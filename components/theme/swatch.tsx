import { cn } from "@/lib/utils";

export function Swatch({ colors, className }: { colors: readonly string[]; className?: string }) {
  return (
    <span className={cn("flex shrink-0 items-center", className)}>
      {colors.map((color, index) => (
        <span
          key={color}
          className="border-border/70 size-3.5 rounded-full border"
          style={{ backgroundColor: color, marginLeft: index === 0 ? 0 : "-0.3rem" }}
        />
      ))}
    </span>
  );
}
