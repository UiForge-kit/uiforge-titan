"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building03Icon } from "@hugeicons/core-free-icons";
import { HealthBar } from "@/components/customers/health-bar";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { ExportButton } from "@/components/shared/export-button";
import { PageHeader } from "@/components/shared/page-header";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { SearchInput } from "@/components/shared/search-input";
import { SelectField } from "@/components/shared/select-field";
import { StatusPill } from "@/components/shared/status-pill";
import { CUSTOMER_STATUS } from "@/config/status";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { useCustomers, usePlans } from "@/store/data";
import type { Customer, CustomerStatus, PlanId } from "@/types/domain";

export function CustomersView() {
  const router = useRouter();
  const customers = useCustomers((s) => s.items);
  const plans = usePlans((s) => s.items);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [plan, setPlan] = useState<PlanId | "all">("all");

  const planName = (id: PlanId) => plans.find((p) => p.id === id)?.name ?? id;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers.filter(
      (c) => (status === "all" || c.status === status) && (plan === "all" || c.planId === plan) && (!needle || c.name.toLowerCase().includes(needle) || c.domain.includes(needle)),
    );
  }, [customers, query, status, plan]);

  const columns: Column<Customer>[] = [
    {
      id: "name", header: "Client", sort: (a, b) => a.name.localeCompare(b.name),
      cell: (c) => (
        <span className="flex items-center gap-3">
          <PersonAvatar name={c.name} rounded="lg" />
          <span className="min-w-0"><span className="block truncate font-medium">{c.name}</span><span className="text-muted-foreground block text-xs">{c.domain}</span></span>
        </span>
      ),
    },
    { id: "plan", header: "Offre", sort: (a, b) => a.planId.localeCompare(b.planId), cell: (c) => planName(c.planId), hideBelow: "sm" },
    { id: "status", header: "Statut", sort: (a, b) => a.status.localeCompare(b.status), cell: (c) => <StatusPill meta={CUSTOMER_STATUS[c.status]} /> },
    { id: "mrr", header: "MRR", align: "right", sort: (a, b) => a.mrr - b.mrr, cell: (c) => <span data-numeric>{formatCurrency(c.mrr)}</span> },
    { id: "health", header: "Santé", sort: (a, b) => a.health - b.health, cell: (c) => <HealthBar value={c.health} />, hideBelow: "md" },
    { id: "seats", header: "Sièges", align: "right", sort: (a, b) => a.seats - b.seats, cell: (c) => <span data-numeric>{c.seats}</span>, hideBelow: "lg" },
    { id: "createdAt", header: "Inscrit le", sort: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt), cell: (c) => <span className="text-muted-foreground" data-numeric>{formatDate(c.createdAt)}</span>, hideBelow: "lg" },
  ];

  return (
    <>
      <PageHeader
        title="Clients"
        description="Comptes, offres, revenus et santé de chaque organisation."
        actions={<ExportButton filename="clients.csv" headers={["Client", "Domaine", "Offre", "Statut", "MRR", "Sièges", "Pays"]} rows={rows.map((c) => [c.name, c.domain, planName(c.planId), CUSTOMER_STATUS[c.status].label, c.mrr, c.seats, c.country])} />}
      />
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Nom ou domaine…" />
        <SelectField aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value as CustomerStatus | "all")}>
          <option value="all">Tous les statuts</option>
          {(Object.keys(CUSTOMER_STATUS) as CustomerStatus[]).map((s) => <option key={s} value={s}>{CUSTOMER_STATUS[s].label}</option>)}
        </SelectField>
        <SelectField aria-label="Filtrer par offre" value={plan} onChange={(e) => setPlan(e.target.value as PlanId | "all")}>
          <option value="all">Toutes les offres</option>
          {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </SelectField>
      </div>
      <DataTable
        caption="Liste des clients" rows={rows} columns={columns} rowId={(c) => c.id} initialSort={{ id: "mrr", direction: "desc" }}
        onRowClick={(c) => router.push(`/customers/${c.id}`)}
        empty={{ icon: Building03Icon, title: "Aucun client", description: "Aucun client ne correspond à ces filtres." }}
      />
    </>
  );
}
