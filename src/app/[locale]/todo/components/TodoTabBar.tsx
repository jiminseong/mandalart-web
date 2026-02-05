"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckSquare, Repeat, Layers } from "lucide-react";
import { cn } from "@/utils/cn";

export function TodoTabBar({ locale }: { locale: string }) {
  const t = useTranslations("todo.nav");
  const pathname = usePathname();

  const tabs = [
    {
      key: "home",
      label: t("home"),
      icon: CheckSquare,
      href: `/${locale}/todo`,
      isActive: (path: string) => path === `/${locale}/todo` || path === `/${locale}/todo/`,
    },
    {
      key: "routine",
      label: t("routine"),
      icon: Repeat,
      href: `/${locale}/todo/routine`,
      isActive: (path: string) => path.includes("/todo/routine"),
    },
    {
      key: "category",
      label: t("category"),
      icon: Layers,
      href: `/${locale}/todo/category`,
      isActive: (path: string) => path.includes("/todo/category"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="max-w-md mx-auto flex justify-between items-center px-6 h-[80px] pb-4">
        {tabs.map((tab) => {
          const active = tab.isActive(pathname);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 transition-colors",
                active
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300",
              )}
            >
              <tab.icon size={24} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
