import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";
import { useTranslations } from "next-intl";
import { getCellTypographyPreset } from "@/utils/cellTypography";
import { AutoFitText } from "@/components/AutoFitText";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

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
  const displayContent =
    node?.content?.replace("Sub Goal", t("subGoal")).replace("Action", t("actionPlan")) || "";
  const hasContent = displayContent.trim().length > 0;
  const typographyPreset = getCellTypographyPreset({
    content: displayContent,
    isCenter,
    placeholder: !hasContent,
  });

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
      <AutoFitText
        text={displayContent}
        color={hasContent ? "var(--theme-color-text-primary)" : "var(--theme-color-text-secondary)"}
        minFontSize={typographyPreset.minFontSize}
        maxFontSize={typographyPreset.maxFontSize}
        fontWeight={typographyPreset.fontWeight}
        fitWidthRatio={typographyPreset.fitWidthRatio}
        fitHeightRatio={typographyPreset.fitHeightRatio}
        emergencyMinFontSize={typographyPreset.emergencyMinFontSize}
        fixedFontSize={16}
        preserveWordBreaks
        clampToContainer
      />
    </div>
  );
};
