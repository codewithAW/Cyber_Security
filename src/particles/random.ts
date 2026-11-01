/** Deterministic PRNG + colour helpers used by the shape generators. */

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type RGB = readonly [number, number, number];

const hex = (h: string): RGB => {
  const n = parseInt(h.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export const PALETTE = {
  blue: hex('#168BFF'),
  deepBlue: hex('#0D4FD6'),
  cyan: hex('#63D9FF'),
  ice: hex('#CFEBFF'),
  orange: hex('#FF9D32'),
  gold: hex('#FFC66E'),
  ember: hex('#FF7A1A'),
} as const;

export type PaletteKey = keyof typeof PALETTE;

/** Weighted palette pick, e.g. [['blue', 3], ['cyan', 1]]. */
export function pickColor(rng: Rng, weights: ReadonlyArray<readonly [PaletteKey, number]>): RGB {
  let total = 0;
  for (const [, w] of weights) total += w;
  let r = rng() * total;
  for (const [k, w] of weights) {
    r -= w;
    if (r <= 0) return PALETTE[k];
  }
  return PALETTE[weights[weights.length - 1][0]];
}

export function writeColor(
  out: Float32Array,
  i: number,
  c: RGB,
  intensity: number,
  rng: Rng,
  jitter = 0.08,
): void {
  const j = 1 + (rng() - 0.5) * 2 * jitter;
  out[i * 3] = c[0] * intensity * j;
  out[i * 3 + 1] = c[1] * intensity * j;
  out[i * 3 + 2] = c[2] * intensity * j;
}

/** Split `total` into integer shares proportional to `weights` (sums exactly to total). */
export function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const out = weights.map((w) => Math.floor((w / sum) * total));
  let rem = total - out.reduce((a, b) => a + b, 0);
  for (let i = 0; rem > 0; i = (i + 1) % out.length, rem--) out[i]++;
  return out;
}

