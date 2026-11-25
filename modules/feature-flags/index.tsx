import { Flag02Icon } from "@hugeicons/core-free-icons";
import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "feature-flags",
  tier: "pro",
  locked: true,
  label: "Feature flags",
  description: "Activation et déploiement progressif des fonctionnalités.",
  nav: { href: "/feature-flags", icon: Flag02Icon, group: "Plateforme" },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
