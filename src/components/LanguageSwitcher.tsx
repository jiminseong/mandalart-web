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
    <div className="flex items-center gap-2">
      {routing.locales.map((loc, index) => (
        <div key={loc} className="flex items-center">
          <button
            onClick={() => switchLanguage(loc as "ko" | "en")}
            className={cn(
              "text-xs font-bold transition-colors uppercase tracking-widest",
              locale === loc
                ? "text-text-primary underline decoration-2 decoration-growth underline-offset-4"
                : "text-text-secondary/40 hover:text-text-secondary",
            )}
          >
            {loc}
          </button>
          {index < routing.locales.length - 1 && (
            <span className="ml-2 text-[10px] text-border">/</span>
          )}
        </div>
      ))}
    </div>
  );
}
