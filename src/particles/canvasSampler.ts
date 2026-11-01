/**
 * Rasterises 2D drawings to an offscreen canvas and exposes the filled /
 * edge / interior pixels so they can be sampled into particle positions.
 */
import type { Rng } from './random';

export interface Mask {
  width: number;
  height: number;
  filled: Int32Array;
  edges: Int32Array;
  interior: Int32Array;
}

let sharedCanvas: HTMLCanvasElement | null = null;

function getContext(w: number, h: number): CanvasRenderingContext2D {
  if (!sharedCanvas) sharedCanvas = document.createElement('canvas');
  sharedCanvas.width = w;
  sharedCanvas.height = h;
  const ctx = sharedCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas unavailable');
  ctx.clearRect(0, 0, w, h);
  return ctx;
}

export function rasterize(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  edgeRadius = 2,
): Mask {
  const ctx = getContext(width, height);
  ctx.save();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fff';
  draw(ctx);
  ctx.restore();
  const data = ctx.getImageData(0, 0, width, height).data;
  const on = new Uint8Array(width * height);
  for (let i = 0, p = 3; i < on.length; i++, p += 4) on[i] = data[p] > 110 ? 1 : 0;

  const filled: number[] = [];
  const edges: number[] = [];
  const interior: number[] = [];
  const r = edgeRadius;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (!on[idx]) continue;
      filled.push(idx);
      const edge =
        x < r || y < r || x >= width - r || y >= height - r ||
        !on[idx - r] || !on[idx + r] || !on[idx - r * width] || !on[idx + r * width];
      (edge ? edges : interior).push(idx);
    }
  }
  return {
    width,
    height,
    filled: Int32Array.from(filled),
    edges: Int32Array.from(edges),
    interior: Int32Array.from(interior),
  };
}

/** Uniformly sample `count` sub-pixel positions from a pixel index list. */
export function samplePixels(
  list: Int32Array,
  width: number,
  count: number,
  rng: Rng,
): Float32Array {
  const out = new Float32Array(count * 2);
  if (list.length === 0) return out;
  for (let i = 0; i < count; i++) {
    const idx = list[Math.floor(rng() * list.length)];
    out[i * 2] = (idx % width) + rng();
    out[i * 2 + 1] = Math.floor(idx / width) + rng();
  }
  return out;
}

