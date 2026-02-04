"use client";

import { useActionState } from "react";
import { updateLifts } from "../../../actions";

export default function LiftsPage({ params }: { params: { locale: string } }) {
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateLifts, null);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          수행 능력 (1RM)
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          모르시면 비워두셔도 좋습니다. (0kg 처리)
        </p>
      </div>

      <form action={action} className="space-y-8 mt-8">
        <input type="hidden" name="locale" value={params.locale} />

        {/* iOS Grouped List for Inputs */}
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[14px] overflow-hidden border border-gray-200 dark:border-gray-800">
          {[
            { id: "squat", label: "스쿼트" },
            { id: "bench", label: "벤치프레스" },
            { id: "deadlift", label: "데드리프트" },
            { id: "overhead", label: "오버헤드프레스" },
          ].map((item, idx, arr) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-[#2C2C2E] ${idx !== arr.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
            >
              <span className="text-[17px] font-medium text-black dark:text-white">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <input
                  name={item.id}
                  type="number"
                  placeholder="0"
                  className="text-right bg-transparent w-24 text-[17px] text-blue-600 placeholder:text-gray-300 focus:outline-none"
                />
                <span className="text-[17px] text-gray-400">kg</span>
              </div>
            </div>
          ))}
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
      </form>
    </>
  );
}
