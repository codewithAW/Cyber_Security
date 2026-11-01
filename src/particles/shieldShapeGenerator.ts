/**
 * Cybersecurity emblem: a double-outlined shield with a padlock and keyhole,
 * rasterised region-by-region and sampled into a slightly domed 3D cloud.
 */
import { rasterize, samplePixels, type Mask } from './canvasSampler';
import { allocate, pickColor, writeColor, type PaletteKey, type Rng } from './random';
import type { ShapeData } from './types';

const CW = 640;
const CH = 700;
const U = 300; // pixels per shield unit
const CX = CW / 2;
const CY = CH / 2 - 0.02 * U;
const WORLD_H = 4.4;
const UNITS_H = 2.08; // shield spans y ∈ [-1, 1.08]

function shieldPath(ctx: CanvasRenderingContext2D, k: number, dy = 0) {
  const P = (x: number, y: number): [number, number] => [CX + x * U * k, CY + (y * k + dy) * U];
  ctx.beginPath();
  ctx.moveTo(...P(0, -1));
  ctx.bezierCurveTo(...P(0.3, -0.82), ...P(0.6, -0.78), ...P(0.88, -0.8));
  ctx.bezierCurveTo(...P(0.94, 0.05), ...P(0.62, 0.72), ...P(0, 1.08));
  ctx.bezierCurveTo(...P(-0.62, 0.72), ...P(-0.94, 0.05), ...P(-0.88, -0.8));
  ctx.bezierCurveTo(...P(-0.6, -0.78), ...P(-0.3, -0.82), ...P(0, -1));
  ctx.closePath();
}
const px = (v: number) => v * U;
const shackle = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.moveTo(CX - px(0.22), CY + px(0.02));
  ctx.lineTo(CX - px(0.22), CY - px(0.2));
  ctx.arc(CX, CY - px(0.2), px(0.22), Math.PI, 0);
  ctx.lineTo(CX + px(0.22), CY + px(0.02));
};
const body = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.roundRect(CX - px(0.36), CY - px(0.02), px(0.72), px(0.56), px(0.07));
};
const keyhole = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(CX, CY + px(0.19), px(0.075), 0, Math.PI * 2);
  ctx.moveTo(CX - px(0.035), CY + px(0.23));
  ctx.lineTo(CX + px(0.035), CY + px(0.23));
  ctx.lineTo(CX + px(0.06), CY + px(0.42));
  ctx.lineTo(CX - px(0.06), CY + px(0.42));
  ctx.closePath();
};

interface Region {
  mask: Mask;
  weight: number;
  colors: ReadonlyArray<readonly [PaletteKey, number]>;
  intensity: number;
  size: [number, number];
  z: number;
  back?: number; // fraction emitted on a recessed back layer
}

export function generateShieldShape(count: number, rng: Rng): ShapeData {
  const inner = 0.8;
  const innerDy = 0.04;
  const regions: Region[] = [
    {
      mask: rasterize(CW, CH, (c) => { c.lineWidth = px(0.065); shieldPath(c, 1); c.stroke(); }),
      weight: 24, colors: [['orange', 4], ['gold', 1.5], ['cyan', 3], ['ice', 1]], intensity: 1.0, size: [1.0, 1.7], z: 0, back: 0.22,
    },
    {
      mask: rasterize(CW, CH, (c) => { c.lineWidth = px(0.032); shieldPath(c, inner, innerDy); c.stroke(); }),
      weight: 13, colors: [['cyan', 4], ['blue', 2], ['orange', 1.5]], intensity: 0.95, size: [0.9, 1.4], z: 0.06,
    },
    {
      mask: rasterize(CW, CH, (c) => {
        shieldPath(c, 1); c.fill();
        c.globalCompositeOperation = 'destination-out';
        shieldPath(c, inner, innerDy); c.fill();
      }),
      weight: 11, colors: [['blue', 4], ['deepBlue', 2], ['cyan', 1.5]], intensity: 0.5, size: [0.6, 1.0], z: 0.0,
    },
    {
      mask: rasterize(CW, CH, (c) => {
        shieldPath(c, inner, innerDy); c.fill();
        c.globalCompositeOperation = 'destination-out';
        body(c); c.fill();
        c.lineWidth = px(0.14); shackle(c); c.stroke();
      }),
      weight: 9, colors: [['deepBlue', 3], ['blue', 3], ['cyan', 1]], intensity: 0.36, size: [0.5, 0.9], z: -0.05,
    },
    {
      mask: rasterize(CW, CH, (c) => { c.lineWidth = px(0.075); shackle(c); c.stroke(); }),
      weight: 11, colors: [['cyan', 4], ['ice', 1.5], ['orange', 2]], intensity: 1.0, size: [0.9, 1.5], z: 0.22,
    },
    {
      mask: rasterize(CW, CH, (c) => {
        body(c); c.fill();
        c.globalCompositeOperation = 'destination-out';
        keyhole(c); c.fill();
      }),
      weight: 17, colors: [['blue', 4], ['cyan', 3], ['deepBlue', 1.5], ['orange', 0.6]], intensity: 0.75, size: [0.7, 1.2], z: 0.25,
    },
    {
      mask: rasterize(CW, CH, (c) => { c.lineWidth = px(0.03); body(c); c.stroke(); }),
      weight: 9, colors: [['orange', 4], ['gold', 2], ['cyan', 1]], intensity: 1.05, size: [0.9, 1.5], z: 0.28,
    },
    {
      mask: rasterize(CW, CH, (c) => { c.lineWidth = px(0.022); keyhole(c); c.stroke(); }),
      weight: 6, colors: [['gold', 3], ['orange', 3], ['ice', 1]], intensity: 1.15, size: [0.9, 1.4], z: 0.3,
    },
  ];

  const counts = allocate(count, regions.map((r) => r.weight));
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const scale = WORLD_H / UNITS_H / U;
  let k = 0;
  regions.forEach((reg, ri) => {
    const n = counts[ri];
    const pts = samplePixels(reg.mask.filled, reg.mask.width, n, rng);
    for (let i = 0; i < n; i++, k++) {
      const ux = (pts[i * 2] - CX) / U;
      const uy = (pts[i * 2 + 1] - CY) / U;
      const dome = 0.42 * (1 - Math.min(1, (ux * ux + uy * uy) / 1.4));
      const isBack = reg.back !== undefined && rng() < reg.back;
      positions[k * 3] = ux * U * scale;
      positions[k * 3 + 1] = -(uy - 0.04) * U * scale;
      positions[k * 3 + 2] = dome + reg.z + (rng() - 0.5) * 0.05 - (isBack ? 0.38 : 0);
      writeColor(colors, k, pickColor(rng, isBack ? [['deepBlue', 3], ['blue', 2]] : reg.colors), isBack ? 0.55 : reg.intensity, rng);
      sizes[k] = reg.size[0] + rng() * (reg.size[1] - reg.size[0]) + (rng() < 0.03 ? 1.2 : 0);
    }
  });

  return {
    id: 'shield',
    count,
    positions,
    colors,
    sizes,
    width: (1.88 * U) * scale,
    height: WORLD_H,
    fit: { w: 0.42, h: 0.6 },
    orbit: { rx: 1.7, ry: 0.42, rz: 0.6, halo: 1.35 },
  };
}
