import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export default async function Home() {
  const t = await getTranslations("home");
  const _navT = await getTranslations("nav");

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* iOS-style Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-black/5 dark:border-white/5">
        <div className="max-w-screen-sm mx-auto px-4 h-11 flex items-center justify-between">
          <TrackedLink
            href="/health"
            eventParams={{ entry: "header_health" }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider"
          >
            Health OS
          </TrackedLink>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 -mt-11">
        <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10">
            <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              {t("badge")}
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {t("title")}
            </h1>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
              {t("titleHighlight")}
            </h2>
          </div>

          {/* Description */}
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
            {t("description")}
            <br />
            {t("descriptionSub")}
          </p>

          {/* CTA Button */}
          <div className="pt-4 w-full space-y-3">
            <TrackedLink
              href="/about"
              eventParams={{ entry: "hero_about" }}
              className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl transition-colors shadow-sm"
            >
              <span>{_navT("about")}</span>
            </TrackedLink>
            <TrackedLink
              href="/editor"
              eventParams={{ entry: "hero" }}
              className="group flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-2xl transition-colors shadow-sm"
            >
              <span>{t("cta")}</span>
              <ArrowRight
                className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.5}
              />
            </TrackedLink>
          </div>
        </div>
      </main>
    </div>
  );
}
