export const APP_THEMES = ["white", "editorial", "dark", "pink", "rainbow"] as const;

export type AppTheme = (typeof APP_THEMES)[number];

export const DEFAULT_THEME: AppTheme = "white";

export const THEME_STORAGE_KEY = "mandalart-theme";

export const THEME_LABEL_KEYS: Record<AppTheme, string> = {
  white: "white",
  editorial: "editorial",
  dark: "dark",
  pink: "pink",
  rainbow: "rainbow",
};

export const THEME_SWATCHES: Record<AppTheme, string[]> = {
  white: ["#ffffff", "#f1f1eb", "#63756b"],
  editorial: ["#f5f5f0", "#ebebe6", "#4a5d44"],
  dark: ["#101311", "#1b201d", "#8ea780"],
  pink: ["#faf4f2", "#f1e5e1", "#8d5d6f"],
  rainbow: ["#d85a43", "#d9aa2b", "#3d63c8"],
};
