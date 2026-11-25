import { smoothPath } from "@/lib/charts";

export function Sparkline({ values, color = "var(--chart-1)" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const range = Math.max(...values) - min || 1;
  const points = values.map((v, i) => ({ x: (i / (values.length - 1)) * 100, y: 4 + (1 - (v - min) / range) * 24 }));
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-24" aria-hidden>
      <path d={smoothPath(points)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
