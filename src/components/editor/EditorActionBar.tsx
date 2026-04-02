"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Link2, Share2 } from "lucide-react";
import { toBlob } from "html-to-image";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { analytics } from "@/utils/gtm";
import { serializeMandalartNodes } from "@/utils/mandalartLink";
import { useMandalartStore } from "@/store/mandalartStore";

type ToastTone = "default" | "success" | "error";

const TOAST_DURATION = 2400;
const EXPORT_GRID_SIZE = 2200;

const waitForNextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

export function EditorActionBar() {
  const tEditor = useTranslations("editor");
  const tShare = useTranslations("share");
  const locale = useLocale();
  const toastTimerRef = useRef<number | null>(null);
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

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const flushPendingEdits = async () => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLTextAreaElement) {
      activeElement.blur();
    }

    await waitForNextFrame();
    await waitForNextFrame();
  };

  const getShareUrl = () => {
    const nodes = useMandalartStore.getState().nodes;
    const encoded = serializeMandalartNodes(nodes);

    return `${window.location.origin}/${locale}/editor/${encoded}`;
  };

  const getBoardElement = () =>
    document.querySelector<HTMLDivElement>('[data-mandalart-export-target="true"]');

  const createBoardBlob = async () => {
    await flushPendingEdits();

    const boardElement = getBoardElement();
    if (!boardElement) {
      throw new Error("Mandalart board element not found.");
    }

    await document.fonts?.ready;
    await waitForNextFrame();
    await waitForNextFrame();

    const width = boardElement.clientWidth;
    const height = boardElement.clientHeight;
    const exportWidth = Math.max(EXPORT_GRID_SIZE, width);
    const exportHeight = Math.max(EXPORT_GRID_SIZE, height);

    return toBlob(boardElement, {
      cacheBust: true,
      backgroundColor: "#ffffff",
      width,
      height,
      canvasWidth: exportWidth,
      canvasHeight: exportHeight,
      pixelRatio: 1,
      skipAutoScale: true,
      preferredFontFormat: "woff2",
    });
  };

  const handleSaveImage = async () => {
    try {
      showToast(tShare("toastDownloadPending"), "default", 0);

      const blob = await createBoardBlob();
      if (!blob) {
        showToast(tShare("toastDownloadError"), "error");
        return;
      }

      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = `mandalart-${Date.now()}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      const nodes = useMandalartStore.getState().nodes;
      const filledCount = nodes.filter((node) => node.content && node.content.trim().length > 0).length;
      analytics.exportImage({
        theme: "light",
        show_title_date: false,
        show_watermark: false,
        filled_count_total: filledCount,
      });

      showToast(tShare("toastDownloadSuccess"), "success");
    } catch (err) {
      console.error("Failed to save image", err);
      showToast(tShare("toastDownloadError"), "error");
    }
  };

  const handleSaveLink = async () => {
    try {
      await flushPendingEdits();
      const shareUrl = getShareUrl();

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

      showToast(tShare("toastLinkCopied"), "success");
    } catch (err) {
      console.error("Failed to copy link", err);
      showToast(tShare("toastLinkCopyError"), "error");
    }
  };

  const handleShare = async () => {
    try {
      await flushPendingEdits();

      if (!navigator.share) {
        showToast(tShare("toastShareUnavailable"), "error");
        return;
      }

      const shareUrl = getShareUrl();
      let blob: Blob | null = null;

      try {
        blob = await createBoardBlob();
      } catch (captureError) {
        console.error("Failed to capture board for share", captureError);
      }

      if (blob) {
        const file = new File([blob], "mandalart.png", { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: tEditor("title"),
          });
          return;
        }
      }

      await navigator.share({
        title: tEditor("title"),
        url: shareUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      console.error("Failed to share mandalart", err);
      showToast(tShare("toastShareError"), "error");
    }
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-6 pt-12 sm:px-6">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-base via-base/92 to-transparent" />
        <div className="pointer-events-auto relative grid w-full max-w-[540px] grid-cols-[1fr_1fr_auto] items-center gap-2 rounded-[28px] border border-border/60 bg-base/78 p-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <button
            type="button"
            onClick={handleSaveImage}
            className="flex h-14 min-w-0 items-center justify-center gap-2 rounded-full bg-text-primary px-4 text-[13px] font-semibold text-accent-contrast transition-all hover:-translate-y-0.5 hover:bg-text-secondary active:scale-[0.98] sm:text-sm"
          >
            <Download size={18} strokeWidth={2} />
            <span className="truncate">{tEditor("saveImage")}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveLink}
            className="flex h-14 min-w-0 items-center justify-center gap-2 rounded-full bg-text-primary px-4 text-[13px] font-semibold text-accent-contrast transition-all hover:-translate-y-0.5 hover:bg-text-secondary active:scale-[0.98] sm:text-sm"
          >
            <Link2 size={18} strokeWidth={2} />
            <span className="truncate">{tEditor("saveAsLink")}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label={tEditor("share")}
            title={tEditor("share")}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border/70 bg-surface/88 text-text-primary transition-all hover:-translate-y-0.5 hover:border-text-primary/30 hover:bg-surface-strong active:scale-[0.98]"
          >
            <Share2 size={18} strokeWidth={1.9} />
          </button>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 sm:bottom-32">
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
    </>
  );
}
