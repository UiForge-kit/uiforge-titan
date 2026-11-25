// deterministic demo data. Dates are relative to today so charts and "recent" lists stay believable
import type {
  AppUser, AuditEntry, Customer, CustomerStatus, FeatureFlag, Invoice, Plan, StaffMember, Ticket, TicketMessage,
} from "@/types/domain";
import { createRng } from "./random";

const DAY = 86_400_000;
const iso = (ms: number) => new Date(ms).toISOString();

export const PLANS: Plan[] = [
  { id: "free", name: "Free", priceMonthly: 0, priceYearly: 0, seats: 3, features: ["3 utilisateurs", "1 projet", "Support communautaire"], highlighted: false, active: true },
  { id: "starter", name: "Starter", priceMonthly: 29, priceYearly: 290, seats: 10, features: ["10 utilisateurs", "Projets illimités", "Support par e-mail", "Exports CSV"], highlighted: false, active: true },
  { id: "pro", name: "Pro", priceMonthly: 99, priceYearly: 990, seats: 40, features: ["40 utilisateurs", "SSO", "API complète", "Support prioritaire", "Rapports avancés"], highlighted: true, active: true },
  { id: "enterprise", name: "Enterprise", priceMonthly: 499, priceYearly: 4990, seats: 500, features: ["Utilisateurs illimités", "SLA 99,9 %", "Audit et conformité", "Account manager dédié"], highlighted: false, active: true },
];

export const STAFF: StaffMember[] = [
  { id: "s_awa", name: "Awa Diallo", email: "awa.diallo@example.com", role: "super_admin", active: true, lastSeenAt: iso(Date.now() - 4 * 60_000) },
  { id: "s_noah", name: "Noah Mbemba", email: "noah.mbemba@example.com", role: "admin", active: true, lastSeenAt: iso(Date.now() - 55 * 60_000) },
  { id: "s_lea", name: "Léa Moreau", email: "lea.moreau@example.com", role: "support", active: true, lastSeenAt: iso(Date.now() - 2 * 3600_000) },
  { id: "s_samuel", name: "Samuel Okoro", email: "samuel.okoro@example.com", role: "support", active: true, lastSeenAt: iso(Date.now() - 20 * 3600_000) },
  { id: "s_ines", name: "Inès Kabongo", email: "ines.kabongo@example.com", role: "finance", active: true, lastSeenAt: iso(Date.now() - 3 * DAY) },
  { id: "s_marc", name: "Marc Dupont", email: "marc.dupont@example.com", role: "viewer", active: false, lastSeenAt: iso(Date.now() - 40 * DAY) },
];

const PREFIX = ["Nova", "Atlas", "Kivu", "Baobab", "Helio", "Lumen", "Zenith", "Cobalt", "Saphir", "Délta", "Orion", "Mistral", "Équinoxe", "Terra", "Pulse", "Vertex"];
const SUFFIX = ["Logistics", "Labs", "Systems", "Digital", "Group", "Studio", "Analytics", "Finance", "Santé", "Retail", "Energy", "Media"];
const INDUSTRIES = ["Logistique", "Fintech", "Santé", "Retail", "Média", "Énergie", "Éducation", "Industrie"];
const COUNTRIES = ["France", "Congo", "Sénégal", "Côte d'Ivoire", "Maroc", "Belgique", "Canada", "Cameroun"];
const FIRST = ["Amine", "Fatou", "Jean", "Marie", "Kofi", "Aïcha", "Luc", "Sarah", "Yanis", "Nadia", "Paul", "Chloé", "Ibrahim", "Mélanie", "Omar", "Julie"];
const LAST = ["Diop", "Martin", "Kouassi", "Bernard", "Traoré", "Nguyen", "Mbala", "Petit", "Ndiaye", "Lopez", "Camara", "Roux"];
const SUBJECTS = [
  "Impossible de se connecter avec le SSO", "Question sur la facture du mois", "Export CSV incomplet", "Demande de passage à l'offre Pro",
  "Erreur 500 sur l'API", "Ajouter des utilisateurs supplémentaires", "Changer l'e-mail de facturation", "Lenteurs sur le tableau de bord",
  "Demande de remboursement", "Intégration Slack ne fonctionne plus", "Besoin d'un contrat annuel", "Comment configurer les webhooks ?",
];
const REPLIES = [
  "Merci pour votre retour, nous regardons cela tout de suite.", "Pouvez-vous nous envoyer une capture d'écran ?",
  "Le correctif est en production, pouvez-vous confirmer ?", "Nous avons mis à jour votre compte, tout devrait être rentré dans l'ordre.",
];

