import type { Metadata } from "next";
import { PlansView } from "@/components/plans/plans-view";

export const metadata: Metadata = { title: "Offres", description: "Catalogue des offres d'abonnement : prix, sièges et fonctionnalités." };

export default function Page() {
  return <PlansView />;
}
