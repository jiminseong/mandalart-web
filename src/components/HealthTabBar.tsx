"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Copy, Target, CalendarDays, Dumbbell } from "lucide-react";

export function HealthTabBar({ locale }: { locale: string }) {
  const pathname = usePathname();

  // Hide on onboarding or login pages just in case
  if (pathname.includes("/onboarding") || pathname.includes("/login")) {
    return null;
  }

  const tabs = [
    {
      name: "투데이",
      href: `/${locale}/health/dashboard/today`,
      icon: CalendarDays,
      isActive: (path: string) => path.includes("/dashboard"),
    },
    {
      name: "기록",
      href: `/${locale}/health/workout/history`, // Linking to history/log
      icon: Dumbbell, // Or ClipboardList
      isActive: (path: string) => path.includes("/workout"),
    },
    {
      name: "목표",
      href: `/${locale}/health/goals/current`,
      icon: Target,
      isActive: (path: string) => path.includes("/goals"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-full duration-500">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50" />

      <div className="relative max-w-md mx-auto w-full h-[83px] flex items-start justify-around pt-3 pb-8">
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-1 w-16 active:scale-90 transition-transform ${
                active ? "text-[#007AFF]" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <Icon strokeWidth={active ? 2.5 : 2} size={26} />
              <span className="text-[10px] font-medium tracking-tight">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
