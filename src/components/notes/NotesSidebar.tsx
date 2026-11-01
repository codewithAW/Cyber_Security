import type { Chapter } from '../../data/notes/types';

interface NotesSidebarProps {
  chapters: Chapter[];
  activeChapterId: string | null;
  activeView: 'chapter' | 'all' | 'master-table' | 'cheat-sheet';
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (id: string) => void;
  onSelectView: (view: 'all' | 'master-table' | 'cheat-sheet') => void;
}

export function NotesSidebar({
  chapters,
  activeChapterId,
  activeView,
  isOpen,
  onClose,
  onSelectChapter,
  onSelectView,
}: NotesSidebarProps) {
  const handleChapterClick = (id: string) => {
    onSelectChapter(id);
    onClose();
  };

  const handleViewClick = (view: 'all' | 'master-table' | 'cheat-sheet') => {
    onSelectView(view);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`notes-sidebar-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`notes-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Course Chapters">
        <div className="sidebar-header">
          <div className="sidebar-title-row">
            <span className="sidebar-badge">CURRICULUM INDEX</span>
            <span className="sidebar-chapter-count">14 Chapters</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* SPECIAL STUDY MODES */}
        <div className="sidebar-special-views">
          <button
            type="button"
            className={`special-view-btn ${activeView === 'all' ? 'is-active' : ''}`}
            onClick={() => handleViewClick('all')}
          >
            <span className="view-icon">📚</span>
            <span className="view-label">All Chapters Library</span>
          </button>

          <button
            type="button"
            className={`special-view-btn ${activeView === 'master-table' ? 'is-active' : ''}`}
            onClick={() => handleViewClick('master-table')}
          >
            <span className="view-icon">📊</span>
            <span className="view-label">Master Revision Table</span>
          </button>

          <button
            type="button"
            className={`special-view-btn ${activeView === 'cheat-sheet' ? 'is-active' : ''}`}
            onClick={() => handleViewClick('cheat-sheet')}
          >
            <span className="view-icon">⚡</span>
            <span className="view-label">Core Rules Cheat Sheet</span>
          </button>
        </div>

        <div className="sidebar-divider">
          <span>CHAPTERS</span>
        </div>

        {/* CHAPTER LIST */}
        <nav className="sidebar-nav" aria-label="Chapters List">
          <div className="sidebar-chapters-list">
            {chapters.map((ch) => {
              const isActive = activeView === 'chapter' && activeChapterId === ch.id;
              const formattedNum = ch.number < 10 ? `0${ch.number}` : ch.number;

              return (
                <button
                  key={ch.id}
                  type="button"
                  className={`sidebar-chapter-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => handleChapterClick(ch.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="sidebar-item-num-col">
                    <span className="sidebar-item-num">{formattedNum}</span>
                    <span className="sidebar-item-roman">{ch.romanNumeral}</span>
                  </div>

                  <div className="sidebar-item-info">
                    <span className="sidebar-item-title">{ch.title}</span>
                    <div className="sidebar-item-meta">
                      <span className="item-topic-count">{ch.topics.length} topics</span>
                      <span className="meta-bullet">·</span>
                      <span className="item-read-time">{ch.readTime}</span>
                    </div>
                  </div>

                  {isActive && <span className="sidebar-active-glow" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

