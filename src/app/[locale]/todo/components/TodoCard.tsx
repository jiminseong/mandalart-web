"use client";

import { motion } from "framer-motion";
import { TodoItem, Category } from "../types";
import { cn } from "@/utils/cn";
import { Check, Clock, Trash2 } from "lucide-react";

interface TodoCardProps {
  item: TodoItem;
  category?: Category;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  isFocused?: boolean;
}

export function TodoCard({ item, category, onClick, onDelete, isFocused }: TodoCardProps) {
  const isDone = item.status === "done";

  // Fallback style if category is missing
  const categoryStyle = category?.colorClass || "bg-gray-100 dark:bg-gray-800 text-gray-500";
  const categoryName = category?.name || "Uncategorized";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(item.id);
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      onDelete(item.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: isDone ? 0.6 : 1,
        scale: 1,
        filter: isDone ? "grayscale(100%)" : "grayscale(0%)",
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: { duration: 0.2 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1,
      }}
      className={cn(
        "relative w-full p-3.5 mb-2.5 rounded-2xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] select-none group focus:ring-2 focus:ring-blue-500 focus:ring-inset focus:outline-none",
        "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800",
        isFocused && "ring-2 ring-primary ring-inset",
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full shrink-0", categoryStyle)} />
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-tight truncate max-w-[120px]">
              {categoryName}
            </span>
            {item.time && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded-md whitespace-nowrap ml-1">
                <Clock size={10} />
                {item.time}
              </span>
            )}
          </div>
          <h3
            className={cn(
              "font-semibold text-[15px] leading-relaxed break-words text-gray-900 dark:text-gray-100",
              isDone && "line-through opacity-50 text-gray-400",
            )}
          >
            {item.title}
          </h3>
        </div>

        <div className="flex items-start gap-1 shrink-0 h-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
            title="Delete (Backspace)"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(item.id);
            }}
            className={cn(
              "w-7 h-7 rounded-md border-[1.5px] flex items-center justify-center transition-all ml-1 push-button",
              isDone
                ? "bg-green-500 border-green-500 text-white shadow-sm"
                : "border-gray-300 dark:border-gray-600 hover:border-green-400 text-transparent bg-white dark:bg-zinc-800",
            )}
            title="Toggle Status (Enter/Space)"
          >
            <Check size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
