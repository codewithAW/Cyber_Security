import { useState } from 'react';
import type { BeforeAfterComparison as BeforeAfterType } from '../../data/notes/types';

interface BeforeAfterComparisonProps {
  comparison: BeforeAfterType;
}

export function BeforeAfterComparison({ comparison }: BeforeAfterComparisonProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="before-after-card">
      <div className="before-after-header">
        <span className="compare-eyebrow">SECURITY REFACTORING</span>
        <h4 className="compare-main-title">{comparison.title}</h4>
      </div>

      <div className="before-after-split-grid">
        {/* VULNERABLE PANE */}
        <div className="split-col col-vulnerable">
          <div className="split-banner banner-vulnerable">
            <span className="status-dot dot-red" aria-hidden="true" />
            <span className="banner-title">INSECURE IMPLEMENTATION</span>
            <button
              type="button"
              className="split-copy-btn"
              onClick={() => handleCopy(comparison.vulnerable.codeOrConfig, 'vuln')}
              aria-label="Copy insecure implementation"
            >
              {copiedKey === 'vuln' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="split-label">{comparison.vulnerable.label}</div>
          <pre className="split-pre">
            <code>{comparison.vulnerable.codeOrConfig}</code>
          </pre>
          <div className="split-explanation explanation-vulnerable">
            <span className="flaw-badge">VULNERABILITY FLAW:</span>
            <p className="explanation-p">{comparison.vulnerable.explanation}</p>
          </div>
        </div>

        {/* SECURE PANE */}
        <div className="split-col col-secure">
          <div className="split-banner banner-secure">
            <span className="status-dot dot-green" aria-hidden="true" />
            <span className="banner-title">SECURE DEFENSIVE PATTERN</span>
            <button
              type="button"
              className="split-copy-btn"
              onClick={() => handleCopy(comparison.secure.codeOrConfig, 'secure')}
              aria-label="Copy secure implementation"
            >
              {copiedKey === 'secure' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="split-label">{comparison.secure.label}</div>
          <pre className="split-pre">
            <code>{comparison.secure.codeOrConfig}</code>
          </pre>
          <div className="split-explanation explanation-secure">
            <span className="remediation-badge">WHY THIS FIXES IT:</span>
            <p className="explanation-p">{comparison.secure.explanation}</p>
          </div>
        </div>
      </div>

      {/* KEY TAKEAWAY CALLOUT */}
      <div className="before-after-takeaway">
        <span className="takeaway-icon" aria-hidden="true">💡</span>
        <div className="takeaway-content">
          <strong>Key Architectural Rule:</strong> {comparison.keyTakeaway}
        </div>
      </div>
    </div>
  );
}

