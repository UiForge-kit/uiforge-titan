// All business mutations go through here: permission check, write, audit entry, toast.
// Pages never write to a store directly. Rights are re-checked here, not only in the UI.
import { LIMITS } from "@/config/limits";
import { createId } from "@/lib/id";
import { actor, audit, guard, now } from "@/store/action-kit";
import { toast } from "@/store/toast-store";
import { useCustomers, usePlans, useUsers } from "@/store/data";
import type { AppUser, Customer, Plan, UserRole } from "@/types/domain";

export function setUserStatus(user: AppUser, status: AppUser["status"]) {
  if (!guard("users.write")) return;
  useUsers.getState().upsert({ ...user, status });
  audit(status === "suspended" ? "a suspendu l'utilisateur" : "a réactivé l'utilisateur", user.email);
  toast(status === "suspended" ? "Utilisateur suspendu." : "Utilisateur réactivé.");
}

export function setUserRole(user: AppUser, role: UserRole) {
  if (!guard("users.write")) return;
  useUsers.getState().upsert({ ...user, role });
  audit(`a passé ${user.email} au rôle ${role}`, user.email);
  toast("Rôle mis à jour.");
}

export function inviteUser(customerId: string, name: string, email: string, role: UserRole): boolean {
  if (!guard("users.write")) return false;
  const exists = useUsers.getState().items.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    toast("Cette adresse e-mail est déjà utilisée.", "danger");
    return false;
  }
  const country = useCustomers.getState().items.find((c) => c.id === customerId)?.country ?? "France";
  useUsers.getState().upsert({ id: createId("u"), name, email, customerId, role, status: "invited", createdAt: now(), lastActiveAt: null, country });
  audit("a invité l'utilisateur", email);
  toast(`Invitation envoyée à ${email}.`);
  return true;
}

export function removeUser(user: AppUser) {
  if (!guard("users.write")) return;
  useUsers.getState().remove(user.id);
  audit("a supprimé l'utilisateur", user.email);
  toast("Utilisateur supprimé.");
}

export function updateCustomer(customer: Customer, patch: Partial<Customer>, label: string) {
  if (!guard("customers.write")) return;
  useCustomers.getState().upsert({ ...customer, ...patch });
  audit(label, customer.name);
  toast("Client mis à jour.");
}

export function addCustomerNote(customer: Customer, text: string) {
  if (!guard("customers.write") || !text.trim()) return;
  useCustomers.getState().upsert({ ...customer, notes: [{ id: createId("n"), at: now(), authorId: actor().id, text: text.trim() }, ...customer.notes] });
  audit("a ajouté une note sur", customer.name);
}

export function changeCustomerPlan(customer: Customer, plan: Plan) {
  const mrr = customer.status === "active" || customer.status === "past_due" ? (customer.interval === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly) : 0;
  updateCustomer(customer, { planId: plan.id, mrr: Math.round(mrr * 100) / 100 }, `a changé l'offre vers ${plan.name} pour`);
}

export function savePlan(plan: Plan) {
  if (!guard("plans.write")) return;
  // cap applies here too, the dialog is not the only way in
  usePlans.getState().upsert({ ...plan, features: plan.features.slice(0, LIMITS.maxPlanFeatures) });
  audit("a modifié l'offre", plan.name);
  toast(`Offre ${plan.name} enregistrée.`);
}
