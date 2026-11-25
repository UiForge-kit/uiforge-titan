"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreVerticalIcon, UserMultipleIcon } from "@hugeicons/core-free-icons";
import { DataTable, type Column } from "@/components/data-table/data-table";
import { Icon } from "@/components/icon";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { PersonAvatar } from "@/components/shared/person-avatar";
import { StatusPill } from "@/components/shared/status-pill";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { USER_STATUS } from "@/config/status";
import { useCurrentStaff } from "@/hooks/use-staff";
import { useCustomerLookup } from "@/hooks/use-lookup";
import { formatDate, formatRelative } from "@/lib/date";
import { removeUser, setUserRole, setUserStatus } from "@/store/actions";
import type { AppUser, UserRole } from "@/types/domain";

const ROLE_LABELS: Record<UserRole, string> = { owner: "Propriétaire", admin: "Admin", member: "Membre" };

export function UserTable({ users, showCustomer = true }: { users: AppUser[]; showCustomer?: boolean }) {
  const customers = useCustomerLookup();
  const { can } = useCurrentStaff();
  const [toRemove, setToRemove] = useState<AppUser | null>(null);
  const editable = can("users.write");

  const columns: Column<AppUser>[] = [
    {
      id: "name", header: "Utilisateur", sort: (a, b) => a.name.localeCompare(b.name),
      cell: (u) => (
        <span className="flex items-center gap-3">
          <PersonAvatar name={u.name} />
          <span className="min-w-0"><span className="block truncate font-medium">{u.name}</span><span className="text-muted-foreground block truncate text-xs">{u.email}</span></span>
        </span>
      ),
    },
    ...(showCustomer ? [{
      id: "customer", header: "Client", hideBelow: "md" as const, sort: (a: AppUser, b: AppUser) => (customers.get(a.customerId)?.name ?? "").localeCompare(customers.get(b.customerId)?.name ?? ""),
      cell: (u: AppUser) => <Link href={`/customers/${u.customerId}`} onClick={(e) => e.stopPropagation()} className="hover:underline">{customers.get(u.customerId)?.name}</Link>,
    }] : []),
    { id: "role", header: "Rôle", hideBelow: "sm", sort: (a, b) => a.role.localeCompare(b.role), cell: (u) => ROLE_LABELS[u.role] },
    { id: "status", header: "Statut", sort: (a, b) => a.status.localeCompare(b.status), cell: (u) => <StatusPill meta={USER_STATUS[u.status]} /> },
    { id: "lastActive", header: "Dernière activité", hideBelow: "lg", sort: (a, b) => Date.parse(a.lastActiveAt ?? "0") - Date.parse(b.lastActiveAt ?? "0"), cell: (u) => <span className="text-muted-foreground" data-numeric>{u.lastActiveAt ? formatRelative(u.lastActiveAt) : "Jamais"}</span> },
    { id: "createdAt", header: "Créé le", hideBelow: "lg", sort: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt), cell: (u) => <span className="text-muted-foreground" data-numeric>{formatDate(u.createdAt)}</span> },
    {
      id: "actions", header: "", align: "right",
      cell: (u) => editable ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions pour ${u.name}`} onClick={(e) => e.stopPropagation()} />}><Icon icon={MoreVerticalIcon} size={16} /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {u.status === "suspended" ? <DropdownMenuItem onClick={() => setUserStatus(u, "active")}>Réactiver</DropdownMenuItem> : <DropdownMenuItem onClick={() => setUserStatus(u, "suspended")}>Suspendre</DropdownMenuItem>}
            {(["admin", "member"] as UserRole[]).filter((r) => r !== u.role && u.role !== "owner").map((r) => <DropdownMenuItem key={r} onClick={() => setUserRole(u, r)}>Passer {ROLE_LABELS[r].toLowerCase()}</DropdownMenuItem>)}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setToRemove(u)}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null,
    },
  ];

  return (
    <>
      <DataTable
        caption="Utilisateurs" rows={users} columns={columns} rowId={(u) => u.id} pageSize={8}
        bulkActions={editable ? (ids, clear) => (
          <Button size="sm" variant="outline" onClick={() => { users.filter((u) => ids.includes(u.id) && u.status !== "suspended").forEach((u) => setUserStatus(u, "suspended")); clear(); }}>Suspendre</Button>
        ) : undefined}
        empty={{ icon: UserMultipleIcon, title: "Aucun utilisateur", description: "Aucun utilisateur ne correspond à ces critères." }}
      />
      {toRemove && <ConfirmDialog title={`Supprimer ${toRemove.name} ?`} description="Le compte et son accès sont supprimés définitivement." confirmLabel="Supprimer" destructive onClose={() => setToRemove(null)} onConfirm={() => removeUser(toRemove)} />}
    </>
  );
}
