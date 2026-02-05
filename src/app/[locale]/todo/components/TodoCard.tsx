"use client";

import { motion } from "framer-motion";
import { TodoItem, Category } from "../types";
import { cn } from "@/utils/cn";
import { Check, Clock } from "lucide-react";

interface TodoCardProps {
  item: TodoItem;
  category?: Category; // Made optional to prevent crash if category deleted, fallbacks needed
  onClick: (id: string) => void;
  isFocused?: boolean;
}

export function TodoCard({ item, category, onClick, isFocused }: TodoCardProps) {
  const isDone = item.status === "done";

  // Fallback style if category is missing
  const categoryStyle = category?.colorClass || "bg-gray-100 dark:bg-gray-800 text-gray-500";
  const categoryName = category?.name || "Uncategorized";

  return (
    <motion.div
      layoutId={item.id}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{
        opacity: isDone ? 0.6 : 1,
        scale: 1,
        y: 0,
        filter: isDone ? "grayscale(100%)" : "grayscale(0%)",
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onClick(item.id)}
      className={cn(
        "relative w-full p-4 mb-2 rounded-xl cursor-pointer transition-shadow shadow-sm hover:shadow-md select-none",
        "border border-transparent",
        isFocused && "ring-2 ring-primary ring-offset-2",
        categoryStyle,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
              {categoryName}
            </span>
            {item.time && (
              <span className="flex items-center gap-1 text-[10px] font-medium opacity-80 bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                <Clock size={10} />
                {item.time}
              </span>
            )}
          </div>
          <h3
            className={cn(
              "font-semibold text-sm leading-snug",
              isDone && "line-through opacity-70",
            )}
          >
            {item.title}
          </h3>
        </div>

        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 border-current flex items-center justify-center transition-colors",
            isDone ? "bg-black/20 dark:bg-white/20" : "bg-transparent",
          )}
        >
          {isDone && <Check size={12} strokeWidth={3} />}
        </div>
      </div>
    </motion.div>
  );
}
