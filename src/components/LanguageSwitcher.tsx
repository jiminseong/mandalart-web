"use client";

import { usePathname, useRouter, routing } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  const switchLanguage = (newLocale: "ko" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="inline-flex items-center rounded-full border border-border/80 bg-surface/80 p-1 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      {routing.locales.map((loc) => (
        <div key={loc} className="flex items-center">
          <button
            onClick={() => switchLanguage(loc as "ko" | "en")}
            className={cn(
              "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
              locale === loc
                ? "bg-surface-strong text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {loc}
          </button>
        </div>
      ))}
    </div>
  );
}
