"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Activity, CheckSquare, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type OS = "Health" | "Todo" | "Work";

export default function OSSwitcher({ currentOS, locale }: { currentOS: OS; locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const osList = [
    {
      id: "Health",
      name: "Health OS",
      icon: Activity,
      href: `/${locale}/health/dashboard/today`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "Todo",
      name: "Todo OS",
      icon: CheckSquare,
      href: `/${locale}/todo`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "Work",
      name: "Work OS",
      icon: Briefcase,
      href: "#", // Not implemented yet
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      disabled: true,
    },
  ];

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-[34px] leading-tight font-bold tracking-tight text-black dark:text-white hover:opacity-70 transition-opacity"
      >
        <span>{currentOS} OS</span>
        <ChevronDown
          size={24}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-[11px] font-semibold text-gray-400 px-3 py-2 uppercase tracking-wide">
            Switch to...
          </div>
          {osList.map((os) => {
            const Icon = os.icon;
            const isCurrent = currentOS === os.id;

            if (os.disabled) {
              return (
                <div
                  key={os.id}
                  className="flex items-center gap-3 w-full p-3 rounded-xl opacity-40 cursor-not-allowed"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${os.bgColor} ${os.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-[15px]">{os.name}</div>
                    <div className="text-[12px] text-gray-500">Coming Soon</div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={os.id}
                href={os.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-gray-100 dark:bg-white/10"
                    : "hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${os.bgColor} ${os.color}`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[15px] text-black dark:text-white">
                    {os.name}
                  </div>
                  {isCurrent && <div className="text-[12px] text-gray-500">Current</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
