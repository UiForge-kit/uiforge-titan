"use client";

import { useState } from "react";
import { HealthBar } from "@/components/customers/health-bar";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentStaff } from "@/hooks/use-staff";
import { useStaffLookup } from "@/hooks/use-lookup";
import { formatDate, formatRelative } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { addCustomerNote } from "@/store/actions";
import type { Customer } from "@/types/domain";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-right" data-numeric>{children}</dd>
    </div>
  );
}

export function CustomerOverview({ customer }: { customer: Customer }) {
  const staff = useStaffLookup();
  const { can } = useCurrentStaff();
  const [note, setNote] = useState("");

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <SectionCard title="Informations" className="lg:col-span-2">
        <dl className="divide-border divide-y">
          <Row label="MRR">{formatCurrency(customer.mrr)}</Row>
          <Row label="Sièges">{customer.seats}</Row>
          <Row label="Santé"><HealthBar value={customer.health} /></Row>
          <Row label="Responsable">{staff.get(customer.managerId)?.name ?? "—"}</Row>
          <Row label="Inscrit le">{formatDate(customer.createdAt)}</Row>
          <Row label={customer.churnedAt ? "Résilié le" : "Prochain renouvellement"}>{formatDate(customer.churnedAt ?? customer.renewsAt ?? customer.createdAt)}</Row>
        </dl>
      </SectionCard>

      <SectionCard title="Notes internes" description="Visibles uniquement par l'équipe." className="lg:col-span-3">
        {can("customers.write") && (
          <form
            className="mb-4 grid gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addCustomerNote(customer, note);
              setNote("");
            }}
          >
            <Textarea aria-label="Nouvelle note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note…" maxLength={1000} className="min-h-20" />
            <Button type="submit" size="sm" className="justify-self-end" disabled={!note.trim()}>Ajouter</Button>
          </form>
        )}
        {customer.notes.length === 0 ? <p className="text-muted-foreground text-sm">Aucune note pour le moment.</p> : (
          <ul className="grid gap-3">
            {customer.notes.map((n) => (
              <li key={n.id} className="flex gap-3">
                <PersonAvatar name={staff.get(n.authorId)?.name ?? "?"} className="size-7" />
                <div className="min-w-0 text-sm">
                  <p><span className="font-medium">{staff.get(n.authorId)?.name}</span> <span className="text-muted-foreground text-xs">{formatRelative(n.at)}</span></p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{n.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
