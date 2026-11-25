// SVG chart geometry, no chart library: colours come from theme tokens so charts follow
// the active theme and mode. Keep these functions pure, the tests rely on it.

export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const step = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return step * exponent;
}

export interface Point {
  x: number;
  y: number;
}

// smoothed curve (Catmull-Rom converted to Bezier), no visible overshoot
export function smoothPath(points: readonly Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    path += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return path;
}

// arc slice for a ring: radians, starting at 12 o'clock, clockwise
export function arcPath(cx: number, cy: number, radius: number, start: number, end: number): string {
  const at = (angle: number) => `${cx + radius * Math.sin(angle)},${cy - radius * Math.cos(angle)}`;
  const large = end - start > Math.PI ? 1 : 0;
  return `M${at(start)} A${radius},${radius} 0 ${large} 1 ${at(end)}`;
}
