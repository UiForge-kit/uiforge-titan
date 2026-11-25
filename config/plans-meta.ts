import type { PlanId } from "../types/domain";

export const PLAN_COLORS: Record<PlanId, string> = {
  enterprise: "var(--chart-1)",
  pro: "var(--chart-2)",
  starter: "var(--chart-3)",
  free: "var(--chart-5)",
};
