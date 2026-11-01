import type { Chapter } from '../../data/notes/types';

interface AllChaptersViewProps {
  chapters: Chapter[];
  onSelectChapter: (id: string) => void;
  onOpenMasterRevision: () => void;
}

export function AllChaptersView({
  chapters,
  onSelectChapter,
  onOpenMasterRevision,
}: AllChaptersViewProps) {
  return (
    <div className="all-chapters-view">
      <div className="library-hero">
        <div className="library-hero-badge">
          <span className="library-dot" />
          <span>COMPLETE CURRICULUM DIRECTORY</span>
        </div>
        <h2 className="library-title">Explore All 14 Subject Chapters</h2>
        <p className="library-desc">
          Structured university-level notes, official definitions, practical attack scenarios, diagrams, and exam preparation guides.
        </p>

        <div className="library-quick-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenMasterRevision}
          >
            <span>Open Master Revision Table</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      <div className="chapters-grid">
        {chapters.map((ch) => {
          const formattedNum = ch.number < 10 ? `0${ch.number}` : ch.number;
          return (
            <div key={ch.id} className="chapter-grid-card">
              <div className="grid-card-top">
                <span className="grid-card-num">CHAPTER {formattedNum}</span>
                <span className="grid-card-roman">{ch.romanNumeral}</span>
              </div>

              <h3 className="grid-card-title">{ch.title}</h3>
              <p className="grid-card-subtitle">{ch.subtitle}</p>

              <div className="grid-card-meta">
                <span className="grid-meta-pill">⏱ {ch.readTime}</span>
                <span className="grid-meta-pill">📖 {ch.topics.length} Topics</span>
                <span className="grid-meta-pill">⭐ Revision</span>
              </div>

              <div className="grid-card-topics-preview">
                {ch.topics.map((t) => (
                  <span key={t.id} className="topic-preview-pill">
                    {t.number} {t.title}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="grid-card-cta"
                onClick={() => onSelectChapter(ch.id)}
              >
                <span>Read Chapter Notes</span>
                <span className="cta-arrow">→</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

