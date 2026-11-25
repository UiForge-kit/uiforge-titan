"use client";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: Parameters<typeof Icon>[0]["icon"];
}

/** Choix exclusif court, tant que les options tiennent sur une ligne. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("bg-muted flex shrink-0 gap-0.5 rounded-lg p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors",
            value === option.value
              ? "bg-surface shadow-card"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.icon && <Icon icon={option.icon} size={13} />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
