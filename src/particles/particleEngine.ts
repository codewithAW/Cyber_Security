/**
 * ParticleEngine — framework-agnostic Three.js renderer for StudyVerse.
 *
 * Supports:
 * 1. Hero 5-second automatic state sequence (Book -> Welcome -> Shield -> Cybersecurity -> Loop)
 * 2. Scroll-triggered Phase 2 AWA sequence:
 *    - 0–20%: Particles enter from all sides (left, right, top, bottom, depth)
 *    - 20–40%: Particles converge toward center, density increases
 *    - 40–65%: AWA & CREATED BY form, stabilize, breathing motion, orbiting rings, cursor interactive
 *    - 65–85%: Text dissolves and particles spread outward across screen edges and depth
 *    - 85–100%: Space clears into background starfield; footer appears
 * 3. Cursor physics (spring-damped local ripples) in all formations.
 * 4. Starfield with depth-weighted scroll parallax.
 * 5. Optional audio-reactive synth integration.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { buildFormations, buildAwaFormation, buildEmblemFormation, FORMATION_ORDER } from './shapeGenerators';
import { mulberry32, pickColor, writeColor } from './random';
import { particleFragment, particleVertex } from './shaders';
import { Starfield } from './starfield';
import type { AudioLevelSource, EngineTiming, FormationId, LayoutMode, ShapeData } from './types';

export type QualityTier = 'low' | 'mid' | 'high';

export interface ParticleEngineOptions {
  reducedMotion?: boolean;
  timing?: Partial<EngineTiming>;
  onFormationChange?: (id: FormationId) => void;
  theme?: 'light' | 'dark';
}

const TIER_CONFIG: Record<QualityTier, { particles: number; stars: number; maxDpr: number; bloom: boolean; size: number }> = {
  low: { particles: 9000, stars: 1100, maxDpr: 1.5, bloom: false, size: 40 },
  mid: { particles: 15000, stars: 1800, maxDpr: 1.5, bloom: false, size: 34 },
  high: { particles: 22000, stars: 2600, maxDpr: 2, bloom: true, size: 30 },
};

const ROTATION_AMP: Record<FormationId, number> = {
  book: 0.2,
  welcome: 0.09,
  shield: 0.26,
  cyber: 0.07,
  awa: 0.12,
  intro: 0.08,
  emblem: 0.14,
};

const AMBIENT_FRACTION = 0.16;
const CAMERA_Z = 12;
const FOV = 40;

const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

export function detectTier(): QualityTier {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  if (coarse || window.innerWidth < 768) return 'low';
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || mem <= 4 ? 'mid' : 'high';
}

export function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

export class ParticleEngine {
  private readonly container: HTMLElement;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly group = new THREE.Group();
  private readonly composer: EffectComposer | null = null;
  private readonly bloom: UnrealBloomPass | null = null;
  private readonly stars: Starfield;
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly tier: QualityTier;
  private readonly reducedMotion: boolean;
  private readonly timing: EngineTiming;
  private readonly onFormationChange?: (id: FormationId) => void;

  // particle pool
  private readonly count: number;
  private readonly coreCount: number;
  private readonly pos: Float32Array;
  private readonly col: Float32Array;
  private readonly size: Float32Array;
  private readonly offset: Float32Array;
  private readonly vel: Float32Array;
  private readonly delay: Float32Array;
  private readonly rand: Float32Array;
  private readonly dir: Float32Array;

  // AWA trajectory buffers (all sides entry and radiant dispersion)
  private readonly entryPos: Float32Array;
  private readonly exitPos: Float32Array;
  private readonly cosmicCol: Float32Array;

  // ambient particles
  private readonly ambRing: Int8Array;
  private readonly ambTheta: Float32Array;
  private readonly ambSpeed: Float32Array;
  private readonly ambJit: Float32Array;
  private readonly ambUnit: Float32Array;

  // formations
  private shapes: ShapeData[] = [];
  private shapeScale: number[] = [1, 1, 1, 1];
  private awaShape: ShapeData | null = null;
  private awaScale = 1;
  private emblemShape: ShapeData | null = null;
  private emblemScale = 1;

  private layout: LayoutMode = 'landscape';
  private visW = 1;
  private visH = 1;

  // hero sequencing
  private current = 0;
  private next = 1;
  private phase: 'hold' | 'morph' = 'hold';
  private phaseTime = 0;
  private currentAnnounced: string = '';

  // scroll state
  private heroExit = 0;
  private heroExitSmooth = 0;
  private awaProgress = 0;
  private awaProgressSmooth = 0;
  private scroll = 0;
  private scrollSmooth = 0;

  // input
  private pointerNdc = new THREE.Vector2(10, 10);
  private pointerActive = false;
  private pointerLocal = new THREE.Vector3();
  private pointerPrev = new THREE.Vector3();
  private pointerVel = new THREE.Vector3();
  private pointerStrength = 0;
  private mouseSmooth = new THREE.Vector2();
  private audioSource: AudioLevelSource | null = null;
  private audio = { bass: 0, mid: 0, treble: 0 };

  private readonly raycaster = new THREE.Raycaster();
  private readonly plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private readonly tmp = new THREE.Vector3();
  private time = 0;
  private last = performance.now() / 1000;
  private disposed = false;

  constructor(container: HTMLElement, opts: ParticleEngineOptions = {}) {
    this.container = container;
    this.reducedMotion = !!opts.reducedMotion;
    this.timing = { hold: 5, transition: 1.4, ...opts.timing };
    this.onFormationChange = opts.onFormationChange;
    this.tier = detectTier();
    const cfg = TIER_CONFIG[this.tier];

    const isLight = opts.theme === 'light';
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    if (isLight) {
      this.renderer.setClearColor(new THREE.Color(0xf1 / 255, 0xf5 / 255, 0xf9 / 255), 1);
    } else {
      this.renderer.setClearColor(new THREE.Color().setRGB(2 / 255, 6 / 255, 12 / 255, THREE.LinearSRGBColorSpace), 1);
    }
    const dpr = Math.min(window.devicePixelRatio || 1, cfg.maxDpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
    this.camera.position.set(0, 0, CAMERA_Z);

    this.stars = new Starfield(cfg.stars, dpr, this.reducedMotion);
    if (isLight) {
      this.stars.points.visible = false;
    }
    this.scene.add(this.stars.points);

    // ---- particle pool ----
    this.count = cfg.particles;
    const ambientCount = Math.round(this.count * AMBIENT_FRACTION);
    this.coreCount = this.count - ambientCount;

    this.pos = new Float32Array(this.count * 3);
    this.col = new Float32Array(this.count * 3);
    this.size = new Float32Array(this.count);
    this.offset = new Float32Array(this.count * 3);
    this.vel = new Float32Array(this.count * 3);
    this.delay = new Float32Array(this.count);
    this.rand = new Float32Array(this.count);
    this.dir = new Float32Array(this.count * 3);

    this.entryPos = new Float32Array(this.coreCount * 3);
    this.exitPos = new Float32Array(this.coreCount * 3);
    this.cosmicCol = new Float32Array(this.coreCount * 3);

    this.ambRing = new Int8Array(ambientCount);
    this.ambTheta = new Float32Array(ambientCount);
    this.ambSpeed = new Float32Array(ambientCount);
    this.ambJit = new Float32Array(ambientCount * 2);
    this.ambUnit = new Float32Array(ambientCount * 3);

    const rng = mulberry32(99);
    for (let i = 0; i < this.count; i++) {
      this.rand[i] = rng();
      this.delay[i] = (i / this.coreCount) * 0.65 + rng() * 0.35;
      const th = rng() * Math.PI * 2;
      const ph = Math.acos(2 * rng() - 1);
      this.dir.set([Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph)], i * 3);
    }

    // Precompute cosmic colors for entry trajectories
    for (let i = 0; i < this.coreCount; i++) {
      writeColor(
        this.cosmicCol,
        i,
        pickColor(rng, [['cyan', 4], ['orange', 3.5], ['gold', 1.5], ['blue', 2.5], ['ice', 2]]),
        0.95,
        rng,
      );
    }

    for (let a = 0; a < ambientCount; a++) {
      const i = this.coreCount + a;
      const ring = rng() < 0.62 ? Math.floor(rng() * 3) : -1;
      this.ambRing[a] = ring;
      this.ambTheta[a] = rng() * Math.PI * 2;
      this.ambSpeed[a] = (0.05 + rng() * 0.09) * (ring === 1 ? -1 : 1);
      this.ambJit[a * 2] = (rng() - 0.5) * (ring >= 0 ? 0.07 : 1);
      this.ambJit[a * 2 + 1] = (rng() - 0.5) * (ring >= 0 ? 0.08 : 1);
      let ux = 0, uy = 0, uz = 0, l = 2;
      while (l > 1 || l < 0.15) {
        ux = rng() * 2 - 1;
        uy = rng() * 2 - 1;
        uz = rng() * 2 - 1;
        l = ux * ux + uy * uy + uz * uz;
      }
      this.ambUnit.set([ux, uy, uz], a * 3);
      writeColor(this.col, i, pickColor(rng, [['orange', 4], ['gold', 1], ['blue', 3], ['cyan', 2.5]]), ring >= 0 ? 0.8 : 0.55, rng, 0.25);
      this.size[i] = ring >= 0 ? 0.55 + rng() * 0.7 : 0.4 + rng() * 0.9 + (rng() < 0.04 ? 1.4 : 0);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.geometry.setAttribute('aRand', new THREE.BufferAttribute(this.rand, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uSizeScale: { value: cfg.size },
        uTwinkle: { value: this.reducedMotion ? 0 : 0.6 },
        uOpacity: { value: 1 },
        uIsLight: { value: isLight ? 1.0 : 0.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);
    this.scene.add(this.group);

    if (cfg.bloom) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.95, 0.45, 0.18);
      if (isLight) {
        this.bloom.enabled = false;
      }
      this.composer.addPass(this.bloom);
    }

    this.resize();
    window.addEventListener('resize', this.resize);
    this.renderer.setAnimationLoop(this.frame);
    this.currentAnnounced = FORMATION_ORDER[this.current];
    this.onFormationChange?.(FORMATION_ORDER[this.current]);
  }

  // ---------------------------------------------------------------- public API

  setPointer(ndcX: number, ndcY: number): void {
    this.pointerNdc.set(ndcX, ndcY);
    this.pointerActive = true;
  }

  setPointerActive(active: boolean): void {
    this.pointerActive = active;
  }

  /** Scroll state controlling Hero exit, AWA sequence progression, and star parallax. */
  setScrollState(heroExit: number, awaProgress: number, parallaxScroll: number): void {
    this.heroExit = clamp(heroExit, 0, 1);
    this.awaProgress = clamp(awaProgress, 0, 1);
    this.scroll = Math.max(0, parallaxScroll);
  }

  /** Legacy single-scroll setter. */
  setScroll(progress: number): void {
    this.scroll = Math.max(0, progress);
  }

  setAudioSource(source: AudioLevelSource | null): void {
    this.audioSource = source;
  }

  setTheme(theme: 'light' | 'dark'): void {
    const isLight = theme === 'light';
    if (isLight) {
      this.renderer.setClearColor(new THREE.Color(0xf1 / 255, 0xf5 / 255, 0xf9 / 255), 1);
      this.stars.points.visible = false;
      this.material.blending = THREE.NormalBlending;
      if (this.bloom) this.bloom.enabled = false;
      if (this.material.uniforms.uIsLight) {
        this.material.uniforms.uIsLight.value = 1.0;
      }
    } else {
      this.renderer.setClearColor(new THREE.Color().setRGB(2 / 255, 6 / 255, 12 / 255, THREE.LinearSRGBColorSpace), 1);
      this.stars.points.visible = true;
      this.material.blending = THREE.AdditiveBlending;
      if (this.bloom) this.bloom.enabled = true;
      if (this.material.uniforms.uIsLight) {
        this.material.uniforms.uIsLight.value = 0.0;
      }
    }
    this.material.needsUpdate = true;
  }

  get qualityTier(): QualityTier {
    return this.tier;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.resize);
    this.geometry.dispose();
    this.material.dispose();
    this.stars.dispose();
    this.bloom?.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ---------------------------------------------------------------- internals

  private initTrajectoryBuffers(): void {
    const rng = mulberry32(1337);
    const hw = this.visW * 0.5;
    const hh = this.visH * 0.5;

    for (let i = 0; i < this.coreCount; i++) {
      const i3 = i * 3;
      const r1 = rng();
      const r2 = rng();
      const side = Math.floor(r1 * 6); // 0=left, 1=right, 2=top, 3=bottom, 4=deepZ, 5=frontZ

      let ex = 0, ey = 0, ez = 0;
      if (side === 0) {
        // Left perimeter
        ex = -hw * (1.06 + r2 * 0.45);
        ey = (rng() - 0.5) * hh * 2.2;
        ez = (rng() - 0.5) * 8;
      } else if (side === 1) {
        // Right perimeter
        ex = hw * (1.06 + r2 * 0.45);
        ey = (rng() - 0.5) * hh * 2.2;
        ez = (rng() - 0.5) * 8;
      } else if (side === 2) {
        // Top perimeter
        ex = (rng() - 0.5) * hw * 2.2;
        ey = hh * (1.06 + r2 * 0.45);
        ez = (rng() - 0.5) * 8;
      } else if (side === 3) {
        // Bottom perimeter
        ex = (rng() - 0.5) * hw * 2.2;
        ey = -hh * (1.06 + r2 * 0.45);
        ez = (rng() - 0.5) * 8;
      } else if (side === 4) {
        // Deep background (streaming forward from warp depth)
        ex = (rng() - 0.5) * hw * 2.5;
        ey = (rng() - 0.5) * hh * 2.5;
        ez = -45 - r2 * 25;
      } else {
        // Foreground
        ex = (rng() - 0.5) * hw * 2.2;
        ey = (rng() - 0.5) * hh * 2.2;
        ez = 6 + r2 * 6;
      }

      this.entryPos[i3] = ex;
      this.entryPos[i3 + 1] = ey;
      this.entryPos[i3 + 2] = ez;

      // Radiant exit dispersion positions (travelling outward past viewport borders)
      const angle = rng() * Math.PI * 2;
      const dist = 1.35 + rng() * 1.5;
      this.exitPos[i3] = Math.cos(angle) * hw * dist;
      this.exitPos[i3 + 1] = Math.sin(angle) * hh * dist;
      this.exitPos[i3 + 2] = (rng() - 0.5) * 22;
    }
  }

  private resize = (): void => {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.composer?.setSize(w, h);
    this.bloom?.resolution.set(w / 2, h / 2);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.visH = 2 * CAMERA_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    this.visW = this.visH * this.camera.aspect;

    const layout: LayoutMode = w / h < 0.85 ? 'portrait' : 'landscape';
    if (layout !== this.layout || this.shapes.length === 0) {
      this.layout = layout;
      this.shapes = buildFormations(this.coreCount, layout);
      this.awaShape = buildAwaFormation(this.coreCount, layout);
      this.emblemShape = buildEmblemFormation(this.coreCount, layout);
    }

    this.shapeScale = this.shapes.map((s) =>
      Math.min((this.visW * s.fit.w) / s.width, (this.visH * s.fit.h) / s.height),
    );

    if (this.awaShape) {
      this.awaScale = Math.min(
        (this.visW * this.awaShape.fit.w) / this.awaShape.width,
        (this.visH * this.awaShape.fit.h) / this.awaShape.height,
      );
    }

    if (this.emblemShape) {
      this.emblemScale = Math.min(
        (this.visW * this.emblemShape.fit.w) / this.emblemShape.width,
        (this.visH * this.emblemShape.fit.h) / this.emblemShape.height,
      );
    }

    this.initTrajectoryBuffers();
  };

  private frame = (): void => {
    const now = performance.now() / 1000;
    const dt = Math.min(0.05, Math.max(0.001, now - this.last));
    this.last = now;
    this.time += dt;
    const t = this.time;
    const kdt = dt * 60;

    // -- scroll smoothing with clean snap to zero when target is zero
    if (this.heroExit === 0 && this.heroExitSmooth < 0.005) {
      this.heroExitSmooth = 0;
    } else {
      this.heroExitSmooth = lerp(this.heroExitSmooth, this.heroExit, 0.12 * kdt);
    }

    if (this.awaProgress === 0 && this.awaProgressSmooth < 0.005) {
      this.awaProgressSmooth = 0;
    } else {
      // Slower, smooth and stately cinematic scroll interpolation
      this.awaProgressSmooth = lerp(this.awaProgressSmooth, this.awaProgress, 0.075 * kdt);
    }
    this.scrollSmooth = lerp(this.scrollSmooth, this.scroll, Math.min(1, 0.10 * kdt));

    const inAwa = this.awaProgressSmooth > 0.003;

    // -- hero 5s state cycling continues independently so it never freezes mid-morph
    this.phaseTime += dt;
    if (this.phase === 'hold' && this.phaseTime >= this.timing.hold) {
      this.phase = 'morph';
      this.phaseTime = 0;
      this.next = (this.current + 1) % this.shapes.length;
      if (!inAwa) {
        this.currentAnnounced = FORMATION_ORDER[this.next];
        this.onFormationChange?.(FORMATION_ORDER[this.next]);
      }
    } else if (this.phase === 'morph' && this.phaseTime >= this.timing.transition) {
      this.current = this.next;
      this.phase = 'hold';
      this.phaseTime = 0;
    }

    // Screen reader announcement for AWA & Cyber Emblem
    if (this.awaProgressSmooth >= 0.22 && this.awaProgressSmooth < 0.48) {
      if (this.currentAnnounced !== 'awa') {
        this.currentAnnounced = 'awa';
        this.onFormationChange?.('awa');
      }
    } else if (this.awaProgressSmooth >= 0.48) {
      if (this.currentAnnounced !== 'emblem') {
        this.currentAnnounced = 'emblem';
        this.onFormationChange?.('emblem');
      }
    } else if (!inAwa) {
      if (this.currentAnnounced === 'awa' || this.currentAnnounced === 'emblem') {
        this.currentAnnounced = FORMATION_ORDER[this.current];
        this.onFormationChange?.(FORMATION_ORDER[this.current]);
      }
    }

    const morphing = this.phase === 'morph';
    const T = morphing ? this.phaseTime / this.timing.transition : 0;
    const eT = easeInOutCubic(T);
    const src = this.shapes[this.current];
    const dst = this.shapes[morphing ? this.next : this.current];
    const sS = this.shapeScale[this.current];
    const sD = this.shapeScale[morphing ? this.next : this.current];

    // -- audio
    if (this.audioSource) {
      const l = this.audioSource();
      this.audio.bass = lerp(this.audio.bass, l.bass, 0.3);
      this.audio.mid = lerp(this.audio.mid, l.mid, 0.2);
      this.audio.treble = lerp(this.audio.treble, l.treble, 0.2);
    } else {
      this.audio.bass *= 0.9;
      this.audio.mid *= 0.9;
      this.audio.treble *= 0.9;
    }

    // -- smoothed inputs + group transform
    const mx = this.pointerActive ? this.pointerNdc.x : 0;
    const my = this.pointerActive ? this.pointerNdc.y : 0;
    this.mouseSmooth.x = lerp(this.mouseSmooth.x, mx, 0.04 * kdt);
    this.mouseSmooth.y = lerp(this.mouseSmooth.y, my, 0.04 * kdt);

    const isDesktop = this.layout === 'landscape' && (this.container.clientWidth || window.innerWidth) >= 860;
    const targetX = inAwa ? 0 : (isDesktop ? this.visW * 0.20 : 0);
    this.group.position.x = lerp(this.group.position.x, targetX, 0.12 * kdt);

    const motion = this.reducedMotion ? 0.3 : 1;
    const currentRotAmp = inAwa
      ? (this.awaProgressSmooth > 0.48 ? ROTATION_AMP.emblem : ROTATION_AMP.awa)
      : lerp(ROTATION_AMP[src.id], ROTATION_AMP[dst.id], eT);
    const rotAmp = currentRotAmp * motion;

    this.group.rotation.y = Math.sin(t * 0.32) * rotAmp + this.mouseSmooth.x * 0.1 * motion;
    this.group.rotation.x = Math.sin(t * 0.21) * 0.05 * motion - this.mouseSmooth.y * 0.06 * motion;

    const P_awa = this.awaProgressSmooth;
    const awa = this.awaShape;
    const sAwa = this.awaScale;
    const emblem = this.emblemShape;
    const sEmblem = this.emblemScale;

    // Position and opacity handling between Hero and AWA / Emblem
    let globalOpacity = 1;
    const baseHeroY = !inAwa && this.layout === 'portrait' ? -this.visH * 0.12 : this.visH * 0.025;
    let heroY = baseHeroY;

    if (inAwa) {
      heroY = this.visH * 0.025;
      globalOpacity = 1;
    } else {
      // In Hero mode: glides up and fades gently if scrolling down past 15%
      if (this.heroExitSmooth > 0) {
        heroY = baseHeroY - this.heroExitSmooth * this.visH * 0.28;
        globalOpacity = clamp(1 - this.heroExitSmooth * 1.25, 0, 1);
      } else {
        heroY = baseHeroY;
        globalOpacity = 1;
      }
    }

    this.group.position.y = heroY;
    this.group.updateMatrixWorld();

    this.material.uniforms.uOpacity.value = globalOpacity;
    this.material.uniforms.uTime.value = t;
    this.material.uniforms.uSizeScale.value = TIER_CONFIG[this.tier].size * (1 + this.audio.bass * 0.35);
    this.material.uniforms.uTwinkle.value = this.reducedMotion ? 0 : 0.6 + this.audio.treble * 0.4;

    // -- pointer in group-local space
    this.pointerStrength = lerp(this.pointerStrength, this.pointerActive ? 1 : 0, 0.1 * kdt);
    if (this.pointerActive) {
      this.raycaster.setFromCamera(this.pointerNdc, this.camera);
      if (this.raycaster.ray.intersectPlane(this.plane, this.tmp)) {
        this.group.worldToLocal(this.tmp);
        this.pointerPrev.copy(this.pointerLocal);
        this.pointerLocal.copy(this.tmp);
        this.pointerVel.subVectors(this.pointerLocal, this.pointerPrev).divideScalar(dt).clampLength(0, 25);
      }
    } else {
      this.pointerVel.multiplyScalar(0.9);
    }

    const pos = this.pos, off = this.offset, vel = this.vel, dir = this.dir, rand = this.rand;
    const turb = (this.reducedMotion ? 0.25 : 1) * this.visH * 0.035;
    const jitterAmp = this.reducedMotion ? 0.004 : 0.014;

    // =========================================================================
    // CORE PARTICLES UPDATE
    // =========================================================================
    for (let i = 0; i < this.coreCount; i++) {
      const i3 = i * 3;
      const r = rand[i];
      const ph = r * 100;

      // 1. Calculate active Hero coordinates
      let hx = 0, hy = 0, hz = 0;
      let hp = morphing ? (T - this.delay[i] * 0.4) / 0.6 : 0;
      hp = clamp(hp, 0, 1);
      const he = easeInOutCubic(hp);
      hx = lerp(src.positions[i3] * sS, dst.positions[i3] * sD, he);
      hy = lerp(src.positions[i3 + 1] * sS, dst.positions[i3 + 1] * sD, he);
      hz = lerp(src.positions[i3 + 2] * sS, dst.positions[i3 + 2] * sD, he);
      if (hp > 0 && hp < 1) {
        const a = Math.sin(hp * Math.PI) * turb * (0.45 + r);
        const sw = Math.sin(t * 2.1 + r * 40);
        hx += dir[i3] * a + sw * a * 0.3;
        hy += dir[i3 + 1] * a * 0.7 + Math.cos(t * 1.7 + r * 30) * a * 0.25;
        hz += (dir[i3 + 2] * 0.6 + 0.5) * a * 1.2;
      }

      let fx = hx, fy = hy, fz = hz;
      let fcR = lerp(src.colors[i3], dst.colors[i3], he);
      let fcG = lerp(src.colors[i3 + 1], dst.colors[i3 + 1], he);
      let fcB = lerp(src.colors[i3 + 2], dst.colors[i3 + 2], he);
      let fSize = lerp(src.sizes[i], dst.sizes[i], he);

      // 2. Check if we are in AWA / Emblem Scroll Sequence
      if (inAwa && awa) {
        const awX = awa.positions[i3] * sAwa;
        const awY = awa.positions[i3 + 1] * sAwa;
        const awZ = awa.positions[i3 + 2] * sAwa;

        const emX = emblem ? emblem.positions[i3] * sEmblem : awX;
        const emY = emblem ? emblem.positions[i3 + 1] * sEmblem : awY;
        const emZ = emblem ? emblem.positions[i3 + 2] * sEmblem : awZ;

        const enX = this.entryPos[i3];
        const enY = this.entryPos[i3 + 1];
        const enZ = this.entryPos[i3 + 2];

        if (P_awa <= 0.22) {
          // STAGE 1: Entering from all sides & Converging (0 to 22%)
          const u = P_awa / 0.22;
          const pDelay = this.delay[i] * 0.15;
          const ti = clamp((u - pDelay) / (1 - pDelay), 0, 1);
          // Sine ease-out: particles stream across the screen immediately and decelerate as they converge
          const ei = Math.sin(ti * Math.PI * 0.5);

          fx = lerp(enX, awX, ei);
          fy = lerp(enY, awY, ei);
          fz = lerp(enZ, awZ, ei);

          // Swirling vortex / incoming stream curvature
          if (ti > 0 && ti < 1) {
            const swirl = Math.sin(ti * Math.PI) * this.visH * 0.045 * (0.3 + r * 0.7);
            fx += Math.sin(t * 1.8 + r * 30) * swirl;
            fy += Math.cos(t * 1.8 + r * 30) * swirl;
            fz += Math.sin(t * 1.2 + r * 15) * swirl * 1.3;
          }

          // Color blend from entry cosmic colors to AWA palette
          fcR = lerp(this.cosmicCol[i3], awa.colors[i3], ti);
          fcG = lerp(this.cosmicCol[i3 + 1], awa.colors[i3 + 1], ti);
          fcB = lerp(this.cosmicCol[i3 + 2], awa.colors[i3 + 2], ti);
          fSize = lerp(1.1 + r * 0.65, awa.sizes[i], ti);

        } else if (P_awa <= 0.46) {
          // STAGE 2: AWA & CREATED BY Formed & Stabilized (22% to 46%)
          fx = awX;
          fy = awY;
          fz = awZ;

          // Gentle breathing and floating motion
          fx += Math.sin(t * 1.1 + ph) * 0.012;
          fy += Math.cos(t * 1.2 + ph) * 0.012;
          fz += Math.sin(t * 0.8 + ph * 1.2) * 0.022;

          fcR = awa.colors[i3];
          fcG = awa.colors[i3 + 1];
          fcB = awa.colors[i3 + 2];
          fSize = awa.sizes[i];

        } else {
          // STAGE 3: Futuristic StudyVerse Cyber Emblem & Holographic Logo (46% to 100%)
          // Between 46% and 58%: Morph smoothly from AWA to Cyber Emblem
          // From 58% to 100%: Emblem is formed, fully stable, razor-sharp, gyro-rotating & buttons active at bottom of page
          if (P_awa < 0.58 && emblem) {
            const u = (P_awa - 0.46) / 0.12;
            const pDelay = this.delay[i] * 0.25;
            const ti = clamp((u - pDelay) / (1 - pDelay), 0, 1);
            const ei = easeInOutCubic(ti);

            fx = lerp(awX, emX, ei);
            fy = lerp(awY, emY, ei);
            fz = lerp(awZ, emZ, ei);

            if (ti > 0 && ti < 1) {
              const transDrift = Math.sin(ti * Math.PI) * this.visH * 0.025 * (0.4 + r);
              fx += Math.sin(t * 2.2 + r * 20) * transDrift;
              fy += Math.cos(t * 2.0 + r * 20) * transDrift * 0.6;
              fz += Math.sin(t * 1.5 + r * 10) * transDrift * 1.2;
            }

            fcR = lerp(awa.colors[i3], emblem.colors[i3], ti);
            fcG = lerp(awa.colors[i3 + 1], emblem.colors[i3 + 1], ti);
            fcB = lerp(awa.colors[i3 + 2], emblem.colors[i3 + 2], ti);
            fSize = lerp(awa.sizes[i], emblem.sizes[i], ti);
          } else {
            // Fully formed Cyber Emblem permanently locked as the bottom of the page
            fx = emX;
            fy = emY;
            fz = emZ;

            // Subtle gyroscopic particle floating & breathing
            fx += Math.sin(t * 1.1 + ph) * 0.012;
            fy += Math.cos(t * 1.2 + ph) * 0.012;
            fz += Math.sin(t * 0.9 + ph * 1.2) * 0.02;

            if (emblem) {
              fcR = emblem.colors[i3];
              fcG = emblem.colors[i3 + 1];
              fcB = emblem.colors[i3 + 2];
              fSize = emblem.sizes[i];
            }
          }
        }
      }
      // When !inAwa, fx/fy/fz remain 100% pure hero coordinates! No deformation!

      // Small ambient jitter
      fx += Math.sin(t * (0.7 + r) + ph) * jitterAmp;
      fy += Math.cos(t * (0.8 + r * 0.7) + ph) * jitterAmp;
      fz += Math.sin(t * 0.6 + ph * 1.3) * jitterAmp * 2;

      pos[i3] = fx;
      pos[i3 + 1] = fy;
      pos[i3 + 2] = fz;

      this.col[i3] = fcR;
      this.col[i3 + 1] = fcG;
      this.col[i3 + 2] = fcB;
      this.size[i] = fSize;
    }

    // =========================================================================
    // AMBIENT ORBITING PARTICLES
    // =========================================================================
    const inEmblemFormed = inAwa && P_awa >= 0.52 && emblem;
    const inAwaFormed = inAwa && P_awa >= 0.20 && P_awa < 0.52 && awa;

    let hw = 1, hh = 1, orbCfg = dst.orbit;
    if (inEmblemFormed && emblem) {
      hw = (emblem.width * sEmblem) / 2;
      hh = (emblem.height * sEmblem) / 2;
      orbCfg = emblem.orbit;
    } else if (inAwaFormed && awa) {
      hw = (awa.width * sAwa) / 2;
      hh = (awa.height * sAwa) / 2;
      orbCfg = awa.orbit;
    } else {
      hw = lerp((src.width * sS) / 2, (dst.width * sD) / 2, eT);
      hh = lerp((src.height * sS) / 2, (dst.height * sD) / 2, eT);
      orbCfg = dst.orbit;
    }

    const rx = orbCfg.rx * hw;
    const ry = orbCfg.ry * hh;
    const rz = orbCfg.rz * hw;
    const hx = orbCfg.halo * hw * 1.25;
    const hy = orbCfg.halo * hh * 1.6;

    const ringRot = [-0.07, 0.05, 0.11];
    const orbitSpeed = this.reducedMotion ? 0.3 : 1;

    for (let a = 0, i = this.coreCount; i < this.count; a++, i++) {
      const i3 = i * 3;
      const ring = this.ambRing[a];
      if (ring >= 0) {
        this.ambTheta[a] += this.ambSpeed[a] * dt * orbitSpeed * (1 + this.audio.mid);
        const th = this.ambTheta[a];
        const m = 1 + ring * 0.13 + this.ambJit[a * 2];
        const ex = Math.cos(th) * rx * m;
        const ey = Math.sin(th) * ry * m + this.ambJit[a * 2 + 1] * ry;
        const rr = ringRot[ring];
        pos[i3] = ex * Math.cos(rr) - ey * Math.sin(rr);
        pos[i3 + 1] = ex * Math.sin(rr) + ey * Math.cos(rr);
        pos[i3 + 2] = Math.sin(th) * rz * m;
      } else {
        const u = this.ambUnit;
        const ph = rand[i] * 50;
        pos[i3] = u[a * 3] * hx + Math.sin(t * 0.15 + ph) * 0.25;
        pos[i3 + 1] = u[a * 3 + 1] * hy + Math.cos(t * 0.12 + ph) * 0.2;
        pos[i3 + 2] = u[a * 3 + 2] * 2.2 + Math.sin(t * 0.1 + ph) * 0.3;
      }
    }

    // =========================================================================
    // CURSOR PHYSICS (Spring-damped offsets) + AUDIO PUSH
    // =========================================================================
    const R = this.visH * 0.12;
    const R2 = R * R;
    const ps = this.pointerStrength;
    const strength = 0.03 * ps * (this.reducedMotion ? 0.4 : 1);
    const plx = this.pointerLocal.x, ply = this.pointerLocal.y;
    const pvx = this.pointerVel.x, pvy = this.pointerVel.y;
    const spring = 0.05 * kdt;
    const damp = Math.pow(0.86, kdt);
    const bassPush = this.audio.bass * 0.0035 * kdt;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      let vx = vel[i3], vy = vel[i3 + 1], vz = vel[i3 + 2];
      const ox = off[i3], oy = off[i3 + 1], oz = off[i3 + 2];

      if (ps > 0.01) {
        const dx = pos[i3] + ox - plx;
        const dy = pos[i3 + 1] + oy - ply;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) + 1e-4;
          let f = 1 - d / R;
          f = f * f * strength * kdt;
          const nx = dx / d, ny = dy / d;
          vx += nx * f - ny * f * 0.45 + pvx * f * 0.012;
          vy += ny * f + nx * f * 0.45 + pvy * f * 0.012;
          vz += f * (0.4 + rand[i]) * 0.9;
        }
      }
      if (bassPush > 0.0001 && i < this.coreCount) {
        vx += dir[i3] * bassPush;
        vy += dir[i3 + 1] * bassPush;
        vz += dir[i3 + 2] * bassPush;
      }

      vx = (vx - ox * spring) * damp;
      vy = (vy - oy * spring) * damp;
      vz = (vz - oz * spring) * damp;
      vel[i3] = vx; vel[i3 + 1] = vy; vel[i3 + 2] = vz;
      off[i3] = ox + vx * kdt; off[i3 + 1] = oy + vy * kdt; off[i3 + 2] = oz + vz * kdt;

      pos[i3] += off[i3];
      pos[i3 + 1] += off[i3 + 1];
      pos[i3 + 2] += off[i3 + 2];
    }

    (this.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.attributes.aSize as THREE.BufferAttribute).needsUpdate = true;

    // -- background stars update
    this.stars.update(t, this.scrollSmooth, this.mouseSmooth.x * motion, this.mouseSmooth.y * motion);

    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  };
}
