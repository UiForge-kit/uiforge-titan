import { Invoice01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "billing",
  tier: "pro",
  locked: true,
  label: "Facturation",
  description: "Suivi des factures, relances de paiement et remboursements.",
  nav: { href: "/billing", icon: Invoice01Icon, group: "Revenus" },
  customerTab: { id: "billing", label: "Facturation", Component: Page },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
