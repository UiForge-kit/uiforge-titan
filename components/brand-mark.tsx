import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-mark text-brand-foreground grid size-8 shrink-0 place-items-center rounded-lg",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-1/2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3a9 9 0 1 0 9 9" />
      </svg>
    </span>
  );
}
