import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";
import { Maximize2, Minimize2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

interface CellProps {
  node?: Node;
  // position prop removed as it was unused in rendering logic
  isCenter?: boolean;
  isActive?: boolean;
  // isPlaceholder removed
  onClick?: (e: React.MouseEvent) => void;
  onZoom?: () => void;
  isZoomed?: boolean;
  className?: string; // Additional classes passed from parent (e.g. background colors)
}

export const Cell = ({
  node,
  isCenter,
  isActive,
  onClick,
  onZoom,
  isZoomed,
  className,
}: CellProps) => {
  const t = useTranslations("editor");

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Layout
        "relative group w-full h-full flex items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer",
        "break-keep select-none",

        // Default Background
        "bg-surface-strong hover:bg-surface",

        // Interaction: Selected State
        isActive && "z-10 scale-[1.02] bg-surface-strong ring-2 ring-growth shadow-lg",

        // Center Node Styling (Generic base style, specific colors usually passed via className)
        isCenter && "font-bold bg-base text-text-primary",

        // Empty State Styling
        !node?.content && !isCenter && "bg-surface text-text-secondary/30",

        className,
      )}
    >
      <span
        className={cn(
          "line-clamp-4 leading-relaxed",
          !node?.content && "text-[10px]",
          // Typography differentiation
          isCenter
            ? "text-sm md:text-base font-bold text-text-primary"
            : "text-xs md:text-sm text-text-secondary font-medium",
        )}
      >
        {node?.content?.replace("Sub Goal", t("subGoal")).replace("Action", t("actionPlan")) || ""}
      </span>

      {/* Zoom Icon - Minimalist Style */}
      {onZoom && node?.content && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          className="absolute top-1 right-1 p-1.5 text-text-secondary/50 hover:text-growth opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isZoomed ? t("zoomOut") : t("zoomIn")} // Accessibility
        >
          {isZoomed ? (
            <Minimize2 size={14} strokeWidth={1.5} />
          ) : (
            <Maximize2 size={14} strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
};
