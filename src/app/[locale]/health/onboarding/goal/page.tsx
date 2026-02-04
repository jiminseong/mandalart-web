"use client";

import { useActionState, useState } from "react";
import { createGoal } from "../../actions";
import { Check } from "lucide-react";

const GOAL_TYPES = [
  { id: "strength", label: "근력 증가", sub: "3대 운동 증량", icon: "💪" },
  { id: "weight", label: "체중 조절", sub: "감량 또는 증량", icon: "⚖️" },
  { id: "bodyfat", label: "체지방 감소", sub: "선명한 근육", icon: "🔥" },
  { id: "habit", label: "운동 습관", sub: "꾸준한 루틴", icon: "🏃" },
  // Default logic:
  // str -> kg
  // weight -> kg
  // bodyfat -> %
  // habit -> 일/주
];

export default function GoalPage({ params }: { params: { locale: string } }) {
  // @ts-ignore
  const [state, action, isPending] = useActionState(createGoal, null);
  const [selectedType, setSelectedType] = useState(GOAL_TYPES[0]);

  const getUnit = (typeId: string) => {
    if (typeId === "bodyfat") return "%";
    if (typeId === "habit") return "일/주";
    return "kg";
  };

  const getPlaceholder = (typeId: string) => {
    if (typeId === "strength") return "500";
    if (typeId === "weight") return "70.0";
    if (typeId === "bodyfat") return "15.0";
    return "5";
  };

  const currentUnit = getUnit(selectedType.id);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          가장 중요한 목표
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          지금 가장 집중하고 싶은 '단 하나'를 알려주세요.
        </p>
      </div>

      <form action={action} className="space-y-8 mt-8">
        <input type="hidden" name="locale" value={params.locale} />
        <input type="hidden" name="unit" value={currentUnit} />
        <input type="hidden" name="priority" value="1" />
        <input type="hidden" name="start_date" value={new Date().toISOString().split("T")[0]} />

        {/* iOS List Style Selection */}
        <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[20px] overflow-hidden">
          {GOAL_TYPES.map((type, index) => (
            <label
              key={type.id}
              className={`relative flex items-center p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors ${
                index !== GOAL_TYPES.length - 1
                  ? "border-b border-gray-300/50 dark:border-gray-700/50 ml-4"
                  : "mx-4"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={type.id}
                className="peer sr-only"
                checked={selectedType.id === type.id}
                onChange={() => setSelectedType(type)}
              />
              <span className="text-2xl mr-4">{type.icon}</span>
              <div className="flex-1">
                <div className="font-semibold text-[17px] text-black dark:text-white">
                  {type.label}
                </div>
                <div className="text-[15px] text-gray-500 dark:text-gray-400">{type.sub}</div>
              </div>

              {selectedType.id === type.id && (
                <div className="text-[#007AFF]">
                  <Check strokeWidth={2.5} size={20} />
                </div>
              )}
            </label>
          ))}
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-1">
            목표 수치 ({currentUnit})
          </label>
          <input
            name="target_value"
            type="number"
            step={selectedType.id === "habit" ? "1" : "0.1"}
            placeholder={getPlaceholder(selectedType.id)}
            required
            className="block w-full text-[28px] font-bold bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 placeholder:text-gray-300 focus:outline-none focus:border-[#007AFF] transition-colors text-center"
          />
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[52px] bg-[#007AFF] hover:bg-[#006ae6] active:scale-95 text-white rounded-[14px] font-semibold text-[17px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isPending ? "저장 중..." : "설정 완료"}
          </button>
        </div>
      </form>
    </>
  );
}
