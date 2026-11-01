import { ALL_PRACTICALS } from '../../data/practicals/practicalsData';

interface PracticalNotFoundProps {
  attemptedSlug?: string;
  onReturnToHub: () => void;
  onSelectPractical: (id: string) => void;
}

export function PracticalNotFound({
  attemptedSlug,
  onReturnToHub,
  onSelectPractical,
}: PracticalNotFoundProps) {
  // Suggest 3 popular practicals for quick recovery
  const featured = ALL_PRACTICALS.slice(0, 3);

  return (
    <div className="practical-not-found-view" role="alert">
      <div className="not-found-container">
        <div className="not-found-badge font-mono">
          <span className="nf-pulse-dot" />
          <span>ERR_LAB_NOT_FOUND // 404</span>
        </div>

        <h1 className="not-found-title">Practical Lab Not Found</h1>

        <p className="not-found-desc">
          The requested practical simulation module could not be located in the STUDYVERSE cyber training matrix.
          The lab identifier may be mistyped or does not exist.
        </p>

        {attemptedSlug && (
          <div className="not-found-attempted font-mono">
            <span className="nf-label">Attempted Route:</span>
            <code className="nf-code">/practicals/{attemptedSlug}</code>
          </div>
        )}

        <div className="not-found-actions">
          <button
            type="button"
            className="btn-sim-action btn-return-hub font-mono"
            onClick={onReturnToHub}
          >
            ← Return to Practicals Hub
          </button>
        </div>

        <div className="not-found-suggestions">
          <h4 className="suggestions-title font-mono">Available Training Labs:</h4>
          <div className="suggestions-grid">
            {featured.map((p) => (
              <button
                type="button"
                key={p.id}
                className="suggestion-card"
                onClick={() => onSelectPractical(p.id)}
              >
                <div className="sugg-header">
                  <span className="sugg-ch font-mono">CH {p.chapterNumber.toString().padStart(2, '0')}</span>
                  <span className={`sugg-diff font-mono diff-${p.difficulty.toLowerCase()}`}>
                    {p.difficulty}
                  </span>
                </div>
                <div className="sugg-title">{p.title}</div>
                <div className="sugg-action font-mono">Launch Lab →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
