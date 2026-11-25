import { BarChart, Legend } from "@/components/charts/bar-chart";
import { SectionCard } from "@/components/shared/section-card";
import type { MonthPoint } from "@/lib/metrics";

const SERIES = [
  { key: "signups", label: "Nouveaux clients", color: "var(--chart-1)" },
  { key: "churned", label: "Résiliations", color: "var(--chart-3)" },
];

export function GrowthCard({ series, className }: { series: MonthPoint[]; className?: string }) {
  return (
    <SectionCard title="Croissance" description="Acquisitions et résiliations par mois" className={className} action={<Legend items={SERIES} />}>
      <BarChart rows={series.map((p) => ({ label: p.label, values: { signups: p.signups, churned: p.churned } }))} series={SERIES} />
    </SectionCard>
  );
}
