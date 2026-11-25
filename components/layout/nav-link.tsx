"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import type { NavItem } from "@/config/navigation";
import { PRO_COPY } from "@/config/pro-copy";
import { cn } from "@/lib/utils";

const noBadge = () => undefined;

export function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const useBadge = item.useBadge ?? noBadge;
  const badge = useBadge();
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[0.8125rem] font-medium transition-colors",
        active ? "bg-surface text-foreground shadow-card ring-border ring-1" : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
      )}
    >
      <Icon icon={item.icon} size={17} className={cn(active && "text-brand")} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.locked && <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase">{PRO_COPY.badge}</span>}
      {!item.locked && !!badge && (
        <span className="bg-brand text-brand-foreground grid h-4.5 min-w-4.5 place-items-center rounded-full px-1 text-[0.625rem] font-semibold" data-numeric>
          {badge}
        </span>
      )}
    </Link>
  );
}