export interface Seed {
  plans: Plan[];
  customers: Customer[];
  users: AppUser[];
  invoices: Invoice[];
  tickets: Ticket[];
  flags: FeatureFlag[];
  staff: StaffMember[];
  audit: AuditEntry[];
}

export function createSeed(now = Date.now()): Seed {
  const rng = createRng(2026);
  const planById = new Map(PLANS.map((plan) => [plan.id, plan]));
  const customers: Customer[] = [];
  const users: AppUser[] = [];
  const invoices: Invoice[] = [];

  for (let i = 0; i < 64; i += 1) {
    const name = `${rng.pick(PREFIX)} ${rng.pick(SUFFIX)}`;
    const planId = rng.weighted(PLANS.map((p) => p.id), [20, 38, 30, 12]);
    const plan = planById.get(planId) as Plan;
    const createdMs = now - rng.int(5, 420) * DAY;
    const status: CustomerStatus = planId === "free" ? "active" : rng.weighted<CustomerStatus>(["active", "trialing", "past_due", "churned"], [62, 12, 8, 18]);
    const trialing = status === "trialing";
    const interval = rng.chance(0.3) ? "yearly" : "monthly";
    const paying = !trialing && planId !== "free";
    const churnedMs = status === "churned" ? Math.min(now - DAY, createdMs + rng.int(45, 240) * DAY) : null;
    const customer: Customer = {
      id: `c_${String(i + 1).padStart(3, "0")}`,
      name,
      domain: `${name.toLowerCase().replace(/[^a-z]+/g, "")}.com`,
      planId,
      status,
      interval,
      mrr: paying && status !== "churned" ? Math.round((interval === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly) * 100) / 100 : 0,
      seats: Math.min(plan.seats, rng.int(2, Math.max(3, plan.seats))),
      country: rng.pick(COUNTRIES),
      industry: rng.pick(INDUSTRIES),
      createdAt: iso(createdMs),
      renewsAt: status === "churned" ? null : iso(now + rng.int(2, 28) * DAY),
      churnedAt: churnedMs ? iso(churnedMs) : null,
      health: status === "churned" ? rng.int(5, 30) : status === "past_due" ? rng.int(25, 50) : rng.int(45, 98),
      managerId: rng.pick(STAFF.slice(0, 4)).id,
      notes: rng.chance(0.3) ? [{ id: `n_${i}`, at: iso(now - rng.int(1, 30) * DAY), authorId: "s_noah", text: "Point trimestriel prévu, intéressé par l'offre supérieure." }] : [],
    };
    customers.push(customer);

    const headcount = Math.min(6, Math.max(1, Math.round(customer.seats / 4)));
    for (let u = 0; u < headcount; u += 1) {
      const first = rng.pick(FIRST);
      const last = rng.pick(LAST);
      const invited = rng.chance(0.08);
      users.push({
        id: `u_${customer.id}_${u}`,
        name: `${first} ${last}`,
        email: `${first}.${last}@${customer.domain}`.toLowerCase().replace(/[éèê]/g, "e").replace(/ï/g, "i"),
        customerId: customer.id,
        role: u === 0 ? "owner" : u === 1 ? "admin" : "member",
        status: customer.status === "churned" ? "suspended" : invited ? "invited" : "active",
        createdAt: iso(createdMs + rng.int(0, 20) * DAY),
        lastActiveAt: invited ? null : iso(now - rng.int(0, 45) * DAY - rng.int(0, 86_000) * 1000),
        country: customer.country,
      });
    }

    if (paying) {
      const end = churnedMs ?? now;
      const step = interval === "yearly" ? 365 : 30;
      let n = 0;
      for (let t = createdMs; t <= end; t += step * DAY, n += 1) {
        const latest = t + step * DAY > end;
        const amount = interval === "yearly" ? plan.priceYearly : plan.priceMonthly;
        let invoiceStatus: Invoice["status"] = "paid";
        if (latest && status === "past_due") invoiceStatus = "failed";
        else if (latest && status === "active") invoiceStatus = rng.chance(0.4) ? "open" : "paid";
        else if (rng.chance(0.03)) invoiceStatus = "refunded";
        invoices.push({
          id: `inv_${customer.id}_${n}`,
          number: `INV-${String(invoices.length + 1001)}`,
          customerId: customer.id,
          planId,
          amount,
          status: invoiceStatus,
          issuedAt: iso(t),
          dueAt: iso(t + 14 * DAY),
        });
      }
    }
  }

  const tickets: Ticket[] = Array.from({ length: 36 }, (_, i) => {
    const customer = rng.pick(customers);
    const requester = users.find((u) => u.customerId === customer.id) ?? users[0];
    const createdMs = now - rng.int(0, 25) * DAY - rng.int(0, 80_000) * 1000;
    const status = rng.weighted<Ticket["status"]>(["open", "pending", "resolved"], [40, 20, 40]);
    const messages: TicketMessage[] = [{ id: `tm_${i}_0`, at: iso(createdMs), authorId: "customer", text: `Bonjour, ${rng.pick(SUBJECTS).toLowerCase()}. Pouvez-vous m'aider ?` }];
    const replies = status === "open" && rng.chance(0.4) ? 0 : rng.int(1, 3);
    for (let r = 0; r < replies; r += 1) {
      messages.push({ id: `tm_${i}_${r + 1}`, at: iso(createdMs + (r + 1) * 3600_000 * rng.int(1, 9)), authorId: r % 2 === 0 ? rng.pick(STAFF.slice(0, 4)).id : "customer", text: rng.pick(REPLIES) });
    }
    return {
      id: `t_${String(i + 1).padStart(3, "0")}`,
      subject: rng.pick(SUBJECTS),
      customerId: customer.id,
      requesterName: requester.name,
      status,
      priority: rng.weighted<Ticket["priority"]>(["low", "normal", "high", "urgent"], [20, 50, 22, 8]),
      assigneeId: rng.chance(0.75) ? rng.pick(STAFF.slice(0, 4)).id : null,
      createdAt: iso(createdMs),
      updatedAt: messages[messages.length - 1].at,
      messages,
    };
  }).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  const flag = (key: string, name: string, description: string, enabled: boolean, rollout: number, age: number): FeatureFlag => ({
    id: `ff_${key}`, key, name, description, enabled, rollout, updatedAt: iso(now - age * DAY),
  });
  const flags = [
    flag("new-dashboard", "Nouveau tableau de bord", "Refonte de la page d'accueil client.", true, 35, 2),
    flag("ai-assistant", "Assistant IA", "Assistant de rédaction intégré à l'éditeur.", true, 10, 5),
    flag("sso-saml", "SSO SAML", "Connexion unique pour les offres Pro et Enterprise.", true, 100, 40),
    flag("usage-based-billing", "Facturation à l'usage", "Mesure et facture la consommation d'API.", false, 0, 9),
    flag("realtime-collab", "Collaboration temps réel", "Édition simultanée des documents.", true, 60, 12),
    flag("dark-mode", "Mode sombre", "Thème sombre pour l'application cliente.", true, 100, 80),
    flag("export-v2", "Export v2", "Nouveau moteur d'export asynchrone.", false, 0, 3),
    flag("webhooks-v2", "Webhooks v2", "Signatures HMAC et relance automatique.", true, 25, 6),
  ];

  const actions: Array<[string, () => string]> = [
    ["a modifié l'offre de", () => rng.pick(customers).name],
    ["a suspendu l'utilisateur", () => rng.pick(users).email],
    ["a remboursé la facture", () => rng.pick(invoices).number],
    ["a activé le flag", () => rng.pick(flags).key],
    ["s'est connecté à la console", () => "console"],
    ["a invité un membre dans l'équipe", () => rng.pick(STAFF).email],
  ];
  const audit: AuditEntry[] = Array.from({ length: 60 }, (_, i) => {
    const [action, target] = rng.pick(actions);
    return { id: `au_${i}`, at: iso(now - i * rng.int(1, 5) * 3600_000 * 2), actorId: rng.pick(STAFF.slice(0, 5)).id, action, target: target(), ip: `${rng.int(11, 197)}.${rng.int(0, 255)}.${rng.int(0, 255)}.${rng.int(1, 254)}` };
  });

  return { plans: PLANS, customers, users, invoices, tickets, flags, staff: STAFF, audit };
}
