"use client";

import { useState } from "react";
import { Field } from "@/components/shared/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LIMITS } from "@/config/limits";
import { savePlan } from "@/store/actions";
import type { Plan } from "@/types/domain";

const toNumber = (value: string) => (value.trim() === "" ? NaN : Number(value.replace(",", ".")));

export function PlanDialog({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [monthly, setMonthly] = useState(String(plan.priceMonthly));
  const [yearly, setYearly] = useState(String(plan.priceYearly));
  const [seats, setSeats] = useState(String(plan.seats));
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [highlighted, setHighlighted] = useState(plan.highlighted);
  const [active, setActive] = useState(plan.active);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const values = [toNumber(monthly), toNumber(yearly), toNumber(seats)];
    if (values.some((v) => !Number.isFinite(v) || v < 0)) return setError("Prix et sièges doivent être des nombres positifs.");
    if (!Number.isInteger(values[2]) || values[2] < 1) return setError("Le nombre de sièges doit être un entier d'au moins 1.");
    savePlan({
      ...plan,
      priceMonthly: values[0], priceYearly: values[1], seats: values[2], highlighted, active,
      features: features.split("\n").map((f) => f.trim()).filter(Boolean).slice(0, LIMITS.maxPlanFeatures),
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Offre {plan.name}</DialogTitle>
            <DialogDescription>Les changements de prix ne s&apos;appliquent qu&apos;aux nouveaux abonnements.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Prix / mois (€)"><Input inputMode="decimal" value={monthly} onChange={(e) => { setMonthly(e.target.value); setError(null); }} /></Field>
            <Field label="Prix / an (€)"><Input inputMode="decimal" value={yearly} onChange={(e) => { setYearly(e.target.value); setError(null); }} /></Field>
            <Field label="Sièges"><Input inputMode="numeric" value={seats} onChange={(e) => { setSeats(e.target.value); setError(null); }} /></Field>
          </div>
          <Field label="Fonctionnalités" hint={`Une par ligne, ${LIMITS.maxPlanFeatures} au maximum.`}><Textarea value={features} onChange={(e) => setFeatures(e.target.value)} className="min-h-28" /></Field>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={highlighted} onChange={(e) => setHighlighted(e.target.checked)} /> Mettre en avant (offre recommandée)</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={active} onChange={(e) => setActive(e.target.checked)} /> Disponible à la souscription</label>
          {error && <p role="alert" className="text-destructive text-xs">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
