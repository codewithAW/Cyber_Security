/**
 * Generates the clean dual-tier point cloud for:
 *
 *              AWA
 *           CREATED BY
 *
 * AWA is the dominant heroic typography in the center.
 * CREATED BY is a refined, widely-tracked caption centered directly below it.
 * Matching the exact Phase 2 storyboard specification.
 */
import { rasterize, samplePixels } from './canvasSampler';
import { allocate, pickColor, writeColor, type Rng } from './random';
import type { ShapeData } from './types';

const CW = 1200;
const CH = 800;
const CX = CW / 2;
const CY = CH / 2;

export interface AwaShapeOptions {
  count: number;
  rng: Rng;
  portrait: boolean;
}

export function generateAwaShape(opts: AwaShapeOptions): ShapeData {
  const { count, rng, portrait } = opts;

  // Typography metrics
  const awaFont = portrait
    ? '900 210px "Arial Black", "Segoe UI Black", "Helvetica Neue", Arial, sans-serif'
    : '900 240px "Arial Black", "Segoe UI Black", "Helvetica Neue", Arial, sans-serif';
  const awaSpacing = portrait ? 20 : 26;

  const subFont = portrait
    ? '700 42px "Inter", "Segoe UI", Arial, sans-serif'
    : '700 48px "Inter", "Segoe UI", Arial, sans-serif';
  const subSpacing = portrait ? 18 : 22;

  // Vertical placement
  const awaY = portrait ? CY - 60 : CY - 50;
  const subY = portrait ? CY + 140 : CY + 150;

  // 1. Rasterize AWA (dominant element)
  const awaMask = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = awaFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${awaSpacing}px`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('AWA', CX, awaY);
    },
    2,
  );

  // 2. Rasterize CREATED BY (secondary caption)
  const subMask = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = subFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${subSpacing}px`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('CREATED BY', CX, subY);
    },
    2,
  );

  // Allocate particle counts: ~75% to AWA, ~25% to CREATED BY
  const [nAwa, nSub] = allocate(count, [75, 25]);
  const [nAwaEdgeFront, nAwaEdgeBack, nAwaFill] = allocate(nAwa, [48, 14, 38]);
  const [nSubEdge, nSubFill] = allocate(nSub, [55, 45]);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const worldW = portrait ? 6.8 : 8.4;
  const scale = worldW / CW;

  let k = 0;

  // Sample AWA particles
  const emitAwa = (px: Float32Array, n: number, kind: 'front' | 'back' | 'fill') => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];

      const wx = (pxX - CX) * scale;
      const wy = -(pxY - CY) * scale;

      positions[k * 3] = wx;
      positions[k * 3 + 1] = wy;

      const normY = (pxY - (awaY - 120)) / 240;
      const isTopOrCorner = normY < 0.32 || Math.abs(wx) > worldW * 0.38;

      if (kind === 'front') {
        positions[k * 3 + 2] = 0.16 + (rng() - 0.5) * 0.06;
        if (isTopOrCorner && rng() < 0.65) {
          writeColor(colors, k, pickColor(rng, [['orange', 5], ['gold', 3], ['ember', 2]]), 1.15, rng);
        } else {
          writeColor(colors, k, pickColor(rng, [['cyan', 4], ['ice', 2], ['orange', 2], ['blue', 1.5]]), 1.05, rng);
        }
        sizes[k] = 1.15 + rng() * 0.55 + (rng() < 0.05 ? 1.2 : 0);
      } else if (kind === 'back') {
        positions[k * 3 + 2] = -0.3 + (rng() - 0.5) * 0.06;
        writeColor(colors, k, pickColor(rng, [['deepBlue', 4], ['blue', 3], ['orange', 1]]), 0.65, rng);
        sizes[k] = 0.85 + rng() * 0.4;
      } else {
        positions[k * 3 + 2] = (rng() - 0.5) * 0.34;
        writeColor(colors, k, pickColor(rng, [['blue', 5], ['cyan', 3.5], ['deepBlue', 2], ['orange', 1]]), 0.8, rng);
        sizes[k] = 0.8 + rng() * 0.55;
      }
    }
  };

  emitAwa(samplePixels(awaMask.edges.length ? awaMask.edges : awaMask.filled, awaMask.width, nAwaEdgeFront, rng), nAwaEdgeFront, 'front');
  emitAwa(samplePixels(awaMask.edges.length ? awaMask.edges : awaMask.filled, awaMask.width, nAwaEdgeBack, rng), nAwaEdgeBack, 'back');
  emitAwa(
    samplePixels(awaMask.interior.length ? awaMask.interior : awaMask.filled, awaMask.width, nAwaFill, rng),
    nAwaFill,
    'fill',
  );

  // Sample CREATED BY particles
  const emitSub = (px: Float32Array, n: number, isEdge: boolean) => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];

      positions[k * 3] = (pxX - CX) * scale;
      positions[k * 3 + 1] = -(pxY - CY) * scale;
      positions[k * 3 + 2] = (rng() - 0.5) * 0.18;

      if (isEdge) {
        writeColor(colors, k, pickColor(rng, [['cyan', 4], ['ice', 3], ['orange', 1.5], ['blue', 1.5]]), 0.95, rng);
        sizes[k] = 0.85 + rng() * 0.45;
      } else {
        writeColor(colors, k, pickColor(rng, [['blue', 4], ['cyan', 3], ['deepBlue', 2]]), 0.65, rng);
        sizes[k] = 0.7 + rng() * 0.35;
      }
    }
  };

  emitSub(samplePixels(subMask.edges.length ? subMask.edges : subMask.filled, subMask.width, nSubEdge, rng), nSubEdge, true);
  emitSub(
    samplePixels(subMask.interior.length ? subMask.interior : subMask.filled, subMask.width, nSubFill, rng),
    nSubFill,
    false,
  );

  // Remainder
  while (k < count) {
    positions[k * 3] = (rng() - 0.5) * worldW;
    positions[k * 3 + 1] = (rng() - 0.5) * (worldW * 0.4);
    positions[k * 3 + 2] = (rng() - 0.5) * 0.3;
    writeColor(colors, k, pickColor(rng, [['blue', 3], ['cyan', 2]]), 0.7, rng);
    sizes[k] = 0.7;
    k++;
  }

  // Sort deterministically along X for coherent morphing
  const indices = new Int32Array(count);
  for (let i = 0; i < count; i++) indices[i] = i;
  indices.sort((a, b) => positions[a * 3] - positions[b * 3]);

  const sPos = new Float32Array(count * 3);
  const sCol = new Float32Array(count * 3);
  const sSiz = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const orig = indices[i];
    sPos[i * 3] = positions[orig * 3];
    sPos[i * 3 + 1] = positions[orig * 3 + 1];
    sPos[i * 3 + 2] = positions[orig * 3 + 2];
    sCol[i * 3] = colors[orig * 3];
    sCol[i * 3 + 1] = colors[orig * 3 + 1];
    sCol[i * 3 + 2] = colors[orig * 3 + 2];
    sSiz[i] = sizes[orig];
  }

  return {
    id: 'awa',
    count,
    positions: sPos,
    colors: sCol,
    sizes: sSiz,
    width: worldW,
    height: 4.8,
    fit: portrait ? { w: 0.9, h: 0.45 } : { w: 0.72, h: 0.55 },
    orbit: { rx: 1.15, ry: 0.72, rz: 0.32, halo: 1.25 },
  };
}
