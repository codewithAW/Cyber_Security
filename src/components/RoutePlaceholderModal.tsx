import { useEffect } from 'react';

export type PlaceholderRoute = 'notes' | 'practicals' | null;

interface RoutePlaceholderModalProps {
  route: PlaceholderRoute;
  onClose: () => void;
}

const ROUTE_DATA: Record<NonNullable<PlaceholderRoute>, { title: string; subtitle: string; path: string; details: string }> = {
  notes: {
    title: 'Complete Notes',
    subtitle: 'High-Yield Knowledge Base',
    path: '/notes',
    details:
      'Curated computer science notes, cybersecurity architecture deep-dives, protocol breakdowns, and exam review sheets are currently in development for StudyVerse.',
  },
  practicals: {
    title: 'Practicals & Labs',
    subtitle: 'Hands-on Security Simulations',
    path: '/practicals',
    details:
      'Interactive WebGL security labs, packet analysis playgrounds, cryptography puzzles, and defensive coding practicals are currently being built.',
  },
};

export function RoutePlaceholderModal({ route, onClose }: RoutePlaceholderModalProps) {
  useEffect(() => {
    if (!route) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [route, onClose]);

  if (!route) return null;
  const data = ROUTE_DATA[route];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-glow-line" aria-hidden="true" />
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>

        <div className="modal-badge">{data.path}</div>
        <h2 id="modal-title" className="modal-title">{data.title}</h2>
        <div className="modal-subtitle">{data.subtitle}</div>

        <p className="modal-description">{data.details}</p>

        <div className="modal-footer">
          <span className="modal-status-pill">
            <span className="status-dot" aria-hidden="true" /> Coming in next release
          </span>
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Back to StudyVerse
          </button>
        </div>
      </div>
    </div>
  );
}
