import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background-light p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
        <Link
          href="/about"
          className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="bg-slate-100 p-1 rounded-full">
            <Sparkles size={12} />
          </span>
          만다라트에 대해 알아보기
        </Link>
      </header>

      <main className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mt-[-40px]">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary-700 font-bold text-xs ring-1 ring-primary/20">
            <Sparkles size={12} />
            Mandalart 2026
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-800">
            작은 목표부터
            <br />
            <span className="text-primary">차근차근 ☁️</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            나만의 만다라트를 만들어보세요.
            <br className="hidden sm:block" />
            복잡한 생각은 비우고, 중요한 것에 집중해요.
          </p>
        </div>

        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Link
            href="/editor"
            className="group flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg"
          >
            지금 시작하기
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-lg"
          >
            로그인
          </Link>
        </div>
      </main>
    </div>
  );
}
