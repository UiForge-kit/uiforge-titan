import assert from "node:assert/strict";
import { test } from "node:test";
import type { Customer } from "../types/domain.ts";
import { churnRate, currentMrr, delta, monthlySeries, planBreakdown } from "./metrics.ts";

const NOW = new Date("2026-06-15T12:00:00Z");
const day = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

const customer = (id: string, extra: Partial<Customer>): Customer => ({
  id, name: id, domain: `${id}.com`, planId: "pro", status: "active", interval: "monthly", mrr: 99, seats: 5,
  country: "France", industry: "Fintech", createdAt: day(100), renewsAt: null, churnedAt: null, health: 80, managerId: "s", notes: [], ...extra,
});

const customers = [
  customer("a", { createdAt: day(100) }),
  customer("b", { createdAt: day(10) }),
  customer("c", { createdAt: day(100), status: "churned", mrr: 0, churnedAt: day(5) }),
  customer("d", { planId: "free", mrr: 0, createdAt: day(60) }),
];

test("MRR courant : somme des clients payants", () => assert.equal(currentMrr(customers), 198));

test("série mensuelle : le client résilié compte jusqu'à son départ", () => {
  const series = monthlySeries(customers, [], 3, NOW);
  assert.equal(series.length, 3);
  assert.equal(series[2].mrr, 198); // a + b, c churned this month but still active at the end of last month
  assert.ok(series[1].mrr >= 99);
  assert.equal(series[2].churned, 1);
});

test("churn : uniquement les clients payants sur 30 jours", () => {
  assert.equal(Math.round(churnRate(customers, NOW.getTime())), 50);
});

test("répartition par offre ignore les résiliés", () => {
  const pro = planBreakdown(customers).find((s) => s.planId === "pro");
  assert.deepEqual(pro, { planId: "pro", customers: 2, mrr: 198 });
});

test("delta", () => {
  assert.equal(delta([100, 110]), 10);
  assert.equal(delta([0, 5]), null);
});
