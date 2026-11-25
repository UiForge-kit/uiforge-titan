"use client";

import { useSearchParams } from "next/navigation";
import { AppearanceSection } from "@/components/settings/appearance-section";
import { DataSection } from "@/components/settings/data-section";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODULES } from "@/config/modules";
import { PRO_COPY } from "@/config/pro-copy";

const moduleSections = MODULES.flatMap((m) => (m.settings ? [{ ...m.settings, locked: m.locked }] : []));

const SECTIONS = [
  { id: "apparence", label: "Apparence", Component: AppearanceSection, locked: false },
  ...moduleSections,
  { id: "donnees", label: "Données", Component: DataSection, locked: false },
];

export function SettingsView() {
  const requested = useSearchParams().get("section");
  const initial = SECTIONS.some((s) => s.id === requested) ? (requested as string) : "apparence";

  return (
    <>
      <PageHeader title="Réglages" description="Apparence et données de démonstration." />
      <Tabs defaultValue={initial}>
        <TabsList>
          {SECTIONS.map((s) => (
            <TabsTrigger key={s.id} value={s.id}>
              {s.label}
              {s.locked && <span className="text-muted-foreground ml-1.5 text-[0.625rem] font-semibold uppercase">{PRO_COPY.badge}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        {SECTIONS.map(({ id, Component }) => <TabsContent key={id} value={id} className="pt-2"><Component /></TabsContent>)}
      </Tabs>
    </>
  );
}
