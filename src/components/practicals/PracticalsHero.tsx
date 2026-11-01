import type { UserPracticalsState, DifficultyLevel } from '../../data/practicals/types';

interface PracticalsHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: 'All' | DifficultyLevel;
  onFilterChange: (filter: 'All' | DifficultyLevel) => void;
  userState: UserPracticalsState;
  totalPracticals: number;
}

export function PracticalsHero({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  userState,
  totalPracticals,
}: PracticalsHeroProps) {
  const completedCount = Object.values(userState.records).filter(
    (r) => r.status === 'completed'
  ).length;

  const inProgressCount = Object.values(userState.records).filter(
    (r) => r.status === 'in-progress'
  ).length;

  const percent = totalPracticals > 0 ? Math.round((completedCount / totalPracticals) * 100) : 0;

  return (
    <div className="practicals-hero-section">
      <div className="hero-content-wrapper">
        <div className="hero-tag-pill font-mono">
          <span className="pulsing-radar" />
          HANDS-ON CYBERSECURITY LAB
        </div>

        <h1 className="hero-heading">Don't just learn security. Experience it.</h1>

        <p className="hero-description">
          Enter interactive cybersecurity labs, experiment with vulnerabilities, solve challenges, and master practical
          security skills across all 14 university syllabus chapters.
        </p>

        {/* Compact Progress Overview (Required by Section 3) */}
        <div className="compact-progress-overview">
          <div className="overview-metric">
            <span className="metric-label">Total Practicals</span>
            <span className="metric-num font-mono text-cyan">{totalPracticals}</span>
          </div>

          <div className="overview-metric">
            <span className="metric-label">Completed</span>
            <span className="metric-num font-mono text-green">
              {completedCount}
            </span>
          </div>

          <div className="overview-metric">
            <span className="metric-label">In Progress</span>
            <span className="metric-num font-mono text-amber">
              {inProgressCount}
            </span>
          </div>

          <div className="overview-metric metric-completion">
            <div className="completion-top">
              <span className="metric-label">Overall Completion</span>
              <span className="completion-percent font-mono">{percent}%</span>
            </div>
            <div className="mini-track">
              <div
                className="mini-fill fill-cyan"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="practicals-filter-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="practicals-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search practicals by chapter, vulnerability, or keyword..."
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => onSearchChange('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-pills-row">
            {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((filter) => (
              <button
                type="button"
                key={filter}
                className={`btn-filter-pill ${selectedFilter === filter ? 'is-active-filter' : ''}`}
                onClick={() => onFilterChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

