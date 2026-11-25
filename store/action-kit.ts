// Shared by store/actions.ts and module actions: permission guard, audit trail, acting member.
// Guard and audit run client-side here; a real backend must enforce rights and record the audit itself.
import { getStaffRole, type Permission } from "@/config/staff-roles";
import { createId } from "@/lib/id";
import { toast } from "@/store/toast-store";
import { useAudit, useStaff } from "@/store/data";
import { usePreferencesStore } from "@/store/preferences-store";

export function actor() {
  const id = usePreferencesStore.getState().currentStaffId;
  return useStaff.getState().items.find((member) => member.id === id) ?? useStaff.getState().items[0];
}

// every mutation must call this first, and audit() after it succeeds
export function guard(permission: Permission): boolean {
  const member = actor();
  if (member && getStaffRole(member.role).permissions.includes(permission)) return true;
  toast("Votre rôle ne permet pas cette action.", "danger");
  return false;
}

export function audit(action: string, target: string) {
  useAudit.getState().upsert({ id: createId("au"), at: new Date().toISOString(), actorId: actor()?.id ?? "system", action, target, ip: "127.0.0.1" }); // placeholder ip, the server knows the real one
}

export const now = () => new Date().toISOString();
