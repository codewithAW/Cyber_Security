import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ALL_CHAPTERS,
  CHAPTERS_MAP,
  searchNotes,
  type SearchResult,
} from '../data/notes';
import { ReadingProgress } from '../components/notes/ReadingProgress';
import { NotesHeader } from '../components/notes/NotesHeader';
import { NotesSidebar } from '../components/notes/NotesSidebar';
import { ChapterContent } from '../components/notes/ChapterContent';
import { AllChaptersView } from '../components/notes/AllChaptersView';
import { MasterRevisionView } from '../components/notes/MasterRevisionView';

export function CompleteNotes() {
  const [activeChapterId, setActiveChapterId] = useState<string>('chapter-01');
  const [activeView, setActiveView] = useState<'chapter' | 'all' | 'master-table' | 'cheat-sheet'>('chapter');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize with URL hash on mount and hash changes
  useEffect(() => {
    const parseHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#notes/')) {
        const targetId = hash.replace('#notes/', '');
        if (targetId === 'all') {
          setActiveView('all');
        } else if (targetId === 'master-revision') {
          setActiveView('master-table');
        } else if (CHAPTERS_MAP[targetId]) {
          setActiveChapterId(targetId);
          setActiveView('chapter');
        }
      }
    };

    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);

  const searchResults = useMemo(() => {
    return searchNotes(searchQuery);
  }, [searchQuery]);

  const currentChapter = useMemo(() => {
    return CHAPTERS_MAP[activeChapterId] || ALL_CHAPTERS[0];
  }, [activeChapterId]);

  const { previousChapter, nextChapter } = useMemo(() => {
    const currentIndex = ALL_CHAPTERS.findIndex((c) => c.id === activeChapterId);
    return {
      previousChapter: currentIndex > 0 ? ALL_CHAPTERS[currentIndex - 1] : null,
      nextChapter: currentIndex < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[currentIndex + 1] : null,
    };
  }, [activeChapterId]);

  const handleSelectChapter = useCallback((chapterId: string) => {
    if (CHAPTERS_MAP[chapterId]) {
      setActiveChapterId(chapterId);
      setActiveView('chapter');
      window.location.hash = `#notes/${chapterId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleSelectSearchResult = useCallback((result: SearchResult) => {
    setSearchQuery('');
    handleSelectChapter(result.chapterId);
    if (result.topicId) {
      setTimeout(() => {
        const el = document.getElementById(result.topicId!);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [handleSelectChapter]);

  const handleSelectView = useCallback((view: 'all' | 'master-table' | 'cheat-sheet') => {
    setActiveView(view);
    if (view === 'all') {
      window.location.hash = '#notes/all';
    } else if (view === 'master-table') {
      window.location.hash = '#notes/master-revision';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="complete-notes-page">
      {/* Scroll Reading Progress Bar */}
      {activeView === 'chapter' && <ReadingProgress />}

      <div className="notes-layout-container">
        {/* Persistent Desktop / Collapsible Mobile Sidebar */}
        <NotesSidebar
          chapters={ALL_CHAPTERS}
          activeChapterId={activeChapterId}
          activeView={activeView}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onSelectChapter={handleSelectChapter}
          onSelectView={handleSelectView}
        />

        {/* Main Notes Reading & Content Column */}
        <main className="notes-main-content">
          <NotesHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchResults={searchResults}
            isSearching={searchQuery.trim().length >= 2}
            onSelectSearchResult={handleSelectSearchResult}
            onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
            activeChapterTitle={activeView === 'chapter' ? currentChapter.title : undefined}
            activeChapterNum={activeView === 'chapter' ? currentChapter.number : undefined}
          />

          <div className="notes-view-viewport">
            {activeView === 'chapter' && (
              <ChapterContent
                chapter={currentChapter}
                previousChapter={previousChapter}
                nextChapter={nextChapter}
                onSelectChapter={handleSelectChapter}
                onBackToOverview={() => handleSelectView('all')}
              />
            )}

            {activeView === 'all' && (
              <AllChaptersView
                chapters={ALL_CHAPTERS}
                onSelectChapter={handleSelectChapter}
                onOpenMasterRevision={() => handleSelectView('master-table')}
              />
            )}

            {(activeView === 'master-table' || activeView === 'cheat-sheet') && (
              <MasterRevisionView
                onSelectChapter={handleSelectChapter}
                onBackToOverview={() => handleSelectView('all')}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

