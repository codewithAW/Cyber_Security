import type { PracticalExercise, PracticalProgressRecord } from '../../data/practicals/types';

interface PracticalCardProps {
  practical: PracticalExercise;
  progressRecord?: PracticalProgressRecord;
  onSelect: (practicalId: string) => void;
}

export function PracticalCard({
  practical,
  progressRecord,
  onSelect,
}: PracticalCardProps) {
  const status = progressRecord?.status || 'not-started';

  const difficultyClass =
    practical.difficulty === 'Beginner'
      ? 'diff-beginner'
      : practical.difficulty === 'Intermediate'
      ? 'diff-intermediate'
      : 'diff-advanced';

  return (
    <div className={`practical-card-item ${status === 'completed' ? 'is-completed' : ''}`}>
      <div className="card-top-bar">
        <span className="card-chapter font-mono">
          CH {practical.chapterNumber.toString().padStart(2, '0')} · {practical.chapterTitle}
        </span>
        <span className={`card-difficulty ${difficultyClass}`}>
          {practical.difficulty}
        </span>
      </div>

      <div className="card-main-info">
        <div className="card-icon-title">
          <span className="card-badge-symbol">{practical.badgeAwarded.icon}</span>
          <h3 className="card-title">{practical.title}</h3>
        </div>
        <p className="card-summary">{practical.summary}</p>
      </div>

      <div className="card-bottom-bar">
        <div className="card-meta">
          <span className="meta-time font-mono">⏱️ {practical.estimatedMinutes} mins</span>
          <span className={`meta-status status-${status}`}>
            {status === 'completed'
              ? '✅ Completed'
              : status === 'in-progress'
              ? '⏳ In Progress'
              : '⭕ Not Started'}
          </span>
        </div>

        <button
          type="button"
          className="btn-start-practical"
          onClick={() => onSelect(practical.id)}
        >
          {status === 'completed' ? 'Revisit Lab →' : 'Start Lab →'}
        </button>
      </div>
    </div>
  );
}

