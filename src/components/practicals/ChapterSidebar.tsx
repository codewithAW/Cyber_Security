import type { UserPracticalsState } from '../../data/practicals/types';
import { ALL_PRACTICALS } from '../../data/practicals/practicalsData';

interface ChapterSidebarProps {
  selectedChapter: number | 'all';
  onSelectChapter: (chapter: number | 'all') => void;
  userState: UserPracticalsState;
}

export function ChapterSidebar({
  selectedChapter,
  onSelectChapter,
  userState,
}: ChapterSidebarProps) {
  // Aggregate data by chapter 1 to 14
  const chapters = Array.from({ length: 14 }, (_, i) => {
    const chNum = i + 1;
    const chPracticals = ALL_PRACTICALS.filter((p) => p.chapterNumber === chNum);
    const chTitle = chPracticals[0]?.chapterTitle || `Chapter ${chNum}`;

    const completedInCh = chPracticals.filter(
      (p) => userState.records[p.id]?.status === 'completed'
    ).length;

    return {
      number: chNum,
      title: chTitle,
      count: chPracticals.length,
      completedCount: completedInCh,
      isFullyCompleted: chPracticals.length > 0 && completedInCh === chPracticals.length,
    };
  });

  const totalCompleted = Object.values(userState.records).filter(
    (r) => r.status === 'completed'
  ).length;

  return (
    <aside className="practicals-sidebar" aria-label="Cybersecurity Chapters Navigation">
      <div className="sidebar-header">
        <span className="sidebar-title font-mono">CHAPTER LABS</span>
        <span className="sidebar-total-badge font-mono">
          {totalCompleted}/{ALL_PRACTICALS.length} Done
        </span>
      </div>

      <nav className="sidebar-chapters-list">
        {/* All Chapters Entry */}
        <button
          type="button"
          className={`sidebar-ch-item ${selectedChapter === 'all' ? 'is-active-ch' : ''}`}
          onClick={() => onSelectChapter('all')}
        >
          <div className="ch-left-info">
            <span className="ch-icon">📚</span>
            <span className="ch-label">All Chapters</span>
          </div>
          <span className="ch-count font-mono">{ALL_PRACTICALS.length} Labs</span>
        </button>

        {/* 14 Individual Chapters */}
        {chapters.map((ch) => {
          const isSelected = selectedChapter === ch.number;

          return (
            <button
              type="button"
              key={ch.number}
              className={`sidebar-ch-item ${isSelected ? 'is-active-ch' : ''} ${
                ch.isFullyCompleted ? 'is-completed-ch' : ''
              }`}
              onClick={() => onSelectChapter(ch.number)}
            >
              <div className="ch-left-info">
                <span className="ch-num font-mono">
                  {ch.number.toString().padStart(2, '0')}
                </span>
                <span className="ch-title">{ch.title}</span>
              </div>

              <div className="ch-right-meta">
                <span className="ch-count font-mono">
                  {ch.count} {ch.count === 1 ? 'Lab' : 'Labs'}
                </span>
                {ch.completedCount > 0 && (
                  <span
                    className={`ch-status-indicator font-mono ${
                      ch.isFullyCompleted ? 'text-green' : 'text-amber'
                    }`}
                  >
                    {ch.isFullyCompleted ? '✓' : `${ch.completedCount}/${ch.count}`}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

