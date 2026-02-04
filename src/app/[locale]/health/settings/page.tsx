"use client";

import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { use } from "react";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("health.settings");
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    // pathname example: /ko/health/settings
    // We want to replace the first segment
    const segments = pathname.split("/");
    // segments[0] is "", segments[1] is locale
    if (segments[1] === "ko" || segments[1] === "en") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/");

    // Replace current URL with new locale
    router.replace(newPath);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center px-4 py-4 safe-top bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 sticky top-0 z-10">
        <Link
          href={`/${locale}/health/dashboard/today`}
          className="p-2 -ml-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="ml-2 text-[17px] font-semibold">{t("title")}</h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Language Section */}
        <section>
          <h2 className="px-1 text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {t("language")}
          </h2>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm border border-gray-100 dark:border-gray-800">
            <button
              onClick={() => changeLanguage("ko")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🇰🇷</span>
                <span className="font-medium text-[17px]">{t("ko")}</span>
              </div>
              {locale === "ko" && <Check size={20} className="text-blue-500" />}
            </button>

            <button
              onClick={() => changeLanguage("en")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🇺🇸</span>
                <span className="font-medium text-[17px]">{t("en")}</span>
              </div>
              {locale === "en" && <Check size={20} className="text-blue-500" />}
            </button>
          </div>
          <p className="px-4 mt-2 text-[13px] text-gray-400">
            {locale === "ko"
              ? "앱의 편의를 위해 언어를 변경할 수 있습니다."
              : "You can change the language for your convenience."}
          </p>
        </section>

        {/* Info Section (Optional Placeholder) */}
        {/* 
        <section>
             <h2 className="px-1 text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                App Info
            </h2>
            <div className="bg-white dark:bg-[#1C1C1E] rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-white/5 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between p-4">
                    <span className="font-medium text-[17px]">Version</span>
                    <span className="text-gray-500">1.0.0</span>
                </div>
            </div>
        </section>
        */}
      </div>
    </div>
  );
}
