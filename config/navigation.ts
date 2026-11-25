import { MODULES, NAV_GROUP_ORDER, type ModuleDef } from "@/config/modules";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: NonNullable<ModuleDef["nav"]>["icon"];
  locked: boolean;
  useBadge?: () => number | undefined;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const toItem = ({ id, label, locked, nav }: ModuleDef & { nav: NonNullable<ModuleDef["nav"]> }): NavItem => ({
  id, label, locked, href: nav.href, icon: nav.icon, useBadge: nav.useBadge,
});

const withNav = MODULES.filter((module): module is ModuleDef & { nav: NonNullable<ModuleDef["nav"]> } => !!module.nav);

export const NAV_GROUPS: NavGroup[] = NAV_GROUP_ORDER.map((label) => ({
  label,
  items: withNav.filter((module) => module.nav.group === label).map(toItem),
}));

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);
