"use client";

import { useState } from "react";
import { saveNutritionLog } from "../../actions";
import { Check, Edit2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

// Define supplement types
const SUPPLEMENTS = [
  { id: "probiotics", label: "유산균", time: "공복", icon: "🥛" },
  { id: "arginine", label: "아르기닌", time: "운동 전", icon: "🔥" },
  { id: "caffeine", label: "카페인", time: "운동 전", icon: "☕" },
  { id: "eaa", label: "EAA", time: "운동 중", icon: "💧" },
  { id: "creatine", label: "크레아틴", time: "운동 후", icon: "💪" },
  { id: "omega3", label: "오메가3", time: "아침", icon: "🐟" },
  { id: "multivitamin_morning", label: "종비(아침)", time: "아침", icon: "💊" },
  { id: "zinc", label: "아연", time: "저녁", icon: "🛡️" },
  { id: "multivitamin_dinner", label: "종비(저녁)", time: "저녁", icon: "💊" },
];

interface NutritionSectionProps {
  initialLog: any;
  date: string;
  locale: string;
}

export default function NutritionSection({ initialLog, date, locale }: NutritionSectionProps) {
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
          <h2 className="text-[22px] font-bold text-black dark:text-white">오늘의 영양</h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-0.5">
            건강한 몸은 식단에서 시작됩니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Diet Card */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[22px] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[17px] font-semibold text-black dark:text-white flex items-center gap-2">
              <span>🍽️ 식단 기록</span>
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[14px] font-medium text-[#007AFF] bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                기입하기
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] text-gray-500">칼로리 (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full bg-[#F2F2F7] dark:bg-black/20 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] text-gray-500">단백질 (g)</label>
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
                  취소
                </button>
                <button
                  onClick={handleSaveDiet}
                  disabled={isSaving}
                  className="flex-1 py-3 text-[15px] font-bold text-white bg-[#007AFF] rounded-xl hover:bg-[#006ae6] transition-colors"
                >
                  {isSaving ? "저장 중..." : "저장 완료"}
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
            ✨ 영양제 체크리스트
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
                      {item.label}
                    </div>
                    <div className="text-[11px] text-gray-400">{item.time}</div>
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
