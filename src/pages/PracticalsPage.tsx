import { useEffect, useMemo, useState } from 'react';
import {
  ALL_PRACTICALS,
  PRACTICALS_MAP,
  searchPracticals,
} from '../data/practicals/practicalsData';
import type {
  DifficultyLevel,
  PracticalProgressRecord,
  UserPracticalsState,
} from '../data/practicals/types';
import { PracticalsHero } from '../components/practicals/PracticalsHero';
import { ChapterSidebar } from '../components/practicals/ChapterSidebar';
import { ChapterMobileSelector } from '../components/practicals/ChapterMobileSelector';
import { PracticalCard } from '../components/practicals/PracticalCard';
import { PracticalWorkspace } from '../components/practicals/PracticalWorkspace';
import { PracticalNotFound } from '../components/practicals/PracticalNotFound';
import '../styles/practicals.css';

const STORAGE_KEY = 'studyverse-practicals-progress';

const DEFAULT_USER_STATE: UserPracticalsState = {
  records: {},
  totalPoints: 0,
  badges: [],
  lastActiveDate: new Date().toISOString().substring(0, 10),
  streakDays: 1,
};

interface ParsedRoute {
  type: 'list' | 'workspace' | 'not-found';
  practicalId: string | null;
  attemptedSlug?: string;
}

function parseCurrentPracticalRoute(): ParsedRoute {
  const hash = window.location.hash;
  const path = window.location.pathname;

  let subpath = '';

  if (hash.startsWith('#practicals/')) {
    subpath = hash.replace(/^#practicals\//, '').trim();
  } else if (hash === '#practicals' || hash === '#practicals/') {
    return { type: 'list', practicalId: null };
  } else if (path.startsWith('/practicals/')) {
    subpath = path.replace(/^\/practicals\//, '').trim();
  } else if (path === '/practicals' || path === '/practicals/') {
    return { type: 'list', practicalId: null };
  } else {
    return { type: 'list', practicalId: null };
  }

  if (!subpath) {
    return { type: 'list', practicalId: null };
  }

  const segments = subpath.split('/').filter(Boolean);
  if (segments.length === 0) {
    return { type: 'list', practicalId: null };
  }

  // Check segments from right to left (slug first, then chapter alias)
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i].toLowerCase();
    if (PRACTICALS_MAP[seg]) {
      return { type: 'workspace', practicalId: PRACTICALS_MAP[seg].id };
    }
  }

  // Not found
  return {
    type: 'not-found',
    practicalId: null,
    attemptedSlug: subpath,
  };
}

