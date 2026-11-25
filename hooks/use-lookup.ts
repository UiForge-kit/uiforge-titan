"use client";

import { useMemo } from "react";
import { useCustomers, useStaff } from "@/store/data";

export function useCustomerLookup() {
  const items = useCustomers((s) => s.items);
  return useMemo(() => new Map(items.map((c) => [c.id, c])), [items]);
}

export function useStaffLookup() {
  const items = useStaff((s) => s.items);
  return useMemo(() => new Map(items.map((m) => [m.id, m])), [items]);
}
