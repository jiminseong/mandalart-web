import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Grid,
  ListTodo,
  Zap,
  Ruler,
  Repeat,
  CalendarDays,
  Layers,
  Settings,
  Archive,
  MessageSquareQuote,
} from "lucide-react";
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

  const criteria = [
    {
      id: 1,
      title: t("criteria1Title"),
      desc: t("criteria1Desc"),
      icon: Zap,
    },
    {
      id: 2,
      title: t("criteria2Title"),
      desc: t("criteria2Desc"),
      icon: Ruler,
    },
    {
      id: 3,
      title: t("criteria3Title"),
      desc: t("criteria3Desc"),
      icon: Repeat,
    },
    {
      id: 4,
      title: t("criteria4Title"),
      desc: t("criteria4Desc"),
      icon: CalendarDays,
    },
    {
      id: 5,
      title: t("criteria5Title"),
      desc: t("criteria5Desc"),
      icon: Layers,
    },
    {
      id: 6,
      title: t("criteria6Title"),
      desc: t("criteria6Desc"),
      icon: Settings,
    },
    {
      id: 7,
      title: t("criteria7Title"),
      desc: t("criteria7Desc"),
      icon: Archive,
    },
    {
      id: 8,
      title: t("criteria8Title"),
      desc: t("criteria8Desc"),
      icon: MessageSquareQuote,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* iOS-style Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-black/5 dark:border-white/5">
        <div className="max-w-screen-sm mx-auto px-4 h-11 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 active:opacity-50 transition-opacity"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span className="font-semibold">{navT("home")}</span>
          </Link>

          <TrackedLink
            href="/editor"
            eventParams={{ entry: "onboarding_end" }}
            className="text-blue-600 dark:text-blue-400 font-semibold active:opacity-50 transition-opacity"
          >
            {t("ctaCreate")}
          </TrackedLink>
        </div>
      </header>

      <main className="max-w-screen-sm mx-auto px-6 pb-20">
        {/* Hero */}
        <section className="pt-8 pb-12 text-center space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight whitespace-pre-wrap">
            {t("title")}
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {t("description")}
          </p>
        </section>

        {/* How it works */}
        <section className="space-y-3 pb-12">
          {steps.map((item, index) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl space-y-3 border border-black/5 dark:border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600/10 dark:bg-blue-400/10 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <item.icon size={24} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed pl-15">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 8 Criteria */}
        <section className="space-y-6 pb-12">
          <h2 className="text-2xl font-bold leading-tight whitespace-pre-wrap text-center">
            {t("criteriaTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {criteria.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-black/5 dark:border-white/5 flex gap-4"
              >
                <div className="shrink-0 text-blue-600 dark:text-blue-400 mt-0.5">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example (Ohtani) */}
        <section className="bg-slate-900 dark:bg-slate-800 text-white rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold leading-tight whitespace-pre-wrap text-center">
            {t("ohtaniTitle")}
          </h2>

          <div className="py-4">
            <OhtaniGrid />
          </div>

          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap text-center">
            {t("ohtaniDesc")}
          </p>

          <TrackedLink
            href="/editor"
            eventParams={{ entry: "example_use" }}
            className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-2xl transition-colors"
          >
            <span>{t("ctaCreate")}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </TrackedLink>
        </section>
      </main>
    </div>
  );
}
