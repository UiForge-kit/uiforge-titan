import type { StaffRole } from "../types/domain";

// UI-side permissions only. A real server must re-check them on every request
export type Permission =
  | "customers.write"
  | "users.write"
  | "billing.write"
  | "plans.write"
  | "tickets.write"
  | "flags.write"
  | "team.manage"
  | "audit.view"
  | "settings.write";

export interface StaffRoleDefinition {
  id: StaffRole;
  label: string;
  description: string;
  permissions: readonly Permission[];
}

const ALL: Permission[] = [
  "customers.write", "users.write", "billing.write", "plans.write", "tickets.write", "flags.write", "team.manage", "audit.view", "settings.write",
];

export const STAFF_ROLES: StaffRoleDefinition[] = [
  { id: "super_admin", label: "Super admin", description: "Tous les droits, y compris l'équipe et les réglages.", permissions: ALL },
  { id: "admin", label: "Administrateur", description: "Gère clients, utilisateurs, offres et feature flags.", permissions: ["customers.write", "users.write", "plans.write", "tickets.write", "flags.write", "audit.view"] },
  { id: "support", label: "Support", description: "Répond aux tickets et gère les comptes utilisateurs.", permissions: ["users.write", "tickets.write", "customers.write"] },
  { id: "finance", label: "Finance", description: "Facturation, remboursements et consultation des offres.", permissions: ["billing.write", "audit.view"] },
  { id: "viewer", label: "Lecture seule", description: "Consulte les données sans rien modifier.", permissions: [] },
];

export function getStaffRole(id: StaffRole): StaffRoleDefinition {
  return STAFF_ROLES.find((role) => role.id === id) ?? STAFF_ROLES[STAFF_ROLES.length - 1];
}
