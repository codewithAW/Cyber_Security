import {
  MASTER_QUICK_REVISION_TABLE,
  CORE_RULES_CHEAT_SHEET,
} from '../../data/notes';

interface MasterRevisionViewProps {
  onSelectChapter: (id: string) => void;
  onBackToOverview: () => void;
}

export function MasterRevisionView({
  onSelectChapter,
  onBackToOverview,
}: MasterRevisionViewProps) {
  return (
    <div className="master-revision-view">
      <div className="revision-hero">
        <div className="revision-hero-badge">
          <span className="hero-star">⭐</span>
          <span>SYLLABUS-WIDE RAPID REVIEW</span>
        </div>
        <h2 className="revision-main-title">Overall Cyber Security Quick Revision</h2>
        <p className="revision-lead">
          The master revision table consolidating every foundational topic and its exact definitions across all 14 chapters.
        </p>

        <div className="revision-actions-row">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onBackToOverview}
          >
            <span>← Back to All Chapters</span>
          </button>
        </div>
      </div>

      {/* MASTER TOPIC TABLE */}
      <div className="master-table-card">
        <div className="master-table-header">
          <span className="table-header-badge">OFFICIAL REVISION MATRIX</span>
          <span className="table-subtitle">Click any topic row to jump to its full notes chapter</span>
        </div>

        <div className="master-table-wrapper">
          <table className="master-revision-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Chapter</th>
                <th style={{ width: '220px' }}>Topic</th>
                <th>Simple Meaning & Definition</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MASTER_QUICK_REVISION_TABLE.map((row, idx) => (
                <tr
                  key={idx}
                  className="clickable-row"
                  onClick={() => onSelectChapter(row.chapterId)}
                >
                  <td className="row-ch-num">
                    <span className="ch-pill">
                      Ch {row.chapterNumber < 10 ? `0${row.chapterNumber}` : row.chapterNumber}
                    </span>
                  </td>
                  <td className="row-topic">
                    <span className="topic-text">{row.topic}</span>
                  </td>
                  <td className="row-meaning">
                    <span className="meaning-text">{row.simpleMeaning}</span>
                  </td>
                  <td className="row-action">
                    <span className="jump-link">Open →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CORE RULES & CHEAT SHEET CARDS */}
      <div className="cheat-sheet-section">
        <div className="cheat-sheet-header">
          <span className="cheat-star">⭐</span>
          <div>
            <span className="cheat-badge">EXAM CRITICAL</span>
            <h3 className="cheat-title">Most Important Things to Remember</h3>
          </div>
        </div>

        <div className="cheat-cards-grid">
          {CORE_RULES_CHEAT_SHEET.map((rule, idx) => (
            <div key={idx} className="cheat-card">
              <div className="cheat-card-header">
                <span className="cheat-card-index">0{idx + 1}</span>
                <h4 className="cheat-card-title">{rule.title}</h4>
              </div>

              <div className="cheat-card-formulas">
                {rule.formula.map((item, fIdx) => (
                  <div key={fIdx} className="formula-line">
                    <span className="formula-arrow">▸</span>
                    <span className="formula-text">{item}</span>
                  </div>
                ))}
              </div>

              <p className="cheat-card-explanation">{rule.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

