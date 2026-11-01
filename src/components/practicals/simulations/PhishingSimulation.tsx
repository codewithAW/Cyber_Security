import { useState } from 'react';

interface PhishingSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  date: string;
  bodyText: string;
  actionButtonText?: string;
  displayedLinkUrl?: string;
  actualDestinationUrl?: string;
  attachmentName?: string;
  isPhishing: boolean;
  explanation: string;
  indicators: string[];
}

export function PhishingSimulation({ onStepComplete, onSimulationSuccess }: PhishingSimulationProps) {
  const EMAILS: EmailItem[] = [
    {
      id: 'email-1',
      senderName: 'PayPal Security Center',
      senderEmail: 'security-alerts@paypa1-support-portal.biz',
      recipientEmail: 'student@studyverse.edu',
      subject: 'URGENT: Unauthorized Account Access Detected [Action Required]',
      date: 'Today, 09:12 AM',
      bodyText:
        'Dear Customer,\n\nWe detected suspicious login activity from an unknown IP address in foreign jurisdiction. Your account will be PERMANENTLY SUSPENDED within 2 hours unless you confirm your identity immediately.\n\nPlease click the button below to verify your login credentials and billing credit card number.',
      actionButtonText: 'Verify Account Now',
      displayedLinkUrl: 'https://www.paypal.com/verify-identity',
      actualDestinationUrl: 'http://harvest-credentials.paypa1-support-portal.biz/login.php',
      isPhishing: true,
      explanation:
        'This is a classic credential harvesting phishing email. Indicators: typosquatted domain "paypa1" (digit 1 instead of letter l), intense psychological urgency ("PERMANENTLY SUSPENDED in 2 hours"), and a link whose displayed text does not match the actual destination URL.',
      indicators: ['Typosquatted domain (paypa1)', 'Urgency & fear lure', 'Deceptive destination link mismatch'],
    },
    {
      id: 'email-2',
      senderName: 'University Bursar Office',
      senderEmail: 'bursar@studyverse.edu',
      recipientEmail: 'student@studyverse.edu',
      subject: 'Spring Semester Tuition Statement Ready for Review',
      date: 'Yesterday, 02:45 PM',
      bodyText:
        'Hello Student,\n\nYour tuition statement for the upcoming Spring semester is now available in your official student account portal. Please review your balance and financial aid allocations at your convenience before registration week.\n\nBest regards,\nBursar Office\nStudyVerse University',
      actionButtonText: 'View Official Statement',
      displayedLinkUrl: 'https://portal.studyverse.edu/billing',
      actualDestinationUrl: 'https://portal.studyverse.edu/billing',
      isPhishing: false,
      explanation:
        'This is a legitimate university communication. The sender domain matches the official `@studyverse.edu` domain, the destination URL matches the displayed link, there is no threatening or panicky language, and no sensitive credentials or credit card numbers are demanded directly.',
      indicators: ['Authentic domain (@studyverse.edu)', 'Clean matching link URLs', 'Standard informative tone'],
    },
    {
      id: 'email-3',
      senderName: 'Alex Morgan (CEO)',
      senderEmail: 'ceo-alex-office@freemail-corp.org',
      recipientEmail: 'student@studyverse.edu',
      subject: 'Quick confidential favor - are you at your desk?',
      date: 'Today, 11:03 AM',
      bodyText:
        'Hey, I am currently locked in an all-day investor board meeting and cannot take calls. I urgently need you to purchase 5 x $100 Apple App Store gift cards for our conference keynote speaker. Send me the scratched PIN codes directly via reply email right away. Keep this confidential between us until the presentation.',
      isPhishing: true,
      explanation:
        'This is a Business Email Compromise (BEC) / CEO Fraud social engineering lure. The attacker uses a free email provider while spoofing the CEO name, invents an excuse preventing phone verification ("in a board meeting"), requests secrecy, and demands untraceable gift card PIN codes.',
      indicators: ['CEO impersonation from freemail address', 'Demand for untraceable gift cards', 'Artificial secrecy constraint'],
    },
    {
      id: 'email-4',
      senderName: 'StudyVerse IT Security Team',
      senderEmail: 'it-helpdesk@studyverse.edu',
      recipientEmail: 'student@studyverse.edu',
      subject: 'Scheduled Maintenance: Student Portal Upgrade Tonight',
      date: 'Yesterday, 04:30 PM',
      bodyText:
        'Hi everyone,\n\nPlease be advised that the student course portal will undergo scheduled maintenance tonight between 12:00 AM and 02:00 AM UTC. No action is required on your part. Do not share your login credentials with anyone; IT will never ask for your password.',
      isPhishing: false,
      explanation:
        'This is a legitimate IT announcement. The domain is valid, no user action or links are pushed, and the message explicitly reminds users that IT never asks for passwords.',
      indicators: ['Official IT sender domain', 'No external links or credential requests', 'Proactive security hygiene reminder'],
    },
    {
      id: 'email-5',
      senderName: 'Global Logistics Express',
      senderEmail: 'tracking-update@fedx-express-delivery.net',
      recipientEmail: 'student@studyverse.edu',
      subject: 'Parcel Delivery Failed: Address Incomplete [#FDX-9982]',
      date: 'Today, 08:30 AM',
      bodyText:
        'Your scheduled parcel could not be delivered due to an invalid postal address. Please open the attached electronic shipping manifest and fill out the customs clearance sheet within 24 hours to prevent your package from being returned to sender.',
      attachmentName: 'Shipping_Manifest_Invoice_FDX9982.zip',
      isPhishing: true,
      explanation:
        'This is a malware dropper distribution email. The sender is a spoofed courier domain (`fedx` misspelled), the lure relies on curiosity about an unexpected package, and the attachment is a compressed `.zip` file likely containing an executable or malicious script.',
      indicators: ['Misspelled courier domain (fedx)', 'Dangerous zip archive attachment', 'Delivery failure panic lure'],
    },
  ];

  const [activeEmailIndex, setActiveEmailIndex] = useState(0);
  const [userDecisions, setUserDecisions] = useState<Record<string, { choice: 'phishing' | 'legitimate'; isCorrect: boolean }>>({});
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const activeEmail = EMAILS[activeEmailIndex];
  const decision = userDecisions[activeEmail.id];

  const handleClassify = (choice: 'phishing' | 'legitimate') => {
    const isCorrect = (choice === 'phishing') === activeEmail.isPhishing;
    const nextDecisions = {
      ...userDecisions,
      [activeEmail.id]: { choice, isCorrect },
    };
    setUserDecisions(nextDecisions);

    const answeredCount = Object.keys(nextDecisions).length;
    if (answeredCount >= 1) onStepComplete?.(1);
    if (answeredCount >= EMAILS.length) {
      onStepComplete?.(2);
      onStepComplete?.(3);
      onSimulationSuccess?.();
    }
  };

  const score = Object.values(userDecisions).filter((d) => d.isCorrect).length;
  const totalAnswered = Object.keys(userDecisions).length;

  return (
    <div className="simulation-phishing-root">
      {/* Triage Dashboard Header */}
      <div className="phish-triage-stats">
        <div className="stat-pill">
          <span className="pill-label">Triage Progress:</span>
          <span className="pill-value">{totalAnswered} / {EMAILS.length} Evaluated</span>
        </div>
        <div className="stat-pill">
          <span className="pill-label">Accuracy Score:</span>
          <span className="pill-value text-cyan">{score} Correct ({totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0}%)</span>
        </div>
        <div className="stat-pill">
          <span className="pill-label">Detection Status:</span>
          <span className={`pill-value ${score === EMAILS.length ? 'text-green' : 'text-amber'}`}>
            {totalAnswered === EMAILS.length ? (score >= 4 ? '🛡️ SOC CERTIFIED' : '⚠️ REVIEW NEEDED') : 'ANALYZING QUEUE'}
          </span>
        </div>
      </div>

      <div className="phish-workbench-grid">
        {/* Left Column: Email Quarantine Queue */}
        <div className="phish-queue-list">
          <div className="queue-header">
            <span>Quarantined Mailbox Queue</span>
            <span className="queue-badge">{EMAILS.length}</span>
          </div>

          <div className="queue-items">
            {EMAILS.map((email, idx) => {
              const res = userDecisions[email.id];
              const isSelected = idx === activeEmailIndex;

              return (
                <button
                  type="button"
                  key={email.id}
                  className={`queue-item-card ${isSelected ? 'is-selected' : ''} ${
                    res ? (res.isCorrect ? 'evaluated-correct' : 'evaluated-wrong') : ''
                  }`}
                  onClick={() => {
                    setActiveEmailIndex(idx);
                    setHoveredLink(null);
                  }}
                >
                  <div className="item-top">
                    <span className="item-sender">{email.senderName}</span>
                    <span className="item-date">{email.date}</span>
                  </div>
                  <div className="item-subject">{email.subject}</div>
                  <div className="item-footer">
                    {res ? (
                      <span className={`item-decision ${res.isCorrect ? 'text-green' : 'text-red'}`}>
                        {res.choice === 'phishing' ? '🚩 Marked Phishing' : '✅ Marked Legitimate'} (
                        {res.isCorrect ? 'Correct' : 'Wrong'})
                      </span>
                    ) : (
                      <span className="item-status-pending">Awaiting Review</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Email Inspection View */}
        <div className="phish-viewer-panel">
          <div className="email-header-envelope">
            <div className="envelope-row">
              <span className="env-label">From:</span>
              <span className="env-value">
                <strong>{activeEmail.senderName}</strong>{' '}
                <code className="font-mono text-cyan">&lt;{activeEmail.senderEmail}&gt;</code>
              </span>
            </div>
            <div className="envelope-row">
              <span className="env-label">To:</span>
              <span className="env-value font-mono">{activeEmail.recipientEmail}</span>
            </div>
            <div className="envelope-row">
              <span className="env-label">Subject:</span>
              <span className="env-value font-bold">{activeEmail.subject}</span>
            </div>
          </div>

          {/* Email Body Content */}
          <div className="email-body-pane">
            <div className="email-prose">
              {activeEmail.bodyText.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Action Button & Link Hover Preview */}
            {activeEmail.actionButtonText && (
              <div className="email-action-box">
                <a
                  href="#phish-link-preview"
                  className="mock-email-action-btn"
                  onClick={(e) => e.preventDefault()}
                  onMouseEnter={() => setHoveredLink(activeEmail.actualDestinationUrl || null)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {activeEmail.actionButtonText}
                </a>

                <div className="displayed-link-note">
                  Visible Text Displays: <code>{activeEmail.displayedLinkUrl}</code>
                </div>

                {hoveredLink && (
                  <div className="hover-link-tooltip">
                    <span className="tooltip-label">⚠️ Browser Link Destination Preview:</span>
                    <code className="font-mono tooltip-url">{hoveredLink}</code>
                  </div>
                )}
              </div>
            )}

            {/* Attachment preview if present */}
            {activeEmail.attachmentName && (
              <div className="email-attachment-box">
                <span className="att-icon">📎</span>
                <div className="att-info">
                  <span className="att-name font-mono">{activeEmail.attachmentName}</span>
                  <span className="att-sub text-amber">Warning: Compressed Archive File</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Classification Controls */}
          <div className="email-triage-controls">
            {!decision ? (
              <div className="triage-action-bar">
                <span className="triage-prompt">Classify this message:</span>
                <button
                  type="button"
                  className="btn-triage btn-mark-phishing"
                  onClick={() => handleClassify('phishing')}
                >
                  🚩 Phishing Attack
                </button>
                <button
                  type="button"
                  className="btn-triage btn-mark-legitimate"
                  onClick={() => handleClassify('legitimate')}
                >
                  ✅ Legitimate Communication
                </button>
              </div>
            ) : (
              <div className={`triage-feedback-card ${decision.isCorrect ? 'card-success' : 'card-warning'}`}>
                <div className="feedback-head">
                  <span className="feedback-icon">{decision.isCorrect ? '🎯' : '⚠️'}</span>
                  <h4>
                    {decision.isCorrect
                      ? `Correct! This is indeed ${activeEmail.isPhishing ? 'Phishing' : 'Legitimate'}.`
                      : `Incorrect Determination. This is actually ${activeEmail.isPhishing ? 'Phishing' : 'Legitimate'}.`}
                  </h4>
                </div>
                <p className="feedback-text">{activeEmail.explanation}</p>
                <div className="feedback-indicators">
                  <span className="ind-label">Key Clues & Indicators:</span>
                  <div className="ind-tags">
                    {activeEmail.indicators.map((ind, iIdx) => (
                      <span key={iIdx} className="ind-tag font-mono">
                        ✓ {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

