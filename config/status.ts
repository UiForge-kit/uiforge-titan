import type { CustomerStatus, InvoiceStatus, TicketPriority, TicketStatus, UserStatus } from "../types/domain";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export interface StatusMeta {
  label: string;
  tone: Tone;
}

export const CUSTOMER_STATUS: Record<CustomerStatus, StatusMeta> = {
  active: { label: "Actif", tone: "success" },
  trialing: { label: "Essai", tone: "info" },
  past_due: { label: "Impayé", tone: "warning" },
  churned: { label: "Résilié", tone: "danger" },
};

export const USER_STATUS: Record<UserStatus, StatusMeta> = {
  active: { label: "Actif", tone: "success" },
  invited: { label: "Invité", tone: "info" },
  suspended: { label: "Suspendu", tone: "danger" },
};

export const INVOICE_STATUS: Record<InvoiceStatus, StatusMeta> = {
  paid: { label: "Payée", tone: "success" },
  open: { label: "En attente", tone: "info" },
  failed: { label: "Échec", tone: "danger" },
  refunded: { label: "Remboursée", tone: "neutral" },
};

export const TICKET_STATUS: Record<TicketStatus, StatusMeta> = {
  open: { label: "Ouvert", tone: "warning" },
  pending: { label: "En attente client", tone: "info" },
  resolved: { label: "Résolu", tone: "success" },
};

export const TICKET_PRIORITY: Record<TicketPriority, StatusMeta> = {
  low: { label: "Basse", tone: "neutral" },
  normal: { label: "Normale", tone: "info" },
  high: { label: "Haute", tone: "warning" },
  urgent: { label: "Urgente", tone: "danger" },
};
