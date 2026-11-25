"use client";

import { useMemo, useState } from "react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { PlanDialog } from "@/components/plans/plan-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PLAN_COLORS } from "@/config/plans-meta";
import { useCurrentStaff } from "@/hooks/use-staff";
import { formatCurrency, formatNumber } from "@/lib/format";
import { currentMrr } from "@/lib/metrics";
import { cn } from "@/lib/utils";
import { useCustomers, usePlans } from "@/store/data";
import type { Plan } from "@/types/domain";

export function PlansView() {
  const plans = usePlans((s) => s.items);
  const customers = useCustomers((s) => s.items);
  const { can } = useCurrentStaff();
  const [editing, setEditing] = useState<Plan | null>(null);

  const stats = useMemo(
    () => new Map(plans.map((p) => {
      const group = customers.filter((c) => c.planId === p.id && c.status !== "churned");
      return [p.id, { count: group.length, mrr: currentMrr(group) }];
    })),
    [plans, customers],
  );

  return (
    <>
      <PageHeader title="Offres" description="Catalogue des abonnements, prix et fonctionnalités incluses." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article key={plan.id} className={cn("surface-card relative flex flex-col gap-4 p-5", plan.highlighted && "border-brand ring-brand ring-1", !plan.active && "opacity-60")}>
            {plan.highlighted && <span className="bg-brand text-brand-foreground absolute -top-2.5 left-5 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold">Recommandée</span>}
            <header>
              <h2 className="flex items-center gap-2 text-sm font-medium"><span className="size-2.5 rounded-sm" style={{ backgroundColor: PLAN_COLORS[plan.id] }} />{plan.name}{!plan.active && <span className="text-muted-foreground text-xs">(archivée)</span>}</h2>
              <p className="font-display mt-2 text-3xl font-semibold tracking-tight" data-numeric>{formatCurrency(plan.priceMonthly)}<span className="text-muted-foreground text-sm font-normal"> /mois</span></p>
              <p className="text-muted-foreground text-xs" data-numeric>ou {formatCurrency(plan.priceYearly)} /an · {plan.seats} sièges</p>
            </header>
            <ul className="grid flex-1 content-start gap-2 text-sm">
              {plan.features.map((f) => <li key={f} className="flex items-start gap-2"><Icon icon={Tick02Icon} size={15} className="text-success mt-0.5" />{f}</li>)}
            </ul>
            <footer className="border-border flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground" data-numeric>{formatNumber(stats.get(plan.id)?.count ?? 0)} clients · {formatCurrency(stats.get(plan.id)?.mrr ?? 0)}</span>
              {can("plans.write") && <Button size="sm" variant="outline" onClick={() => setEditing(plan)}>Modifier</Button>}
            </footer>
          </article>
        ))}
      </div>
      {editing && <PlanDialog key={editing.id} plan={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
