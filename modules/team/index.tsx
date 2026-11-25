import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "team",
  tier: "pro",
  locked: true,
  label: "Équipe",
  description: "Membres du back-office, rôles, matrice des droits et invitations.",
  nav: { href: "/team", icon: UserGroupIcon, group: "Plateforme" },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
