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
  CheckCircle2,
} from "lucide-react";
import { OhtaniGrid } from "@/components/about/OhtaniGrid";
import { getTranslations } from "next-intl/server";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { Metadata } from "next";
import { cn } from "@/utils/cn";

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
        <section className="space-y-12 bg-text-primary text-base rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="relative z-10 space-y-8 text-center max-w-2xl mx-auto">
            <div className="space-y-4">
              <span className="text-growth font-medium uppercase tracking-widest text-xs">
                Example
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">{t("ohtaniTitle")}</h2>
            </div>

            <p className="text-white/70 text-lg leading-relaxed">{t("ohtaniDesc")}</p>

            <div className="py-6">
              {/* OhtaniGrid might need styling adjustments for dark bg, assuming it handles it */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <OhtaniGrid />
              </div>
            </div>

            <TrackedLink
              href="/editor"
              eventParams={{ entry: "example_use" }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-growth text-text-primary font-bold rounded-full hover:bg-growth/90 transition-all hover:scale-105 active:scale-95"
            >
              <span>{t("ctaCreate")}</span>
              <ArrowRight size={20} strokeWidth={2} />
            </TrackedLink>
          </div>

          {/* Decorative background blur */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-growth/5 blur-3xl rounded-full" />
        </section>
      </main>
    </div>
  );
}
