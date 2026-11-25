/** `auto` lets each theme pick its own font. */
export type FontFamily = "auto" | "sans" | "display" | "serif" | "mono";

export interface Preferences {
  fontFamily: FontFamily;
  /** Team member impersonated in the demo, drives permissions. */
  currentStaffId: string;
  compactTables: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  fontFamily: "auto",
  currentStaffId: "s_awa",
  compactTables: false,
};
