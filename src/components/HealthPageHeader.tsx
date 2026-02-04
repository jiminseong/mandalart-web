"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HealthPageHeader({
  subtitle,
  title,
  nickname,
  locale,
}: {
  subtitle: string;
  title: string;
  nickname: string;
  locale: string;
}) {
  const router = useRouter();

  return (
    <div className="pt-2 px-1">
      <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {subtitle}
      </span>
      <div className="flex items-end justify-between mt-1">
        <h1 className="text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white">
          {title}
        </h1>

        <div className="flex items-center gap-2 mb-1">
          {/* Profile Image */}
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-bold">
              {nickname?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => router.push(`/${locale}/health/settings`)}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors active:scale-95"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
