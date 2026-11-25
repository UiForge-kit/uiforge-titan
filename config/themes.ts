import type { ThemeDefinition, ThemeId } from "@/types/theme";

export const THEMES: ThemeDefinition[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Papier chaud, coins en squircle, presque sans ombre.",
    swatch: ["#EDEAE3", "#3A352E", "#C05A34"],
    radius: "squircle",
    density: "comfortable",
  },
  {
    id: "contrast",
    name: "Contrast",
    description: "Gris froids, bordures franches, densité élevée.",
    swatch: ["#F1F1F3", "#1F2024", "#10A37F"],
    radius: "tight",
    density: "compact",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "Vert phosphore, tout en mono, angles vifs et ombres dures.",
    swatch: ["#EFF4F0", "#35804F", "#A17048"],
    radius: "none",
    density: "compact",
  },
];

export const DEFAULT_THEME_ID: ThemeId = "minimal";

export const THEME_IDS = THEMES.map((theme) => theme.id);

export const STORAGE_KEY_THEME = "admin-template:theme";

export function getTheme(id: ThemeId): ThemeDefinition {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEME_IDS.includes(value as ThemeId);
}
