import Link from "next/link";
import { ArrowLeft, Target, Grid, ListTodo } from "lucide-react";
import { OhtaniGrid } from "@/components/about/OhtaniGrid";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "만다라트 기법이란? - 오타니 쇼헤이 성공 비결",
  description:
    "만다라트(Mandalart)의 뜻과 작성법, 그리고 오타니 쇼헤이가 실제로 작성한 계획표 예시를 통해 목표 달성의 비밀을 확인해보세요.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="fixed top-0 left-0 w-full p-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          홈으로
        </Link>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-32">
        {/* Hero */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight">
            만다라트가
            <br />
            무엇인가요?
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            'Manda(본질)' + 'la(달성)' + 'Art(기술)'의 합성어로,
            <br />
            목표를 달성하기 위한 구체적인 기술을 의미합니다.
          </p>
        </section>

        {/* How it works */}
        <section className="grid sm:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {[
            {
              icon: Target,
              title: "핵심 목표",
              desc: "가장 중심에 이루고 싶은\n하나의 큰 꿈을 적습니다.",
            },
            {
              icon: Grid,
              title: "8개의 세부 목표",
              desc: "핵심 목표를 이루기 위해\n필요한 8가지 요소를 찾습니다.",
            },
            {
              icon: ListTodo,
              title: "64개의 실행 계획",
              desc: "세부 목표를 달성하기 위한\n구체적인 행동 계획을 세웁니다.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-3xl text-center space-y-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-primary ring-1 ring-slate-100">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 whitespace-pre-wrap leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Example (Ohtani) */}
        <section className="bg-slate-900 text-white rounded-[40px] p-10 sm:p-20 text-center space-y-8 overflow-hidden relative animate-in fade-in duration-700 delay-500">
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black leading-tight">
              오타니 쇼헤이의
              <br />
              괴물 같은 성장의 비밀
            </h2>

            <div className="py-8">
              <OhtaniGrid />
            </div>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              고등학교 1학년 때, 8구단 드래프트 1순위라는 꿈을 이루기 위해
              <br className="hidden sm:block" />
              그는 64개의 구체적인 실행 계획을 빈틈없이 채웠습니다.
              <br />
              이제 당신의 차례입니다.
            </p>
            <Link
              href="/editor"
              className="inline-block px-10 py-5 bg-primary text-white font-bold rounded-2xl text-xl hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              나만의 만다라트 만들기
            </Link>
          </div>
          {/* Deco */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-[50px]" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-[60px]" />
          </div>
        </section>
      </main>
    </div>
  );
}
