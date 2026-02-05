"use client";

import { ArrowLeft, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { use, useEffect, useRef } from "react";

export default function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("health.settings");
  const router = useRouter();
  const pathname = usePathname();

  // 진입 시 referrer 경로 저장 (최초 1회만)
  const referrerRef = useRef<string | null>(null);

  useEffect(() => {
    // document.referrer는 외부 사이트에서 온 경우만 유효하므로,
    // 대신 sessionStorage에서 이전 경로를 가져오거나 기본값 사용
    if (referrerRef.current === null) {
      const storedReferrer = sessionStorage.getItem("settings_referrer");
      if (storedReferrer) {
        referrerRef.current = storedReferrer;
        sessionStorage.removeItem("settings_referrer");
      }
    }
  }, []);

  const changeLanguage = (newLocale: string) => {
    const segments = pathname.split("/");
    if (segments[1] === "ko" || segments[1] === "en") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/");
    router.replace(newPath);
  };

  const handleBack = () => {
    // referrer가 있으면 그 경로의 locale만 현재 locale로 교체
    if (referrerRef.current) {
      const segments = referrerRef.current.split("/");
      if (segments[1] === "ko" || segments[1] === "en") {
        segments[1] = locale;
      }
      router.push(segments.join("/"));
    } else {
      // referrer가 없으면 현재 locale의 todo 홈으로 이동
      router.push(`/${locale}/todo`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center px-4 py-4 safe-top bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 sticky top-0 z-10">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
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
      </div>
    </div>
  );
}
