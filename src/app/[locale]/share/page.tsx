"use client";

import { useRef, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Download, Share2, ArrowLeft, Image as ImageIcon, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { toPng, toBlob } from "html-to-image";
import { Link } from "@/i18n/routing";
import { analytics } from "@/utils/gtm";
import { useTranslations, useLocale } from "next-intl";

export default function SharePage() {
  const t = useTranslations("share");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useMandalartStore((state) => state.nodes);

  // Options
  const [showTitle, setShowTitle] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  // Default to light mode export for "Paper" feel
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff", // Always white paper background for nordic style
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
          // Fallback
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
        <div className="max-w-screen-md mx-auto px-6 h-14 flex items-center justify-between">
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

          <span className="font-serif font-bold text-lg tracking-tight">{t("title")}</span>

          <div className="w-16" />
        </div>
      </header>

      <main className="flex-1 max-w-screen-md mx-auto w-full px-6 py-8 space-y-8 pb-20">
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
              className="bg-white text-slate-900 w-full max-w-[500px] aspect-[4/5] p-8 flex flex-col gap-6 shadow-2xl items-center relative"
            >
              {showTitle && (
                <div className="text-center space-y-2 w-full pt-4">
                  <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
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
                  CREATED WITH MANDALART
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
                ? "bg-text-primary text-base border-text-primary"
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
                ? "bg-text-primary text-base border-text-primary"
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
            className="w-full py-4 bg-growth text-white font-bold rounded-full hover:bg-growth/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-growth/20"
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
function ExportGrid({ nodes, t }: { nodes: any[]; t: any }) {
  // Helper to get color based on position/type
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
      backgroundColor: "#ffffff", // Default white
      color: "#334155", // Slate 700
      fontSize: "8px",
      fontWeight: "400",
    };

    if (type === "core") {
      // Center Core Cell
      styles.color = "#0F766E"; // Growth Color
      styles.fontWeight = "900";
      styles.fontSize = "10px";
      // styles.backgroundColor = "#F0FDFA"; // Very light teal bg option
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

  const renderCell = (content: string, type: "core" | "sub" | "action", isCenter: boolean) => {
    let displayContent = content;
    // ... logic for default text ...

    return <div style={getStyles(type, isCenter)}>{displayContent}</div>;
  };

  const renderBlock = (blockIdx: number) => {
    const isCoreBlock = blockIdx === 4;
    const coreNode = nodes.find((n) => n.level === 0);
    // ... logic to find subNodes ... (Simplified for brevity, assuming logic exists)

    // Using simple placeholder logic if nodes are missing for preview robustness
    const subNodes = nodes.filter((n) => n.level === 1).sort((a, b) => a.position - b.position);

    let cellNodes: any[] = Array(9).fill(null);

    // Re-implement or Copy Logic for filling cellNodes
    if (isCoreBlock && coreNode) {
      // Fill Core Block
      const getSubNodeAt = (pos: number) => subNodes.find((n) => n.position === pos);
      cellNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((p) => {
        if (p === 4) return coreNode;
        return getSubNodeAt(p);
      });
    } else {
      // Fill Action Block
      let subPos = blockIdx;
      if (blockIdx > 4) subPos = blockIdx - 1;
      const blockCenterNode = subNodes.find((n) => n.position === subPos);
      if (blockCenterNode) {
        const actions = nodes.filter((n) => n.level === 2 && n.parent_id === blockCenterNode.id);
        cellNodes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((p) => {
          if (p === 4) return blockCenterNode;
          return actions.find((n) => n.position === p);
        });
      }
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gap: "0px", // No gap, just borders
          backgroundColor: "#CBD5E1", // Border color
          border: "1px solid #CBD5E1",
          aspectRatio: "1/1",
          width: "100%",
          height: "100%",
        }}
      >
        {cellNodes.map((n, i) => {
          const isCenter = i === 4;
          const type = isCoreBlock ? (isCenter ? "core" : "sub") : isCenter ? "sub" : "action";
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
              {renderCell(n?.content || "", type, isCenter)}
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
        gap: "4px", // Gap between blocks
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
