/**
 * Builds every formation for a given particle count / layout and sorts each
 * point cloud along X so that particle i occupies a similar relative region
 * in every formation. This deterministic correspondence makes particles
 * sweep coherently between shapes instead of criss-crossing randomly.
 */
import { generateBookShape } from './bookShapeGenerator';
import { generateShieldShape } from './shieldShapeGenerator';
import { generateTextShape } from './textShapeGenerator';
import { generateAwaShape } from './awaShapeGenerator';
import { generateIntroShape } from './introShapeGenerator';
import { generateEmblemShape } from './emblemShapeGenerator';
import { mulberry32 } from './random';
import type { FormationId, LayoutMode, ShapeData } from './types';

export type HeroFormationId = 'book' | 'welcome' | 'shield' | 'cyber';

export const FORMATION_ORDER: HeroFormationId[] = ['book', 'welcome', 'shield', 'cyber'];

export const FORMATION_LABELS: Record<FormationId, string> = {
  book: 'Open book',
  welcome: 'Welcome',
  shield: 'Cybersecurity shield',
  cyber: 'Cybersecurity',
  awa: 'AWA — Created By',
  intro: 'A Different Kind of Learning',
  emblem: 'StudyVerse Cyber Emblem',
};

function sortByX(shape: ShapeData, seed: number): ShapeData {
  const n = shape.count;
  const rng = mulberry32(seed);
  const order = new Array<number>(n);
  const keys = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    order[i] = i;
    // small jitter so equal-x columns do not form rigid bands
    keys[i] = shape.positions[i * 3] + (rng() - 0.5) * 0.12;
  }
  order.sort((a, b) => keys[a] - keys[b]);
  const p = new Float32Array(n * 3);
  const c = new Float32Array(n * 3);
  const s = new Float32Array(n);
  order.forEach((src, dst) => {
    p.set(shape.positions.subarray(src * 3, src * 3 + 3), dst * 3);
    c.set(shape.colors.subarray(src * 3, src * 3 + 3), dst * 3);
    s[dst] = shape.sizes[src];
  });
  return { ...shape, positions: p, colors: c, sizes: s };
}

export function buildFormations(count: number, layout: LayoutMode): ShapeData[] {
  const portrait = layout === 'portrait';
  const shapes: Record<HeroFormationId, ShapeData> = {
    book: generateBookShape(count, mulberry32(11)),
    welcome: generateTextShape(count, mulberry32(23), {
      id: 'welcome',
      lines: ['WELCOME'],
      worldWidth: 7.6,
      fit: portrait ? { w: 0.86, h: 0.3 } : { w: 0.5, h: 0.32 },
      orbit: { rx: 1.12, ry: 1.0, rz: 0.25, halo: 1.1 },
    }),
    shield: generateShieldShape(count, mulberry32(37)),
    cyber: generateTextShape(count, mulberry32(41), {
      id: 'cyber',
      lines: portrait ? ['CYBER', 'SECURITY'] : ['CYBERSECURITY'],
      worldWidth: portrait ? 7 : 10,
      fit: portrait ? { w: 0.86, h: 0.36 } : { w: 0.6, h: 0.28 },
      orbit: portrait ? { rx: 1.12, ry: 0.85, rz: 0.25, halo: 1.1 } : { rx: 1.08, ry: 1.25, rz: 0.2, halo: 1.08 },
    }),
  };
  if (portrait) {
    shapes.book.fit = { w: 0.88, h: 0.45 };
    shapes.shield.fit = { w: 0.7, h: 0.45 };
    shapes.shield.orbit = { ...shapes.shield.orbit, rx: 1.45 };
  }
  return FORMATION_ORDER.map((id, i) => sortByX(shapes[id], 101 + i));
}

export function buildAwaFormation(count: number, layout: LayoutMode): ShapeData {
  const portrait = layout === 'portrait';
  const raw = generateAwaShape({ count, rng: mulberry32(77), portrait });
  return sortByX(raw, 202);
}

export function buildIntroFormation(count: number, layout: LayoutMode): ShapeData {
  const portrait = layout === 'portrait';
  const raw = generateIntroShape({ count, rng: mulberry32(88), portrait });
  return sortByX(raw, 203);
}

export function buildEmblemFormation(count: number, layout: LayoutMode): ShapeData {
  const portrait = layout === 'portrait';
  const raw = generateEmblemShape({ count, rng: mulberry32(88), portrait });
  return sortByX(raw, 204);
}


