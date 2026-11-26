# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 1.0.0 - 2026-11-25

### Added

- Free version of Titan, a SaaS back-office template built on Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI) and Zustand.
- Dashboard: MRR, ARR, paying customers, churn, revenue curve, growth, plan breakdown, top customers and items needing attention.
- Customers list and detail page (plan, cancellation, users, internal notes).
- Users management: invite, role change, suspension, deletion, bulk actions.
- Plans catalog: price, seats, features, highlighted plan.
- Settings: theme, color scheme, font, density, keyboard shortcuts list, demo data reset.
- Three themes (Minimal, Contrast, Terminal), each in light and dark.
- Generic `DataTable` (sorting, pagination, selection, density) and dependency-free SVG/CSS charts.
- Command palette (`Cmd/Ctrl+K`), toasts, responsive layout.
- Staff roles with permission checks (`guard`) and audit entries recorded by every write action.
- Module registry (`config/modules.ts`) read by navigation, settings, search, customer tabs and store hydration.
- Locked entry points for Pro modules (analytics, support, billing, feature flags, audit log, team, CSV exports, developers) with a presentation card and an optional purchase link (`NEXT_PUBLIC_UPGRADE_URL`).
- Free-tier limits in `config/limits.ts` (page size, rows per table, features per plan).
- `EntityRepository` contract with a `localStorage` implementation and deterministic demo seed data.
- `robots.ts`, `sitemap.ts`, `noindex` by default (`NEXT_PUBLIC_ALLOW_INDEXING`) and security headers (partial CSP).
- Unit tests for metrics, charts, validation and the module registry (`npm test`).
- MIT license and third-party notices (`NOTICE`).
- English and French documentation (`README.md`, `README.fr.md`).
