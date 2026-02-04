"use client";

import { useState } from "react";
import { saveNutritionLog } from "../../actions";
import { Check, Edit2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Define supplement types with translation keys
const SUPPLEMENTS = [
  // 기상 직후 (공복)
  { id: "probiotics", timeKey: "empty_stomach", icon: "🥛" },
  { id: "arginine_morning", timeKey: "empty_stomach", icon: "🔥" },

  // 아침 식후
  { id: "multivitamin_morning", timeKey: "morning", icon: "💊" },
  { id: "omega3", timeKey: "morning", icon: "🐟" },
  { id: "vitamin_d3", timeKey: "morning", icon: "☀️" },
  { id: "coq10", timeKey: "morning", icon: "⚡" },

  // 운동 전
  { id: "caffeine", timeKey: "pre_workout", icon: "☕" },
  { id: "arginine", timeKey: "pre_workout", icon: "🔥" },

  // 운동 중
  { id: "eaa", timeKey: "intra_workout", icon: "💧" },
  { id: "electrolyte", timeKey: "intra_workout", icon: "🧂" },

  // 운동 후
  { id: "wpi", timeKey: "post_workout", icon: "🥛" },
  { id: "creatine", timeKey: "post_workout", icon: "💪" },

  // 저녁 식후
  { id: "multivitamin_dinner", timeKey: "dinner", icon: "💊" },
  { id: "omega3_dinner", timeKey: "dinner", icon: "🐟" },
  { id: "zinc", timeKey: "dinner", icon: "🛡️" },

  // 취침 전
  { id: "magnesium", timeKey: "before_sleep", icon: "😴" },
];

interface NutritionSectionProps {
  initialLog: any;
  date: string;
  locale: string;
}

export default function NutritionSection({ initialLog, date, locale }: NutritionSectionProps) {
  const t = useTranslations("health.dashboard");
  const tCommon = useTranslations("health.common");
  const tSupplements = useTranslations("health.supplements");

  const [isEditing, setIsEditing] = useState(false);
  const [calories, setCalories] = useState(initialLog?.calories || 0);
  const [protein, setProtein] = useState(initialLog?.protein || 0);
  const [isSaving, setIsSaving] = useState(false);

  // Optimistic UI for supplements
  const [supplements, setSupplements] = useState(initialLog?.supplements || {});

  const handleToggleSupplement = async (id: string) => {
    const newState = !supplements[id];
    const newSupplements = { ...supplements, [id]: newState };
    setSupplements(newSupplements); // Optimistic update

    try {
      await saveNutritionLog(date, { supplements: { [id]: newState } }, locale);
    } catch (e) {
      console.error(e);
      setSupplements(supplements); // Revert on error
    }
  };

  const handleSaveDiet = async () => {
    setIsSaving(true);
    try {
      await saveNutritionLog(date, { calories, protein }, locale);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[22px] font-bold text-black dark:text-white">
            {t("todayNutrition")}
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-0.5">
            {t("todayNutritionDesc")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Diet Card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-black dark:text-white flex items-center gap-2">
              <span>🍽️ {t("logMeal")}</span>
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[14px] font-medium text-[#007AFF] bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                {t("fillIn")}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] text-gray-500">{t("calories")} (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-[#F2F2F7] dark:bg-black/20 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] text-gray-500">{t("protein")} (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full bg-[#F2F2F7] dark:bg-black/20 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 text-[15px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  onClick={handleSaveDiet}
                  disabled={isSaving}
                  className="flex-1 py-3 text-[15px] font-bold text-white bg-[#007AFF] rounded-xl hover:bg-[#006ae6] transition-colors"
                >
                  {isSaving ? tCommon("saving") : tCommon("save")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-around py-2">
              <div className="text-center">
                <div className="text-[28px] font-bold text-black dark:text-white">
                  {calories.toLocaleString()}
                </div>
                <div className="text-[13px] font-medium text-gray-400 uppercase">kcal</div>
              </div>
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
              <div className="text-center">
                <div className="text-[28px] font-bold text-black dark:text-white">
                  {Math.round(protein)}
                </div>
                <div className="text-[13px] font-medium text-gray-400 uppercase">Protein (g)</div>
              </div>
            </div>
          )}
        </div>

        {/* Supplements Grid */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-[17px] font-semibold text-black dark:text-white mb-4">
            ✨ {t("supplementChecklist")}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUPPLEMENTS.map((item) => {
              const isChecked = supplements[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleSupplement(item.id)}
                  className={`relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[100px] ${
                    isChecked
                      ? "bg-blue-50/50 dark:bg-blue-900/20 border-[#007AFF] shadow-sm"
                      : "bg-gray-50/50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {isChecked && (
                    <div className="absolute top-2 right-2 text-[#007AFF]">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-center">
                    <div
                      className={`text-[14px] font-semibold ${isChecked ? "text-[#007AFF]" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {tSupplements(`names.${item.id}`)}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {tSupplements(`times.${item.timeKey}`)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
