import { useState } from 'react';

interface OsintSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function OsintSimulation({ onStepComplete, onSimulationSuccess }: OsintSimulationProps) {
  const [activeTab, setActiveTab] = useState<'whois' | 'git' | 'social'>('whois');
  const [whoisQuery, setWhoisQuery] = useState('alexmorgan-tech.net');
  const [whoisExecuted, setWhoisExecuted] = useState(false);

  const [gitCommitViewed, setGitCommitViewed] = useState(false);
  const [discoveredCredentials, setDiscoveredCredentials] = useState(false);

  const handleRunWhois = () => {
    setWhoisExecuted(true);
    onStepComplete?.(1);
  };

  const handleInspectCommit = () => {
    setGitCommitViewed(true);
    onStepComplete?.(2);
  };

  const handleFlagSecret = () => {
    setDiscoveredCredentials(true);
    onStepComplete?.(3);
    onSimulationSuccess?.();
  };

  return (
    <div className="simulation-osint-root">
      <div className="osint-tabs-bar">
        <button
          type="button"
          className={`osint-tab-btn ${activeTab === 'whois' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('whois')}
        >
          🌐 1. WHOIS & Domain Lookup
        </button>
        <button
          type="button"
          className={`osint-tab-btn ${activeTab === 'git' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('git')}
        >
          📂 2. Public Git Repository Commits
        </button>
        <button
          type="button"
          className={`osint-tab-btn ${activeTab === 'social' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          👤 3. Social Footprint Correlation
        </button>
      </div>

      <div className="osint-tab-content">
        {activeTab === 'whois' && (
          <div className="osint-panel">
            <div className="sim-field-group">
              <label htmlFor="osint-whois-target">Query Target Domain</label>
              <div className="whois-input-row font-mono">
                <input
                  id="osint-whois-target"
                  type="text"
                  className="sim-input"
                  value={whoisQuery}
                  onChange={(e) => setWhoisQuery(e.target.value)}
                />
                <button type="button" className="btn-sim-action" onClick={handleRunWhois}>
                  Run WHOIS Query
                </button>
              </div>
            </div>

            {whoisExecuted ? (
              <div className="whois-results-box font-mono">
                <div className="whois-line text-cyan">Domain Name: alexmorgan-tech.net</div>
                <div className="whois-line">Registry Domain ID: 99823412_DOMAIN_NET-VRSN</div>
                <div className="whois-line">Registrar: NameHost Global Services LLC</div>
                <div className="whois-line text-amber">Registrant Name: Alex Morgan</div>
                <div className="whois-line text-amber">Registrant Email: <strong>alex.m92@fictionalmail.com</strong></div>
                <div className="whois-line">Name Server: ns1.clouddns-staging.org</div>
                <div className="whois-line text-green">
                  [!] CLUE DISCOVERED: Found personal email `alex.m92@fictionalmail.com` and username handle prefix `alexm92`!
                </div>
              </div>
            ) : (
              <div className="whois-placeholder">
                Click "Run WHOIS Query" to look up public domain registration metadata.
              </div>
            )}
          </div>
        )}

        {activeTab === 'git' && (
          <div className="osint-panel">
            <div className="git-repo-header font-mono">
              <span>GitHub / alexm92 / smart-auth-gateway</span>
              <span className="repo-badge">Public Repository</span>
            </div>

            <div className="git-commits-list">
              <div className="commit-item">
                <div className="commit-meta font-mono">
                  <span className="commit-hash text-cyan">commit a4f8e12</span>
                  <span className="commit-author">alexm92 &lt;alex.m92@fictionalmail.com&gt;</span>
                  <span className="commit-date">2 days ago</span>
                </div>
                <div className="commit-msg">"Cleanup and remove staging test credentials before release"</div>
                <button
                  type="button"
                  className="btn-inspect-diff"
                  onClick={handleInspectCommit}
                >
                  🔍 View Git Diff / Past Revisions
                </button>

                {gitCommitViewed && (
                  <div className="commit-diff-box font-mono">
                    <div className="diff-header">diff --git a/config/staging.env b/config/staging.env</div>
                    <div className="diff-line diff-del text-red">
                      - DB_PASSWORD="Staging_Database_Secret_Pass_2026!"
                    </div>
                    <div className="diff-line diff-add text-green">
                      + DB_PASSWORD=process.env.DB_PASSWORD
                    </div>

                    <div className="diff-alert-box">
                      <span className="alert-text">
                        🚨 CRITICAL LEAK: Deleting a secret in a commit does not wipe it from Git history!
                      </span>
                      <button
                        type="button"
                        className="btn-flag-secret"
                        onClick={handleFlagSecret}
                      >
                        🎯 Flag Leaked Staging Credential
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="osint-panel">
            <div className="social-cards-grid">
              <div className="social-card">
                <div className="social-card-head">
                  <span className="social-network">🐦 Twitter / X Profile</span>
                  <span className="social-handle font-mono">@alexm_sec</span>
                </div>
                <p className="social-bio">
                  "Founder & Developer. Building smart-auth-gateway. Love cybersecurity and coffee ☕"
                </p>
                <div className="social-post">
                  "Just pushed our backend staging repository! Check out my GitHub under alexm92."
                </div>
              </div>

              <div className="social-card">
                <div className="social-card-head">
                  <span className="social-network">💼 Developer Forum</span>
                  <span className="social-handle font-mono">alexm92</span>
                </div>
                <div className="social-post">
                  "Having trouble connecting PostgreSQL to ns1.clouddns-staging.org with password authentication..."
                </div>
              </div>
            </div>

            {discoveredCredentials && (
              <div className="osint-synthesis-card">
                <div className="synth-title">🎯 Threat Reconnaissance Report Synthesized:</div>
                <ul className="synth-list font-mono">
                  <li>Target Identity: Alex Morgan (@alexm_sec / alexm92)</li>
                  <li>Leaked Staging Password: Staging_Database_Secret_Pass_2026!</li>
                  <li>Target Infrastructure Host: ns1.clouddns-staging.org</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

