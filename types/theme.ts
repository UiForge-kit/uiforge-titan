export type ThemeId = "minimal" | "contrast" | "terminal";

export type ColorScheme = "light" | "dark" | "system";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  description: string;
  swatch: [string, string, string];
  radius: "none" | "tight" | "soft" | "squircle";
  density: "compact" | "comfortable";
}

export interface ThemePreference {
  themeId: ThemeId;
  scheme: ColorScheme;
}
