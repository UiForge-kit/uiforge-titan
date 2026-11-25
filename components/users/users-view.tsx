"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { ExportButton } from "@/components/shared/export-button";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { InviteUserDialog } from "@/components/users/invite-user-dialog";
import { UserTable } from "@/components/users/user-table";
import { USER_STATUS } from "@/config/status";
import { useCurrentStaff } from "@/hooks/use-staff";
import { useCustomerLookup } from "@/hooks/use-lookup";
import { useUsers } from "@/store/data";
import type { UserStatus } from "@/types/domain";

export function UsersView() {
  const users = useUsers((s) => s.items);
  const customers = useCustomerLookup();
  const { can } = useCurrentStaff();
  const [query, setQuery] = useState(useSearchParams().get("q") ?? "");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [inviting, setInviting] = useState(false);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((u) => (status === "all" || u.status === status) && (!needle || u.name.toLowerCase().includes(needle) || u.email.includes(needle)));
  }, [users, query, status]);

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        description="Tous les comptes de tous vos clients, au même endroit."
        actions={
          <>
            <ExportButton filename="utilisateurs.csv" headers={["Nom", "E-mail", "Client", "Rôle", "Statut"]} rows={rows.map((u) => [u.name, u.email, customers.get(u.customerId)?.name ?? "", u.role, USER_STATUS[u.status].label])} />
            {can("users.write") && <Button className="bg-brand text-brand-foreground hover:bg-brand/90 h-9" onClick={() => setInviting(true)}><Icon icon={Add01Icon} size={15} /> Inviter</Button>}
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <SearchInput value={query} onChange={setQuery} placeholder="Nom ou e-mail…" />
        <SelectField aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value as UserStatus | "all")}>
          <option value="all">Tous les statuts</option>
          {(Object.keys(USER_STATUS) as UserStatus[]).map((s) => <option key={s} value={s}>{USER_STATUS[s].label}</option>)}
        </SelectField>
      </div>
      <UserTable users={rows} />
      {inviting && <InviteUserDialog onClose={() => setInviting(false)} />}
    </>
  );
}
