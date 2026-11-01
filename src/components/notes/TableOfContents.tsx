import { useState } from 'react';
import type { SubTopic, Chapter } from '../../data/notes/types';

interface TableOfContentsProps {
  topics: SubTopic[];
  chapterNumber: number;
  chapter?: Chapter;
}

export function TableOfContents({ topics, chapterNumber, chapter }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(topics[0]?.id || '');

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const hasAttacks = !!(chapter?.attackVisualizations && chapter.attackVisualizations.length > 0);
  const hasComparisons = !!(chapter?.beforeAfterComparisons && chapter.beforeAfterComparisons.length > 0);
  const hasPracticals = !!(chapter?.handsOnPracticals && chapter.handsOnPracticals.length > 0);

  return (
    <div className="chapter-toc">
      <div className="toc-header">
        <svg className="toc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span className="toc-title">IN THIS CHAPTER</span>
      </div>

      <nav className="toc-links" aria-label="Chapter contents">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`toc-link ${activeId === t.id ? 'is-active' : ''}`}
            onClick={() => scrollToSection(t.id)}
          >
            <span className="toc-num">{t.number}</span>
            <span className="toc-text">{t.title}</span>
          </button>
        ))}

        {hasAttacks && (
          <button
            type="button"
            className={`toc-link toc-link-attack ${activeId === 'how-attacks-work' ? 'is-active' : ''}`}
            onClick={() => scrollToSection('how-attacks-work')}
          >
            <span className="toc-num toc-emoji">⚔️</span>
            <span className="toc-text">How This Attack Works</span>
          </button>
        )}

        {hasComparisons && (
          <button
            type="button"
            className={`toc-link toc-link-compare ${activeId === 'before-after-comparisons' ? 'is-active' : ''}`}
            onClick={() => scrollToSection('before-after-comparisons')}
          >
            <span className="toc-num toc-emoji">⚖️</span>
            <span className="toc-text">Vulnerable vs Secure</span>
          </button>
        )}

        {hasPracticals && (
          <button
            type="button"
            className={`toc-link toc-link-practical ${activeId === 'hands-on-practicals' ? 'is-active' : ''}`}
            onClick={() => scrollToSection('hands-on-practicals')}
          >
            <span className="toc-num toc-emoji">🛠️</span>
            <span className="toc-text">Hands-on Practical</span>
          </button>
        )}

        <button
          type="button"
          className={`toc-link ${activeId === 'quick-revision' ? 'is-active' : ''}`}
          onClick={() => scrollToSection('quick-revision')}
        >
          <span className="toc-num">⭐</span>
          <span className="toc-text">Chapter {chapterNumber} Revision</span>
        </button>

        <button
          type="button"
          className={`toc-link ${activeId === 'exam-prep' ? 'is-active' : ''}`}
          onClick={() => scrollToSection('exam-prep')}
        >
          <span className="toc-num">📝</span>
          <span className="toc-text">University Exam Prep</span>
        </button>
      </nav>
    </div>
  );
}

