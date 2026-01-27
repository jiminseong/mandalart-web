"use client";

import React, { useMemo } from "react";
import { useMandalartStore } from "@/store/mandalartStore";

export const ProgressBar = () => {
  const nodes = useMandalartStore((state) => state.nodes);

  const progress = useMemo(() => {
    // Total unique editable nodes: 81 (Core 1 + Sub 8 + Action 64 + duplicate centers)
    // Theoretically 9x9 = 81 cells.
    // The nodes array might only contain initialized nodes or all.
    // Let's assume the full grid is 81 cells.

    // Count non-empty nodes
    const filledCount = nodes.filter((n) => n.content && n.content.trim().length > 0).length;

    // Fixed Total for a Full Mandalart
    const totalCount = 81;

    // Prevent >100% just in case
    const percentage = Math.min(100, Math.round((filledCount / totalCount) * 100));

    return percentage;
  }, [nodes]);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center w-[120px] sm:w-[200px]">
      <div className="flex justify-between w-full text-[10px] uppercase font-bold text-slate-400 mb-1">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
