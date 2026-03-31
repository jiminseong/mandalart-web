import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { cn } from "@/utils/cn";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("home");
  const navT = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-base text-text-primary font-sans selection:bg-growth/20 selection:text-growth flex flex-col">
      {/* Editorial Header */}
      <header className="w-full max-w-[1400px] mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-growth rounded-full" />
          <span className="font-medium tracking-widest text-xs text-text-secondary uppercase">
            Mandalart 2026
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content - Left Aligned Editorial Layout */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center pb-24">
        <div className="max-w-4xl w-full">
          {/* Badge / Label */}
          <div className="mb-8 inline-block">
            <span className="rounded-full border border-border bg-surface-strong/80 px-3 py-1 text-xs font-medium tracking-wide text-text-secondary uppercase backdrop-blur-sm">
              {t("badge")}
            </span>
          </div>

          {/* Hero Typography */}
          <div className="space-y-8 mb-16">
            <h1
              className={cn(
                "font-bold leading-[1.2] -ml-[0.05em] tracking-tighter text-text-primary break-keep text-balance",
                locale === "en"
                  ? "text-5xl md:text-7xl lg:text-[7.5rem]"
                  : "text-6xl md:text-8xl lg:text-9xl",
              )}
            >
              {t("title")}
              <br />
              <span className="text-text-secondary/80 font-medium italic">
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg font-light break-keep border-l border-growth pl-6 py-2">
              {t("description")} {t("descriptionSub")}
            </p>
          </div>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <TrackedLink
              href="/editor"
              eventParams={{ entry: "hero" }}
              className="group relative inline-flex items-center gap-3 rounded-full bg-text-primary px-10 py-5 text-base text-accent-contrast transition-all hover:-translate-y-1 hover:bg-text-secondary hover:shadow-lg"
            >
              <span className="font-medium tracking-wide">{t("cta")}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2}
              />
            </TrackedLink>

            <TrackedLink
              href="/about"
              eventParams={{ entry: "hero_about" }}
              className="group inline-flex items-center gap-2 px-8 py-5 text-text-primary font-medium border-b border-border hover:border-text-primary transition-colors text-base"
            >
              <span>{navT("about")}</span>
            </TrackedLink>
          </div>
        </div>

        {/* Decorative Lines */}
        <div className="fixed top-0 right-[15%] w-px h-full bg-border/40 -z-10 hidden xl:block" />
        <div className="fixed bottom-[15%] left-0 w-full h-px bg-border/40 -z-10" />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-6 py-8 border-t border-border/40">
        <div className="flex justify-between items-end text-[10px] md:text-xs text-text-secondary uppercase tracking-widest font-medium">
          <div className="flex flex-col gap-1">
            <span>© 2026 Mandalart Project</span>
            <span className="text-text-secondary/50">All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <span>Nordic Editorial Standard</span>
            <span>Design System v2</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
