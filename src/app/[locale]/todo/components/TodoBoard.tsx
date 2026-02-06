"use client";

import { useState, useOptimistic, useTransition, useEffect } from "react";
import { useTranslations } from "next-intl";
import { TodoItem, Category } from "../types";
import { createTodo, toggleTodoStatus, createCategory, deleteTodo } from "../actions";
import { TodoCard } from "./TodoCard";
import OSSwitcher from "@/components/OSSwitcher";
import { Plus, SendHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/utils/cn";

// Safelist for Tailwind to detect these classes on the /todo route
const CATEGORY_COLORS = [
  "bg-blue-500",
  "bg-blue-600",
  "bg-blue-400",
  "bg-sky-500",
  "bg-sky-600",
  "bg-indigo-500",
  "bg-indigo-600",
  "bg-cyan-500",
  "bg-cyan-600",
  "bg-teal-500",
  "bg-slate-500",
  "bg-slate-600",
  "bg-zinc-500",
  "bg-neutral-500",
  "bg-stone-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-green-500",
  "bg-lime-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-red-500",
  "bg-blue-300",
  "bg-indigo-300",
  "bg-sky-300",
  "bg-slate-400",
];

const getCategoryColor = (category: Category, index: number) => {
  if (category.colorClass) return category.colorClass;
  // Deterministic fallback based on index (or char code sum if we wanted)
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
};

interface TodoBoardProps {
  initialTodos: TodoItem[];
  initialCategories: Category[];
  locale: string;
}

type OptimisticAction =
  | { type: "ADD_TODO"; payload: TodoItem }
  | { type: "TOGGLE_STATUS"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };

export default function TodoBoard({ initialTodos, initialCategories, locale }: TodoBoardProps) {
  const t = useTranslations("todo.stack");
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || "");
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo");
  const [isPending, startTransition] = useTransition();

  // Optimistic Todos
  const [optimisticTodos, dispatchOptimistic] = useOptimistic(
    initialTodos,
    (state, action: OptimisticAction) => {
      switch (action.type) {
        case "ADD_TODO":
          return [...state, action.payload];
        case "TOGGLE_STATUS":
          return state.map((item) => {
            if (item.id === action.payload.id) {
              const newStatus = item.status === "todo" ? "done" : "todo";
              return {
                ...item,
                status: newStatus,
                completedAt: newStatus === "done" ? new Date().toISOString() : undefined,
              };
            }
            return item;
          });
        case "DELETE_TODO":
          return state.filter((item) => item.id !== action.payload.id);
        default:
          return state;
      }
    },
  );

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedCategory) return;

    const optimisticId = uuidv4();
    const newTodo: TodoItem = {
      id: optimisticId,
      title: inputValue,
      categoryId: selectedCategory,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    startTransition(async () => {
      dispatchOptimistic({ type: "ADD_TODO", payload: newTodo });
      setInputValue("");
      await createTodo(inputValue, selectedCategory, undefined, locale, optimisticId);
    });
  };

  const handleToggleStatus = async (id: string) => {
    const item = optimisticTodos.find((t) => t.id === id);
    if (!item) return;

    startTransition(async () => {
      dispatchOptimistic({ type: "TOGGLE_STATUS", payload: { id } });
      await toggleTodoStatus(id, item.status, locale);
    });
  };

  const handleDeleteTodo = async (id: string) => {
    startTransition(async () => {
      dispatchOptimistic({ type: "DELETE_TODO", payload: { id } });
      await deleteTodo(id, locale);
    });
  };

  const todoItems = optimisticTodos.filter((i) => i.status === "todo");
  const doneItems = optimisticTodos.filter((i) => i.status === "done");
  const currentItems = activeTab === "todo" ? todoItems : doneItems;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab Switcher */}
      <div className="mt-2 mb-4 flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl relative shrink-0">
        <motion.div
          className="absolute top-1 bottom-1 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
          initial={false}
          animate={{
            left: activeTab === "todo" ? "4px" : "50%",
            width: "calc(50% - 4px)",
            x: activeTab === "done" ? "0%" : "0%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <button
          onClick={() => setActiveTab("todo")}
          className={cn(
            "flex-1 relative z-10 py-2 text-sm font-semibold text-center transition-colors",
            activeTab === "todo"
              ? "text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400",
          )}
        >
          {t("today")} ({todoItems.length})
        </button>
        <button
          onClick={() => setActiveTab("done")}
          className={cn(
            "flex-1 relative z-10 py-2 text-sm font-semibold text-center transition-colors",
            activeTab === "done"
              ? "text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400",
          )}
        >
          {t("done")} ({doneItems.length})
        </button>
      </div>

      {/* Main Content: Single Stack View */}
      <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
        {/* Stack View */}
        <div
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar space-y-3 relative min-h-0 pb-52",
            activeTab === "done" && "pb-24",
          )}
        >
          <AnimatePresence initial={false}>
            {currentItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-center  py-20 text-gray-400 self-center m-auto"
              >
                {activeTab === "todo" ? t("empty") : t("emptyDone")}
              </motion.div>
            )}
            {[...currentItems].map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <TodoCard
                  key={item.id}
                  item={item}
                  category={category}
                  onClick={handleToggleStatus}
                  onDelete={handleDeleteTodo}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Input Area (Only visible in Todo tab) */}
        <AnimatePresence>
          {activeTab === "todo" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ bottom: "calc(24px + env(safe-area-inset-bottom))" }}
              className="absolute left-0 right-0 pt-4 bg-white dark:bg-black z-20 border-t border-gray-100 dark:border-zinc-800"
            >
              <div className="flex flex-wrap gap-2 mb-2 pt-2">
                {categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5",
                      selectedCategory === cat.id
                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700",
                    )}
                  >
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", getCategoryColor(cat, index))}
                    />
                    {cat.name}
                  </button>
                ))}
                <Link
                  href={`/${locale}/todo/category`}
                  className="text-xs px-3 py-1.5 rounded-full bg-gray-50 text-gray-400 border border-dashed border-gray-300 flex items-center gap-1 hover:border-gray-400 hover:text-gray-500 whitespace-nowrap"
                >
                  <Plus size={12} /> {t("new")}
                </Link>
              </div>

              <form onSubmit={handleAddTodo} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("inputPlaceholder")}
                  className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-100 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500/20 text-[15px] placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isPending}
                  className="absolute right-2 top-2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  <SendHorizontal size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
