import type { Limits } from "@/types/limits";

// Free-tier caps. Enforced where data is shown or saved (DataTable, savePlan), not just in the UI
export const LIMITS: Limits = {
  maxPageSize: 6,
  maxTableRows: 50,
  maxPlanFeatures: 6,
};
