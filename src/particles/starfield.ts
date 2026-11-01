/** Scroll- and cursor-reactive 3D starfield rendered as a single Points object. */
import * as THREE from 'three';
import { mulberry32 } from './random';
import { starFragment, starVertex } from './shaders';

export class Starfield {
  readonly points: THREE.Points;
  private readonly material: THREE.ShaderMaterial;
  private readonly geometry: THREE.BufferGeometry;

  constructor(count: number, pixelRatio: number, reducedMotion: boolean) {
    const rng = mulberry32(7);
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const z = -90 + rng() * 96;
      const spread = 0.55 * (12 - z); // widen with distance to fill the frustum
      pos[i * 3] = (rng() - 0.5) * spread * 2.2;
      pos[i * 3 + 1] = (rng() - 0.5) * spread * 1.6;
      pos[i * 3 + 2] = z;
      const r = rng();
      const c: [number, number, number] =
        r < 0.07 ? [1.0, 0.62, 0.25] : r < 0.25 ? [0.35, 0.65, 1.0] : [0.78, 0.86, 1.0];
      const b = 0.35 + rng() * 0.65;
      col.set([c[0] * b, c[1] * b, c[2] * b], i * 3);
      size[i] = rng() < 0.03 ? 2.2 + rng() * 1.5 : 0.4 + rng() * 1.1;
      rand[i] = rng();
    }
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    this.geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new THREE.Vector2() },
        uPixelRatio: { value: pixelRatio },
        uDrift: { value: reducedMotion ? 0.15 : 0.9 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  update(time: number, scroll: number, mouseX: number, mouseY: number): void {
    const u = this.material.uniforms;
    u.uTime.value = time;
    u.uScroll.value = scroll;
    (u.uMouse.value as THREE.Vector2).set(mouseX, mouseY);
  }

  setPixelRatio(pr: number): void {
    this.material.uniforms.uPixelRatio.value = pr;
  }

  dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}

