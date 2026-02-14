"use client";

import { useActionState, use } from "react";
import { updateInbody } from "../../../actions";

export default function InbodyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateInbody, null);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          인바디 기록
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          현재 몸 상태를 알려주세요.
        </p>
      </div>

      <form action={action} className="space-y-8 mt-8">
        <input type="hidden" name="locale" value={locale} />

        <div className="bg-white dark:bg-[#1C1C1E] rounded-[14px] overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Weight (Required) */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2C2C2E] border-b border-gray-200 dark:border-gray-700">
            <span className="text-[17px] font-medium text-black dark:text-white">
              체중 <span className="text-red-500">*</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                name="weight"
                type="number"
                step="0.1"
                placeholder="0.0"
                required
                autoFocus
                className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-300 focus:outline-none"
              />
              <span className="text-[17px] text-gray-400">kg</span>
            </div>
          </div>

          {/* Muscle */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2C2C2E] border-b border-gray-200 dark:border-gray-700">
            <span className="text-[17px] font-medium text-black dark:text-white">골격근량</span>
            <div className="flex items-center gap-2">
              <input
                name="skeletal_muscle"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-300 focus:outline-none"
              />
              <span className="text-[17px] text-gray-400">kg</span>
            </div>
          </div>

          {/* Fat Rate */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2C2C2E]">
            <span className="text-[17px] font-medium text-black dark:text-white">체지방률</span>
            <div className="flex items-center gap-2">
              <input
                name="body_fat_rate"
                type="number"
                step="0.1"
                placeholder="0.0"
                className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-300 focus:outline-none"
              />
              <span className="text-[17px] text-gray-400">%</span>
            </div>
          </div>
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
