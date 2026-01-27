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
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLanguage(loc as "ko" | "en")}
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-bold transition-all uppercase",
            locale === loc
              ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
