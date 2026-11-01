import { useEffect, type RefObject } from 'react';
import type { ParticleEngine } from '../particles/particleEngine';

/**
 * Feeds mouse / touch positions (as NDC) to the engine. Listeners live on
 * the window so the header and overlays never block the particle physics,
 * and nothing here triggers React re-renders.
 */
export function useCursorInteraction(engineRef: RefObject<ParticleEngine | null>): void {
  useEffect(() => {
    const toNdc = (x: number, y: number) => {
      engineRef.current?.setPointer((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    };
    const onPointer = (e: PointerEvent) => toNdc(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) toNdc(t.clientX, t.clientY);
    };
    const onLeave = () => engineRef.current?.setPointerActive(false);
    const onOut = (e: PointerEvent) => { if (!e.relatedTarget) onLeave(); };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onLeave, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onLeave);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('blur', onLeave);
    };
  }, [engineRef]);
}

