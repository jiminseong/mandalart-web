"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { APP_THEMES, DEFAULT_THEME, THEME_STORAGE_KEY } from "@/utils/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      themes={[...APP_THEMES]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
