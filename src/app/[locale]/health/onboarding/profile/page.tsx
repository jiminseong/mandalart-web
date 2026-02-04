"use client";

import { useActionState } from "react";
import { updateProfile } from "../../actions";

export default function ProfilePage({ params }: { params: { locale: string } }) {
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          기본 정보
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          정확한 분석을 위해 신체 정보를 알려주세요.
        </p>
      </div>

      <form action={action} className="space-y-8 mt-8">
        <input type="hidden" name="locale" value={params.locale} />

        {/* iOS Grouped Inset List Style */}
        <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[14px] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300/50 dark:border-gray-700/50 bg-white dark:bg-[#2C2C2E]">
            <span className="text-[17px] text-black dark:text-white">키</span>
            <div className="flex items-center gap-2">
              <input
                name="height"
                type="number"
                placeholder="175"
                step="0.1"
                required
                className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-400 focus:outline-none"
              />
              <span className="text-[17px] text-gray-500">cm</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2C2C2E]">
            <span className="text-[17px] text-black dark:text-white">평균 수면</span>
            <div className="flex items-center gap-2">
              <input
                name="sleep_avg"
                type="number"
                placeholder="7"
                step="0.5"
                required
                className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-400 focus:outline-none"
              />
              <span className="text-[17px] text-gray-500">시간</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-4">
            주당 평균 운동 횟수
          </label>
          <div className="bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-[14px] p-1 flex justify-between">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="workout_per_week"
                  value={num}
                  className="peer sr-only"
                  required
                />
                <div className="h-10 rounded-[10px] flex items-center justify-center text-[15px] font-medium text-gray-500 peer-checked:bg-white peer-checked:text-black peer-checked:shadow-sm dark:peer-checked:bg-[#636366] dark:peer-checked:text-white transition-all">
                  {num}
                  {num === 5 ? "+" : ""}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#2C2C2E] rounded-[14px] overflow-hidden border border-gray-200 dark:border-gray-800">
          <textarea
            name="injury_notes"
            placeholder="부상 부위나 주의사항이 있다면 적어주세요 (선택)"
            className="w-full h-32 px-4 py-3 bg-transparent text-[17px] placeholder:text-gray-400 focus:outline-none resize-none"
          />
        </div>

        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-md mx-auto">
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-[52px] bg-[#007AFF] hover:bg-[#006ae6] active:scale-95 text-white rounded-[14px] font-semibold text-[17px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            {isPending ? "저장 중..." : "다음"}
          </button>
        </div>

        {state?.error && <p className="text-[15px] text-red-500 text-center">{state.error}</p>}
      </form>
    </>
  );
}
