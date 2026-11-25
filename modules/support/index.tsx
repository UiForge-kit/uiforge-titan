import { CustomerSupportIcon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "support",
  tier: "pro",
  locked: true,
  label: "Support",
  description: "Boîte de réception des tickets, priorités, assignation et réponses.",
  nav: { href: "/support", icon: CustomerSupportIcon, group: "Clients" },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
