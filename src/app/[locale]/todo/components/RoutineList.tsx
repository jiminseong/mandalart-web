"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Repeat, Calendar, SendHorizontal } from "lucide-react";
import { createRoutine, deleteRoutine, DBRoutine } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

interface Category {
  id: string;
  name: string;
  colorClass: string;
}

interface RoutineListProps {
  routines: DBRoutine[];
  categories: Category[];
  locale: string;
}

const DAYS = [
  { key: "Mon", translationKey: "mon" },
  { key: "Tue", translationKey: "tue" },
  { key: "Wed", translationKey: "wed" },
  { key: "Thu", translationKey: "thu" },
  { key: "Fri", translationKey: "fri" },
  { key: "Sat", translationKey: "sat" },
  { key: "Sun", translationKey: "sun" },
];

const DATES = Array.from({ length: 31 }, (_, i) => i + 1); // 1-31

export default function RoutineList({ routines, categories, locale }: RoutineListProps) {
  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "every-other-day">(
    "daily",
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("todo.routine");

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCategoryId) return;
    if (frequency === "weekly" && selectedDays.length === 0) return;
    if (frequency === "monthly" && selectedDates.length === 0) return;

    startTransition(async () => {
      await createRoutine(
        title,
        selectedCategoryId,
        frequency,
        frequency === "weekly" ? selectedDays : null,
        frequency === "monthly" ? selectedDates : null,
        locale,
      );
      setTitle("");
      setSelectedDays([]);
      setSelectedDates([]);
      setFrequency("daily");
    });
  };

  const handleDeleteRoutine = (id: string) => {
    if (confirm(t("deleteConfirm"))) {
      startTransition(async () => {
        await deleteRoutine(id, locale);
      });
    }
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleDate = (date: number) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter((d) => d !== date));
    } else {
      setSelectedDates([...selectedDates, date].sort((a, b) => a - b));
    }
  };

  const getFrequencyLabel = (routine: DBRoutine) => {
    switch (routine.frequency) {
      case "daily":
        return t("frequencyLabels.daily");
      case "weekly":
        return routine.days?.join(", ") || t("frequencyLabels.weekly");
      case "monthly":
        return t("frequencyLabels.monthly", { dates: routine.dates?.join(", ") || "" });
      case "every-other-day":
        return t("frequencyLabels.everyOtherDay");
      default:
        return routine.frequency;
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* List View */}
        <div className="flex-1 overflow-y-auto pb-96 space-y-3  no-scrollbar">
          <h3 className="px-1 text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
            {t("myRoutines")}
          </h3>

          <AnimatePresence>
            {routines.map((routine) => {
              const category = categories.find((c) => c.id === routine.category_id);
              return (
                <motion.div
                  key={routine.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={cn(
                        "mt-1 w-2 h-2 rounded-full",
                        category?.colorClass || "bg-gray-400",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {routine.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[10px] text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                          <Repeat size={10} /> {getFrequencyLabel(routine)}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {category?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteRoutine(routine.id)}
                    className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {routines.length === 0 && (
            <div className="text-center py-15 md:py-20 text-gray-400">
              <Repeat size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm">{t("empty")}</p>
            </div>
          )}
        </div>

        {/* Input Area (TodoBoard 스타일 그대로) */}
        <div className="absolute bottom-0 left-0 right-0 pt-4 pb-2 mb-4 bg-white dark:bg-black z-20 border-t border-gray-100 dark:border-zinc-800">
          {/* 1. 일정 선택 (4개 탭) */}
          <div className="grid grid-cols-4 gap-1.5 mb-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setFrequency("daily")}
              className={cn(
                "px-2 py-2 text-xs font-semibold rounded-lg transition-all",
                frequency === "daily"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {t("daily")}
            </button>
            <button
              onClick={() => setFrequency("weekly")}
              className={cn(
                "px-2 py-2 text-xs font-semibold rounded-lg transition-all",
                frequency === "weekly"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {t("weekly")}
            </button>
            <button
              onClick={() => setFrequency("monthly")}
              className={cn(
                "px-2 py-2 text-xs font-semibold rounded-lg transition-all",
                frequency === "monthly"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setFrequency("every-other-day")}
              className={cn(
                "px-2 py-2 text-xs font-semibold rounded-lg transition-all",
                frequency === "every-other-day"
                  ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400",
              )}
            >
              {t("everyOtherDay")}
            </button>
          </div>

          {/* 2-1. 요일 선택 (Weekly Only) */}
          <AnimatePresence>
            {frequency === "weekly" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-3 overflow-hidden"
              >
                <div className="flex gap-2 justify-center py-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => toggleDay(day.key)}
                      className={cn(
                        "w-10 h-10 rounded-full text-sm font-bold transition-all",
                        selectedDays.includes(day.key)
                          ? "bg-blue-500 text-white shadow-md scale-105"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                      )}
                    >
                      {t(`days.${day.translationKey}`)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2-2. 날짜 선택 (Monthly Only) */}
          <AnimatePresence>
            {frequency === "monthly" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-3 overflow-hidden"
              >
                <div className="grid grid-cols-7 gap-1.5 py-2 max-h-56 overflow-y-scroll scrollbar-hide">
                  {DATES.map((date) => (
                    <button
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={cn(
                        "h-9 rounded-lg text-xs font-bold transition-all",
                        selectedDates.includes(date)
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                      )}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3. 카테고리 선택 (TodoBoard 스타일 그대로) */}
          <div className="flex flex-wrap gap-2 mb-2 pt-2">
            {categories.map((cat, index) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5",
                  selectedCategoryId === cat.id
                    ? "bg-black text-white dark:bg-white dark:text-black font-semibold shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                <span className={cn("w-1.5 h-1.5 rounded-full", cat.colorClass)} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* 4. 할일 입력 (TodoBoard 스타일 그대로) */}
          <form onSubmit={handleAddRoutine} className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("inputPlaceholder")}
              className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-100 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500/20 text-[15px] placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={
                !title.trim() ||
                isPending ||
                (frequency === "weekly" && selectedDays.length === 0) ||
                (frequency === "monthly" && selectedDates.length === 0)
              }
              className="absolute right-2 top-2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              <SendHorizontal size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
