"use client";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { SHORTCUTS } from "@/config/shortcuts";
import { resetAll } from "@/store/data";
import { toast } from "@/store/toast-store";

export function DataSection() {
  return (
    <div className="grid gap-4">
      <SectionCard title="Raccourcis clavier" flush>
        <ul className="divide-border divide-y">
          {SHORTCUTS.map((s) => <li key={s.id} className="flex items-center justify-between px-4 py-3 text-sm">{s.label}<Kbd keys={s.keys} /></li>)}
        </ul>
      </SectionCard>
      <SectionCard title="Données de démonstration" description="Rétablit le jeu de données d'origine et efface vos modifications locales.">
        <Button variant="outline" onClick={() => void resetAll().then(() => toast("Données réinitialisées.", "info"))}>Réinitialiser la démo</Button>
      </SectionCard>
    </div>
  );
}
