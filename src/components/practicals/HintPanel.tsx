import { useState } from 'react';
import type { HintTier, PracticalSolution } from '../../data/practicals/types';

interface HintPanelProps {
  hints: HintTier[];
  solution: PracticalSolution;
  onUseHint?: (tier: number) => void;
  onRevealSolution?: () => void;
}

export function HintPanel({
  hints,
  solution,
  onUseHint,
  onRevealSolution,
}: HintPanelProps) {
  const [unlockedTier, setUnlockedTier] = useState<number>(0);
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  const handleUnlockNextHint = () => {
    const next = unlockedTier + 1;
    if (next <= hints.length) {
      setUnlockedTier(next);
      onUseHint?.(next);
    }
  };

  const handleToggleSolution = () => {
    if (!isSolutionRevealed) {
      const confirmReveal = window.confirm(
        'Are you sure you want to reveal the full solution? Try using hints first to earn maximum practical points!'
      );
      if (!confirmReveal) return;
      setIsSolutionRevealed(true);
      onRevealSolution?.();
    } else {
      setIsSolutionRevealed(false);
    }
  };

  return (
    <div className="hint-panel-root">
      <div className="hint-panel-head">
        <span className="hint-head-title">💡 Progressive Hints & Solution</span>
        <span className="hint-tier-count font-mono">
          {unlockedTier} of {hints.length} Unlocked
        </span>
      </div>

      <div className="hints-list">
        {hints.map((h) => {
          const isUnlocked = h.tier <= unlockedTier;

          return (
            <div
              key={h.tier}
              className={`hint-card ${isUnlocked ? 'hint-unlocked' : 'hint-locked'}`}
            >
              <div className="hint-card-head">
                <span className="hint-badge font-mono">
                  {isUnlocked ? '🔓' : '🔒'} Hint #{h.tier}
                </span>
                <span className="hint-title">{h.title}</span>
              </div>

              {isUnlocked ? (
                <p className="hint-content">{h.content}</p>
              ) : (
                <div className="hint-locked-content">
                  <span>Locked. Unlock earlier hints first.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hint-actions">
        {unlockedTier < hints.length && (
          <button
            type="button"
            className="btn-unlock-hint"
            onClick={handleUnlockNextHint}
          >
            🔓 Unlock Hint #{unlockedTier + 1}
          </button>
        )}

        <button
          type="button"
          className={`btn-reveal-solution ${isSolutionRevealed ? 'is-active' : ''}`}
          onClick={handleToggleSolution}
        >
          {isSolutionRevealed ? 'Hide Solution' : '🔑 Reveal Complete Solution'}
        </button>
      </div>

      {isSolutionRevealed && (
        <div className="solution-revealed-card">
          <div className="sol-head">
            <span className="sol-icon">🎯</span>
            <h4>Official Solution & Remediation</h4>
          </div>

          <div className="sol-answer font-mono">
            <strong>Key Solution:</strong> {solution.answer}
          </div>

          <p className="sol-expl">{solution.detailedExplanation}</p>

          {solution.codeSnippet && (
            <div className="sol-code-box">
              {solution.codeSnippet.filename && (
                <div className="code-filename font-mono">
                  {solution.codeSnippet.filename}
                </div>
              )}
              <pre className="font-mono code-body">
                <code>{solution.codeSnippet.code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

