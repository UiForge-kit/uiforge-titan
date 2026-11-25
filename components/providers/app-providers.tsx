"use client";

import { useEffect } from "react";
import { ShortcutListener } from "@/components/providers/shortcut-listener";
import { CommandSearch } from "@/components/search/command-search";
import { ToastViewport } from "@/components/shared/toast-viewport";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MODULES } from "@/config/modules";
import { hydrateAll, registerStores } from "@/store/data";
import { usePreferencesStore } from "@/store/preferences-store";
import { useThemeStore } from "@/store/theme-store";

// Module collections join hydrate/reset before the first effect runs.
registerStores(...MODULES.flatMap((module) => module.stores ?? []));

export function AppProviders({ children }: { children: React.ReactNode }) {
  const fontFamily = usePreferencesStore((state) => state.fontFamily);

  useEffect(() => {
    useThemeStore.getState().hydrate();
    usePreferencesStore.getState().hydrate();
    void hydrateAll();
  }, []);

  // anti-flash script already sets the attribute on load, this covers later changes
  useEffect(() => {
    const root = document.documentElement;
    if (fontFamily === "auto") root.removeAttribute("data-font");
    else root.dataset.font = fontFamily;
  }, [fontFamily]);

  return (
    <TooltipProvider delay={300}>
      <ShortcutListener />
      <CommandSearch />
      <ToastViewport />
      {children}
    </TooltipProvider>
  );
}
