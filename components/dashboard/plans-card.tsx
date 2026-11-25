"use client";

import { useMemo } from "react";
import { DonutChart } from "@/components/charts/donut-chart";
import { SectionCard } from "@/components/shared/section-card";
import { PLAN_COLORS } from "@/config/plans-meta";
import { formatCurrency, formatNumber } from "@/lib/format";
import { planBreakdown } from "@/lib/metrics";
import { useCustomers, usePlans } from "@/store/data";

export function PlansCard() {
  const customers = useCustomers((s) => s.items);
  const plans = usePlans((s) => s.items);
  const slices = useMemo(() => planBreakdown(customers), [customers]);
  const total = slices.reduce((sum, s) => sum + s.customers, 0);
  const name = (id: string) => plans.find((p) => p.id === id)?.name ?? id;

  return (
    <SectionCard title="Répartition par offre" description="Clients non résiliés">
      <div className="flex flex-wrap items-center justify-center gap-5">
        <DonutChart ariaLabel="Répartition des clients par offre" slices={slices.map((s) => ({ label: name(s.planId), value: s.customers, color: PLAN_COLORS[s.planId] }))}>
          <div>
            <p className="font-display text-xl font-semibold" data-numeric>{formatNumber(total)}</p>
            <p className="text-muted-foreground text-[0.6875rem]">clients</p>
          </div>
        </DonutChart>
        <ul className="grid min-w-44 flex-1 gap-2.5 text-sm">
          {slices.map((s) => (
            <li key={s.planId} className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: PLAN_COLORS[s.planId] }} />
              <span className="min-w-0 flex-1 truncate">{name(s.planId)}</span>
              <span className="text-muted-foreground text-xs whitespace-nowrap" data-numeric>{s.customers} · {formatCurrency(s.mrr)}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
