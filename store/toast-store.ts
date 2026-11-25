"use client";

import { create } from "zustand";
import { createId } from "@/lib/id";

export interface Toast {
  id: string;
  message: string;
  tone: "success" | "danger" | "info";
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, tone?: Toast["tone"]) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  push(message, tone = "success") {
    const id = createId("toast");
    set({ toasts: [...get().toasts, { id, message, tone }].slice(-4) });
    setTimeout(() => get().dismiss(id), 4000);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) }),
}));

export const toast = (message: string, tone?: Toast["tone"]) => useToastStore.getState().push(message, tone);
