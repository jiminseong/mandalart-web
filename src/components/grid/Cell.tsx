import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";
import { Maximize2, Minimize2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

interface CellProps {
  node?: Node;
  position: number;
  isCenter?: boolean;
  isActive?: boolean;
  isPlaceholder?: boolean;
  width?: string;
  height?: string;
  onClick?: (e: React.MouseEvent) => void;
  onZoom?: () => void;
  isZoomed?: boolean;
  className?: string;
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

  // Design System Colors mapping
  // Core Center (Level 0): Growth Theme
  // Sub Center (Level 1): Focus Theme

  return (
    <div
      onClick={onClick}
      className={cn(
        // Base Layout
        "relative group w-full h-full flex items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer",
        "break-keep select-none",

        // Default Background (Editorial style: clean white or very light gray)
        "bg-white hover:bg-surface",

        // Interaction
        isActive && "z-10 ring-2 ring-growth bg-white shadow-lg scale-[1.02]",

        // Center Node Styling (The 'Core' of any 3x3 block)
        isCenter && "font-bold bg-base text-text-primary",

        // Empty State
        !node?.content && !isCenter && "text-text-secondary/30 bg-gray-50/50",

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

      {/* Zoom Icon - Minimalist */}
      {onZoom && node?.content && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          className="absolute top-1 right-1 p-1.5 text-text-secondary/50 hover:text-growth opacity-0 group-hover:opacity-100 transition-opacity"
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
