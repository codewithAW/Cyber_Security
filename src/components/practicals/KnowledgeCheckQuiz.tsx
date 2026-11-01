import React, { useState } from 'react';
import type { KnowledgeCheck } from '../../data/practicals/types';

interface KnowledgeCheckQuizProps {
  quiz: KnowledgeCheck;
  onQuizCompleted?: (isCorrect: boolean) => void;
}

export function KnowledgeCheckQuiz({ quiz, onQuizCompleted }: KnowledgeCheckQuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCorrect = selectedOption === quiz.correctIndex;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOption === null) return;
    setIsSubmitted(true);
    onQuizCompleted?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <div className="quiz-card-root">
      <div className="quiz-header">
        <span className="quiz-icon">📝</span>
        <h4>Knowledge Check & Assessment</h4>
      </div>

      <p className="quiz-question">{quiz.question}</p>

      <form onSubmit={handleSubmit} className="quiz-options-form">
        <div className="quiz-options-list">
          {quiz.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let optionClass = 'quiz-opt-btn';

            if (isSubmitted) {
              if (idx === quiz.correctIndex) {
                optionClass += ' opt-correct';
              } else if (isSelected && !isCorrect) {
                optionClass += ' opt-wrong';
              }
            } else if (isSelected) {
              optionClass += ' opt-selected';
            }

            return (
              <button
                type="button"
                key={idx}
                className={optionClass}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
              >
                <span className="opt-letter font-mono">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="opt-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {!isSubmitted ? (
          <button
            type="submit"
            className="btn-sim-action btn-submit-quiz"
            disabled={selectedOption === null}
          >
            Check My Answer
          </button>
        ) : (
          <div className={`quiz-feedback-box ${isCorrect ? 'fb-correct' : 'fb-wrong'}`}>
            <div className="fb-head">
              <span className="fb-icon">{isCorrect ? '🎉' : '⚠️'}</span>
              <span className="fb-title">
                {isCorrect ? 'Correct Answer!' : 'Not Quite Right'}
              </span>
            </div>
            <p className="fb-explanation">{quiz.explanation}</p>
            {!isCorrect && (
              <button type="button" className="btn-retry-quiz" onClick={handleReset}>
                Try Again
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

