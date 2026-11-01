import React from 'react';

interface HeroContentProps {
  onNavigateNotes: (e: React.MouseEvent) => void;
  onNavigatePracticals: (e: React.MouseEvent) => void;
  heroExit: number;
}

export function HeroContent({ onNavigateNotes, onNavigatePracticals, heroExit }: HeroContentProps) {
  // Fade out and translate gently as user scrolls down
  const opacity = Math.max(0, Math.min(1, 1 - heroExit * 1.5));
  const translateY = -heroExit * 40;
  const pointerEvents = heroExit > 0.7 ? 'none' : 'auto';

  return (
    <div
      className="hero-text-block"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents,
      }}
    >
      {/* 1. Small introductory label */}
      <div className="hero-eyebrow">
        <span className="hero-eyebrow-dot" aria-hidden="true" />
        <span className="hero-eyebrow-text">LEARN · EXPLORE · PRACTICE</span>
      </div>

      {/* 2 & 3. Main headline with highlighted 'beyond boundaries.' */}
      <h1 className="hero-headline">
        <span className="hero-headline-row anim-row-1">
          <span className="hero-word">Learn</span>{' '}
          <span className="hero-word">without</span>{' '}
          <span className="hero-word">limits.</span>
        </span>
        <span className="hero-headline-row anim-row-2">
          <span className="hero-word">Build</span>{' '}
          <span className="hero-word hero-word-accent">beyond</span>{' '}
          <span className="hero-word hero-word-accent">boundaries.</span>
        </span>
      </h1>

      {/* 4. Supporting description */}
      <p className="hero-description anim-row-3">
        Your complete learning space for computer science notes, practical exercises, and cybersecurity knowledge.
      </p>

      {/* 5. Two functional navigation buttons */}
      <div className="hero-actions anim-row-4">
        <a
          href="#notes"
          className="btn btn-primary"
          onClick={onNavigateNotes}
          aria-label="Explore Complete Notes"
        >
          <span>Explore Notes</span>
          <span className="btn-arrow" aria-hidden="true">→</span>
        </a>

        <a
          href="#practicals"
          className="btn btn-secondary"
          onClick={onNavigatePracticals}
          aria-label="Explore Practicals"
        >
          <span>Explore Practicals</span>
          <span className="btn-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

