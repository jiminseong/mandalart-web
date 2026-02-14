"use client";

import { useActionState, use } from "react";
import { updateNickname } from "../../actions";
import { ArrowRight } from "lucide-react";

export default function NicknamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  // @ts-ignore
  const [state, action, isPending] = useActionState(updateNickname, null);

  return (
    <>
      <div className="space-y-3">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          안녕하세요. <br />
          어떻게 불러드릴까요?
        </h1>
        <p className="text-[17px] leading-snug text-gray-500 dark:text-gray-400">
          코칭에 사용할 편한 이름을 알려주세요.
        </p>
      </div>

      <form action={action} className="space-y-8 mt-10">
        <input type="hidden" name="locale" value={locale} />

        <div className="group relative">
          <input
            name="nickname"
            type="text"
            placeholder="닉네임"
            required
            className="block w-full text-[22px] font-medium bg-transparent border-b border-gray-200 dark:border-gray-800 py-4 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-[52px] bg-[#007AFF] hover:bg-[#006ae6] active:scale-95 text-white rounded-[14px] font-semibold text-[17px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isPending ? "저장 중..." : <>다음</>}
        </button>

        {state?.error && (
          <p className="text-[15px] font-medium text-red-500 text-center">{state.error}</p>
        )}
      </form>
    </>
  );
}
