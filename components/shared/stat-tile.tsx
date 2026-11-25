import { ArrowDownRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Sparkline } from "@/components/charts/sparkline";
import { Icon } from "@/components/icon";
import { formatDelta } from "@/lib/format";
import { cn } from "@/lib/utils";

// `invert` flips good/bad for metrics where down is good (churn)
export function StatTile({
  label,
  value,
  delta,
  hint,
  trend,
  invert,
}: {
  label: string;
  value: string;
  delta?: number | null;
  hint?: string;
  trend?: number[];
  invert?: boolean;
}) {
  const good = delta == null ? true : invert ? delta <= 0 : delta >= 0;
  return (
    <div className="surface-card flex flex-col gap-2 p-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-2xl font-semibold tracking-tight" data-numeric>{value}</p>
        {trend && <Sparkline values={trend} color={good ? "var(--success)" : "var(--destructive)"} />}
      </div>
      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {delta != null && (
          <span className={cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium", good ? "bg-success/15 text-success" : "bg-destructive/12 text-destructive")} data-numeric>
            <Icon icon={delta >= 0 ? ArrowUpRight01Icon : ArrowDownRight01Icon} size={11} />
            {formatDelta(delta)}
          </span>
        )}
        {hint}
      </p>
    </div>
  );
}
