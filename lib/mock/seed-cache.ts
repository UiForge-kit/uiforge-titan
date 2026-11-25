import { createSeed, type Seed } from "./seed";

let cached: Seed | null = null;

// one draw per session so every store shares the same ids
export function getSeed(): Seed {
  cached ??= createSeed();
  return cached;
}
