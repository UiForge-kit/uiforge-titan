"use client";

import { useSyncExternalStore } from "react";
import { getSeed } from "@/lib/mock/seed-cache";
import { createEntityStore, type HydratableStore } from "@/store/entity-store";
import type { AppUser, AuditEntry, Customer, FeatureFlag, Invoice, Plan, StaffMember, Ticket } from "@/types/domain";

export const useCustomers = createEntityStore<Customer>("customers", () => getSeed().customers);
export const useUsers = createEntityStore<AppUser>("users", () => getSeed().users);
export const useInvoices = createEntityStore<Invoice>("invoices", () => getSeed().invoices);
export const useTickets = createEntityStore<Ticket>("tickets", () => getSeed().tickets);
export const useFlags = createEntityStore<FeatureFlag>("flags", () => getSeed().flags);
export const usePlans = createEntityStore<Plan>("plans", () => getSeed().plans);
export const useStaff = createEntityStore<StaffMember>("staff", () => getSeed().staff);
export const useAudit = createEntityStore<AuditEntry>("audit", () => getSeed().audit);

const stores: HydratableStore[] = [useCustomers, useUsers, useInvoices, useTickets, useFlags, usePlans, useStaff, useAudit];

// called once by AppProviders so module collections follow hydrate, reset and readiness
export function registerStores(...extra: HydratableStore[]) {
  for (const store of extra) if (!stores.includes(store)) stores.push(store);
}

export const hydrateAll = () => Promise.all(stores.map((store) => store.getState().hydrate()));
export const resetAll = () => Promise.all(stores.map((store) => store.getState().reset()));

const subscribeAll = (listener: () => void) => {
  const unsubscribers = stores.map((store) => store.subscribe(listener));
  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
};
const allHydrated = () => stores.every((store) => store.getState().hydrated);

export function useDataReady(): boolean {
  return useSyncExternalStore(subscribeAll, allHydrated, () => false);
}
