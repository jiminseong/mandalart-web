import React from "react";
import { cn } from "@/utils/cn";
import { MandalartNode } from "@/types/mandalart";
import { useTranslations } from "next-intl";
import { getCellTypographyPreset } from "@/utils/cellTypography";
import { AutoFitText } from "@/components/AutoFitText";
import { useMandalartStore } from "@/store/mandalartStore";
import { CELL_TEXT_SIZE_PRESETS } from "@/utils/textSize";
import { analytics } from "@/utils/gtm";

type Node = MandalartNode;

interface CellProps {
  node?: Node;
  // position prop removed as it was unused in rendering logic
  isCenter?: boolean;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string; // Additional classes passed from parent (e.g. background colors)
}

export const Cell = ({
  node,
  isCenter,
  isActive,
  onClick,
  className,
}: CellProps) => {
  const t = useTranslations("editor");
  const cellTextSizeIndex = useMandalartStore((state) => state.cellTextSizeIndex);
  const nodes = useMandalartStore((state) => state.nodes);
  const updateNodeContent = useMandalartStore((state) => state.updateNodeContent);
  const setSelectedNodeId = useMandalartStore((state) => state.setSelectedNodeId);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const skipNextBlurRef = React.useRef(false);
  const [draft, setDraft] = React.useState(() => node?.content || "");
  const displayContent =
    node?.content?.replace("Sub Goal", t("subGoal")).replace("Action", t("actionPlan")) || "";
  const hasContent = displayContent.trim().length > 0;
  const fixedFontSize = CELL_TEXT_SIZE_PRESETS[cellTextSizeIndex];
  const typographyPreset = getCellTypographyPreset({
    content: displayContent,
    isCenter,
    placeholder: !hasContent,
  });
  const levelLabel = isCenter ? t("coreGoal") : node?.level === 1 ? t("subGoal") : t("actionPlan");

  React.useEffect(() => {
    setDraft(node?.content || "");
  }, [node?.content, node?.id]);

  React.useEffect(() => {
    if (!isActive || !textareaRef.current) return;

    textareaRef.current.focus();
    const length = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(length, length);
    textareaRef.current.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [isActive]);

  const commitDraft = (nextContent: string) => {
    if (!node) return;

    const normalizedContent = nextContent.trim();
    const previousContent = node.content || "";
    const isNewContent = previousContent !== nextContent;

    if (isNewContent) {
      const filledCountTotal = nodes.filter((n) => n.content && n.content.trim().length > 0).length;

      updateNodeContent(node.id, nextContent);

      analytics.cellEdit({
        section: node.level === 0 ? "center" : node.level === 1 ? "core8" : "actions64",
        cell_index: node.position,
        filled: normalizedContent.length > 0,
        filled_count_total: filledCountTotal,
        input_len: nextContent.length,
      });
    }

    setSelectedNodeId(null);
  };

  const handleCancel = () => {
    skipNextBlurRef.current = true;
    setDraft(node?.content || "");
    setSelectedNodeId(null);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Layout
        "relative group w-full h-full min-w-0 min-h-0 overflow-hidden flex items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer select-none",

        // Default Background
        "bg-surface-strong hover:bg-surface",

        // Interaction: Selected State
        isActive && "z-10 scale-[1.02] bg-surface-strong ring-2 ring-growth shadow-lg",

        // Center Node Styling
        isCenter && "font-bold",

        // Empty State Styling
        !node?.content && !isCenter && "bg-surface",

        className,
      )}
    >
      {isActive && node ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (skipNextBlurRef.current) {
              skipNextBlurRef.current = false;
              return;
            }

            commitDraft(draft);
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              e.stopPropagation();
              handleCancel();
              return;
            }

            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              e.stopPropagation();
              skipNextBlurRef.current = true;
              commitDraft(draft);
            }
          }}
          placeholder={levelLabel}
          rows={3}
          className={cn(
            "absolute inset-0 h-full w-full resize-none bg-surface px-3 py-3 text-center leading-snug outline-none",
            "placeholder:text-text-secondary/45",
            isCenter ? "font-bold text-growth" : node.level === 1 ? "font-semibold text-focus" : "font-medium text-text-primary",
          )}
          style={{ fontSize: `${fixedFontSize}px` }}
        />
      ) : (
        <AutoFitText
          text={displayContent}
          color={hasContent ? "var(--theme-color-text-primary)" : "var(--theme-color-text-secondary)"}
          minFontSize={typographyPreset.minFontSize}
          maxFontSize={typographyPreset.maxFontSize}
          fontWeight={typographyPreset.fontWeight}
          fitWidthRatio={typographyPreset.fitWidthRatio}
          fitHeightRatio={typographyPreset.fitHeightRatio}
          emergencyMinFontSize={typographyPreset.emergencyMinFontSize}
          fixedFontSize={fixedFontSize}
          preserveWordBreaks
          clampToContainer
        />
      )}
    </div>
  );
};
