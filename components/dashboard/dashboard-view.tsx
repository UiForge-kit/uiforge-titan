"use client";

import { useMemo } from "react";
import { GrowthCard } from "@/components/dashboard/growth-card";
import { AttentionCard } from "@/components/dashboard/attention-card";
import { PlansCard } from "@/components/dashboard/plans-card";
import { RevenueCard } from "@/components/dashboard/revenue-card";
import { TopCustomersCard } from "@/components/dashboard/top-customers-card";
import { PageHeader } from "@/components/shared/page-header";
import { StatTile } from "@/components/shared/stat-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentStaff } from "@/hooks/use-staff";
import { churnRate, currentMrr, delta, monthlySeries } from "@/lib/metrics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { useCustomers, useDataReady, useInvoices, useUsers } from "@/store/data";

export function DashboardView() {
  const ready = useDataReady();
  const { member } = useCurrentStaff();
  const customers = useCustomers((s) => s.items);
  const invoices = useInvoices((s) => s.items);
  const users = useUsers((s) => s.items);

  const series = useMemo(() => monthlySeries(customers, invoices), [customers, invoices]);
  const mrr = currentMrr(customers);
  const paying = customers.filter((c) => c.mrr > 0);
  const churn = churnRate(customers);
  const activeUsers = users.filter((u) => u.status === "active").length;
  const mrrSeries = series.map((p) => p.mrr);

  return (
    <>
      <PageHeader title={`Bonjour, ${member.name.split(" ")[0]}`} description="L'état de votre activité SaaS en un coup d'œil." />

      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="MRR" value={formatCurrency(mrr)} delta={delta(mrrSeries)} hint="vs mois précédent" trend={mrrSeries} />
            <StatTile label="ARR" value={formatCurrency(mrr * 12)} hint="projection annuelle" />
            <StatTile label="Clients payants" value={formatNumber(paying.length)} hint={`${formatNumber(customers.length)} comptes au total`} trend={series.map((p) => p.signups)} />
            <StatTile label="Churn 30 jours" value={formatPercent(churn)} invert delta={null} hint={`${formatNumber(activeUsers)} utilisateurs actifs`} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueCard series={series} className="lg:col-span-2" />
            <PlansCard />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <GrowthCard series={series} className="lg:col-span-2" />
            <TopCustomersCard />
          </div>
          <AttentionCard />
        </>
      )}
    </>
  );
}
