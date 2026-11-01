/**
 * Generates the point cloud for the StudyVerse Holographic Cyber Emblem & Logo:
 *
 * An intricate, cinematic 3D particle emblem featuring:
 * 1. Double Outer Cyber Hexagon with glowing corner node vertices.
 * 2. Dual 3D Gyroscopic Quantum Orbital Rings tilted in Z-depth.
 * 3. Central 8-Point Cyber Starburst & Crystalline Core.
 * 4. Crisp, elegant, widely-spaced "STUDYVERSE" wordmark underneath.
 *
 * Clean geometry prevents bloom blowout while creating an unforgettable,
 * iconic centerpiece that looks stunning on desktop and mobile.
 */
import { rasterize, samplePixels } from './canvasSampler';
import { allocate, pickColor, writeColor, type Rng } from './random';
import type { ShapeData } from './types';

const CW = 1200;
const CH = 900;
const CX = CW / 2;
const CY = CH / 2 - 35; // slightly above center so STUDYVERSE wordmark sits balanced below

export interface EmblemShapeOptions {
  count: number;
  rng: Rng;
  portrait: boolean;
}

export function generateEmblemShape(opts: EmblemShapeOptions): ShapeData {
  const { count, rng, portrait } = opts;

  // Typography metrics for STUDYVERSE wordmark
  const brandFont = portrait
    ? '800 48px "Inter", "Segoe UI", sans-serif'
    : '800 58px "Inter", "Segoe UI", sans-serif';
  const brandSpacing = portrait ? 16 : 22;
  const brandY = portrait ? CY + 230 : CY + 245;

  // 1. Rasterize STUDYVERSE wordmark
  const brandMask = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = brandFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${brandSpacing}px`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('STUDYVERSE', CX, brandY);
    },
    2,
  );

  // Particle budget allocation:
  // - Hexagon Outer Frame: 24%
  // - Dual Orbital Gyro Rings: 30%
  // - Central Cyber Starburst Core: 26%
  // - STUDYVERSE Wordmark: 20%
  const [nHex, nRings, nCore] = allocate(count, [24, 30, 26, 20]);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const worldW = portrait ? 7.2 : 9.0;
  const scale = worldW / CW;

  let k = 0;

  // =========================================================================
  // 1. HEXAGON CYBER FRAME (Double concentric hexagon with corner nodes)
  // =========================================================================
  const hexRadiusOuter = portrait ? 180 : 210;
  const hexRadiusInner = hexRadiusOuter * 0.88;
  const hexAngles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3];

  const emitHexLine = (x1: number, y1: number, x2: number, y2: number, nPts: number, isInner: boolean) => {
    for (let i = 0; i < nPts; i++, k++) {
      const t = (i + rng() * 0.3) / nPts;
      const pxX = x1 + (x2 - x1) * t;
      const pxY = y1 + (y2 - y1) * t;

      positions[k * 3] = (pxX - CX) * scale;
      positions[k * 3 + 1] = -(pxY - CY) * scale;
      positions[k * 3 + 2] = (rng() - 0.5) * (isInner ? 0.08 : 0.14);

      if (isInner) {
        writeColor(colors, k, pickColor(rng, [['cyan', 4], ['ice', 2], ['blue', 2]]), 1.1, rng);
        sizes[k] = 1.0 + rng() * 0.45;
      } else {
        writeColor(colors, k, pickColor(rng, [['blue', 3.5], ['cyan', 3], ['deepBlue', 2]]), 0.95, rng);
        sizes[k] = 0.9 + rng() * 0.4;
      }
    }
  };

  const ptsPerSide = Math.floor(nHex / 14); // 6 outer sides, 6 inner sides, 2 for corner nodes
  // Outer hexagon
  for (let s = 0; s < 6; s++) {
    const a1 = hexAngles[s];
    const a2 = hexAngles[(s + 1) % 6];
    emitHexLine(
      CX + Math.cos(a1) * hexRadiusOuter,
      CY + Math.sin(a1) * hexRadiusOuter,
      CX + Math.cos(a2) * hexRadiusOuter,
      CY + Math.sin(a2) * hexRadiusOuter,
      ptsPerSide,
      false,
    );
  }
  // Inner hexagon
  for (let s = 0; s < 6; s++) {
    const a1 = hexAngles[s];
    const a2 = hexAngles[(s + 1) % 6];
    emitHexLine(
      CX + Math.cos(a1) * hexRadiusInner,
      CY + Math.sin(a1) * hexRadiusInner,
      CX + Math.cos(a2) * hexRadiusInner,
      CY + Math.sin(a2) * hexRadiusInner,
      ptsPerSide,
      true,
    );
  }
  // Glowing Corner Node Anchors
  const ptsPerNode = Math.floor((nHex - k) / 6);
  for (let s = 0; s < 6; s++) {
    const a = hexAngles[s];
    const nx = CX + Math.cos(a) * hexRadiusOuter;
    const ny = CY + Math.sin(a) * hexRadiusOuter;
    for (let p = 0; p < ptsPerNode && k < nHex; p++, k++) {
      positions[k * 3] = (nx - CX + (rng() - 0.5) * 8) * scale;
      positions[k * 3 + 1] = -(ny - CY + (rng() - 0.5) * 8) * scale;
      positions[k * 3 + 2] = (rng() - 0.5) * 0.25;

      writeColor(colors, k, pickColor(rng, [['orange', 4], ['gold', 3], ['ember', 2]]), 1.3, rng);
      sizes[k] = 1.35 + rng() * 0.6;
    }
  }

  // =========================================================================
  // 2. DUAL 3D GYROSCOPIC QUANTUM ORBITAL RINGS
  // =========================================================================
  const ringCount = Math.floor(nRings / 2);
  const ringA = portrait ? 200 : 230; // semi-major axis
  const ringB = portrait ? 95 : 110;  // semi-minor axis
  const tilt1 = Math.PI / 6;  // +30 deg
  const tilt2 = -Math.PI / 6; // -30 deg

  const emitOrbitRing = (tilt: number, count: number, isGoldAccent: boolean) => {
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    for (let i = 0; i < count; i++, k++) {
      const theta = (i / count) * Math.PI * 2;
      const rx = Math.cos(theta) * ringA;
      const ry = Math.sin(theta) * ringB;
      const rz = Math.sin(theta) * 0.45; // 3D depth tilt

      // Rotate in 2D plane by tilt angle
      const rotX = rx * cosT - ry * sinT;
      const rotY = rx * sinT + ry * cosT;

      positions[k * 3] = rotX * scale;
      positions[k * 3 + 1] = -rotY * scale;
      positions[k * 3 + 2] = rz + (rng() - 0.5) * 0.06;

      const isNode = rng() < 0.12;
      if (isNode) {
        const pal = isGoldAccent
          ? pickColor(rng, [['gold', 4], ['orange', 3], ['ember', 2]])
          : pickColor(rng, [['cyan', 4], ['ice', 3], ['orange', 2]]);
        writeColor(colors, k, pal, 1.35, rng);
        sizes[k] = 1.4 + rng() * 0.6;
      } else {
        const pal = isGoldAccent
          ? pickColor(rng, [['cyan', 3], ['blue', 3], ['gold', 1.5]])
          : pickColor(rng, [['blue', 4], ['cyan', 3], ['ice', 1]]);
        writeColor(colors, k, pal, 0.95, rng);
        sizes[k] = 0.85 + rng() * 0.4;
      }
    }
  };

  emitOrbitRing(tilt1, ringCount, false);
  emitOrbitRing(tilt2, nRings - ringCount, true);

  // =========================================================================
  // 3. CENTRAL 8-POINT CYBER STARBURST & CRYSTALLINE CORE
  // =========================================================================
  const starRadiusMajor = hexRadiusInner * 0.68;
  const starRadiusMinor = hexRadiusInner * 0.28;
  const starAngles = Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8);

  const starPts = Math.floor(nCore * 0.65);
  const ptsPerSpoke = Math.floor(starPts / 16);
  for (let s = 0; s < 16; s++) {
    const r1 = s % 2 === 0 ? starRadiusMajor : starRadiusMinor;
    const r2 = (s + 1) % 2 === 0 ? starRadiusMajor : starRadiusMinor;
    const a1 = starAngles[s];
    const a2 = starAngles[(s + 1) % 16];

    const x1 = CX + Math.cos(a1) * r1;
    const y1 = CY + Math.sin(a1) * r1;
    const x2 = CX + Math.cos(a2) * r2;
    const y2 = CY + Math.sin(a2) * r2;

    for (let p = 0; p < ptsPerSpoke; p++, k++) {
      const t = (p + rng() * 0.3) / ptsPerSpoke;
      const pxX = x1 + (x2 - x1) * t;
      const pxY = y1 + (y2 - y1) * t;

      positions[k * 3] = (pxX - CX) * scale;
      positions[k * 3 + 1] = -(pxY - CY) * scale;
      positions[k * 3 + 2] = 0.12 + (rng() - 0.5) * 0.1;

      writeColor(colors, k, pickColor(rng, [['cyan', 4], ['ice', 3], ['orange', 1.5]]), 1.15, rng);
      sizes[k] = 1.1 + rng() * 0.5;
    }
  }

  // Glowing center core orb
  const remainingCore = (nHex + nRings + nCore) - k;
  for (let p = 0; p < remainingCore; p++, k++) {
    const rad = (rng() ** 0.5) * (starRadiusMinor * 0.85);
    const ang = rng() * Math.PI * 2;
    positions[k * 3] = (Math.cos(ang) * rad) * scale;
    positions[k * 3 + 1] = -(Math.sin(ang) * rad) * scale;
    positions[k * 3 + 2] = (rng() - 0.5) * 0.3;

    if (rad < starRadiusMinor * 0.35) {
      // Core bright center
      writeColor(colors, k, pickColor(rng, [['ice', 4], ['cyan', 3], ['gold', 2]]), 1.4, rng);
      sizes[k] = 1.35 + rng() * 0.6;
    } else {
      writeColor(colors, k, pickColor(rng, [['cyan', 4], ['blue', 3], ['orange', 2]]), 1.05, rng);
      sizes[k] = 0.95 + rng() * 0.45;
    }
  }

  // =========================================================================
  // 4. CRISP "STUDYVERSE" WORDMARK
  // =========================================================================
  const brandTarget = count - k;
  const brandPixels = samplePixels(
    brandMask.edges.length ? brandMask.edges : brandMask.filled,
    brandMask.width,
    brandTarget,
    rng,
  );

  for (let i = 0; i < brandTarget && k < count; i++, k++) {
    const pxX = brandPixels[i * 2];
    const pxY = brandPixels[i * 2 + 1];

    positions[k * 3] = (pxX - CX) * scale;
    positions[k * 3 + 1] = -(pxY - CY) * scale;
    positions[k * 3 + 2] = 0.08 + (rng() - 0.5) * 0.1;

    // Elegant gradient across STUDYVERSE: warm orange tips, luminous cyan body
    const normX = Math.abs(pxX - CX) / (CW * 0.35);
    if (normX > 0.75 || rng() < 0.18) {
      writeColor(colors, k, pickColor(rng, [['orange', 4], ['gold', 3], ['ember', 1]]), 1.15, rng);
      sizes[k] = 1.1 + rng() * 0.45;
    } else {
      writeColor(colors, k, pickColor(rng, [['ice', 3], ['cyan', 4], ['blue', 2]]), 1.05, rng);
      sizes[k] = 0.95 + rng() * 0.4;
    }
  }

  // Any remaining particles
  while (k < count) {
    positions[k * 3] = (rng() - 0.5) * worldW;
    positions[k * 3 + 1] = (rng() - 0.5) * (worldW * 0.6);
    positions[k * 3 + 2] = (rng() - 0.5) * 0.35;
    writeColor(colors, k, pickColor(rng, [['cyan', 2], ['blue', 3]]), 0.7, rng);
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
    id: 'emblem',
    count,
    positions: sPos,
    colors: sCol,
    sizes: sSiz,
    width: worldW,
    height: 6.2,
    fit: portrait ? { w: 0.92, h: 0.62 } : { w: 0.75, h: 0.68 },
    orbit: { rx: 1.18, ry: 1.05, rz: 0.42, halo: 1.25 },
  };
}
