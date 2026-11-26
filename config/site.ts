export const SITE = {
  name: "Titan",
  shortName: "Titan",
  tagline: "Template de back-office SaaS",
  description:
    "Dashboard admin Next.js prêt à brancher : clients, utilisateurs, facturation, analytics, support, feature flags, audit et rôles, trois thèmes.",
  repository: "https://github.com/UiForge-kit/uiforge-titan",
  /** Purchase link shown on locked Pro features. Empty hides the link. */
  upgrade: { url: process.env.NEXT_PUBLIC_UPGRADE_URL ?? "" },
} as const;

export const STORAGE_NAMESPACE = "admin-template";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// a back-office should not be indexed: explicit opt-in via NEXT_PUBLIC_ALLOW_INDEXING=true
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
