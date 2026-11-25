import { Shield01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "audit-log",
  tier: "pro",
  locked: true,
  label: "Journal d'audit",
  description: "Historique consultable des actions de l'équipe.",
  nav: { href: "/audit-log", icon: Shield01Icon, group: "Plateforme" },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
