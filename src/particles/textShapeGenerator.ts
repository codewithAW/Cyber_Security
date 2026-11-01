/**
 * Samples particle positions from text rendered to a canvas.
 * Edge pixels are sampled more densely than the interior so letters read
 * as crisp, luminous outlines with a softer particle fill.
 */
import { rasterize, samplePixels } from './canvasSampler';
import { allocate, pickColor, writeColor, type Rng } from './random';
import type { FormationId, OrbitConfig, ShapeData } from './types';

const FONT_PX = 200;
const FONT_STACK = '"Arial Black", "Segoe UI Black", "Helvetica Neue", Arial, sans-serif';

export interface TextShapeOptions {
  id: FormationId;
  lines: string[];
  /** Design-space width of the widest line. */
  worldWidth: number;
  fit: { w: number; h: number };
  orbit: OrbitConfig;
}

export function generateTextShape(count: number, rng: Rng, opts: TextShapeOptions): ShapeData {
  const font = `900 ${FONT_PX}px ${FONT_STACK}`;
  const spacing = Math.round(FONT_PX * 0.06);
  const measureCtx = document.createElement('canvas').getContext('2d')!;
  measureCtx.font = font;
  const hasSpacing = 'letterSpacing' in measureCtx;
  if (hasSpacing) (measureCtx as unknown as { letterSpacing: string }).letterSpacing = `${spacing}px`;
  const lineWidths = opts.lines.map((l) => measureCtx.measureText(l).width);
  const textW = Math.max(...lineWidths);
  const lineH = FONT_PX * 1.08;
  const pad = 24;
  const cw = Math.ceil(textW + pad * 2);
  const ch = Math.ceil(lineH * opts.lines.length + pad * 2);

  const mask = rasterize(cw, ch, (ctx) => {
    ctx.font = font;
    if (hasSpacing) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${spacing}px`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    opts.lines.forEach((line, li) => {
      const x = pad + (textW - lineWidths[li]) / 2;
      ctx.fillText(line, x, pad + lineH * (li + 0.5));
    });
  }, 3);

  const scale = opts.worldWidth / textW;
  const cx = cw / 2;
  const cy = ch / 2;

  const [nEdgeFront, nEdgeBack, nInterior] = allocate(count, [46, 12, 42]);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let k = 0;

  const emit = (px: Float32Array, n: number, kind: 'front' | 'back' | 'fill') => {
    for (let i = 0; i < n; i++, k++) {
      positions[k * 3] = (px[i * 2] - cx) * scale;
      positions[k * 3 + 1] = -(px[i * 2 + 1] - cy) * scale;
      if (kind === 'front') {
        positions[k * 3 + 2] = 0.14 + (rng() - 0.5) * 0.06;
        writeColor(colors, k, pickColor(rng, [['orange', 4], ['gold', 1.5], ['cyan', 3], ['ice', 1.2]]), 0.95, rng);
        sizes[k] = 1.05 + rng() * 0.6 + (rng() < 0.04 ? 1.2 : 0);
      } else if (kind === 'back') {
        positions[k * 3 + 2] = -0.32 + (rng() - 0.5) * 0.06;
        writeColor(colors, k, pickColor(rng, [['deepBlue', 3], ['blue', 2], ['orange', 0.6]]), 0.6, rng);
        sizes[k] = 0.8 + rng() * 0.4;
      } else {
        positions[k * 3 + 2] = (rng() - 0.5) * 0.36;
        writeColor(colors, k, pickColor(rng, [['blue', 5], ['cyan', 3], ['deepBlue', 2], ['orange', 1]]), 0.7, rng);
        sizes[k] = 0.75 + rng() * 0.55;
      }
    }
  };

  emit(samplePixels(mask.edges, mask.width, nEdgeFront, rng), nEdgeFront, 'front');
  emit(samplePixels(mask.edges, mask.width, nEdgeBack, rng), nEdgeBack, 'back');
  emit(samplePixels(mask.interior.length ? mask.interior : mask.filled, mask.width, nInterior, rng), nInterior, 'fill');

  return {
    id: opts.id,
    count,
    positions,
    colors,
    sizes,
    width: opts.worldWidth,
    height: lineH * opts.lines.length * scale * 0.85,
    fit: opts.fit,
    orbit: opts.orbit,
  };
}

