import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

import { Maximize2, Minimize2 } from "lucide-react";

interface CellProps {
  node?: Node;
  position: number;
  isCenter?: boolean;
  isActive?: boolean;
  isPlaceholder?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onZoom?: () => void; // New prop for zoom action
  isZoomed?: boolean; // To show zoom-out icon instead
  className?: string;
}

export const Cell = ({
  node,
  isCenter,
  isActive,
  isPlaceholder,
  onClick,
  onZoom,
  isZoomed,
  className,
}: CellProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group aspect-square flex items-center justify-center p-2 text-center text-xs break-keep cursor-pointer transition-all duration-200 select-none rounded-lg border",
        // Default styles
        "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50",
        // Center cell styles (Core/Sub goals)
        isCenter &&
          "bg-primary/10 dark:bg-primary/20 font-bold text-slate-900 dark:text-white border-primary/30 ring-1 ring-primary/20",
        // Active/Selected state
        isActive && "ring-2 ring-primary border-primary z-10 shadow-lg scale-105",
        // Placeholder/Empty state
        !node?.content &&
          !isCenter &&
          "bg-slate-50 dark:bg-slate-800/50 border-dashed text-slate-400",
        className,
      )}
    >
      <span className={cn("line-clamp-3", !node?.content && "text-[10px] opacity-50")}>
        {node?.content?.replace("Sub Goal", "세부 목표").replace("Action", "실천") ||
          (isPlaceholder ? "" : "")}
      </span>

      {/* Zoom Action Button (Visible only on Center cells of Outer blocks, or Core cell) */}
      {onZoom && node?.content && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onZoom();
          }}
          className="absolute top-1 right-1 p-1 rounded-full bg-white/80 dark:bg-black/50 text-slate-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          title={isZoomed ? "전체 보기" : "확대해서 보기"}
        >
          {isZoomed ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </button>
      )}
    </div>
  );
};
