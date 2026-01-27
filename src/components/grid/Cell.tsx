import { cn } from "@/utils/cn";
import { Database } from "@/types/supabase";

type Node = Database["public"]["Tables"]["nodes"]["Row"];

interface CellProps {
  node?: Node;
  position: number;
  isCenter?: boolean;
  isActive?: boolean; // Highlighted
  isPlaceholder?: boolean; // Empty state
  onClick?: () => void;
  className?: string;
}

export const Cell = ({
  node,
  isCenter,
  isActive,
  isPlaceholder,
  onClick,
  className,
}: CellProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "aspect-square flex items-center justify-center p-2 text-center text-xs break-keep cursor-pointer transition-all duration-200 select-none rounded-lg border",
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
        {node?.content || (isPlaceholder ? "" : "")}
      </span>
    </div>
  );
};
