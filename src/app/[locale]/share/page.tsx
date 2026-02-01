"use client";

import { useRef, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { Download, Share2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { toBlob, toPng } from "html-to-image";
import { Link } from "@/i18n/routing";
import { analytics } from "@/utils/gtm";
import { useTranslations, useLocale } from "next-intl";

export default function SharePage() {
  const t = useTranslations("share");
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodes = useMandalartStore((state) => state.nodes);

  // Options
  // Options
  const [showTitle, setShowTitle] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Helper to render a specific block...
  // (Remaining render logic skipped as it is not needed here)

  const handleDownload = async () => {
    if (!containerRef.current) return;

    try {
      // html-to-image: toPng
      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `mandalart-2026-${Date.now()}.png`;
      link.click();

      // Track export_image event
      const filledCount = nodes.filter((n) => n.content && n.content.trim().length > 0).length;
      analytics.exportImage({
        theme: isDarkMode ? "dark" : "light",
        show_title_date: showTitle,
        show_watermark: showWatermark,
        filled_count_total: filledCount,
      });
    } catch (err) {
      console.error("Failed to save image", err);
      alert("이미지 저장에 실패했습니다.");
    }
  };

  const handleShare = async () => {
    if (!containerRef.current) return;

    if (navigator.share) {
      try {
        const blob = await toBlob(containerRef.current, {
          cacheBust: true,
          backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
        });

        if (!blob) return;
        const file = new File([blob], "mandalart-2026.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "만다라트 2026",
            text: "나만의 만다라트 계획표를 확인해보세요!",
          });
        } else {
          await navigator.share({
            title: "만다라트 2026",
            text: "나만의 만다라트 계획표를 확인해보세요!",
            url: globalThis.location.href,
          });
        }
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      alert("이 브라우저에서는 공유 기능을 지원하지 않습니다.");
    }
  };

  // To render the grid accurately, we really should extract the grid rendering logic.
  // But for speed, let's import MandalartGrid and hide UI elements using a 'share-mode' prop?
  // Or just wrap it.

  // However, MandalartGrid relies on window size for responsiveness.
  // For export, we want a fixed size container.

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/editor"
            className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t("title")}</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid lg:grid-cols-2 gap-8 items-start">
        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              {t("preview")}
            </h2>
            <span className="text-xs text-slate-400">{t("highQuality")}</span>
          </div>

          <div
            className={cn(
              "p-8 rounded-3xl shadow-2xl transition-colors duration-300 flex items-center justify-center overflow-hidden",
              isDarkMode ? "bg-slate-900" : "bg-white",
            )}
          >
            {/* Capture Area */}
            <div
              ref={containerRef}
              className={cn(
                "w-full aspect-square max-w-[600px] relative p-8",
                isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900",
              )}
            >
              {showTitle && (
                <div className="mb-8 text-center space-y-2">
                  <h1
                    className={cn(
                      "text-3xl font-black",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    만다라트 2026
                  </h1>
                  <p
                    className={cn(
                      "text-sm opacity-60",
                      isDarkMode ? "text-slate-400" : "text-slate-500",
                    )}
                  >
                    {new Date().toLocaleDateString(locale)}
                  </p>
                </div>
              )}

              {/* Reuse Grid - Ideally we import it. Since we can't easily pass props to change its style deeply without refactoring, 
                        we will trust the grid to render nicely. We need to make sure it expands to fit this container.
                        
                        Warning: MandalartGrid uses absolute positioning/responsive logic that might conflict.
                        Let's Try importing it first.
                    */}
              <div className="pointer-events-none">
                <ExportGrid nodes={nodes} isDarkMode={isDarkMode} t={t} />
              </div>

              {/* Branding Footer */}
              {showWatermark && (
                <div
                  className={cn(
                    "absolute bottom-3 right-6 text-[10px] font-bold opacity-30 italic",
                    isDarkMode ? "text-white" : "text-slate-900",
                  )}
                >
                  {t("createdWith")}
                </div>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-slate-400">{t("previewDisclaimer")}</p>
        </div>

        {/* Settings Section */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white">{t("settings")}</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    T
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {t("showTitle")}
                  </span>
                </div>
                <Switch checked={showTitle} onCheckedChange={setShowTitle} />
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                    W
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {t("showWatermark")}
                  </span>
                </div>
                <Switch checked={showWatermark} onCheckedChange={setShowWatermark} />
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                    <ImageIcon size={16} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {t("darkMode")}
                  </span>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download size={20} />
              {t("downloadPng")}
            </button>
            <button
              onClick={handleShare}
              className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold rounded-xl shadow-lg shadow-yellow-400/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Share2 size={20} />
              {t("shareButton")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple Toggle Component
function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (c: boolean) => void;
}) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "w-12 h-7 rounded-full transition-colors relative",
        checked ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700",
      )}
    >
      <div
        className={cn(
          "absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}

// Simplified Grid Renderer for Export (Crucial for clean export)
// Simplified Grid Renderer for Export (Crucial for clean export)
function ExportGrid({ nodes, isDarkMode, t }: { nodes: any[]; isDarkMode: boolean; t: any }) {
  // HTML2Canvas limitation fixes:
  // 1. Avoid 'display: contents' -> Use nested grids
  // 2. Avoid modern color spaces (lab, oklch) -> Use Explicit HEX via inline styles
  // 3. Avoid 'gap' if possible or ensure it works -> explicit margin/padding is safer but grid gap usually works in recent versions if container has size.

  const renderCell = (content: string, type: "core" | "sub" | "action", isCenter: boolean) => {
    let bgColor = isDarkMode ? "#1e293b" : "#ffffff";
    let textColor = isDarkMode ? "#f8fafc" : "#1e293b";
    let fontWeight = isCenter ? "900" : "500";

    if (type === "core") {
      bgColor = isDarkMode ? "#2563eb" : "#3b82f6";
      textColor = "#ffffff";
    } else if (type === "sub") {
      bgColor = isDarkMode ? "#334155" : "#f1f5f9";
      textColor = isDarkMode ? "#e2e8f0" : "#475569";
    }

    if (type === "action" && isDarkMode) {
      bgColor = "#0f172a";
      textColor = "#94a3b8";
    }

    // Dark Mode Overrides (some colors were not correctly overridden initially)
    if (isDarkMode) {
      if (bgColor === "#3b82f6") {
        // Original light mode core blue
        bgColor = "#2563eb"; // Dark mode core blue
        textColor = "#ffffff";
      } else if (bgColor === "#f8fafc") {
        // Original light mode default text color
        bgColor = "#1e293b"; // Dark mode default background
        textColor = "#cbd5e1"; // Dark mode default text color
      } else if (bgColor === "#f1f5f9") {
        // Original light mode sub background
        bgColor = "#334155"; // Dark mode sub background
        textColor = "#e2e8f0"; // Dark mode sub text color
      }
    }

    // Translate Default Text
    let displayContent = content;
    if (!displayContent) {
      displayContent = "";
    } else {
      if (displayContent.startsWith("Sub Goal")) displayContent = t("defaultSub");
      if (displayContent.startsWith("Action")) displayContent = t("defaultAction");
      if (displayContent === "Mandalart") displayContent = t("defaultCore");
    }

    return (
      <div
        style={{
          backgroundColor: bgColor,
          color: textColor,
          width: "100%",
          height: "100%",
          display: "flex", // Flex inside cell is fine
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontSize: "10px",
          lineHeight: "1.2",
          fontWeight: fontWeight,
          wordBreak: "keep-all",
          whiteSpace: "pre-wrap",
          padding: "2px",
          boxSizing: "border-box", // Important
        }}
      >
        {displayContent}
      </div>
    );
  };

  const renderBlock = (blockIdx: number) => {
    const isCoreBlock = blockIdx === 4;

    const coreNode = nodes.find((n) => n.level === 0);
    if (!coreNode) return null;

    const subNodes = nodes
      .filter((n) => n.level === 1 && n.parent_id === coreNode.id)
      .sort((a, b) => a.position - b.position);

    let cellNodes: any[] = [];

    if (isCoreBlock) {
      const getSubNodeAt = (pos: number) => subNodes.find((n) => n.position === pos);
      cellNodes = [
        getSubNodeAt(0),
        getSubNodeAt(1),
        getSubNodeAt(2),
        getSubNodeAt(3),
        coreNode,
        getSubNodeAt(5),
        getSubNodeAt(6),
        getSubNodeAt(7),
        getSubNodeAt(8),
      ];
    } else {
      let subPos = blockIdx;
      if (blockIdx > 4) subPos = blockIdx - 1;
      const blockCenterNode = subNodes.find((n) => n.position === subPos);

      if (blockCenterNode) {
        const actions = nodes.filter((n) => n.level === 2 && n.parent_id === blockCenterNode?.id);
        cellNodes = [0, 1, 2, 3, 99, 5, 6, 7, 8].map((p) => {
          if (p === 99) return blockCenterNode;
          return actions.find((n) => n.position === p);
        });
      } else {
        cellNodes = Array.from({ length: 9 }, () => null); // Fix: Use Array.from for proper initialization
      }
    }

    const gridGapColor = isDarkMode ? "#334155" : "#e2e8f0";

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)", // Explicit rows
          gap: "1px",
          backgroundColor: gridGapColor,
          border: `1px solid ${gridGapColor}`,
          aspectRatio: "1/1", // Force square
          width: "100%",
          height: "100%",
        }}
      >
        {cellNodes.map((n, i) => {
          const isCenter = i === 4;
          const type = isCoreBlock ? (isCenter ? "core" : "sub") : isCenter ? "sub" : "action";
          return (
            <div key={i} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              {renderCell(n?.content || "", type, isCenter)}
            </div>
          );
        })}
      </div>
    );
  };

  const containerGapColor = isDarkMode ? "#cbd5e1" : "#cbd5e1";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)", // Explicit rows
        gap: "4px",
        backgroundColor: containerGapColor,
        border: `1px solid ${containerGapColor}`,
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
