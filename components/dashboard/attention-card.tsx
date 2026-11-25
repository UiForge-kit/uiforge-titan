"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SectionCard } from "@/components/shared/section-card";
import { StatusPill } from "@/components/shared/status-pill";
import { TICKET_PRIORITY } from "@/config/status";
import { useCustomerLookup } from "@/hooks/use-lookup";
import { formatRelative } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { useInvoices, useTickets } from "@/store/data";

export function AttentionCard() {
  const invoices = useInvoices((s) => s.items);
  const tickets = useTickets((s) => s.items);
  const customers = useCustomerLookup();
  const failed = useMemo(() => invoices.filter((i) => i.status === "failed").slice(0, 5), [invoices]);
  const urgent = useMemo(() => tickets.filter((t) => t.status === "open" && (t.priority === "urgent" || t.priority === "high")).slice(0, 5), [tickets]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <SectionCard title="Paiements à traiter" action={<Link href="/billing" className="text-muted-foreground hover:text-foreground text-xs">Facturation</Link>}>
        {failed.length === 0 ? <p className="text-muted-foreground text-sm">Aucun paiement en échec.</p> : (
          <ul className="grid gap-2.5">
            {failed.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1">
                  <Link href={`/customers/${inv.customerId}`} className="block truncate font-medium hover:underline">{customers.get(inv.customerId)?.name}</Link>
                  <span className="text-muted-foreground text-xs">{inv.number} · {formatRelative(inv.issuedAt)}</span>
                </span>
                <span className="text-destructive font-medium" data-numeric>{formatCurrency(inv.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title="Tickets prioritaires" action={<Link href="/support" className="text-muted-foreground hover:text-foreground text-xs">Support</Link>}>
        {urgent.length === 0 ? <p className="text-muted-foreground text-sm">Aucun ticket prioritaire ouvert.</p> : (
          <ul className="grid gap-2.5">
            {urgent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 text-sm">
                <span className="min-w-0 flex-1">
                  <Link href={`/support?ticket=${t.id}`} className="block truncate font-medium hover:underline">{t.subject}</Link>
                  <span className="text-muted-foreground text-xs">{customers.get(t.customerId)?.name} · {formatRelative(t.updatedAt)}</span>
                </span>
                <StatusPill meta={TICKET_PRIORITY[t.priority]} />
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}
