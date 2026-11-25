"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { SectionCard } from "@/components/shared/section-card";
import { formatCurrency } from "@/lib/format";
import { useCustomers } from "@/store/data";

export function TopCustomersCard() {
  const customers = useCustomers((s) => s.items);
  const top = useMemo(() => [...customers].sort((a, b) => b.mrr - a.mrr).slice(0, 6), [customers]);

  return (
    <SectionCard title="Meilleurs clients" description="Par MRR" action={<Link href="/customers" className="text-muted-foreground hover:text-foreground text-xs">Tout voir</Link>}>
      <ul className="grid gap-2.5">
        {top.map((c) => (
          <li key={c.id}>
            <Link href={`/customers/${c.id}`} className="hover:bg-muted/60 -mx-1.5 flex items-center gap-3 rounded-lg p-1.5 transition-colors">
              <PersonAvatar name={c.name} rounded="lg" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{c.name}</span>
                <span className="text-muted-foreground block text-xs">{c.seats} sièges · {c.country}</span>
              </span>
              <span className="text-sm font-medium" data-numeric>{formatCurrency(c.mrr)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
