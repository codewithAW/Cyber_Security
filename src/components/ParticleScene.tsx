import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { isWebGLAvailable, ParticleEngine } from '../particles/particleEngine';
import { FORMATION_LABELS } from '../particles/shapeGenerators';
import { useCursorInteraction } from '../hooks/useCursorInteraction';
import type { FormationId } from '../particles/types';

interface ParticleSceneProps {
  engineRef: MutableRefObject<ParticleEngine | null>;
  reducedMotion: boolean;
  theme?: 'light' | 'dark';
}

/** Mounts the WebGL engine into a fixed full-screen layer. */
export function ParticleScene({ engineRef, reducedMotion, theme = 'dark' }: ParticleSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!isWebGLAvailable()) {
      setFailed(true);
      return;
    }
    let engine: ParticleEngine;
    try {
      engine = new ParticleEngine(host, {
        reducedMotion,
        theme,
        timing: { hold: 5, transition: 1.4 },
        // update the screen-reader label directly — no React re-render per state
        onFormationChange: (id: FormationId) => {
          if (liveRef.current) liveRef.current.textContent = FORMATION_LABELS[id];
        },
      });
    } catch (err) {
      console.error('StudyVerse: failed to start WebGL scene', err);
      setFailed(true);
      return;
    }
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [engineRef, reducedMotion]);

  // Update theme dynamically when toggled without recreating WebGL context
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTheme(theme);
    }
  }, [engineRef, theme]);

  useCursorInteraction(engineRef);

  return (
    <>
      <div ref={hostRef} className="scene-layer" />
      <p ref={liveRef} className="sr-only" aria-live="polite" />
      {failed && (
        <div className="scene-fallback" role="img" aria-label="StudyVerse">
          <div className="fallback-stars" />
          <p className="fallback-word">WELCOME</p>
          <p className="fallback-note">Interactive 3D view requires WebGL.</p>
        </div>
      )}
    </>
  );
}

