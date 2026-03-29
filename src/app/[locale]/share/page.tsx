"use client";

import { useRef, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Database } from "@/types/supabase";
import { Download, Share2, ArrowLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPng, toBlob } from "html-to-image";
import { Link } from "@/i18n/routing";
import { analytics } from "@/utils/gtm";
import { useTranslations, useLocale } from "next-intl";

type Node = Database["public"]["Tables"]["nodes"]["Row"];
type ShareTranslationKey = "defaultCore" | "defaultSub" | "defaultAction";
type ShareTranslator = (key: ShareTranslationKey) => string;

export default function SharePage() {
  const t = useTranslations("share");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useMandalartStore((state) => state.nodes);

  // Options
  const [showTitle, setShowTitle] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `mandalart-2026-${Date.now()}.png`;
      link.click();

      // Track export_image event
      const filledCount = nodes.filter((n) => n.content && n.content.trim().length > 0).length;
      analytics.exportImage({
        theme: "light",
        show_title_date: showTitle,
        show_watermark: showWatermark,
        filled_count_total: filledCount,
      });
    } catch (err) {
      console.error("Failed to save image", err);
      alert("Failed to save image.");
    }
  };

  const handleShare = async () => {
    if (!containerRef.current) return;

    if (navigator.share) {
      try {
        const blob = await toBlob(containerRef.current, {
          cacheBust: true,
          backgroundColor: "#ffffff",
        });

        if (!blob) return;
        const file = new File([blob], "mandalart-2026.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Mandalart 2026",
            text: "Check out my Mandalart plan!",
          });
        } else {
          alert("Sharing is not supported on this device.");
        }
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("Sharing is not supported on this browser.");
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 space-y-8 pb-20">
        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              {t("preview")}
            </h2>
            <span className="text-xs text-text-tertiary">{t("highQuality")}</span>
          </div>

          <div className="p-8 rounded-2xl bg-surface border border-border flex items-center justify-center overflow-hidden shadow-sm">
            {/* Capture Area - Fixed Ratio Box */}
            <div
              ref={containerRef}
              className="bg-white text-slate-900 w-full max-w-[500px] aspect-4/5 p-8 flex flex-col gap-6 shadow-2xl items-center relative"
            >
              {showTitle && (
                <div className="text-center space-y-2 w-full pt-4">
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
                <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 font-medium tracking-wider">
                  Created with mandalart.life
                </div>
              )}
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
        <div className="space-y-3 pt-4">
          <button
            onClick={handleDownload}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-growth py-4 font-bold text-accent-contrast shadow-lg shadow-growth/20 transition-all hover:scale-[1.02] hover:bg-growth/90 active:scale-95"
          >
            <Download size={20} strokeWidth={2} />
            <span>{t("downloadPng")}</span>
          </button>
          <button
            onClick={handleShare}
            className="w-full py-4 bg-surface text-text-primary border border-border font-bold rounded-full hover:bg-base hover:border-text-primary/50 transition-all flex items-center justify-center gap-2"
          >
            <Share2 size={20} strokeWidth={2} />
            <span>{t("shareButton")}</span>
          </button>
        </div>
      </main>
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

  const getStyles = (type: "core" | "sub" | "action", isCenter: boolean) => {
    const styles: React.CSSProperties = {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      lineHeight: "1.2",
      wordBreak: "keep-all",
      whiteSpace: "pre-wrap",
      padding: "2px",
      boxSizing: "border-box",
      backgroundColor: "#ffffff",
      color: "#334155",
      fontSize: "8px",
      fontWeight: "400",
    };

    if (type === "core") {
      styles.color = "#0F766E"; // Growth Color
      styles.fontWeight = "900";
      styles.fontSize = "10px";
    } else if (type === "sub") {
      if (isCenter) {
        styles.color = "#1E293B"; // Slate 800
        styles.fontWeight = "700";
        styles.fontSize = "9px";
      } else {
        styles.color = "#475569"; // Slate 600
      }
    } else {
      // Action
      styles.color = "#64748B"; // Slate 500
    }

    return styles;
  };

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

    return <div style={getStyles(type, isCenter)}>{displayContent}</div>;
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
          backgroundColor: "#CBD5E1",
          border: "1px solid #CBD5E1",
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
                border: "0.5px solid #E2E8F0",
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
        gap: "4px",
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
