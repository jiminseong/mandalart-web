"use client";

import { Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import OSSwitcher from "@/components/OSSwitcher";

interface CommonHeaderProps {
  subTitle: string; // Date or Category name like "Productivity"
  currentOS: "Health" | "Todo";
  locale: string;
  nickname: string;
  settingsPath: string;
}

export default function CommonHeader({
  subTitle,
  currentOS,
  locale,
  nickname,
  settingsPath,
}: CommonHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSettingsClick = () => {
    // 현재 경로를 sessionStorage에 저장 (설정에서 돌아올 때 사용)
    sessionStorage.setItem("settings_referrer", pathname);
    router.push(settingsPath);
  };

  return (
    <section className="pt-2 px-1">
      <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {subTitle}
      </span>
      <div className="flex items-end justify-between mt-1">
        <OSSwitcher currentOS={currentOS} locale={locale} />

        <div className="flex items-center gap-2 mb-1">
          {/* Profile Image */}
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold">
              {nickname?.[0] || "U"}
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={handleSettingsClick}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors active:scale-95"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
