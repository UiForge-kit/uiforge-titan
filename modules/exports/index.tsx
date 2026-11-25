import { ProLocked } from "@/components/pro/pro-locked";
import type { ModuleDef } from "@/config/modules";

export const moduleDef: ModuleDef = {
  id: "exports",
  tier: "pro",
  locked: true,
  label: "Exports CSV",
  description: "Export CSV des tableaux filtrés, protégé contre l'injection de formules.",
};

export function Page() {
  return <ProLocked feature={moduleDef.label} description={moduleDef.description} />;
}
