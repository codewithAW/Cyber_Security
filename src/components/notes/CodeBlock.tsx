import { useState } from 'react';
import type { CodeSnippet } from '../../data/notes/types';

interface CodeBlockProps {
  snippet: CodeSnippet;
}

export function CodeBlock({ snippet }: CodeBlockProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isComparison = !!snippet.vulnerableCode && !!snippet.secureCode;

  return (
    <div className="code-block-container">
      <div className="code-block-header">
        <div className="code-block-meta">
          <span className="code-lang-badge">{snippet.language.toUpperCase()}</span>
          <span className="code-block-title">{snippet.title}</span>
        </div>
      </div>

      {isComparison ? (
        <div className="code-comparison-grid">
          {snippet.vulnerableCode && (
            <div className="code-pane code-pane-vulnerable">
              <div className="code-pane-banner banner-vulnerable">
                <span className="status-indicator-dot dot-danger" />
                <span>Vulnerable Implementation</span>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={() => handleCopy(snippet.vulnerableCode!, 'vuln')}
                  aria-label="Copy vulnerable code"
                >
                  {copiedKey === 'vuln' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code-pre">
                <code>{snippet.vulnerableCode}</code>
              </pre>
            </div>
          )}

          {snippet.secureCode && (
            <div className="code-pane code-pane-secure">
              <div className="code-pane-banner banner-secure">
                <span className="status-indicator-dot dot-success" />
                <span>Secure Defense (Remediated)</span>
                <button
                  type="button"
                  className="code-copy-btn"
                  onClick={() => handleCopy(snippet.secureCode!, 'secure')}
                  aria-label="Copy secure code"
                >
                  {copiedKey === 'secure' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <pre className="code-pre">
                <code>{snippet.secureCode}</code>
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="code-pane">
          <div className="code-pane-banner">
            <span className="code-caption">{snippet.caption || 'Code Reference'}</span>
            <button
              type="button"
              className="code-copy-btn"
              onClick={() => handleCopy(snippet.singleCode || '', 'single')}
              aria-label="Copy code snippet"
            >
              {copiedKey === 'single' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <pre className="code-pre">
            <code>{snippet.singleCode}</code>
          </pre>
        </div>
      )}

      {snippet.explanation && (
        <div className="code-explanation">
          <span className="explanation-label">Architecture Note:</span> {snippet.explanation}
        </div>
      )}
    </div>
  );
}

