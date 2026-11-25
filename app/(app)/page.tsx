import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "MRR, ARR, clients, churn, répartition par offre et alertes de paiement et de support.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
