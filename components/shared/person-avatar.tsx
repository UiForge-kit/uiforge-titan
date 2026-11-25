import { initialsOf } from "@/lib/format";
import { cn } from "@/lib/utils";

// chart tokens, so avatars follow the active theme
const TONES = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--warning)"];

function toneOf(key: string): string {
  let hash = 0;
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
}

export function PersonAvatar({ name, className, rounded = "full" }: { name: string; className?: string; rounded?: "full" | "lg" }) {
  const tone = toneOf(name);
  return (
    <span
      aria-hidden
      className={cn("grid size-8 shrink-0 place-items-center text-[0.6875rem] font-semibold", rounded === "full" ? "rounded-full" : "rounded-lg", className)}
      style={{ backgroundColor: `color-mix(in oklch, ${tone} 22%, var(--surface))`, color: `color-mix(in oklch, ${tone} 70%, var(--foreground))` }}
    >
      {initialsOf(name)}
    </span>
  );
}
