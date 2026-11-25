// deterministic PRNG: the demo shows the same data on every load
export function createRng(seed: number) {
  let state = seed >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => Math.floor(next() * (max - min + 1)) + min,
    chance: (probability: number) => next() < probability,
    pick: <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)],
    weighted<T>(items: readonly T[], weights: readonly number[]): T {
      let roll = next() * weights.reduce((sum, w) => sum + w, 0);
      for (let i = 0; i < items.length; i += 1) {
        roll -= weights[i];
        if (roll <= 0) return items[i];
      }
      return items[items.length - 1];
    },
  };
}
