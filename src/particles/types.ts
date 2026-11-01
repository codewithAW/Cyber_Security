/** Shared types for the particle-morphing system. */

export type FormationId = 'book' | 'welcome' | 'shield' | 'cyber' | 'awa' | 'intro' | 'emblem';

export type LayoutMode = 'landscape' | 'portrait';

export interface OrbitConfig {
  /** Ring radius on X as a multiple of the shape half-width. */
  rx: number;
  /** Ring radius on Y as a multiple of the shape half-height. */
  ry: number;
  /** Depth amplitude as a multiple of the shape half-width. */
  rz: number;
  /** Halo (dust cloud) size multiplier. */
  halo: number;
}

/**
 * A point-cloud formation. All arrays have exactly `count` entries
 * (positions/colors are xyz/rgb triplets) so formations can be morphed 1:1.
 */
export interface ShapeData {
  id: FormationId;
  count: number;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  /** Bounds of the formation in design units (before viewport fitting). */
  width: number;
  height: number;
  /** Fraction of the visible viewport the formation may occupy. */
  fit: { w: number; h: number };
  orbit: OrbitConfig;
}

export interface EngineTiming {
  /** Seconds a formation is held before morphing. */
  hold: number;
  /** Seconds a morph takes. */
  transition: number;
}

export interface AudioLevels {
  bass: number;
  mid: number;
  treble: number;
}

export type AudioLevelSource = () => AudioLevels;

