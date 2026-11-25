import type { StatusMeta, Tone } from "@/config/status";
import { cn } from "@/lib/utils";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-chart-2/12 text-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/12 text-destructive",
};

// the dot keeps the state readable without relying on colour alone
export function StatusPill({ meta, className }: { meta: StatusMeta; className?: string }) {
  return (
    <span className={cn("inline-flex h-5 shrink-0 items-center gap-1.5 rounded-full px-2 text-[0.6875rem] font-medium whitespace-nowrap", TONES[meta.tone], className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}
