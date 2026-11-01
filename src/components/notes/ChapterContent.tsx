import { useState } from 'react';
import type { Chapter } from '../../data/notes/types';
import { NoteCallout } from './NoteCallout';
import { CodeBlock } from './CodeBlock';
import { DiagramBlock } from './DiagramBlock';
import { TableOfContents } from './TableOfContents';
import { ChapterNavigation } from './ChapterNavigation';
import { AttackFlowDiagram } from './AttackFlowDiagram';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { HandsOnPracticalBlock } from './HandsOnPracticalBlock';
import { TechnicalVisualSvg } from './TechnicalVisualSvg';

interface ChapterContentProps {
  chapter: Chapter;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  onSelectChapter: (chapterId: string) => void;
  onBackToOverview: () => void;
}

export function ChapterContent({
  chapter,
  previousChapter,
  nextChapter,
  onSelectChapter,
  onBackToOverview,
}: ChapterContentProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  const toggleQuestion = (idx: number) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const formattedNum = chapter.number < 10 ? `0${chapter.number}` : chapter.number;

  return (
    <article className="chapter-article" aria-labelledby="chapter-main-title">
      {/* CHAPTER HERO / HEADER */}
      <header className="chapter-header">
        <div className="chapter-eyebrow">
          <span className="chapter-badge">CHAPTER {formattedNum}</span>
          <span className="chapter-roman">{chapter.romanNumeral}</span>
          <span className="chapter-category">{chapter.category}</span>
        </div>

        <h1 id="chapter-main-title" className="chapter-title">
          {chapter.title}
        </h1>

        <p className="chapter-subtitle">{chapter.subtitle}</p>

        <div className="chapter-meta-bar">
          <div className="meta-item">
            <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{chapter.readTime}</span>
          </div>

          <div className="meta-item">
            <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>{chapter.topics.length} In-Depth Topics</span>
          </div>

          <div className="meta-item verified-badge">
            <span className="status-indicator-dot dot-success" />
            <span>Syllabus Verified</span>
          </div>
        </div>
      </header>

      {/* CHAPTER INTRODUCTION */}
      {chapter.introParagraphs && chapter.introParagraphs.length > 0 && (
        <section className="chapter-intro-section" aria-label="Chapter Introduction">
          <div className="intro-card">
            <div className="intro-badge">
              <span className="intro-badge-dot" />
              <span>CHAPTER ORIENTATION</span>
            </div>
            {chapter.introParagraphs.map((p, idx) => (
              <p key={idx} className="intro-paragraph">{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* CHAPTER HIGH-LEVEL TECHNICAL ARCHITECTURE VISUAL */}
      {chapter.technicalVisual && (
        <div className="chapter-technical-visual-wrapper">
          <TechnicalVisualSvg
            type={chapter.technicalVisual.type}
            title={chapter.technicalVisual.title}
            caption={chapter.technicalVisual.caption}
          />
        </div>
      )}

      {/* IN-CHAPTER TABLE OF CONTENTS */}
      <TableOfContents topics={chapter.topics} chapterNumber={chapter.number} chapter={chapter} />

      {/* TOPICS & SUBTOPICS */}
      <div className="chapter-topics-body">
        {chapter.topics.map((topic) => (
          <section key={topic.id} id={topic.id} className="topic-section">
            <div className="topic-header">
              <span className="topic-number">{topic.number}</span>
              <h2 className="topic-title">{topic.title}</h2>
            </div>

            {/* Topic Content Paragraphs */}
            <div className="topic-paragraphs">
              {topic.content.map((p, idx) => (
                <p key={idx} className="content-p">{p}</p>
              ))}
            </div>

            {/* Definitions */}
            {topic.definitions && topic.definitions.map((def, idx) => (
              <NoteCallout key={idx} type="definition" title={def.term} badge="OFFICIAL DEFINITION">
                <p className="callout-def-text">{def.definition}</p>
                {def.keyTakeaway && (
                  <div className="callout-takeaway">
                    <span className="takeaway-badge">KEY FORMULA:</span>
                    <span className="takeaway-text">{def.keyTakeaway}</span>
                  </div>
                )}
              </NoteCallout>
            ))}

            {/* Diagrams / Flows */}
            {topic.diagrams && topic.diagrams.map((diag, idx) => (
              <DiagramBlock key={idx} diagram={diag} />
            ))}

            {/* Code Snippets */}
            {topic.codeSnippets && topic.codeSnippets.map((snip, idx) => (
              <CodeBlock key={idx} snippet={snip} />
            ))}

            {/* Tables */}
            {topic.tables && topic.tables.map((tbl, idx) => (
              <div key={idx} className="notes-table-container">
                <div className="table-caption-bar">
                  <span className="table-badge">COMPARISON MATRIX</span>
                  <span className="table-title">{tbl.title}</span>
                </div>
                <div className="table-scroll-wrapper">
                  <table className="notes-table">
                    <thead>
                      <tr>
                        {tbl.columns.map((c) => (
                          <th key={c.key}>{c.header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tbl.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {tbl.columns.map((c) => (
                            <td key={c.key}>{row[c.key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* Examples */}
            {topic.examples && topic.examples.map((ex, idx) => (
              <NoteCallout key={idx} type="example" title={ex.title} badge="WORKED EXAMPLE">
                <p className="example-scenario">{ex.scenario}</p>
                {ex.breakdown && (
                  <div className="example-breakdown-list">
                    {ex.breakdown.map((item, bIdx) => (
                      <div key={bIdx} className="breakdown-item">
                        <span className="breakdown-label">{item.label}:</span>
                        <span className="breakdown-detail">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                )}
                {ex.outcome && (
                  <div className="example-outcome">
                    <span className="outcome-tag">SECURITY OUTCOME:</span> {ex.outcome}
                  </div>
                )}
              </NoteCallout>
            ))}

            {/* Key Points */}
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <div className="topic-keypoints-box">
                <div className="keypoints-title">IMPORTANT TAKEAWAYS:</div>
                <ul className="keypoints-list">
                  {topic.keyPoints.map((kp, kIdx) => (
                    <li key={kIdx}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* ATTACK VISUALIZATIONS: HOW THIS ATTACK WORKS */}
      {chapter.attackVisualizations && chapter.attackVisualizations.length > 0 && (
        <section id="how-attacks-work" className="chapter-attack-visualizations-section" aria-label="How This Attack Works">
          <div className="section-eyebrow-banner">
            <span className="eyebrow-dot dot-red" />
            <span className="eyebrow-text">INTERACTIVE ATTACK FLOW ARCHITECTURE</span>
          </div>
          <h2 className="section-heading-h2">How This Attack Works</h2>
          <p className="section-heading-desc">
            Explore step-by-step interactive attack flow diagrams detailing threat actor actions, systemic weaknesses, payload mechanics, and cryptographic or architectural defenses.
          </p>

          <div className="attack-visualizations-list">
            {chapter.attackVisualizations.map((attack) => (
              <AttackFlowDiagram key={attack.id} attack={attack} />
            ))}
          </div>
        </section>
      )}

      {/* BEFORE AND AFTER COMPARISONS */}
      {chapter.beforeAfterComparisons && chapter.beforeAfterComparisons.length > 0 && (
        <section id="before-after-comparisons" className="chapter-comparisons-section" aria-label="Before and After Refactoring Comparisons">
          <div className="section-eyebrow-banner">
            <span className="eyebrow-dot dot-cyan" />
            <span className="eyebrow-text">ARCHITECTURAL REFACTORING</span>
          </div>
          <h2 className="section-heading-h2">Vulnerable vs. Secure Implementations</h2>
          <p className="section-heading-desc">
            Side-by-side technical code and architecture comparisons identifying insecure design patterns, exploitation vectors, and their production-hardened equivalents.
          </p>

          <div className="comparisons-list">
            {chapter.beforeAfterComparisons.map((comp, idx) => (
              <BeforeAfterComparison key={idx} comparison={comp} />
            ))}
          </div>
        </section>
      )}

      {/* HANDS-ON PRACTICAL LABS */}
      {chapter.handsOnPracticals && chapter.handsOnPracticals.length > 0 && (
        <section id="hands-on-practicals" className="chapter-practicals-section" aria-label="Hands-on Practical Labs">
          <div className="section-eyebrow-banner">
            <span className="eyebrow-dot dot-green" />
            <span className="eyebrow-text">CONTROLLED WORKSHOP LAB</span>
          </div>
          <h2 className="section-heading-h2">Hands-on Practical Labs</h2>
          <p className="section-heading-desc">
            Real-world terminal workflows, parameter breakdowns, and simulated outputs designed for safe local experimentation and examination prep.
          </p>

          <div className="practicals-list">
            {chapter.handsOnPracticals.map((prac) => (
              <HandsOnPracticalBlock key={prac.id} practical={prac} />
            ))}
          </div>
        </section>
      )}

      {/* QUICK REVISION SECTION */}
      <section id="quick-revision" className="chapter-revision-section">
        <div className="revision-card">
          <div className="revision-header">
            <span className="revision-star">⭐</span>
            <div className="revision-title-wrap">
              <span className="revision-badge">REVISION ACCELERATOR</span>
              <h3 className="revision-title">Chapter {chapter.number} — Quick Revision</h3>
            </div>
          </div>

          <div className="revision-grid">
            {chapter.quickRevision.map((item, idx) => (
              <div key={idx} className="revision-item">
                <span className="revision-item-topic">{item.topic}</span>
                <span className="revision-item-summary">{item.summary}</span>
              </div>
            ))}
          </div>

          {/* Remember Points */}
          {chapter.rememberPoints && chapter.rememberPoints.length > 0 && (
            <div className="remember-box">
              <div className="remember-header">
                <span className="remember-icon">⭐</span>
                <span className="remember-title">CORE PRINCIPLES TO REMEMBER</span>
              </div>
              <div className="remember-pills">
                {chapter.rememberPoints.map((pt, idx) => (
                  <div key={idx} className="remember-pill">
                    <span className="pill-dot" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* UNIVERSITY EXAM PREPARATION QUESTIONS */}
      {chapter.examQuestions && chapter.examQuestions.length > 0 && (
        <section id="exam-prep" className="chapter-exam-section">
          <div className="exam-card">
            <div className="exam-header">
              <span className="exam-badge">EXAMINATION PREPARATION</span>
              <h3 className="exam-title">University-Level Review Questions</h3>
              <p className="exam-subtitle">
                Master these comprehensive exam prompts derived directly from the chapter syllabus.
              </p>
            </div>

            <div className="exam-questions-list">
              {chapter.examQuestions.map((q, idx) => {
                const isOpen = !!expandedQuestions[idx];
                return (
                  <div key={idx} className={`exam-question-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="question-toggle-btn"
                      onClick={() => toggleQuestion(idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="question-q-badge">Q{idx + 1}</span>
                      <span className="question-text">{q.question}</span>
                      <span className="question-chevron">{isOpen ? '▲' : '▼'}</span>
                    </button>

                    {isOpen && (
                      <div className="question-answer-panel">
                        <div className="answer-guidance-badge">MODEL ANSWER GUIDANCE & KEY CONCEPTS:</div>
                        <p className="answer-text">{q.answerGuidance}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CHAPTER FOOTER NAVIGATION */}
      <ChapterNavigation
        currentChapter={chapter}
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        onSelectChapter={onSelectChapter}
        onBackToOverview={onBackToOverview}
      />
    </article>
  );
}

