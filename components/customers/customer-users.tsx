"use client";

import { useMemo } from "react";
import { UserTable } from "@/components/users/user-table";
import { useUsers } from "@/store/data";

export function CustomerUsers({ customerId }: { customerId: string }) {
  const all = useUsers((s) => s.items);
  const users = useMemo(() => all.filter((u) => u.customerId === customerId), [all, customerId]);
  return <UserTable users={users} showCustomer={false} />;
}
