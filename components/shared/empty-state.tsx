import { Icon } from "@/components/icon";
import type { IconSvgElement } from "@hugeicons/react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: IconSvgElement;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-2xl">
        <Icon icon={icon} size={22} />
      </span>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-xs leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}
