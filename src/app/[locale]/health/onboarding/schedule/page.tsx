"use client";

import { useActionState, use } from "react";
import { updateSchedule } from "../../actions";
import { Check } from "lucide-react";

const DAYS = [
  { id: "mon", label: "월" },
  { id: "tue", label: "화" },
  { id: "wed", label: "수" },
  { id: "thu", label: "목" },
  { id: "fri", label: "금" },
  { id: "sat", label: "토" },
  { id: "sun", label: "일" },
];

const TIME_SLOTS = [
  { id: "morning", label: "오전", sub: "06:00 ~ 11:00" },
  { id: "afternoon", label: "오후", sub: "12:00 ~ 17:00" },
  { id: "evening", label: "저녁", sub: "18:00 ~ 21:00" },
  { id: "night", label: "심야", sub: "22:00 ~" },
];

export default function SchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateSchedule, null);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          일정 설정
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          운동이 가능한 현실적인 시간을 선택하세요.
        </p>
      </div>

      <form action={action} className="space-y-8 mt-8 pb-32">
        <input type="hidden" name="locale" value={locale} />

        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-4">
            가능 요일
          </label>
          <div className="flex justify-between px-2">
            {DAYS.map((day) => (
              <label key={day.id} className="cursor-pointer group flex flex-col items-center gap-2">
                <input type="checkbox" name={`day_${day.id}`} className="peer sr-only" />
                <div className="w-10 h-10 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center text-[15px] font-medium text-gray-500 peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black transition-all">
                  {day.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-4">
            주 운동 시간대
          </label>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-[14px] overflow-hidden border border-gray-200 dark:border-gray-800">
            {TIME_SLOTS.map((slot, idx) => (
              <label
                key={slot.id}
                className={`flex items-center p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors ${idx !== TIME_SLOTS.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
              >
                <input
                  type="radio"
                  name="time_slot"
                  value={slot.id}
                  required
                  className="peer sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium text-[17px] text-black dark:text-white">
                    {slot.label}
                  </div>
                  <div className="text-[13px] text-gray-400">{slot.sub}</div>
                </div>
                <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100">
                  <Check size={14} strokeWidth={3} />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[54px] bg-black dark:bg-white text-white dark:text-black rounded-[27px] font-bold text-[19px] flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            {isPending ? "시작하는 중..." : "Health OS 시작하기"}
          </button>
        </div>
      </form>
    </>
  );
}
