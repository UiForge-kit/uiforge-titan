"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store";
import { useUIStore } from "@/store/ui-store";

// single root listener, so there is one place to check a combo is free
export function ShortcutListener() {
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      const key = event.key.toLowerCase();
      const run = (action: () => void) => {
        event.preventDefault();
        action();
      };
      const ui = useUIStore.getState();
      if (key === "k") return run(() => ui.setCommandOpen(true));
      if (key === "b") return run(ui.toggleSidebar);
      if (key === "l" && event.shiftKey) return run(() => useThemeStore.getState().toggleScheme());
      if (key === ",") return run(() => router.push("/settings"));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
