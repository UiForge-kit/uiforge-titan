import type { Metadata } from "next";
import { CustomersView } from "@/components/customers/customers-view";

export const metadata: Metadata = { title: "Clients", description: "Liste des organisations clientes, avec offre, statut, MRR et santé." };

export default function Page() {
  return <CustomersView />;
}