export function PracticalsPage() {
  const [route, setRoute] = useState<ParsedRoute>(() => {
    return parseCurrentPracticalRoute();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | DifficultyLevel>('All');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');

  const [userState, setUserState] = useState<UserPracticalsState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load practicals progress from storage', e);
    }
    return DEFAULT_USER_STATE;
  });

  // Save to localStorage whenever userState updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch (e) {
      console.warn('Failed to save practicals progress', e);
    }
  }, [userState]);

  // Synchronize hash & popstate (browser back/forward) with practical route
  useEffect(() => {
    const onLocationChange = () => {
      setRoute(parseCurrentPracticalRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const handleSelectPractical = (id: string) => {
    const p = PRACTICALS_MAP[id];
    if (p) {
      window.location.hash = `#practicals/chapter-${p.chapterNumber}/${p.slug}`;
      setRoute({ type: 'workspace', practicalId: p.id });
    } else {
      window.location.hash = `#practicals/${id}`;
      setRoute({ type: 'workspace', practicalId: id });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mark as in-progress if not started
    if (!userState.records[id]) {
      setUserState((prev) => ({
        ...prev,
        records: {
          ...prev.records,
          [id]: {
            status: 'in-progress',
            usedHints: 0,
            revealedSolution: false,
            pointsEarned: 0,
            currentStep: 0,
            checkedSteps: [],
          },
        },
      }));
    }
  };

  const handleBackToList = () => {
    window.location.hash = '#practicals';
    setRoute({ type: 'list', practicalId: null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateProgress = (
    practicalId: string,
    updates: Partial<PracticalProgressRecord>
  ) => {
    setUserState((prev) => {
      const existing = prev.records[practicalId] || {
        status: 'in-progress',
        usedHints: 0,
        revealedSolution: false,
        pointsEarned: 0,
        currentStep: 0,
        checkedSteps: [],
      };

      const updatedRecord: PracticalProgressRecord = {
        ...existing,
        ...updates,
      };

      const newRecords = {
        ...prev.records,
        [practicalId]: updatedRecord,
      };

      // Recalculate total points & badges
      let totalPts = 0;
      const badgesSet = new Set(prev.badges);

      Object.entries(newRecords).forEach(([pid, rec]) => {
        if (rec.status === 'completed') {
          let earned = 100;
          if (rec.revealedSolution) earned = 40;
          else if (rec.usedHints > 0) earned = Math.max(50, 100 - rec.usedHints * 15);

          if (rec.quizCompleted) earned += 25;
          totalPts += earned;

          const pObj = PRACTICALS_MAP[pid];
          if (pObj && pObj.badgeAwarded) {
            badgesSet.add(`${pObj.badgeAwarded.icon} ${pObj.badgeAwarded.name}`);
          }
        }
      });

      return {
        ...prev,
        records: newRecords,
        totalPoints: totalPts,
        badges: Array.from(badgesSet),
      };
    });
  };

  // Filter practicals for list view
  const filteredPracticals = useMemo(() => {
    let result = ALL_PRACTICALS;

    if (searchQuery.trim()) {
      result = searchPracticals(searchQuery);
    }

    if (selectedFilter !== 'All') {
      result = result.filter((p) => p.difficulty === selectedFilter);
    }

    if (selectedChapter !== 'all') {
      result = result.filter((p) => p.chapterNumber === selectedChapter);
    }

    return result;
  }, [searchQuery, selectedFilter, selectedChapter]);

  // Current active practical if in workspace mode
  const currentPractical =
    route.type === 'workspace' && route.practicalId
      ? PRACTICALS_MAP[route.practicalId] || null
      : null;

  // Next / Prev practical navigation
  const currentIndex = currentPractical
    ? ALL_PRACTICALS.findIndex((p) => p.id === currentPractical.id)
    : -1;

  const prevPractical =
    currentIndex > 0 ? ALL_PRACTICALS[currentIndex - 1] : null;
  const nextPractical =
    currentIndex >= 0 && currentIndex < ALL_PRACTICALS.length - 1
      ? ALL_PRACTICALS[currentIndex + 1]
      : null;

  return (
    <div className="practicals-page-root">
      {route.type === 'not-found' ? (
        <PracticalNotFound
          attemptedSlug={route.attemptedSlug}
          onReturnToHub={handleBackToList}
          onSelectPractical={handleSelectPractical}
        />
      ) : currentPractical ? (
        <PracticalWorkspace
          practical={currentPractical}
          progressRecord={userState.records[currentPractical.id]}
          onBackToList={handleBackToList}
          onNavigatePrev={
            prevPractical
              ? () => handleSelectPractical(prevPractical.id)
              : undefined
          }
          onNavigateNext={
            nextPractical
              ? () => handleSelectPractical(nextPractical.id)
              : undefined
          }
          onUpdateProgress={handleUpdateProgress}
        />
      ) : (
        <div className="practicals-list-view">
          <PracticalsHero
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            userState={userState}
            totalPracticals={ALL_PRACTICALS.length}
          />

          <div className="practicals-body-wrap">
            {/* Desktop Persistent Left Sidebar */}
            <ChapterSidebar
              selectedChapter={selectedChapter}
              onSelectChapter={setSelectedChapter}
              userState={userState}
            />

            {/* Main Content Area */}
            <main className="practicals-main-content">
              {/* Mobile Chapter Selector (Visible on small screens) */}
              <ChapterMobileSelector
                selectedChapter={selectedChapter}
                onSelectChapter={setSelectedChapter}
                userState={userState}
              />

              <div className="practicals-results-header">
                <span className="results-count font-mono">
                  Showing {filteredPracticals.length} of {ALL_PRACTICALS.length} Practical Labs
                  {selectedChapter !== 'all' && ` (Chapter ${selectedChapter.toString().padStart(2, '0')})`}
                </span>
                {selectedFilter !== 'All' && (
                  <span className="active-filter-badge font-mono">
                    Filtered by: {selectedFilter}
                  </span>
                )}
              </div>

              {filteredPracticals.length > 0 ? (
                <div className="practicals-grid">
                  {filteredPracticals.map((p) => (
                    <PracticalCard
                      key={p.id}
                      practical={p}
                      progressRecord={userState.records[p.id]}
                      onSelect={handleSelectPractical}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-practicals-found">
                  <span className="empty-icon">🔍</span>
                  <h3>No Matching Practicals Found</h3>
                  <p>Try clearing your search query or choosing a different chapter or filter.</p>
                  <button
                    type="button"
                    className="btn-sim-reset"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('All');
                      setSelectedChapter('all');
                    }}
                  >
                    Reset Search & Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
