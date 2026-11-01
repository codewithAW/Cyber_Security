/**
 * Generates the point cloud for the scroll-triggered professional introduction:
 *
 *               A DIFFERENT KIND OF LEARNING
 *                  Learn without limits.
 *                Build beyond boundaries.
 *   Your complete learning space for computer science notes,
 *       practical exercises, and cybersecurity knowledge.
 *
 * All letters are formed by actual particle positions sampled from canvas pixel masks.
 */
import { rasterize, samplePixels } from './canvasSampler';
import { allocate, writeColor, type RGB, type Rng } from './random';
import type { ShapeData } from './types';

const CW = 1400;
const CH = 950;
const CX = CW / 2;
const CY = CH / 2;

export interface IntroShapeOptions {
  count: number;
  rng: Rng;
  portrait: boolean;
}

export function generateIntroShape(opts: IntroShapeOptions): ShapeData {
  const { count, rng, portrait } = opts;

  // Typography metrics
  const labelFont = portrait
    ? '600 20px "Inter", "Segoe UI", sans-serif'
    : '600 24px "Inter", "Segoe UI", sans-serif';
  const labelTracking = portrait ? 8 : 12;

  const headlineFont = portrait
    ? '800 46px "Inter", "Segoe UI", -apple-system, sans-serif'
    : '800 62px "Inter", "Segoe UI", -apple-system, sans-serif';

  const bodyFont = portrait
    ? '500 20px "Inter", "Segoe UI", sans-serif'
    : '500 23px "Inter", "Segoe UI", sans-serif';
  const bodyTracking = 1;

  // Vertical layout offsets
  const labelY = portrait ? CY - 210 : CY - 180;
  const line1Y = portrait ? CY - 120 : CY - 90;
  const line2Y = portrait ? CY - 55 : CY - 15;
  const body1Y = portrait ? CY + 45 : CY + 85;
  const body2Y = portrait ? CY + 80 : CY + 125;
  const body3Y = portrait ? CY + 115 : CY + 125;

  // 1. Label: A DIFFERENT KIND OF LEARNING
  const maskLabel = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = labelFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${labelTracking}px`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('A DIFFERENT KIND OF LEARNING', CX, labelY);
    },
    2,
  );

  // 2. Line 1: Learn without limits.
  const maskLine1 = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = headlineFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = '0px';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText('Learn without limits.', CX, line1Y);
    },
    2,
  );

  // 3. Line 2: Build beyond boundaries.
  let beyondBoundariesStartX = CX;
  const maskLine2 = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = headlineFont;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      const fullText = 'Build beyond boundaries.';
      const fullWidth = ctx.measureText(fullText).width;
      const buildWidth = ctx.measureText('Build ').width;
      const startX = CX - fullWidth / 2;
      beyondBoundariesStartX = startX + buildWidth;

      ctx.textAlign = 'left';
      ctx.fillText(fullText, startX, line2Y);
    },
    2,
  );

  // 4. Supporting Description
  const maskBody = rasterize(
    CW,
    CH,
    (ctx) => {
      ctx.font = bodyFont;
      if ('letterSpacing' in ctx) (ctx as unknown as { letterSpacing: string }).letterSpacing = `${bodyTracking}px`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (portrait) {
        ctx.fillText('Your complete learning space', CX, body1Y);
        ctx.fillText('for computer science notes, practical exercises,', CX, body2Y);
        ctx.fillText('and cybersecurity knowledge.', CX, body3Y);
      } else {
        ctx.fillText(
          'Your complete learning space for computer science notes,',
          CX,
          body1Y,
        );
        ctx.fillText(
          'practical exercises, and cybersecurity knowledge.',
          CX,
          body2Y,
        );
      }
    },
    2,
  );

  // Allocate particle budget across sections:
  // Label: 12%, Headline 1: 28%, Headline 2: 32%, Body: 28%
  const [nLabel, nLine1, nLine2, nBody] = allocate(count, [12, 28, 32, 28]);

  const [nLabelEdge, nLabelFill] = allocate(nLabel, [60, 40]);
  const [nLine1Edge, nLine1Fill] = allocate(nLine1, [65, 35]);
  const [nLine2Edge, nLine2Fill] = allocate(nLine2, [65, 35]);
  const [nBodyEdge, nBodyFill] = allocate(nBody, [60, 40]);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const worldW = portrait ? 8.2 : 11.2;
  const scale = worldW / CW;

  let k = 0;

  // Color palettes
  const colCyan: RGB = [0.388, 0.851, 1.0]; // #63D9FF
  const colWhite: RGB = [0.91, 0.949, 1.0]; // #E8F2FF
  const colElectricBlue: RGB = [0.086, 0.545, 1.0]; // #168BFF
  const colBody: RGB = [0.608, 0.694, 0.788]; // #9BB1C9
  const colOrange: RGB = [1.0, 0.616, 0.196]; // #FF9D32

  // 1. Emit Label Particles
  const sampleLabel = (px: Float32Array, n: number, isEdge: boolean) => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];
      const wx = (pxX - CX) * scale;
      const wy = -(pxY - CY) * scale;

      positions[k * 3] = wx;
      positions[k * 3 + 1] = wy;
      positions[k * 3 + 2] = (rng() - 0.5) * (isEdge ? 0.08 : 0.16);

      const r = rng();
      if (r < 0.75) {
        writeColor(colors, k, colCyan, 1.0, rng);
      } else if (r < 0.92) {
        writeColor(colors, k, colWhite, 1.0, rng);
      } else {
        writeColor(colors, k, colElectricBlue, 1.0, rng);
      }
      sizes[k] = isEdge ? 1.05 + rng() * 0.45 : 0.85 + rng() * 0.35;
    }
  };

  const pxLabelEdge = samplePixels(maskLabel.edges.length ? maskLabel.edges : maskLabel.filled, maskLabel.width, nLabelEdge, rng);
  const pxLabelFill = samplePixels(maskLabel.interior.length ? maskLabel.interior : maskLabel.filled, maskLabel.width, nLabelFill, rng);
  sampleLabel(pxLabelEdge, nLabelEdge, true);
  sampleLabel(pxLabelFill, nLabelFill, false);

  // 2. Emit Headline Line 1 Particles
  const sampleLine1 = (px: Float32Array, n: number, isEdge: boolean) => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];
      const wx = (pxX - CX) * scale;
      const wy = -(pxY - CY) * scale;

      positions[k * 3] = wx;
      positions[k * 3 + 1] = wy;
      positions[k * 3 + 2] = (rng() - 0.5) * (isEdge ? 0.12 : 0.22);

      const r = rng();
      if (r < 0.82) {
        writeColor(colors, k, colWhite, 1.1, rng);
      } else if (r < 0.94) {
        writeColor(colors, k, colCyan, 1.0, rng);
      } else {
        writeColor(colors, k, colOrange, 1.0, rng);
      }
      sizes[k] = isEdge ? 1.35 + rng() * 0.55 : 1.05 + rng() * 0.4;
    }
  };

  const pxLine1Edge = samplePixels(maskLine1.edges.length ? maskLine1.edges : maskLine1.filled, maskLine1.width, nLine1Edge, rng);
  const pxLine1Fill = samplePixels(maskLine1.interior.length ? maskLine1.interior : maskLine1.filled, maskLine1.width, nLine1Fill, rng);
  sampleLine1(pxLine1Edge, nLine1Edge, true);
  sampleLine1(pxLine1Fill, nLine1Fill, false);

  // 3. Emit Headline Line 2 Particles (Highlighting "beyond boundaries.")
  const sampleLine2 = (px: Float32Array, n: number, isEdge: boolean) => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];
      const wx = (pxX - CX) * scale;
      const wy = -(pxY - CY) * scale;

      positions[k * 3] = wx;
      positions[k * 3 + 1] = wy;
      positions[k * 3 + 2] = (rng() - 0.5) * (isEdge ? 0.12 : 0.22);

      const isBeyondBoundaries = pxX >= beyondBoundariesStartX - 6;

      if (isBeyondBoundaries) {
        const r = rng();
        if (r < 0.55) {
          writeColor(colors, k, colCyan, 1.15, rng);
        } else if (r < 0.88) {
          writeColor(colors, k, colElectricBlue, 1.1, rng);
        } else if (r < 0.96) {
          writeColor(colors, k, colWhite, 1.05, rng);
        } else {
          writeColor(colors, k, colOrange, 1.05, rng);
        }
        sizes[k] = isEdge ? 1.45 + rng() * 0.6 : 1.15 + rng() * 0.45;
      } else {
        const r = rng();
        if (r < 0.85) {
          writeColor(colors, k, colWhite, 1.1, rng);
        } else {
          writeColor(colors, k, colCyan, 1.0, rng);
        }
        sizes[k] = isEdge ? 1.35 + rng() * 0.55 : 1.05 + rng() * 0.4;
      }
    }
  };

  const pxLine2Edge = samplePixels(maskLine2.edges.length ? maskLine2.edges : maskLine2.filled, maskLine2.width, nLine2Edge, rng);
  const pxLine2Fill = samplePixels(maskLine2.interior.length ? maskLine2.interior : maskLine2.filled, maskLine2.width, nLine2Fill, rng);
  sampleLine2(pxLine2Edge, nLine2Edge, true);
  sampleLine2(pxLine2Fill, nLine2Fill, false);

  // 4. Emit Body Particles
  const sampleBody = (px: Float32Array, n: number, isEdge: boolean) => {
    for (let i = 0; i < n; i++, k++) {
      const pxX = px[i * 2];
      const pxY = px[i * 2 + 1];
      const wx = (pxX - CX) * scale;
      const wy = -(pxY - CY) * scale;

      positions[k * 3] = wx;
      positions[k * 3 + 1] = wy;
      positions[k * 3 + 2] = (rng() - 0.5) * (isEdge ? 0.08 : 0.16);

      const r = rng();
      if (r < 0.78) {
        writeColor(colors, k, colBody, 0.9, rng);
      } else if (r < 0.93) {
        writeColor(colors, k, colCyan, 0.85, rng);
      } else {
        writeColor(colors, k, colWhite, 0.85, rng);
      }
      sizes[k] = isEdge ? 1.05 + rng() * 0.4 : 0.85 + rng() * 0.3;
    }
  };

  const pxBodyEdge = samplePixels(maskBody.edges.length ? maskBody.edges : maskBody.filled, maskBody.width, nBodyEdge, rng);
  const pxBodyFill = samplePixels(maskBody.interior.length ? maskBody.interior : maskBody.filled, maskBody.width, nBodyFill, rng);
  sampleBody(pxBodyEdge, nBodyEdge, true);
  sampleBody(pxBodyFill, nBodyFill, false);

  // Fill any remaining particles with halo dust around the text
  while (k < count) {
    const rx = (rng() - 0.5) * worldW * 1.1;
    const ry = (rng() - 0.5) * (worldW * 0.55);
    positions[k * 3] = rx;
    positions[k * 3 + 1] = ry;
    positions[k * 3 + 2] = (rng() - 0.5) * 0.5;

    const c: RGB = rng() < 0.7 ? colCyan : colOrange;
    writeColor(colors, k, c, 0.75, rng);
    sizes[k] = 0.7 + rng() * 0.5;
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
    id: 'intro',
    count,
    positions: sPos,
    colors: sCol,
    sizes: sSiz,
    width: worldW,
    height: worldW * (CH / CW),
    fit: portrait ? { w: 0.94, h: 0.72 } : { w: 0.88, h: 0.65 },
    orbit: { rx: 1.15, ry: 1.15, rz: 0.45, halo: 1.25 },
  };
}
