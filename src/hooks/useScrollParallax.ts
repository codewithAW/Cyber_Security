import { useEffect, useState, type RefObject } from 'react';
import type { ParticleEngine } from '../particles/particleEngine';

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);

export interface ScrollState {
  heroExit: number;
  awaProgress: number;
}

/**
 * Tracks document scroll and updates:
 * 1. ParticleEngine directly for 60fps WebGL rendering.
 * 2. React state throttled via RAF for smooth HTML UI fading.
 */
export function useScrollParallax(engineRef: RefObject<ParticleEngine | null>): ScrollState {
  const [state, setState] = useState<ScrollState>({ heroExit: 0, awaProgress: 0 });

  useEffect(() => {
    let rafId = 0;
    let lastHeroExit = -1;
    let lastAwaProgress = -1;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight || 900;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const maxScroll = Math.max(1, docHeight - vh);

      // Hero exit range: from 10% of viewport down to 105% for a smooth, relaxed exit
      const heroExit = clamp((scrollY - vh * 0.10) / (vh * 0.95), 0, 1);

      // AWA sequence: starts as hero exits, unfolding slowly and deliberately
      const awaStart = vh * 0.90;
      const awaTotal = Math.max(1, maxScroll - awaStart - vh * 0.35);
      const awaProgress = clamp((scrollY - awaStart) / awaTotal, 0, 1);

      const parallaxScroll = scrollY / vh;

      // Always pass directly to Three.js engine for zero-latency WebGL frame updates
      engineRef.current?.setScrollState(heroExit, awaProgress, parallaxScroll);

      // Throttle React state update slightly
      if (Math.abs(heroExit - lastHeroExit) > 0.006 || Math.abs(awaProgress - lastAwaProgress) > 0.006) {
        lastHeroExit = heroExit;
        lastAwaProgress = awaProgress;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setState({ heroExit, awaProgress });
        });
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [engineRef]);

  return state;
}
