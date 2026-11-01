/**
 * Procedural open book: two curved page surfaces, a glowing spine,
 * stacked page edges, a cover outline and a soft light fan from the spine.
 */
import { allocate, pickColor, writeColor, type Rng } from './random';
import type { ShapeData } from './types';

const W = 3.1; // page width (spine -> outer edge)
const D = 2.4; // page depth (top -> bottom edge)
const TILT = 0.5; // pitch so we look down onto the pages

/** Height profile of a page from spine (u=0) to outer edge (u=1): an arch that droops outward. */
const pageH = (u: number) => 1.0 * (1 - Math.exp(-5 * u)) - 0.38 * u * u;

export function generateBookShape(count: number, rng: Rng): ShapeData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let k = 0;

  const put = (x: number, y: number, z: number, size: number) => {
    positions[k * 3] = x;
    positions[k * 3 + 1] = y;
    positions[k * 3 + 2] = z;
    sizes[k] = size;
    k++;
  };
  const color = (w: Parameters<typeof pickColor>[1], intensity: number) =>
    writeColor(colors, k, pickColor(rng, w), intensity, rng);
  const side = () => (rng() < 0.5 ? -1 : 1);
  /** Page surface point: s=±1 side, u across, v along depth. */
  const page = (s: number, u: number, v: number, layer = 0): [number, number, number] => {
    const lift = 1 - 0.075 * layer;
    const curl = 0.06 * Math.sin(v * Math.PI) * u; // slight cupping of each page
    return [s * (0.03 + u * W * (1 + 0.012 * layer)), pageH(u) * lift - 0.04 * layer + curl, (v - 0.5) * D];
  };

  const [nFill, nOutline, nLines, nStack, nCover, nSpine, nFan, nSpark] = allocate(count, [
    30, 15, 9, 15, 9, 7, 6, 9,
  ]);

  // Page surfaces
  for (let i = 0; i < nFill; i++) {
    const u = Math.pow(rng(), 0.9);
    const v = rng();
    color([['blue', 5], ['cyan', 2.5], ['deepBlue', 2], ['orange', 0.7]], 0.62);
    const [x, y, z] = page(side(), u, v);
    put(x, y + (rng() - 0.5) * 0.02, z, 0.7 + rng() * 0.6);
  }
  // Page outlines (top, bottom, outer edges)
  for (let i = 0; i < nOutline; i++) {
    const s = side();
    const r = rng();
    let u: number, v: number;
    if (r < 0.36) { u = rng(); v = 0; }
    else if (r < 0.76) { u = rng(); v = 1; }
    else { u = 1; v = rng(); }
    const warm = (u > 0.7 && v === 1) || u === 1;
    color(warm ? [['orange', 4], ['gold', 2], ['cyan', 1.5]] : [['cyan', 3], ['ice', 1], ['orange', 1.6]], 1.0);
    const [x, y, z] = page(s, u, v);
    put(x, y, z, 1.1 + rng() * 0.6 + (rng() < 0.05 ? 1.4 : 0));
  }
  // "Text" lines printed on the pages
  for (let i = 0; i < nLines; i++) {
    let u = 0, row = 0;
    for (let tries = 0; tries < 8; tries++) {
      u = 0.14 + rng() * 0.72;
      row = Math.floor(rng() * 10);
      if (((u * 6.3 + row * 0.37) % 1) < 0.78) break;
    }
    const v = 0.12 + row * 0.085;
    color([['cyan', 3], ['ice', 1.5], ['blue', 2]], 0.75);
    const [x, y, z] = page(side(), u, v);
    put(x, y + 0.01, z, 0.75 + rng() * 0.35);
  }
  // Stacked page layers beneath the top pages
  for (let i = 0; i < nStack; i++) {
    const s = side();
    const layer = 1 + Math.floor(rng() * 7);
    const r = rng();
    let u: number, v: number;
    if (r < 0.62) { u = 0.12 + rng() * 0.88; v = 1; }
    else if (r < 0.8) { u = 0.12 + rng() * 0.88; v = 0; }
    else { u = 1; v = rng(); }
    color([['orange', 5], ['gold', 2], ['ember', 1.5], ['cyan', 1]], 0.85);
    const [x, y, z] = page(s, u, v, layer);
    put(x, y, z, 0.8 + rng() * 0.5);
  }
  // Cover board outline + faint fill
  for (let i = 0; i < nCover; i++) {
    const s = side();
    const r = rng();
    let u: number, v: number, edge = true;
    if (r < 0.42) { u = rng() * 1.06; v = 1.04; }
    else if (r < 0.62) { u = rng() * 1.06; v = -0.04; }
    else if (r < 0.8) { u = 1.06; v = -0.04 + rng() * 1.08; }
    else { u = rng(); v = rng(); edge = false; }
    color(edge ? [['orange', 4], ['gold', 1], ['blue', 1.5]] : [['deepBlue', 3], ['blue', 1]], edge ? 0.9 : 0.4);
    const y = pageH(Math.min(u, 1)) * 0.42 - 0.5;
    put(s * (0.03 + u * W), y, (v - 0.5) * D, edge ? 0.9 + rng() * 0.5 : 0.6);
  }
  // Spine
  for (let i = 0; i < nSpine; i++) {
    const v = rng();
    color([['gold', 3], ['orange', 3], ['ice', 1]], 1.15);
    const drop = rng() * 0.5; // spine runs down to the cover
    put((rng() - 0.5) * 0.05, -drop * (rng() < 0.7 ? 0.1 : 1), (v - 0.5) * D, 1.1 + rng() * 0.8);
  }
  // Light fan rising from the spine
  for (let i = 0; i < nFan; i++) {
    const t = Math.pow(rng(), 1.7);
    color([['gold', 3], ['orange', 3], ['cyan', 1]], 0.95 - t * 0.4);
    put((rng() - 0.5) * (0.08 + t * 1.6), t * 2.2, (rng() - 0.5) * D * (0.4 + t * 0.4), 0.7 + rng() * 0.9);
  }
  // Sparkles hovering above the pages
  for (let i = 0; i < nSpark; i++) {
    const u = rng() * 1.1;
    const v = rng() * 1.1 - 0.05;
    color([['cyan', 3], ['orange', 2.5], ['ice', 1], ['blue', 2]], 0.8);
    const [x, y, z] = page(side(), Math.min(u, 1.1), v);
    put(x, y + Math.pow(rng(), 2) * 0.9, z, 0.5 + rng() * 0.9);
  }

  // Tilt the book towards the viewer and centre it.
  const c = Math.cos(TILT), sn = Math.sin(TILT);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    const ny = y * c - z * sn;
    positions[i * 3 + 1] = ny;
    positions[i * 3 + 2] = y * sn + z * c;
    minX = Math.min(minX, positions[i * 3]); maxX = Math.max(maxX, positions[i * 3]);
    minY = Math.min(minY, ny); maxY = Math.max(maxY, ny);
  }
  const oy = (minY + maxY) / 2 + 0.15;
  for (let i = 0; i < count; i++) positions[i * 3 + 1] -= oy;

  return {
    id: 'book',
    count,
    positions,
    colors,
    sizes,
    width: maxX - minX,
    height: maxY - minY,
    fit: { w: 0.5, h: 0.6 },
    orbit: { rx: 1.12, ry: 0.62, rz: 0.35, halo: 1.15 },
  };
}
