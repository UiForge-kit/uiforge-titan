import { STORAGE_NAMESPACE } from "@/config/site";

// localStorage access that never throws: private mode, full quota or corrupted JSON
// must not stop the app from booting

export function storageKey(name: string): string {
  return `${STORAGE_NAMESPACE}:${name}`;
}

export function readPersisted<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePersisted(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded: session keeps working, only persistence is lost
  }
}

export function removePersisted(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // key stays behind, harmless
  }
}
