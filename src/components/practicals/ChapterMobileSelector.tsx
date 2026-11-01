import type { UserPracticalsState } from '../../data/practicals/types';
import { ALL_PRACTICALS } from '../../data/practicals/practicalsData';

interface ChapterMobileSelectorProps {
  selectedChapter: number | 'all';
  onSelectChapter: (chapter: number | 'all') => void;
  userState: UserPracticalsState;
}

export function ChapterMobileSelector({
  selectedChapter,
  onSelectChapter,
  userState,
}: ChapterMobileSelectorProps) {
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

  return (
    <div className="chapter-mobile-selector-root">
      <label htmlFor="mobile-chapter-select" className="mobile-select-label font-mono">
        SELECT CHAPTER LAB:
      </label>
      <select
        id="mobile-chapter-select"
        className="mobile-chapter-dropdown font-mono"
        value={selectedChapter}
        onChange={(e) => {
          const val = e.target.value;
          onSelectChapter(val === 'all' ? 'all' : parseInt(val));
        }}
      >
        <option value="all">📚 All Chapters ({ALL_PRACTICALS.length} Labs)</option>
        {chapters.map((ch) => (
          <option key={ch.number} value={ch.number}>
            {ch.isFullyCompleted ? '✓ ' : ''}CH {ch.number.toString().padStart(2, '0')}: {ch.title} ({ch.count} {ch.count === 1 ? 'lab' : 'labs'})
          </option>
        ))}
      </select>
    </div>
  );
}

