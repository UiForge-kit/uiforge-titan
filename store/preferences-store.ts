"use client";

import { createPersistedSlice } from "@/store/persisted-slice";
import { DEFAULT_PREFERENCES } from "@/types/settings";

export const usePreferencesStore = createPersistedSlice("preferences", DEFAULT_PREFERENCES);
