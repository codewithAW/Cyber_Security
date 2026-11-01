import type { SearchResult } from '../../data/notes/types';

interface NotesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  onSelectSearchResult: (result: SearchResult) => void;
  onToggleMobileSidebar: () => void;
  activeChapterTitle?: string;
  activeChapterNum?: number;
}

export function NotesHeader({
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  onSelectSearchResult,
  onToggleMobileSidebar,
  activeChapterTitle,
  activeChapterNum,
}: NotesHeaderProps) {
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <header className="notes-page-header">
      <div className="notes-header-top">
        {/* Mobile Sidebar Toggle Button */}
        <button
          type="button"
          className="mobile-drawer-toggle"
          onClick={onToggleMobileSidebar}
          aria-label="Open chapters menu"
        >
          <svg className="drawer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="drawer-label">
            {activeChapterNum ? `Ch ${activeChapterNum}` : 'Chapters'}
          </span>
        </button>

        <div className="notes-eyebrow">
          <span className="eyebrow-dot" />
          <span className="eyebrow-text">STUDYVERSE LEARNING LIBRARY</span>
        </div>
      </div>

      <div className="notes-headline-row">
        <h1 className="notes-main-heading">Complete Notes</h1>
        {activeChapterTitle && (
          <span className="notes-current-pill">
            Reading: {activeChapterTitle}
          </span>
        )}
      </div>

      <p className="notes-supporting-text">
        Everything you need to understand, revise, and master your subjects — organized chapter by chapter.
      </p>

      {/* FUNCTIONAL SEARCH BAR */}
      <div className="notes-search-wrapper">
        <div className="notes-search-input-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="notes-search-input"
            placeholder="Search chapters, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notes"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* SEARCH RESULTS DROPDOWN */}
        {isSearching && (
          <div className="search-results-dropdown" role="region" aria-label="Search results">
            <div className="search-results-header">
              <span className="results-count">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="search-empty-state">
                <span className="empty-icon">🔍</span>
                <p className="empty-title">No matching notes found</p>
                <p className="empty-subtitle">Try searching for terms like "XSS", "CIA Triad", "TLS", "WPA3", or "IPsec".</p>
              </div>
            ) : (
              <div className="search-results-list">
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="search-result-item"
                    onClick={() => onSelectSearchResult(res)}
                  >
                    <div className="result-item-top">
                      <span className="result-chapter-badge">
                        Chapter {res.chapterNumber < 10 ? `0${res.chapterNumber}` : res.chapterNumber}
                      </span>
                      <span className="result-match-type">
                        {res.matchType.toUpperCase()}
                      </span>
                    </div>

                    <div className="result-item-title">
                      {res.topicTitle ? (
                        <>
                          <span className="result-ch-name">{res.chapterTitle}</span>
                          <span className="result-divider">›</span>
                          <span className="result-topic-name">
                            {highlightMatch(res.topicTitle, searchQuery)}
                          </span>
                        </>
                      ) : (
                        <span className="result-ch-name">
                          {highlightMatch(res.chapterTitle, searchQuery)}
                        </span>
                      )}
                    </div>

                    <p className="result-item-snippet">
                      {highlightMatch(res.snippet, searchQuery)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
