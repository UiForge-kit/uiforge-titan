import { arcPath } from "@/lib/charts";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ slices, children, ariaLabel }: { slices: DonutSlice[]; children?: React.ReactNode; ariaLabel: string }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const gap = slices.length > 1 ? 0.04 : 0;
  let cursor = 0;

  return (
    <div className="relative size-40 shrink-0">
      <svg viewBox="0 0 100 100" role="img" aria-label={ariaLabel} className="size-full">
        <circle cx={50} cy={50} r={38} fill="none" stroke="var(--muted)" strokeWidth={12} />
        {total > 0 &&
          slices.filter((s) => s.value > 0).map((slice) => {
            const start = cursor;
            cursor += (slice.value / total) * Math.PI * 2;
            // a full ring is not a valid arc, draw it as two halves
            const full = slice.value === total;
            return full ? (
              <circle key={slice.label} cx={50} cy={50} r={38} fill="none" stroke={slice.color} strokeWidth={12} />
            ) : (
              <path key={slice.label} d={arcPath(50, 50, 38, start + gap / 2, cursor - gap / 2)} fill="none" stroke={slice.color} strokeWidth={12} />
            );
          })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
