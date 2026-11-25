"use client";

import { usePathname } from "next/navigation";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { BrandMark } from "@/components/brand-mark";
import { Icon } from "@/components/icon";
import { NavLink } from "@/components/layout/nav-link";
import { StaffMenu } from "@/components/layout/staff-menu";
import { Kbd } from "@/components/ui/kbd";
import { NAV_GROUPS, type NavItem } from "@/config/navigation";
import { SITE } from "@/config/site";
import { useUIStore } from "@/store/ui-store";

const isActive = (pathname: string, item: NavItem) =>
  item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);

export function Sidebar() {
  const pathname = usePathname();
  const { setCommandOpen, setMobileNav } = useUIStore();
  const close = () => setMobileNav(false);

  return (
    <nav aria-label="Navigation principale" className="flex h-full flex-col gap-3 p-3">
      <div className="flex items-center gap-2.5 px-1 pt-1">
        <BrandMark />
        <span className="font-display text-base font-semibold tracking-tight">{SITE.shortName}</span>
        <span className="bg-brand-subtle text-brand ml-auto rounded-md px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wide uppercase">Prod</span>
      </div>

      <button
        type="button"
        onClick={() => {
          close();
          setCommandOpen(true);
        }}
        className="border-border bg-surface text-muted-foreground hover:border-border-strong flex h-9 items-center gap-2 rounded-lg border px-2.5 text-[0.8125rem] transition-colors"
      >
        <Icon icon={Search01Icon} size={15} />
        <span className="flex-1 text-left">Rechercher</span>
        <Kbd keys={["mod", "K"]} />
      </button>

      <div className="scrollbar-slim -mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <p className="label-caps px-2.5 pb-1">{group.label}</p>
            {group.items.map((item) => (
              <NavLink key={item.id} item={item} active={isActive(pathname, item)} onNavigate={close} />
            ))}
          </div>
        ))}
      </div>

      <StaffMenu />
    </nav>
  );
}
