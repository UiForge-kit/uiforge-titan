"use client";

import { getStaffRole, type Permission } from "@/config/staff-roles";
import { useStaff } from "@/store/data";
import { usePreferencesStore } from "@/store/preferences-store";
import type { StaffMember } from "@/types/domain";

const FALLBACK: StaffMember = { id: "s_awa", name: "Awa Diallo", email: "awa.diallo@example.com", role: "super_admin", active: true, lastSeenAt: "" };

export function useCurrentStaff() {
  const id = usePreferencesStore((state) => state.currentStaffId);
  const staff = useStaff((state) => state.items);
  const member = staff.find((item) => item.id === id) ?? staff[0] ?? FALLBACK;
  return { member, can: (permission: Permission) => getStaffRole(member.role).permissions.includes(permission) };
}
