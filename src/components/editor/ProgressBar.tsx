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
    <div className="mx-auto flex w-[160px] flex-col items-center justify-center sm:w-[220px]">
      <div className="flex justify-between w-full text-[10px] uppercase font-bold text-slate-400 mb-1">
        <span>{t("progress")}</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
