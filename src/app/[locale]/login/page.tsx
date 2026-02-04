"use client";

import { Suspense, useState } from "react";
import { useLocale } from "next-intl";
import { login, signup } from "./actions";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const locale = useLocale();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const action = isLogin ? login : signup;
      const result = await action(formData);

      if (result && "error" in result && result.error) {
        setError(result.error);
      } else if (result && "message" in result && result.message) {
        setMessage(result.message);
        setIsLogin(true); // Switch to login mode to prompt check
      }
    } catch (err) {
      // Re-throw if it appears to be a Next.js redirect
      if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
        throw err;
      }
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {isLogin ? "환영합니다" : "시작하기"}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isLogin
            ? "오타니 쇼헤이의 목표 달성법, 디지털로 시작하세요."
            : "당신의 꿈을 체계적으로 설계하는 첫 걸음입니다."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={nextUrl || ""} />

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 dark:text-white">이름</label>
            <input
              name="full_name"
              type="text"
              required
              placeholder="홍길동"
              className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">이메일</label>
          <input
            name="email"
            type="email"
            required
            placeholder="hello@example.com"
            className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">비밀번호</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="6자리 이상 입력해주세요"
            className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? "로그인" : "회원가입"}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-600 dark:text-blue-400 active:opacity-50 transition-opacity"
        >
          {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* iOS-style Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-black/5 dark:border-white/5">
        <div className="max-w-screen-sm mx-auto px-4 h-11 flex items-center">
          <Link
            href="/editor"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 active:opacity-50 transition-opacity"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="font-semibold">에디터</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <Suspense fallback={<Loader2 className="animate-spin h-8 w-8 text-blue-500" />}>
          <LoginContent />
        </Suspense>
      </main>
    </div>
  );
}
