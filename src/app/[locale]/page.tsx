import { Link } from "@/i18n/routing";
import { Sparkles, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export default async function Home() {
  const t = await getTranslations("home");
  const navT = await getTranslations("nav");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-50 dark:opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 z-20 flex justify-end items-center">
        <LanguageSwitcher />
      </header>

      <main className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl mt-[-40px]">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary-700 dark:text-primary-300 font-bold text-xs ring-1 ring-primary/20">
            <Sparkles size={12} />
            {t("badge")}
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-800 dark:text-slate-100">
            {t("title")}
            <br />
            <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t("description")}
            <br className="hidden sm:block" />
            {t("descriptionSub")}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <div className="flex gap-4">
            <TrackedLink
              href="/editor"
              eventParams={{ entry: "hero" }}
              className="group flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all text-lg"
            >
              {t("cta")}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </TrackedLink>
            <Link
              href="/login"
              className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-lg"
            >
              {navT("login")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
