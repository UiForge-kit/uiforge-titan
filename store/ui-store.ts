"use client";

import { create } from "zustand";

interface UIState {
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
  commandOpen: boolean;
  setMobileNav: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  sidebarCollapsed: false,
  commandOpen: false,
  setMobileNav: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
}));
