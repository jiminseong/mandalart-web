"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMandalartStore } from "@/store/mandalartStore";
import { CELL_TEXT_SIZE_PRESETS } from "@/utils/textSize";

export function TextSizeControls() {
  const t = useTranslations("editor");
  const cellTextSizeIndex = useMandalartStore((state) => state.cellTextSizeIndex);
  const setCellTextSizeIndex = useMandalartStore((state) => state.setCellTextSizeIndex);

  const canDecreaseTextSize = cellTextSizeIndex > 0;
  const canIncreaseTextSize = cellTextSizeIndex < CELL_TEXT_SIZE_PRESETS.length - 1;
  const currentTextSize = CELL_TEXT_SIZE_PRESETS[cellTextSizeIndex];

  return (
    <div className="flex h-12 items-center rounded-full border border-border/70 bg-surface/70 p-1 shadow-[0_20px_60px_-48px_rgba(0,0,0,0.3)] backdrop-blur-md">
      <button
        type="button"
        onClick={() => setCellTextSizeIndex(cellTextSizeIndex - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={t("decreaseTextSize")}
        title={t("decreaseTextSize")}
        disabled={!canDecreaseTextSize}
      >
        <Minus size={16} strokeWidth={1.8} />
      </button>
      <div className="min-w-[2.5rem] px-1 text-center text-xs font-semibold tabular-nums text-text-primary">
        {currentTextSize}
      </div>
      <button
        type="button"
        onClick={() => setCellTextSizeIndex(cellTextSizeIndex + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-35"
        aria-label={t("increaseTextSize")}
        title={t("increaseTextSize")}
        disabled={!canIncreaseTextSize}
      >
        <Plus size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
