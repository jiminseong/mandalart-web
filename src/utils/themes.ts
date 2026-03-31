export const APP_THEMES = ["light", "dark", "blue", "editorial", "pink", "rainbow"] as const;
export const PROVIDER_THEMES = [...APP_THEMES, "white"] as const;

export type AppTheme = (typeof APP_THEMES)[number];

export const DEFAULT_THEME: AppTheme = "light";

export const THEME_STORAGE_KEY = "mandalart-theme";

export const THEME_LABEL_KEYS: Record<AppTheme, string> = {
  light: "light",
  dark: "dark",
  blue: "blue",
  editorial: "editorial",
  pink: "pink",
  rainbow: "rainbow",
};

export const THEME_SWATCHES: Record<AppTheme, string[]> = {
  light: ["#ffffff", "#f5f5f5", "#d4d4d8"],
  dark: ["#000000", "#171717", "#525252"],
  blue: ["#05070b", "#111827", "#60a5fa"],
  editorial: ["#f5f5f0", "#ebebe6", "#4a5d44"],
  pink: ["#faf4f2", "#f1e5e1", "#8d5d6f"],
  rainbow: ["#d85a43", "#d9aa2b", "#3d63c8"],
};

export function normalizeAppTheme(theme?: string | null): AppTheme | null {
  if (!theme) return null;

  const normalizedTheme = theme === "white" ? "light" : theme;

  return APP_THEMES.includes(normalizedTheme as AppTheme)
    ? (normalizedTheme as AppTheme)
    : null;
}
