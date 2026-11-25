"use client";

import { useId, useState } from "react";
import { niceMax, smoothPath } from "@/lib/charts";

export interface SeriesPoint {
  label: string;
  value: number;
}

const W = 600;
const H = 200;
const PAD = { top: 12, bottom: 4, left: 8, right: 8 };

export function AreaChart({
  data,
  format = String,
  color = "var(--chart-1)",
  ariaLabel,
}: {
  data: SeriesPoint[];
  format?: (value: number) => string;
  color?: string;
  ariaLabel: string;
}) {
  const gradient = useId();
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const x = (i: number) => PAD.left + (i / Math.max(1, data.length - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);
  const points = data.map((d, i) => ({ x: x(i), y: y(d.value) }));
  const line = smoothPath(points);
  const area = points.length ? `${line} L${x(data.length - 1)},${H} L${x(0)},${H} Z` : "";
  const active = hover !== null ? data[hover] : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        className="h-52 w-full touch-none overflow-visible"
        preserveAspectRatio="none"
        onPointerMove={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - box.left) / box.width;
          setHover(Math.max(0, Math.min(data.length - 1, Math.round(ratio * (data.length - 1)))));
        }}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
          <line key={tick} x1={0} x2={W} y1={y(max * tick)} y2={y(max * tick)} stroke="var(--border)" strokeDasharray={tick === 0 ? undefined : "3 4"} vectorEffect="non-scaling-stroke" />
        ))}
        <path d={area} fill={`url(#${gradient})`} />
        <path d={line} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="var(--border-strong)" vectorEffect="non-scaling-stroke" />
        )}
      </svg>

      {active && hover !== null && (
        <div
          className="bg-popover ring-foreground/10 shadow-pop pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg px-2.5 py-1.5 text-xs ring-1"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="text-muted-foreground">{active.label}</p>
          <p className="font-medium" data-numeric>{format(active.value)}</p>
        </div>
      )}

      <div className="text-muted-foreground mt-1 flex justify-between text-[0.6875rem]" aria-hidden>
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`} className={i % Math.ceil(data.length / 8) === 0 ? "" : "invisible"}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
