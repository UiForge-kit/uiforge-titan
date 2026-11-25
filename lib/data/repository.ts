import { readPersisted, storageKey, writePersisted } from "@/lib/storage/persisted";

/**
 * Extension point: swap localRepository for your REST/GraphQL backend by implementing this pair.
 * `load` must return null (not []) when nothing was ever saved, that is what triggers the demo seed.
 */
export interface EntityRepository<T> {
  load(): Promise<T[] | null>;
  save(items: T[]): Promise<void>;
}

export function localRepository<T>(name: string): EntityRepository<T> {
  const key = storageKey(name);
  return {
    async load() {
      return readPersisted<T[] | null>(key, null);
    },
    async save(items) {
      writePersisted(key, items);
    },
  };
}
