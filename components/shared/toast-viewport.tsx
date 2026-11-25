"use client";

import { Alert02Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { useToastStore } from "@/store/toast-store";

const ICONS = { success: CheckmarkCircle02Icon, danger: Alert02Icon, info: InformationCircleIcon } as const;
const COLORS = { success: "text-success", danger: "text-destructive", info: "text-brand" } as const;

export function ToastViewport() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => dismiss(toast.id)}
          className="bg-popover ring-foreground/10 shadow-pop pointer-events-auto flex items-start gap-2.5 rounded-xl p-3 text-left text-sm ring-1"
        >
          <Icon icon={ICONS[toast.tone]} size={17} className={COLORS[toast.tone]} />
          {toast.message}
        </button>
      ))}
    </div>
  );
}
