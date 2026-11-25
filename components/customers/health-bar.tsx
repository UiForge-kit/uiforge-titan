import { cn } from "@/lib/utils";

// colour only backs up the number, which always stays visible
export function HealthBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-muted h-1.5 w-16 overflow-hidden rounded-full" aria-hidden>
        <span className={cn("block h-full rounded-full", value >= 70 ? "bg-success" : value >= 40 ? "bg-warning" : "bg-destructive")} style={{ width: `${value}%` }} />
      </span>
      <span className="text-muted-foreground text-xs" data-numeric>{value}</span>
    </div>
  );
}
