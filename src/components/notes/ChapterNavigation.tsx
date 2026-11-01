import type { Chapter } from '../../data/notes/types';

interface ChapterNavigationProps {
  currentChapter: Chapter;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  onSelectChapter: (chapterId: string) => void;
  onBackToOverview: () => void;
}

export function ChapterNavigation({
  previousChapter,
  nextChapter,
  onSelectChapter,
  onBackToOverview,
}: ChapterNavigationProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="chapter-nav-footer">
      <div className="chapter-nav-grid">
        {previousChapter ? (
          <button
            type="button"
            className="chapter-nav-btn prev-btn"
            onClick={() => onSelectChapter(previousChapter.id)}
            aria-label={`Go to previous chapter: Chapter ${previousChapter.number}`}
          >
            <span className="nav-arrow">←</span>
            <div className="nav-text">
              <span className="nav-direction">PREVIOUS CHAPTER</span>
              <span className="nav-chapter-title">
                Chapter {previousChapter.number < 10 ? `0${previousChapter.number}` : previousChapter.number}: {previousChapter.title}
              </span>
            </div>
          </button>
        ) : (
          <div className="chapter-nav-placeholder" />
        )}

        {nextChapter ? (
          <button
            type="button"
            className="chapter-nav-btn next-btn"
            onClick={() => onSelectChapter(nextChapter.id)}
            aria-label={`Go to next chapter: Chapter ${nextChapter.number}`}
          >
            <div className="nav-text">
              <span className="nav-direction">NEXT CHAPTER</span>
              <span className="nav-chapter-title">
                Chapter {nextChapter.number < 10 ? `0${nextChapter.number}` : nextChapter.number}: {nextChapter.title}
              </span>
            </div>
            <span className="nav-arrow">→</span>
          </button>
        ) : (
          <div className="chapter-nav-placeholder" />
        )}
      </div>

      <div className="chapter-nav-auxiliary">
        <button
          type="button"
          className="aux-btn back-overview-btn"
          onClick={onBackToOverview}
        >
          <svg className="aux-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span>All Chapters Library</span>
        </button>

        <button
          type="button"
          className="aux-btn scroll-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top of current notes"
        >
          <svg className="aux-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span>Scroll to Top</span>
        </button>
      </div>
    </footer>
  );
}

