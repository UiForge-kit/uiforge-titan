"use client";

import { create } from "zustand";
import { DEFAULT_THEME_ID, STORAGE_KEY_THEME, isThemeId } from "@/config/themes";
import type { ColorScheme, ThemeId, ThemePreference } from "@/types/theme";

// themeId and scheme are independent and set on <html> the same way as the anti-flash script

interface ThemeState extends ThemePreference {
  resolved: "light" | "dark";
  hydrated: boolean;
  setTheme: (themeId: ThemeId) => void;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
  hydrate: () => void;
}

function prefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

function resolveScheme(scheme: ColorScheme): "light" | "dark" {
  if (scheme === "system") return prefersDark() ? "dark" : "light";
  return scheme;
}

function apply(preference: ThemePreference): "light" | "dark" {
  const resolved = resolveScheme(preference.scheme);
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.dataset.theme = preference.themeId;
    root.classList.toggle("dark", resolved === "dark");
  }
  return resolved;
}

function persist(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(preference));
  } catch {
    // private browsing: the preference will not outlive the session
  }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeId: DEFAULT_THEME_ID,
  scheme: "system",
  resolved: "light",
  hydrated: false,

  setTheme(themeId) {
    const next = { themeId, scheme: get().scheme };
    persist(next);
    set({ themeId, resolved: apply(next) });
  },

  setScheme(scheme) {
    const next = { themeId: get().themeId, scheme };
    persist(next);
    set({ scheme, resolved: apply(next) });
  },

  toggleScheme() {
    get().setScheme(get().resolved === "dark" ? "light" : "dark");
  },

  hydrate() {
    if (get().hydrated) return;

    let preference: ThemePreference = { themeId: DEFAULT_THEME_ID, scheme: "system" };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_THEME);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ThemePreference>;
        preference = {
          themeId: isThemeId(parsed.themeId) ? parsed.themeId : DEFAULT_THEME_ID,
          scheme:
            parsed.scheme === "light" || parsed.scheme === "dark" ? parsed.scheme : "system",
        };
      }
    } catch {
    }

    set({ ...preference, resolved: apply(preference), hydrated: true });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", () => {
      if (get().scheme !== "system") return;
      set({ resolved: apply({ themeId: get().themeId, scheme: "system" }) });
    });
  },
}));
