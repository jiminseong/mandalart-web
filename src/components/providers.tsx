"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import {
  DEFAULT_THEME,
  normalizeAppTheme,
  PROVIDER_THEMES,
  THEME_STORAGE_KEY,
} from "@/utils/themes";

function ThemeMigration() {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const normalizedStoredTheme = normalizeAppTheme(storedTheme);
    const effectiveTheme = normalizeAppTheme(theme) ?? normalizedStoredTheme ?? DEFAULT_THEME;

    if (storedTheme && normalizedStoredTheme && storedTheme !== normalizedStoredTheme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, normalizedStoredTheme);
    }

    root.classList.remove(...PROVIDER_THEMES);
    root.classList.add(effectiveTheme);

    const normalizedTheme = normalizeAppTheme(theme);
    if (theme && normalizedTheme && theme !== normalizedTheme) {
      setTheme(normalizedTheme);
    }

    if (!theme) {
      window.localStorage.setItem(THEME_STORAGE_KEY, effectiveTheme);
      setTheme(effectiveTheme);
    }
  }, [theme, setTheme]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      themes={[...PROVIDER_THEMES]}
      disableTransitionOnChange
    >
      <ThemeMigration />
      {children}
    </NextThemesProvider>
  );
}
