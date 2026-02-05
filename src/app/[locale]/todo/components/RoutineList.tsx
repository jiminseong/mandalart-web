"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Repeat, Calendar } from "lucide-react";
import { createRoutine, deleteRoutine, DBRoutine } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function RoutineList({ routines, categories, locale }: RoutineListProps) {
  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || "");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("todo.routine");

  const handleAddRoutine = () => {
    if (!title.trim() || !selectedCategoryId) return;
    if (frequency === "weekly" && selectedDays.length === 0) return;

    startTransition(async () => {
      await createRoutine(
        title,
        selectedCategoryId,
        frequency,
        frequency === "weekly" ? selectedDays : null,
        locale,
      );
      setTitle("");
      setSelectedDays([]);
      setFrequency("daily"); // Reset to default
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

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative">
      <div className="flex-1 overflow-y-auto pb-32 space-y-4 scrollbar-hide">
        {/* Input Section */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("placeholder")}
            className="w-full text-lg font-medium bg-transparent border-none focus:ring-0 placeholder:text-gray-400 p-0"
          />

          {/* Options */}
          <div className="flex flex-col gap-3">
            {/* Frequency Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-black/50 rounded-lg self-start">
              <button
                onClick={() => setFrequency("daily")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  frequency === "daily"
                    ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {t("daily")}
              </button>
              <button
                onClick={() => setFrequency("weekly")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  frequency === "weekly"
                    ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                    : "text-gray-500"
                }`}
              >
                {t("weekly")}
              </button>
            </div>

            {/* Day Selector (Weekly Only) */}
            <AnimatePresence>
              {frequency === "weekly" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-1 flex-wrap">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-8 h-8 rounded-full text-[10px] font-medium transition-colors flex items-center justify-center ${
                          selectedDays.includes(day)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                      >
                        {day[0]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    selectedCategoryId === cat.id
                      ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                      : "bg-transparent text-gray-500 border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1.5 ${cat.colorClass}`}
                  ></span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddRoutine}
            disabled={
              !title.trim() || isPending || (frequency === "weekly" && selectedDays.length === 0)
            }
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {isPending ? (
              t("adding")
            ) : (
              <>
                <Plus size={18} /> {t("add")}
              </>
            )}
          </button>
        </div>

        {/* List Section */}
        <div className="space-y-2">
          <h3 className="px-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t("myRoutines")}
          </h3>
          {routines.map((routine) => {
            const category = categories.find((c) => c.id === routine.category_id);
            return (
              <motion.div
                key={routine.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-4 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${category?.colorClass || "bg-gray-400"}`}
                  />
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {routine.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {routine.frequency === "daily" ? (
                        <span className="flex items-center gap-1 text-[10px] text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                          <Repeat size={10} /> {t("daily")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-purple-500 font-medium bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded">
                          <Calendar size={10} /> {routine.days?.join(", ")}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{category?.name}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })}

          {routines.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">{t("empty")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
