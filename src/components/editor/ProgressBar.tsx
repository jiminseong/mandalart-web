"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";

import { createClient } from "@/utils/supabase/client";

export const ProgressBar = () => {
  const nodes = useMandalartStore((state) => state.nodes);
  const [remainingAi, setRemainingAi] = React.useState<number | null>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const checkAiUsage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const updateCount = () => {
          const used = parseInt(localStorage.getItem("ai_free_usage_count") || "0", 10);
          setRemainingAi(Math.max(0, 3 - used));
        };
        updateCount();
        window.addEventListener("ai-usage-updated", updateCount);
        return () => window.removeEventListener("ai-usage-updated", updateCount);
      } else {
        setRemainingAi(null);
      }
    };

    checkAiUsage();
  }, []);

  const progress = useMemo(() => {
    // We need to count unique logical nodes that are filled.
    // However, the initial data might contain default texts like "Sub Goal X" or "Action X".
    // The user perceives these as empty. So we must exclude them.

    const isEffectivelyEmpty = (content?: string | null) => {
      if (!content || !content.trim()) return true;
      const text = content.trim();
      // Exclusion patterns for default placeholder text acting as real content
      if (text.startsWith("Sub Goal")) return true;
      if (text.startsWith("Core Goal")) return true; // Just in case
      // "Action" or "Action Plan" usually implies empty
      if (text.startsWith("Action")) return true;
      return false;
    };

    // Level 0: 1 node (Core) - Core usually has custom text, but if it's default "Mandalart", maybe exclude?
    // Let's assume Core is always counted if user edited it. But if it says "2026 성공" (user input), it counts.

    // Filter actual user inputs
    const filledCore = nodes.filter((n) => n.level === 0 && !isEffectivelyEmpty(n.content)).length;
    const filledSubs = nodes.filter((n) => n.level === 1 && !isEffectivelyEmpty(n.content)).length;
    const filledActions = nodes.filter(
      (n) => n.level === 2 && !isEffectivelyEmpty(n.content),
    ).length;

    const filledTotal = filledCore + filledSubs + filledActions;
    const maxTotal = 1 + 8 + 64; // 73

    // Prevent >100% just in case
    const percentage = Math.min(100, Math.round((filledTotal / maxTotal) * 100));

    return percentage;
  }, [nodes]);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center w-[140px] sm:w-[200px]">
      <div className="flex justify-between w-full text-[10px] uppercase font-bold text-slate-400 mb-1">
        <span>진행도</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* AI Remaining Count Display */}
      {remainingAi !== null && (
        <div className="flex items-center justify-center w-full mt-1">
          <span className="text-[10px] sm:text-xs font-medium text-primary bg-primary/5 dark:bg-primary/20 px-2 py-0.5 rounded-full border border-primary/20 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            무료 AI 잔여 {remainingAi}회
          </span>
        </div>
      )}
    </div>
  );
};
