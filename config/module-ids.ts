export const PRO_MODULE_IDS = ["analytics", "billing", "feature-flags", "audit-log", "team", "support", "exports", "developers"] as const;

export type ProModuleId = (typeof PRO_MODULE_IDS)[number];
