"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMandalartStore } from "@/store/mandalartStore";
import { GRID_SIZE_PRESETS } from "@/utils/gridSize";

export function GridSizeControls() {
  const t = useTranslations("editor");
  const gridSizeIndex = useMandalartStore((state) => state.gridSizeIndex);
  const setGridSizeIndex = useMandalartStore((state) => state.setGridSizeIndex);

  const canDecreaseGridSize = gridSizeIndex > 0;
  const canIncreaseGridSize = gridSizeIndex < GRID_SIZE_PRESETS.length - 1;

  return (
    <div className="hidden lg:flex h-12 items-center rounded-full border border-border/70 bg-surface/70 p-1 shadow-[0_20px_60px_-48px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <button
        type="button"
        onClick={() => setGridSizeIndex(gridSizeIndex - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={t("decreaseGridSize")}
        title={t("decreaseGridSize")}
        disabled={!canDecreaseGridSize}
      >
        <Minus size={16} strokeWidth={1.8} />
      </button>
      <div className="h-4 w-px bg-border/70" />
      <button
        type="button"
        onClick={() => setGridSizeIndex(gridSizeIndex + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={t("increaseGridSize")}
        title={t("increaseGridSize")}
        disabled={!canIncreaseGridSize}
      >
        <Plus size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
