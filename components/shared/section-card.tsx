import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  flush,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) {
  return (
    <section className={cn("surface-card", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 p-4 pb-0">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-medium">{title}</h2>}
            {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn(flush ? "mt-3" : "p-4", !flush && (title || action) && "pt-3")}>{children}</div>
    </section>
  );
}
