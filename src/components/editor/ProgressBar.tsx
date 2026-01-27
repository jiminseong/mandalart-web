"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useMandalartStore } from "@/store/mandalartStore";
import { createClient } from "@/utils/supabase/client";
import { useTranslations } from "next-intl";

export const ProgressBar = () => {
  const t = useTranslations("editor");
  const nodes = useMandalartStore((state) => state.nodes);
  const [remainingAi, setRemainingAi] = useState<number | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkAiUsage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const updateCount = () => {
          const used = Number.parseInt(localStorage.getItem("ai_free_usage_count") || "0", 10);
          setRemainingAi(Math.max(0, 3 - used));
        };
        updateCount();
        globalThis.addEventListener("ai-usage-updated", updateCount);
        return () => globalThis.removeEventListener("ai-usage-updated", updateCount);
      } else {
        setRemainingAi(null);
      }
    };

    checkAiUsage();
  }, [supabase]);

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
    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center w-[140px] sm:w-[200px]">
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

      {remainingAi !== null && (
        <div className="flex items-center justify-center w-full mt-1">
          <span className="text-[10px] sm:text-xs font-medium text-primary bg-primary/5 dark:bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1 shadow-sm whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            {t("freeAiRemaining", { count: remainingAi })}
          </span>
        </div>
      )}
    </div>
  );
};
