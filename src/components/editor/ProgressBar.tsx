"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { useTranslations } from "next-intl";

export const ProgressBar = () => {
  const t = useTranslations("editor");
  const nodes = useMandalartStore((state) => state.nodes);

  const progress = useMemo(() => {
    // Level 0: 1 node (Core)
    const isEffectivelyEmpty = (content?: string | null) => {
      if (!content || !content.trim()) return true;
      const text = content.trim();
      if (text.startsWith("Sub Goal")) return true;
      if (text.startsWith("Core Goal")) return true;
      if (text.startsWith("Action")) return true;
      return false;
    };

    const filledCore = nodes.filter((n) => n.level === 0 && !isEffectivelyEmpty(n.content)).length;
    const filledSubs = nodes.filter((n) => n.level === 1 && !isEffectivelyEmpty(n.content)).length;
    const filledActions = nodes.filter(
      (n) => n.level === 2 && !isEffectivelyEmpty(n.content),
    ).length;

    const filledTotal = filledCore + filledSubs + filledActions;
    const maxTotal = 1 + 8 + 64; // 73
    const percentage = Math.min(100, Math.round((filledTotal / maxTotal) * 100));

    return percentage;
  }, [nodes]);

  return (
    <div className="flex h-12 w-[240px] items-center gap-3 rounded-full border border-border/70 bg-surface/70 px-4 shadow-[0_20px_60px_-48px_rgba(0,0,0,0.3)] backdrop-blur-md sm:w-[280px]">
      <div className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
        {t("progress")}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border/75">
          <div
            className="h-full rounded-full bg-growth transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-text-primary">
          {progress}%
        </span>
      </div>
    </div>
  );
};
