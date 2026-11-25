"use client";

import { useState } from "react";
import { AreaChart } from "@/components/charts/area-chart";
import { SectionCard } from "@/components/shared/section-card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { formatCurrency } from "@/lib/format";
import type { MonthPoint } from "@/lib/metrics";

type Metric = "mrr" | "revenue";

export function RevenueCard({ series, className }: { series: MonthPoint[]; className?: string }) {
  const [metric, setMetric] = useState<Metric>("mrr");
  return (
    <SectionCard
      title="Revenus"
      description="12 derniers mois"
      className={className}
      action={<SegmentedControl value={metric} onChange={setMetric} options={[{ value: "mrr", label: "MRR" }, { value: "revenue", label: "Encaissé" }]} />}
    >
      <AreaChart
        ariaLabel={metric === "mrr" ? "Évolution du MRR" : "Revenus encaissés par mois"}
        data={series.map((p) => ({ label: p.label, value: p[metric] }))}
        format={formatCurrency}
      />
    </SectionCard>
  );
}
