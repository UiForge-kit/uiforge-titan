import { cn } from "@/lib/utils";

export function SelectField({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn("border-input bg-surface h-9 rounded-lg border px-2.5 text-sm outline-none focus-visible:border-ring disabled:opacity-50", className)}
      {...props}
    />
  );
}
