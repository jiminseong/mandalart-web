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
    <div className="min-h-screen bg-base text-text-primary font-sans selection:bg-growth/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-base/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-screen-md mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft
              size={20}
              strokeWidth={1.5}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium tracking-wide uppercase text-sm">HOME</span>
          </Link>
          <div className="font-bold text-lg tracking-tight">Mandalart</div>
          <div className="w-16" /> {/* Spacer for centering if needed, or actions */}
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-6 py-12 md:py-20 space-y-24">
        {/* Hero Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-4">
            <span className="text-growth font-medium uppercase tracking-widest text-xs">
              Philosophy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-text-primary">
              {t("title")}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto font-normal">
            {t("description")}
          </p>
        </section>

        {/* How it works */}
        <section className="grid md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-surface border border-border/50 hover:border-growth/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-base border border-border flex items-center justify-center text-text-primary">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* 8 Criteria */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <span className="text-growth font-medium uppercase tracking-widest text-xs">
              Guidelines
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">{t("criteriaTitle")}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {criteria.map((item) => (
              <div
                key={item.id}
                className="group flex gap-5 p-6 rounded-xl bg-surface border border-border/50 hover:border-growth/50 transition-colors"
              >
                <div className="shrink-0 pt-1 text-text-tertiary group-hover:text-growth transition-colors">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-text-primary text-lg">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Example (Ohtani) */}
        <section className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#20211e] px-6 py-8 text-base shadow-[0_24px_80px_-36px_rgba(0,0,0,0.45)] md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-x-12 bottom-0 h-40 rounded-full bg-growth/12 blur-3xl" />

          <div className="relative z-10 space-y-8 text-center max-w-2xl mx-auto">
            <div className="space-y-4">
              <span className="text-growth font-medium uppercase tracking-widest text-xs">
                Example
              </span>
              <h2 className="whitespace-pre-line text-3xl font-bold text-white md:text-4xl">
                {t("ohtaniTitle")}
              </h2>
            </div>

            <p className="mx-auto max-w-xl whitespace-pre-line break-keep text-base leading-8 text-white/85 md:text-lg">
              {t("ohtaniDesc")}
            </p>

            <div className="py-2 md:py-4">
              <div className="rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm md:p-4">
                <OhtaniGrid />
              </div>
            </div>

            <TrackedLink
              href="/editor"
              eventParams={{ entry: "example_use" }}
              className="inline-flex items-center gap-3 rounded-full bg-growth px-8 py-4 font-bold text-accent-contrast shadow-lg shadow-growth/20 transition-all hover:scale-[1.02] hover:bg-growth/90 active:scale-95"
            >
              <span>{t("ctaCreate")}</span>
              <ArrowRight size={20} strokeWidth={2} />
            </TrackedLink>
          </div>
        </section>
      </main>
    </div>
  );
}
