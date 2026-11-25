"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

/** La plateforme ne change jamais, il n'y a rien à quoi s'abonner. */
const noop = () => () => {};

function readIsMac(): boolean {
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

// `mod` devient ⌘ sur macOS et Ctrl ailleurs. L'information n'existe pas au
// rendu serveur, d'où `useSyncExternalStore` et ses deux instantanés distincts.
export function Kbd({ keys, className }: { keys: string[]; className?: string }) {
  const isMac = useSyncExternalStore(noop, readIsMac, () => false);

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {keys.map((key) => (
        <kbd
          key={key}
          className="border-border/80 bg-muted text-muted-foreground inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded border px-1 font-sans text-[0.625rem] font-medium"
        >
          {key === "mod" ? (isMac ? "⌘" : "Ctrl") : key}
        </kbd>
      ))}
    </span>
  );
}
