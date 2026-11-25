import { cn } from "@/lib/utils";

/** Case native : clavier, lecteurs d'écran et état indéterminé sans code en plus. */
export function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      className={cn("accent-brand size-4 shrink-0 cursor-pointer rounded", className)}
      {...props}
    />
  );
}
