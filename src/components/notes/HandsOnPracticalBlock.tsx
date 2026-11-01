import { useState } from 'react';
import type { HandsOnPractical } from '../../data/notes/types';

interface HandsOnPracticalBlockProps {
  practical: HandsOnPractical;
}

export function HandsOnPracticalBlock({ practical }: HandsOnPracticalBlockProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="hands-on-practical-section" id={practical.id} aria-label={`Hands-on Practical: ${practical.title}`}>
      <div className="practical-card">
        {/* SAFETY NOTICE BANNER */}
        <div className="practical-safety-banner" role="note">
          <span className="safety-icon" aria-hidden="true">⚠️</span>
          <div className="safety-text">
            <strong>AUTHORIZED LAB USE ONLY:</strong> All commands and demonstrations are designed for isolated practice environments, localhost servers, and dummy testing accounts. Never execute cyber tools against live systems without explicit legal authorization.
          </div>
        </div>

        {/* PRACTICAL HEADER */}
        <header className="practical-header">
          <div className="practical-eyebrow">
            <span className="practical-badge">LAB WORKSHOP</span>
            <span className="practical-tagline">STEP-BY-STEP CONTROLLED DEMONSTRATION</span>
          </div>
          <h3 className="practical-title">{practical.title}</h3>

          <div className="practical-objective-box">
            <span className="objective-label">LEARNING OBJECTIVE:</span>
            <p className="objective-text">{practical.learningObjective}</p>
          </div>

          <div className="practical-meta-grid">
            <div className="meta-block">
              <span className="meta-title">Required Tools:</span>
              <div className="tool-tags">
                {practical.requiredTools.map((t, idx) => (
                  <span key={idx} className="tool-pill">{t}</span>
                ))}
              </div>
            </div>

            <div className="meta-block">
              <span className="meta-title">Environment Setup:</span>
              <span className="env-text">{practical.environmentSetup}</span>
            </div>
          </div>
        </header>

        {/* STEP BY STEP INSTRUCTIONS */}
        <div className="practical-steps-container">
          <h4 className="steps-heading">Step-by-Step Lab Execution</h4>

          <div className="steps-list">
            {practical.steps.map((st) => (
              <div key={st.stepNumber} className="practical-step-item">
                <div className="step-number-col">
                  <span className="step-num-badge">STEP {st.stepNumber}</span>
                </div>

                <div className="step-content-col">
                  <p className="step-instruction-text">{st.instruction}</p>

                  {/* Terminal Command Box */}
                  {st.command && (
                    <div className="terminal-box">
                      <div className="terminal-bar">
                        <div className="terminal-dots">
                          <span className="term-dot dot-1" />
                          <span className="term-dot dot-2" />
                          <span className="term-dot dot-3" />
                        </div>
                        <span className="terminal-title">BASH / TERMINAL</span>
                        <button
                          type="button"
                          className="term-copy-btn"
                          onClick={() => handleCopy(st.command!, st.stepNumber)}
                          aria-label={`Copy command for step ${st.stepNumber}`}
                        >
                          {copiedIndex === st.stepNumber ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>

                      <pre className="terminal-pre">
                        <code>
                          <span className="term-prompt">$ </span>
                          <span className="term-cmd">{st.command}</span>
                        </code>
                      </pre>

                      {st.commandExplanation && (
                        <div className="command-breakdown">
                          <span className="breakdown-title">Command Breakdown:</span>
                          <p className="breakdown-p">{st.commandExplanation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Code Snippet Box */}
                  {st.codeSnippet && (
                    <div className="step-code-box">
                      <div className="step-code-header">
                        <span className="step-code-lang">{st.codeSnippet.language.toUpperCase()}</span>
                        <span className="step-code-title">{st.codeSnippet.title}</span>
                      </div>
                      <pre className="step-code-pre">
                        <code>{st.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Expected Output Box */}
                  {st.expectedOutput && (
                    <div className="expected-output-box">
                      <span className="output-badge">EXPECTED LAB OUTPUT:</span>
                      <pre className="output-pre">
                        <code>{st.expectedOutput}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POST-LAB SYNTHESIS */}
        <div className="practical-synthesis-grid">
          {/* What Happened */}
          <div className="synthesis-card card-happened">
            <h5 className="synthesis-title">
              <span className="synthesis-icon" aria-hidden="true">🔍</span>
              What Happened in this Lab
            </h5>
            <p className="synthesis-text">{practical.whatHappened}</p>
          </div>

          {/* Security Lessons */}
          <div className="synthesis-card card-lessons">
            <h5 className="synthesis-title">
              <span className="synthesis-icon" aria-hidden="true">💡</span>
              Core Security Lessons
            </h5>
            <ul className="synthesis-list">
              {practical.securityLessons.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>
          </div>

          {/* Prevention & Remediation */}
          <div className="synthesis-card card-prevention">
            <h5 className="synthesis-title">
              <span className="synthesis-icon" aria-hidden="true">🛡️</span>
              Production Mitigation & Defense
            </h5>
            <ul className="synthesis-list">
              {practical.prevention.map((prev, idx) => (
                <li key={idx}>{prev}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

