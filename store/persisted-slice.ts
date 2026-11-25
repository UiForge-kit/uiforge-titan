"use client";

import { create } from "zustand";
import { readPersisted, storageKey, writePersisted } from "@/lib/storage/persisted";

export type PersistedSlice<T extends object> = T & {
  hydrated: boolean;
  set: <K extends keyof T>(key: K, value: T[K]) => void;
  patch: (values: Partial<T>) => void;
  reset: () => void;
  hydrate: () => void;
};

export function createPersistedSlice<T extends object>(name: string, defaults: T) {
  const key = storageKey(name);
  const fields = Object.keys(defaults) as Array<keyof T>;

  // data fields only, never the actions
  const extract = (state: PersistedSlice<T>): T =>
    Object.fromEntries(fields.map((field) => [field, state[field]])) as T;

  return create<PersistedSlice<T>>((setState, get) => ({
    ...defaults,
    hydrated: false,

    set(field, value) {
      get().patch({ [field]: value } as unknown as Partial<T>);
    },

    patch(values) {
      setState(values as Partial<PersistedSlice<T>>);
      writePersisted(key, extract(get()));
    },

    reset() {
      setState({ ...defaults } as Partial<PersistedSlice<T>>);
      writePersisted(key, defaults);
    },

    hydrate() {
      if (get().hydrated) return;
      const stored = readPersisted<Partial<T>>(key, {});
      setState({ ...defaults, ...stored, hydrated: true } as Partial<PersistedSlice<T>>);
    },
  }));
}
