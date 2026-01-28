import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Target, Grid, ListTodo } from "lucide-react";
import { OhtaniGrid } from "@/components/about/OhtaniGrid";
import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/analytics/TrackedLink";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "만다라트 기법이란? - 오타니 쇼헤이 성공 비결",
  description:
    "만다라트(Mandalart)의 뜻과 작성법, 그리고 오타니 쇼헤이가 실제로 작성한 계획표 예시를 통해 목표 달성의 비밀을 확인해보세요.",
};

export default async function AboutPage() {
  const t = await getTranslations("about");
  const navT = await getTranslations("nav");

  const steps = [
    {
      id: "step1",
      icon: Target,
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      id: "step2",
      icon: Grid,
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      id: "step3",
      icon: ListTodo,
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="fixed top-0 left-0 w-full p-6 z-20 flex justify-between items-center bg-white/50 backdrop-blur-sm">
        <Link
          href="/"
          className="group text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-primary/50 hover:text-primary shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <span className="bg-slate-100 p-1 rounded-full group-hover:bg-primary/10 transition-colors">
            <ArrowLeft size={16} />
          </span>
          {navT("home")}
        </Link>

        <TrackedLink
          href="/editor"
          eventParams={{ entry: "onboarding_end" }}
          className="group flex items-center gap-2 px-6 py-2 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm"
        >
          {t("ctaCreate")}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </TrackedLink>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-32">
        {/* Hero */}
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight whitespace-pre-wrap">
            {t("title")}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto whitespace-pre-wrap">
            {t("description")}
          </p>
        </section>

        {/* How it works */}
        <section className="grid sm:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {steps.map((item) => (
            <div key={item.id} className="bg-slate-50 p-8 rounded-3xl text-center space-y-4">
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
            <h2 className="text-3xl sm:text-5xl font-black leading-tight whitespace-pre-wrap">
              {t("ohtaniTitle")}
            </h2>

            <div className="py-8">
              <OhtaniGrid />
            </div>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
              {t("ohtaniDesc")}
            </p>
            <TrackedLink
              href="/editor"
              eventParams={{ entry: "example_use" }}
              className="inline-block px-10 py-5 bg-primary text-white font-bold rounded-2xl text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              {t("ctaCreate")}
            </TrackedLink>
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
