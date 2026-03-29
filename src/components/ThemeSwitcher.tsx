"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import {
  APP_THEMES,
  DEFAULT_THEME,
  type AppTheme,
  THEME_LABEL_KEYS,
  THEME_SWATCHES,
} from "@/utils/themes";

export function ThemeSwitcher() {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const activeTheme = mounted && theme && APP_THEMES.includes(theme as AppTheme)
    ? (theme as AppTheme)
    : DEFAULT_THEME;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border border-border/80",
          "bg-surface/80 px-3.5 text-[11px] font-semibold tracking-[0.16em]",
          "text-text-primary uppercase shadow-[0_10px_30px_-24px_rgba(15,23,42,0.45)]",
          "backdrop-blur-xl transition-colors hover:border-growth/40 hover:bg-surface-strong/80",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("label")}
      >
        <div className="flex items-center -space-x-1">
          {THEME_SWATCHES[activeTheme].map((swatch) => (
            <span
              key={swatch}
              className="h-4 w-4 rounded-full border border-white/80 shadow-sm"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
        <span className="leading-none">{t(THEME_LABEL_KEYS[activeTheme])}</span>
        <ChevronDown
          size={14}
          className={cn("transition-transform", open && "rotate-180")}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 z-50 mt-3 w-[240px] rounded-[1.35rem] border border-border/80",
            "bg-base/95 p-2.5 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur-2xl",
          )}
          role="listbox"
          aria-label={t("label")}
        >
          <div className="mb-2 px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
            {t("label")}
          </div>

          <div className="space-y-1">
            {APP_THEMES.map((option) => {
              const selected = activeTheme === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setTheme(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-colors",
                    selected
                      ? "border-growth/35 bg-surface-strong text-text-primary"
                      : "border-transparent bg-transparent text-text-secondary hover:border-border/60 hover:bg-surface/70 hover:text-text-primary",
                  )}
                  role="option"
                  aria-selected={selected}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-1.5">
                      {THEME_SWATCHES[option].map((swatch) => (
                        <span
                          key={swatch}
                          className="h-5 w-5 rounded-full border border-white/80 shadow-sm"
                          style={{ backgroundColor: swatch }}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium tracking-tight">
                      {t(THEME_LABEL_KEYS[option])}
                    </span>
                  </div>

                  <Check
                    size={16}
                    strokeWidth={2}
                    className={cn(
                      "transition-opacity",
                      selected ? "opacity-100 text-growth" : "opacity-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
