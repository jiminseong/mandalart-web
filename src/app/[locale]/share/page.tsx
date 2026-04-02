"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Database } from "@/types/supabase";
import { ArrowLeft, Download, Link2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { toBlob } from "html-to-image";
import { Link } from "@/i18n/routing";
import { analytics } from "@/utils/gtm";
import { useTranslations, useLocale } from "next-intl";
import { getCellTypographyPreset } from "@/utils/cellTypography";
import { AutoFitText } from "@/components/AutoFitText";
import { serializeMandalartNodes } from "@/utils/mandalartLink";

type Node = Database["public"]["Tables"]["nodes"]["Row"];
type ShareTranslationKey = "defaultCore" | "defaultSub" | "defaultAction";
type ShareTranslator = (key: ShareTranslationKey) => string;
type ToastTone = "default" | "success" | "error";

const PREVIEW_CARD_WIDTH = 500;
const PREVIEW_CARD_HEIGHT = 625;
const EXPORT_CARD_WIDTH = 2000;
const EXPORT_CARD_HEIGHT = 2500;
const EXPORT_SCALE = EXPORT_CARD_WIDTH / PREVIEW_CARD_WIDTH;
const TOAST_DURATION = 2400;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export default function SharePage() {
  const t = useTranslations("share");
  const locale = useLocale();
  const exportRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const nodes = useMandalartStore((state) => state.nodes);

  // Options
  const [showTitle, setShowTitle] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [previewScale, setPreviewScale] = useState(1);
  const [toast, setToast] = useState<{ message: string; tone: ToastTone } | null>(null);

  const showToast = (message: string, tone: ToastTone = "default", duration = TOAST_DURATION) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    setToast({ message, tone });

    if (duration > 0) {
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, duration);
    }
  };

  useLayoutEffect(() => {
    const container = previewContainerRef.current;

    if (!container) return;

    const updatePreviewScale = () => {
      const nextWidth = container.clientWidth;

      if (!nextWidth) return;

      setPreviewScale(Math.min(1, nextWidth / PREVIEW_CARD_WIDTH));
    };

    updatePreviewScale();

    const resizeObserver = new ResizeObserver(updatePreviewScale);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const getExportBlob = async () => {
    if (!exportRef.current) return null;

    await document.fonts?.ready;
    await waitForNextFrame();
    await waitForNextFrame();

    return toBlob(exportRef.current, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: EXPORT_CARD_WIDTH,
      height: EXPORT_CARD_HEIGHT,
      canvasWidth: EXPORT_CARD_WIDTH,
      canvasHeight: EXPORT_CARD_HEIGHT,
      pixelRatio: 1,
      skipAutoScale: true,
      preferredFontFormat: "woff2",
    });
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;

    try {
      showToast(t("toastDownloadPending"), "default", 0);
      const blob = await getExportBlob();
      if (!blob) {
        showToast(t("toastDownloadError"), "error");
        return;
      }

      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `mandalart-2026-${Date.now()}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      // Track export_image event
      const filledCount = nodes.filter((n) => n.content && n.content.trim().length > 0).length;
      analytics.exportImage({
        theme: "light",
        show_title_date: showTitle,
        show_watermark: showWatermark,
        filled_count_total: filledCount,
      });

      showToast(t("toastDownloadSuccess"), "success");
    } catch (err) {
      console.error("Failed to save image", err);
      showToast(t("toastDownloadError"), "error");
    }
  };

  const handleCopyLink = async () => {
    try {
      const encoded = serializeMandalartNodes(nodes);
      const shareUrl = `${window.location.origin}/${locale}/editor/${encoded}`;

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error("Copy command was rejected.");
        }
      }

      showToast(t("toastLinkCopied"), "success");
    } catch (err) {
      console.error("Failed to copy link", err);
      showToast(t("toastLinkCopyError"), "error");
    }
  };

  return (
    <div className="min-h-screen bg-base text-text-primary font-sans selection:bg-growth/20 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/editor"
            className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium tracking-wide uppercase text-sm">Editor</span>
          </Link>

          <span className="font-bold text-lg tracking-tight font-sans">{t("title")}</span>

          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-8 pb-20 sm:px-6 sm:py-8">
        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              {t("preview")}
            </h2>
            <span className="text-xs text-text-tertiary">{t("highQuality")}</span>
          </div>

          <div className="rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden p-4 shadow-sm sm:p-6 md:p-8">
            <div
              ref={previewContainerRef}
              className="relative w-full max-w-[500px]"
              style={{ height: `${PREVIEW_CARD_HEIGHT * previewScale}px` }}
            >
              <div
                className="absolute left-0 top-0"
                style={{
                  width: PREVIEW_CARD_WIDTH,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                <ShareCaptureCard
                  locale={locale}
                  nodes={nodes}
                  showTitle={showTitle}
                  showWatermark={showWatermark}
                  t={t}
                />
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-text-tertiary">{t("previewDisclaimer")}</p>
        </div>

        {/* Settings Information */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowTitle(!showTitle)}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
              showTitle
                ? "bg-text-primary text-base border-text-primary text-accent-contrast"
                : "bg-surface text-text-secondary border-border hover:border-text-primary",
            )}
          >
            <span className="font-semibold text-sm">{t("showTitle")}</span>
            <span className="text-xs opacity-70">{showTitle ? "On" : "Off"}</span>
          </button>

          <button
            onClick={() => setShowWatermark(!showWatermark)}
            className={cn(
              "p-4 rounded-xl border flex flex-col items-center gap-2 transition-all",
              showWatermark
                ? "bg-text-primary text-base border-text-primary text-accent-contrast"
                : "bg-surface text-text-secondary border-border hover:border-text-primary",
            )}
          >
            <span className="font-semibold text-sm">{t("showWatermark")}</span>
            <span className="text-xs opacity-70">{showWatermark ? "On" : "Off"}</span>
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-growth py-4 font-bold text-accent-contrast shadow-lg shadow-growth/20 transition-all hover:scale-[1.02] hover:bg-growth/90 active:scale-95"
          >
            <Download size={20} strokeWidth={2} />
            <span>{t("downloadPng")}</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface py-4 font-bold text-text-primary transition-all hover:border-text-primary/30 hover:bg-base"
          >
            <Link2 size={20} strokeWidth={2} />
            <span>{t("copyLink")}</span>
          </button>
        </div>
      </main>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div
            className={cn(
              "max-w-md rounded-[20px] border px-4 py-3 text-sm font-medium shadow-[0_20px_60px_-32px_rgba(0,0,0,0.35)] backdrop-blur-xl",
              toast.tone === "success" && "border-emerald-200/70 bg-white/90 text-emerald-900",
              toast.tone === "error" && "border-rose-200/70 bg-white/90 text-rose-900",
              toast.tone === "default" && "border-white/70 bg-white/88 text-slate-900",
            )}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-10000px] top-0 opacity-0"
        style={{ width: EXPORT_CARD_WIDTH, height: EXPORT_CARD_HEIGHT }}
      >
        <div
          ref={exportRef}
          className="overflow-hidden bg-white"
          style={{ width: EXPORT_CARD_WIDTH, height: EXPORT_CARD_HEIGHT }}
        >
          <div
            style={{
              width: PREVIEW_CARD_WIDTH,
              transform: `scale(${EXPORT_SCALE})`,
              transformOrigin: "top left",
            }}
          >
            <ShareCaptureCard
              locale={locale}
              nodes={nodes}
              showTitle={showTitle}
              showWatermark={showWatermark}
              t={t}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareCaptureCard({
  locale,
  nodes,
  showTitle,
  showWatermark,
  t,
}: {
  locale: string;
  nodes: Node[];
  showTitle: boolean;
  showWatermark: boolean;
  t: ShareTranslator;
}) {
  return (
    <div className="bg-white text-slate-900 w-full aspect-4/5 p-6 flex flex-col gap-4 shadow-2xl items-center relative overflow-hidden">
      {showTitle && (
        <div className="text-center space-y-2 w-full pt-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">
            Mandalart 2026
          </h1>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
            {new Date().toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}

      <div className="flex-1 w-full flex items-center justify-center">
        <ExportGrid nodes={nodes} t={t} />
      </div>

      {showWatermark && (
        <div className="absolute bottom-3 right-5 text-[10px] text-slate-400 font-medium tracking-wider">
          Created with mandalart.life
        </div>
      )}
    </div>
  );
}

// Nordic Style Clean Grid Renderer
function ExportGrid({ nodes, t }: { nodes: Node[]; t: ShareTranslator }) {
  // 1. Core Logic: Find Core Node
  const coreNode = nodes.find((n) => n.level === 0);
  // 2. Sub Logic: Find Sub Nodes
  const subNodes = nodes.filter((n) => n.level === 1);
  // 3. Action Logic: Find Action Nodes
  const actionNodes = nodes.filter((n) => n.level === 2);

  const renderCell = (
    node: Node | undefined,
    type: "core" | "sub" | "action",
    isCenter: boolean,
  ) => {
    let displayContent = node?.content || "";

    // Default Text Logic with Translation
    if (!displayContent) {
      if (type === "core" && isCenter) displayContent = t("defaultCore");
      else if (type === "sub") displayContent = t("defaultSub");
      else if (type === "action") displayContent = t("defaultAction");
    }

    const isPlaceholder = !node?.content?.trim();
    const typographyPreset = getCellTypographyPreset({
      content: displayContent,
      isCenter,
      compact: true,
      placeholder: isPlaceholder,
    });

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1px",
          boxSizing: "border-box",
        }}
      >
        <AutoFitText
          text={displayContent}
          color={isPlaceholder ? "#6B7280" : isCenter ? "#111827" : "#374151"}
          minFontSize={typographyPreset.minFontSize}
          maxFontSize={typographyPreset.maxFontSize}
          fontWeight={typographyPreset.fontWeight}
          fitWidthRatio={typographyPreset.fitWidthRatio}
          fitHeightRatio={typographyPreset.fitHeightRatio}
          emergencyMinFontSize={typographyPreset.emergencyMinFontSize}
          preserveWordBreaks
        />
      </div>
    );
  };

  const renderBlock = (blockIdx: number) => {
    const isCoreBlock = blockIdx === 4;

    let cellNodes: Array<Node | undefined> = new Array(9).fill(undefined);
    let cellTypes: ("core" | "sub" | "action")[] = new Array(9).fill("action");

    if (isCoreBlock) {
      // Core Block Logic
      cellTypes = cellTypes.map((_, i) => (i === 4 ? "core" : "sub"));

      cellNodes = cellNodes.map((_, i) => {
        if (i === 4) return coreNode;
        return subNodes.find((n) => n.position === i);
      });
    } else {
      // Action Block Logic
      const subNodePos = blockIdx;
      const currentSubNode = subNodes.find((n) => n.position === subNodePos);

      cellTypes = cellTypes.map((_, i) => (i === 4 ? "sub" : "action"));

      if (currentSubNode) {
        const currentActions = actionNodes.filter((n) => n.parent_id === currentSubNode.id);

        cellNodes = cellNodes.map((_, i) => {
          if (i === 4) return currentSubNode;
          return currentActions.find((n) => n.position === i);
        });
      }
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "0px",
          backgroundColor: "#D1D5DB",
          border: "1px solid #D1D5DB",
          aspectRatio: "1/1",
          width: "100%",
          height: "100%",
        }}
      >
        {cellNodes.map((n, i) => {
          const isCenter = i === 4;
          const type = cellTypes[i];
          return (
            <div
              key={i}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#fff",
                border: "0.5px solid #E5E7EB",
              }}
            >
              {renderCell(n, type, isCenter)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gap: "3px",
        aspectRatio: "1/1",
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} style={{ width: "100%", height: "100%" }}>
          {renderBlock(i)}
        </div>
      ))}
    </div>
  );
}
