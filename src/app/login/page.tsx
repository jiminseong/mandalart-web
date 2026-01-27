"use client";

import { useState } from "react";
import { login, signup } from "./actions";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const action = isLogin ? login : signup;
      const result = await action(formData);

      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Back Button */}
        <Link
          href="/editor"
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          에디터로 돌아가기
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {isLogin ? "Welcome Back" : "Join Mandalart 2026"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isLogin
              ? "오타니 쇼헤이의 목표 달성법, 디지털로 시작하세요."
              : "당신의 꿈을 체계적으로 설계하는 첫 걸음입니다."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">이름</label>
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="홍길동"
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">이메일</label>
              <input
                name="email"
                type="email"
                required
                placeholder="hello@example.com"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                비밀번호
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-primary text-slate-900 font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? "로그인" : "시작하기"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">
              {isLogin ? "계정이 없으신가요?" : "이미 계정이 있으신가요?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-primary hover:underline"
            >
              {isLogin ? "회원가입" : "로그인"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
