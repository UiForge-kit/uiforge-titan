// SaaS metrics derived from customers and invoices. Nothing is stored, so charts follow every
// edit. Month-end MRR is rebuilt from created/churned dates, keep that in sync with Customer.
import type { Customer, Invoice, PlanId } from "../types/domain.ts";

export interface MonthPoint {
  start: string;
  label: string;
  mrr: number;
  revenue: number;
  signups: number;
  churned: number;
}

export const monthStart = (offset: number, now: Date) => new Date(now.getFullYear(), now.getMonth() + offset, 1);

export const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "short" });

export const currentMrr = (customers: readonly Customer[]) => customers.reduce((sum, c) => sum + c.mrr, 0);

// MRR at month end: customers created before and not yet churned at that date
export function monthlySeries(
  customers: readonly Customer[],
  invoices: readonly Invoice[],
  months = 12,
  now = new Date(),
): MonthPoint[] {
  return Array.from({ length: months }, (_, i) => {
    const start = monthStart(i - months + 1, now);
    const end = monthStart(i - months + 2, now);
    const inMonth = (iso: string | null) => !!iso && Date.parse(iso) >= start.getTime() && Date.parse(iso) < end.getTime();
    const mrr = customers
      .filter((c) => c.mrr > 0 || c.churnedAt)
      .filter((c) => Date.parse(c.createdAt) < end.getTime() && (!c.churnedAt || Date.parse(c.churnedAt) >= end.getTime()))
      .reduce((sum, c) => sum + (c.mrr || mrrAtChurn(c)), 0);
    return {
      start: start.toISOString(),
      label: monthLabel.format(start).replace(".", ""),
      mrr: Math.round(mrr),
      revenue: invoices.filter((inv) => inv.status === "paid" && inMonth(inv.issuedAt)).reduce((s, inv) => s + inv.amount, 0),
      signups: customers.filter((c) => inMonth(c.createdAt)).length,
      churned: customers.filter((c) => inMonth(c.churnedAt)).length,
    };
  });
}

// a churned customer has no MRR left, rebuild it from the plan for the history
const PRICES: Record<PlanId, number> = { free: 0, starter: 29, pro: 99, enterprise: 499 };
const mrrAtChurn = (c: Customer) => PRICES[c.planId];

// share of paying customers lost over the last 30 days, in %
export function churnRate(customers: readonly Customer[], now = Date.now()): number {
  const since = now - 30 * 86_400_000;
  const base = customers.filter((c) => c.planId !== "free" && Date.parse(c.createdAt) < since).length;
  const lost = customers.filter((c) => c.planId !== "free" && c.churnedAt && Date.parse(c.churnedAt) >= since).length;
  return base === 0 ? 0 : (lost / base) * 100;
}

export interface PlanSlice {
  planId: PlanId;
  customers: number;
  mrr: number;
}

export function planBreakdown(customers: readonly Customer[]): PlanSlice[] {
  const ids: PlanId[] = ["enterprise", "pro", "starter", "free"];
  return ids.map((planId) => {
    const group = customers.filter((c) => c.planId === planId && c.status !== "churned");
    return { planId, customers: group.length, mrr: currentMrr(group) };
  });
}

// % change between the last two points, null when the base is zero
export function delta(series: readonly number[]): number | null {
  const [previous, last] = series.slice(-2);
  if (series.length < 2 || !previous) return null;
  return ((last - previous) / previous) * 100;
}
