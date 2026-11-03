import React from 'react';

interface ScrollActionsOverlayProps {
  onNavigateNotes: (e: React.MouseEvent) => void;
  onNavigatePracticals: (e: React.MouseEvent) => void;
  awaProgress: number;
}

/**
 * Two functional navigation buttons that appear beneath the particle-formed
 * AWA / Introduction content when the text has formed and stabilized.
 * Matches Stage 8 of the visual specification.
 */
export function ScrollActionsOverlay({
  onNavigateNotes,
  onNavigatePracticals,
  awaProgress,
}: ScrollActionsOverlayProps) {
  // Visible during the stabilized formation stages:
  // Starts fading in around 0.32, fully visible from 0.48 all the way through 1.0 (bottom of the page)
  let opacity = 0;
  let translateY = 15;

  if (awaProgress >= 0.32) {
    if (awaProgress < 0.48) {
      // Fade in smoothly as text finishes stabilizing
      const t = (awaProgress - 0.32) / 0.16;
      opacity = t;
      translateY = 15 * (1 - t);
    } else {
      // Fully formed and stable all the way to the bottom of the page
      opacity = 1;
      translateY = 0;
    }
  }

  const isInteractive = opacity > 0.2;

  return (
    <div
      className="scroll-actions-overlay"
      style={{
        opacity,
        transform: `translate(-50%, ${translateY}px)`,
        pointerEvents: isInteractive ? 'auto' : 'none',
      }}
      aria-hidden={!isInteractive}
    >
      <a
        href="#notes"
        className="btn btn-primary"
        onClick={onNavigateNotes}
        tabIndex={isInteractive ? 0 : -1}
        aria-label="Explore Complete Notes"
      >
        <span>Explore Notes</span>
        <span className="btn-arrow" aria-hidden="true">→</span>
      </a>

      <a
        href="#practicals"
        className="btn btn-secondary"
        onClick={onNavigatePracticals}
        tabIndex={isInteractive ? 0 : -1}
        aria-label="Explore Practicals"
      >
        <span>Explore Practicals</span>
        <span className="btn-arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

