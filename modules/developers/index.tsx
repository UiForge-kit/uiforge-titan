import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "developers",
  tier: "pro",
  locked: true,
  label: "Développeurs",
  description: "Clés d'API et webhooks HTTPS.",
  settings: { id: "developpeurs", label: "Développeurs", Component: Page },
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
