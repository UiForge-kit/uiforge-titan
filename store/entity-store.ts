"use client";

// One Zustand store per entity, loaded from a repository and saved on every write.
// Pages only talk to these stores, never to the repository.
import { create } from "zustand";
import { localRepository, type EntityRepository } from "@/lib/data/repository";

export interface EntityState<T extends { id: string }> {
  items: T[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  upsert: (...items: T[]) => void;
  remove: (...ids: string[]) => void;
  reset: () => Promise<void>;
}

export interface HydratableStore {
  getState: () => Pick<EntityState<{ id: string }>, "hydrated" | "hydrate" | "reset">;
  subscribe: (listener: () => void) => () => void;
}

export function createEntityStore<T extends { id: string }>(
  name: string,
  seed: () => T[],
  repository: EntityRepository<T> = localRepository<T>(name),
) {
  return create<EntityState<T>>((set, get) => {
    const commit = (items: T[]) => {
      set({ items });
      // in-memory state stays valid if the write fails
      void repository.save(items).catch(console.error);
    };

    return {
      items: [],
      hydrated: false,

      async hydrate() {
        if (get().hydrated) return;
        const stored = await repository.load();
        set({ items: stored ?? seed(), hydrated: true });
      },

      upsert(...changed) {
        const byId = new Map(changed.map((item) => [item.id, item]));
        const known = new Set(get().items.map((item) => item.id));
        commit([...get().items.map((item) => byId.get(item.id) ?? item), ...changed.filter((item) => !known.has(item.id))]);
      },

      remove(...ids) {
        const gone = new Set(ids);
        commit(get().items.filter((item) => !gone.has(item.id)));
      },

      async reset() {
        const items = seed();
        await repository.save(items);
        set({ items, hydrated: true });
      },
    };
  });
}
