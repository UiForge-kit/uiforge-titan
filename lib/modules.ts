// Pure checks behind the module registry test (lib/modules.test.ts).

export const entryPath = (id: string) => `modules/${id}/index.tsx`;

export function findMissingEntries(ids: readonly string[], exists: (path: string) => boolean): string[] {
  return ids.filter((id) => !exists(entryPath(id)));
}

export function findUnregistered(ids: readonly string[], registrySource: string): string[] {
  return ids.filter((id) => !registrySource.includes(`"@/modules/${id}"`));
}
