"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/utils/cn";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.startsWith("/en") ? "en" : "ko";

  const switchLanguage = (locale: "ko" | "en") => {
    const newPathname = pathname.replace(/^\/(ko|en)/, `/${locale}`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => switchLanguage("ko")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-bold transition-all",
          currentLocale === "ko"
            ? "bg-primary text-white"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
        )}
      >
        한국어
      </button>
      <button
        onClick={() => switchLanguage("en")}
        className={cn(
          "px-3 py-1.5 rounded-full text-sm font-bold transition-all",
          currentLocale === "en"
            ? "bg-primary text-white"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
        )}
      >
        English
      </button>
    </div>
  );
}
