export type PlanId = "free" | "starter" | "pro" | "enterprise";
export type BillingInterval = "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  name: string;
  /** Euros per month. */
  priceMonthly: number;
  /** Euros per year, total. */
  priceYearly: number;
  seats: number;
  features: string[];
  highlighted: boolean;
  active: boolean;
}

export type CustomerStatus = "active" | "trialing" | "past_due" | "churned";

export interface CustomerNote {
  id: string;
  at: string;
  authorId: string;
  text: string;
}

export interface Customer {
  id: string;
  name: string;
  domain: string;
  planId: PlanId;
  status: CustomerStatus;
  interval: BillingInterval;
  /** Monthly recurring revenue in euros, 0 unless the customer is paying. */
  mrr: number;
  seats: number;
  country: string;
  industry: string;
  createdAt: string;
  renewsAt: string | null;
  churnedAt: string | null;
  health: number;
  managerId: string;
  notes: CustomerNote[];
}

export type UserRole = "owner" | "admin" | "member";
export type UserStatus = "active" | "invited" | "suspended";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  customerId: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastActiveAt: string | null;
  country: string;
}

export type InvoiceStatus = "paid" | "open" | "failed" | "refunded";

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  planId: PlanId;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
}

export type TicketStatus = "open" | "pending" | "resolved";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export interface TicketMessage {
  id: string;
  at: string;
  /** `customer` for the client, otherwise a team member id. */
  authorId: string;
  text: string;
}

export interface Ticket {
  id: string;
  subject: string;
  customerId: string;
  requesterName: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  /** Share of customers exposed, 0-100. */
  rollout: number;
  updatedAt: string;
}

export type StaffRole = "super_admin" | "admin" | "support" | "finance" | "viewer";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  lastSeenAt: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actorId: string;
  action: string;
  target: string;
  ip: string;
}
