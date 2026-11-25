"use client";

import { useState } from "react";
import { niceMax } from "@/lib/charts";

export interface BarSeries {
  key: string;
  label: string;
  color: string;
}

export interface BarRow {
  label: string;
  values: Record<string, number>;
}

// HTML/CSS bars rather than SVG: crisp text, fluid height
export function BarChart({
  rows,
  series,
  height = 180,
  format = String,
}: {
  rows: BarRow[];
  series: BarSeries[];
  height?: number;
  format?: (value: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...rows.flatMap((row) => series.map((s) => row.values[s.key] ?? 0)), 0));

  return (
    <div>
      <div className="relative flex items-end gap-1.5" style={{ height }} role="img" aria-label={series.map((s) => s.label).join(", ")}>
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <span key={tick} className="border-border pointer-events-none absolute inset-x-0 border-t border-dashed" style={{ bottom: `${tick * 100}%` }} />
        ))}
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className="relative flex h-full flex-1 items-end justify-center gap-0.5"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          >
            {series.map((s) => (
              <span key={s.key} className="w-full max-w-4 rounded-t-sm transition-opacity" style={{ height: `${((row.values[s.key] ?? 0) / max) * 100}%`, backgroundColor: s.color, opacity: hover === null || hover === i ? 1 : 0.45 }} />
            ))}
            {hover === i && (
              <div className="bg-popover ring-foreground/10 shadow-pop pointer-events-none absolute -top-1 z-10 -translate-y-full rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap ring-1">
                <p className="text-muted-foreground">{row.label}</p>
                {series.map((s) => (
                  <p key={s.key} className="flex items-center gap-1.5" data-numeric>
                    <span className="size-2 rounded-sm" style={{ backgroundColor: s.color }} />
                    {s.label} : <span className="font-medium">{format(row.values[s.key] ?? 0)}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-muted-foreground mt-1.5 flex gap-1.5 text-[0.6875rem]" aria-hidden>
        {rows.map((row, i) => (
          <span key={`${row.label}-${i}`} className="flex-1 text-center">{row.label}</span>
        ))}
      </div>
    </div>
  );
}

export function Legend({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span className="size-2 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
