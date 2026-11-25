"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft01Icon, Building03Icon } from "@hugeicons/core-free-icons";
import { CustomerOverview } from "@/components/customers/customer-overview";
import { CustomerUsers } from "@/components/customers/customer-users";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MODULES } from "@/config/modules";
import { PRO_COPY } from "@/config/pro-copy";
import { CUSTOMER_STATUS } from "@/config/status";
import { useCurrentStaff } from "@/hooks/use-staff";
import { changeCustomerPlan, updateCustomer } from "@/store/actions";
import { useCustomers, usePlans } from "@/store/data";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

const CUSTOMER_TABS = MODULES.flatMap((m) => (m.customerTab ? [{ ...m.customerTab, locked: m.locked }] : []));

export function CustomerDetail({ id }: { id: string }) {
  const hydrated = useCustomers((s) => s.hydrated);
  const customer = useCustomers((s) => s.items.find((c) => c.id === id));
  const plans = usePlans((s) => s.items);
  const { can } = useCurrentStaff();
  const [confirmChurn, setConfirmChurn] = useState(false);

  if (!hydrated) return <Skeleton className="h-40 rounded-xl" />;
  if (!customer) {
    return (
      <div className="surface-card">
        <EmptyState icon={Building03Icon} title="Client introuvable" description="Ce client n'existe pas ou a été supprimé." action={<Button render={<Link href="/customers" />}>Retour aux clients</Button>} />
      </div>
    );
  }

  const editable = can("customers.write");

  return (
    <>
      <PageHeader
        eyebrow={<Link href="/customers" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"><Icon icon={ArrowLeft01Icon} size={14} /> Clients</Link>}
        title={customer.name}
        description={`${customer.domain} · ${customer.industry} · ${customer.country}`}
        actions={
          <>
            <StatusPill meta={CUSTOMER_STATUS[customer.status]} />
            {editable && (
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" className="h-9" />}>Changer d&apos;offre</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {plans.map((plan) => (
                    <DropdownMenuItem key={plan.id} disabled={plan.id === customer.planId} onClick={() => changeCustomerPlan(customer, plan)}>
                      {plan.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {editable && customer.status !== "churned" && <Button variant="destructive" className="h-9" onClick={() => setConfirmChurn(true)}>Résilier</Button>}
            {editable && customer.status === "churned" && (
              <Button className="h-9" onClick={() => updateCustomer(customer, { status: "active", churnedAt: null }, "a réactivé le client")}>Réactiver</Button>
            )}
          </>
        }
      />
      <div className="flex items-center gap-3">
        <PersonAvatar name={customer.name} rounded="lg" className="size-10" />
        <p className="text-muted-foreground text-sm">Inscrit sur l&apos;offre {plans.find((p) => p.id === customer.planId)?.name}, facturation {customer.interval === "yearly" ? "annuelle" : "mensuelle"}.</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          {CUSTOMER_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
              {tab.locked && <span className="text-muted-foreground ml-1.5 text-[0.625rem] font-semibold uppercase">{PRO_COPY.badge}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="pt-3"><CustomerOverview customer={customer} /></TabsContent>
        <TabsContent value="users" className="pt-3"><CustomerUsers customerId={customer.id} /></TabsContent>
        {CUSTOMER_TABS.map(({ id: tabId, Component }) => <TabsContent key={tabId} value={tabId} className="pt-3"><Component customerId={customer.id} /></TabsContent>)}
      </Tabs>

      {confirmChurn && (
        <ConfirmDialog
          title={`Résilier ${customer.name} ?`}
          description="L'abonnement s'arrête, le MRR tombe à zéro et les utilisateurs perdent l'accès. Vous pourrez réactiver le compte."
          confirmLabel="Résilier" destructive onClose={() => setConfirmChurn(false)}
          onConfirm={() => updateCustomer(customer, { status: "churned", mrr: 0, churnedAt: new Date().toISOString(), renewsAt: null }, "a résilié le client")}
        />
      )}
    </>
  );
}
