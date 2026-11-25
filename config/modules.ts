// Module registry. Navigation, settings, search, customer tabs and store hydration all read
// MODULES, nothing lists pages by hand. Add a module by exporting a ModuleDef from modules/<id>.
import type { ComponentType } from "react";
import { Building03Icon, Home01Icon, PackageIcon, Settings01Icon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import type { ProModuleId } from "@/config/module-ids";
import type { HydratableStore } from "@/store/entity-store";
import * as analytics from "@/modules/analytics";
import * as auditLog from "@/modules/audit-log";
import * as billing from "@/modules/billing";
import * as developers from "@/modules/developers";
import * as exportsModule from "@/modules/exports";
import * as featureFlags from "@/modules/feature-flags";
import * as support from "@/modules/support";
import * as team from "@/modules/team";

export const NAV_GROUP_ORDER = ["Pilotage", "Clients", "Revenus", "Plateforme"] as const;
export type NavGroupLabel = (typeof NAV_GROUP_ORDER)[number];

/**
 * What a module exposes to the shell. Every field except `id`, `tier`, `locked`, `label` and
 * `description` is optional: a module only fills the slots it plugs into.
 */
export interface ModuleDef {
  id: string;
  tier: "free" | "pro";
  /** True when only the stub is installed. */
  locked: boolean;
  label: string;
  description: string;
  nav?: { href: string; icon: IconSvgElement; group: NavGroupLabel; useBadge?: () => number | undefined };
  settings?: { id: string; label: string; Component: ComponentType };
  customerTab?: { id: string; label: string; Component: ComponentType<{ customerId: string }> };
  accountMenu?: ComponentType;
  /** CSV export handler used by ExportButton. Must neutralise formula cells (see exports/csv). */
  exportCsv?: (filename: string, headers: string[], rows: Array<Array<string | number | null>>) => void;
  /** Collections owned by the module, hydrated and reset with the core ones. */
  stores?: HydratableStore[];
}

export interface ModuleEntry {
  moduleDef: ModuleDef;
  Page: ComponentType;
}

const free = (id: string, label: string, description: string, nav: NonNullable<ModuleDef["nav"]>): ModuleDef => ({ id, tier: "free", locked: false, label, description, nav });

const PRO_ENTRIES = {
  analytics,
  billing,
  "feature-flags": featureFlags,
  "audit-log": auditLog,
  team,
  support,
  exports: exportsModule,
  developers,
} satisfies Record<ProModuleId, ModuleEntry>;

const pro = (id: ProModuleId) => PRO_ENTRIES[id].moduleDef;

// order here is the sidebar order inside each group
export const MODULES: readonly ModuleDef[] = [
  free("dashboard", "Tableau de bord", "MRR, ARR, clients et alertes.", { href: "/", icon: Home01Icon, group: "Pilotage" }),
  pro("analytics"),
  free("customers", "Clients", "Organisations clientes et fiches détaillées.", { href: "/customers", icon: Building03Icon, group: "Clients" }),
  free("users", "Utilisateurs", "Comptes utilisateurs, rôles et suspensions.", { href: "/users", icon: UserMultipleIcon, group: "Clients" }),
  pro("support"),
  pro("billing"),
  free("plans", "Offres", "Catalogue des offres d'abonnement.", { href: "/plans", icon: PackageIcon, group: "Revenus" }),
  pro("feature-flags"),
  pro("audit-log"),
  pro("team"),
  free("settings", "Réglages", "Apparence et données.", { href: "/settings", icon: Settings01Icon, group: "Plateforme" }),
  pro("exports"),
  pro("developers"),
];

export const getModule = (id: string) => MODULES.find((module) => module.id === id);
