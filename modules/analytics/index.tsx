import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "analytics",
  tier: "pro",
  locked: true,
  label: "Analytics",
  description: "ARPA, churn, LTV, rétention par cohorte et santé du portefeuille.",
  nav: { href: "/analytics", icon: Analytics01Icon, group: "Pilotage" },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
