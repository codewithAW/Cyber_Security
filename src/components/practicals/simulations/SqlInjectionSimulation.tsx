import React, { useState } from 'react';

interface SqlInjectionSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function SqlInjectionSimulation({ onStepComplete, onSimulationSuccess }: SqlInjectionSimulationProps) {
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('student123');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{
    type: 'idle' | 'success' | 'failure' | 'bypassed';
    title: string;
    message: string;
    user?: string;
    role?: string;
  }>({
    type: 'idle',
    title: 'Ready for Authentication',
    message: 'Enter credentials or an injection payload to test the login service.',
  });
  const [queryLog, setQueryLog] = useState<{
    rawSql: string;
    parameterizedSql?: string;
    params?: string[];
    executionTimeMs: number;
    rowsReturned: number;
    logicAltered: boolean;
  } | null>(null);

  const handleQuickFill = (type: 'valid' | 'sqli-bypass' | 'sqli-admin') => {
    if (type === 'valid') {
      setUsername('student');
      setPassword('student123');
    } else if (type === 'sqli-bypass') {
      setUsername("' OR '1'='1' --");
      setPassword('anything');
    } else if (type === 'sqli-admin') {
      setUsername("admin' --");
      setPassword('anything');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const u = username.trim();
    const p = password.trim();

    if (!isSecureMode) {
      // VULNERABLE MODE (Raw string concatenation simulation)
      const rawSql = `SELECT * FROM users WHERE username = '${u}' AND password = '${p}' LIMIT 1;`;

      // Check if tautology payload injected
      const isTautology =
        u.includes("' OR '1'='1'") ||
        u.includes("' or '1'='1'") ||
        u.includes("' OR 1=1") ||
        u.includes("' or 1=1") ||
        u.includes("admin' --") ||
        u.includes("admin'--");

      if (isTautology) {
        setQueryLog({
          rawSql,
          executionTimeMs: 14,
          rowsReturned: 1,
          logicAltered: true,
        });
        setLoginStatus({
          type: 'bypassed',
          title: '🚨 CRITICAL: Authentication Bypassed!',
          message:
            "The query logic was altered because metacharacters broke out of the literal string. The WHERE condition evaluated to TRUE, and the trailing comment symbol (--) neutralized the password check completely!",
          user: 'admin (Superuser)',
          role: 'ADMINISTRATOR',
        });
        onStepComplete?.(2);
        onSimulationSuccess?.();
      } else if (u === 'student' && p === 'student123') {
        setQueryLog({
          rawSql,
          executionTimeMs: 12,
          rowsReturned: 1,
          logicAltered: false,
        });
        setLoginStatus({
          type: 'success',
          title: '✅ Legitimate Login Successful',
          message: 'Authenticated as standard student test user. Query executed as intended with matched credentials.',
          user: 'student',
          role: 'STUDENT',
        });
        onStepComplete?.(1);
      } else {
        setQueryLog({
          rawSql,
          executionTimeMs: 11,
          rowsReturned: 0,
          logicAltered: false,
        });
        setLoginStatus({
          type: 'failure',
          title: '❌ Authentication Failed',
          message: 'Invalid credentials. The query found 0 matching rows.',
        });
      }
    } else {
      // SECURE MODE (Parameterized prepared statement simulation)
      const parameterizedSql = 'PREPARE auth_stmt FROM "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1";';
      const params = [u, p];

      if (u === 'student' && p === 'student123') {
        setQueryLog({
          rawSql: 'EXECUTE auth_stmt USING @param_user, @param_pass;',
          parameterizedSql,
          params,
          executionTimeMs: 15,
          rowsReturned: 1,
          logicAltered: false,
        });
        setLoginStatus({
          type: 'success',
          title: '✅ Secure Login Successful',
          message: 'Authenticated cleanly via parameterized query.',
          user: 'student',
          role: 'STUDENT',
        });
      } else {
        // Even if SQLi payload is entered, it is treated strictly as literal data!
        setQueryLog({
          rawSql: 'EXECUTE auth_stmt USING @param_user, @param_pass;',
          parameterizedSql,
          params,
          executionTimeMs: 16,
          rowsReturned: 0,
          logicAltered: false,
        });
        setLoginStatus({
          type: 'failure',
          title: '🛡️ Authentication Rejected (Secure Defended)',
          message:
            'The database received the SQL injection string strictly as a literal username value. No user exists with that literal name, so 0 rows were returned. The attack was completely neutralized!',
        });
        onStepComplete?.(3);
      }
    }
  };

  const handleReset = () => {
    setUsername('student');
    setPassword('student123');
    setIsSecureMode(false);
    setLoginStatus({
      type: 'idle',
      title: 'Ready for Authentication',
      message: 'Enter credentials or an injection payload to test the login service.',
    });
    setQueryLog(null);
  };

  return (
    <div className="simulation-sqli-root">
      {/* Simulation Mode Bar */}
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Active Mode:</span>
          <span className={`sim-mode-tag ${isSecureMode ? 'is-secure' : 'is-vulnerable'}`}>
            {isSecureMode ? '🛡️ Secure Application (Parameterized)' : '⚠️ Vulnerable Application (Raw Concatenation)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isSecureMode}
              onChange={(e) => {
                setIsSecureMode(e.target.checked);
                setLoginStatus({
                  type: 'idle',
                  title: e.target.checked ? 'Switched to Secure Mode' : 'Switched to Vulnerable Mode',
                  message: e.target.checked
                    ? 'Backend is now using parameterized prepared statements. Try running injection payloads!'
                    : 'Backend is now using raw string concatenation. SQL injection payloads will alter query logic.',
                });
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isSecureMode ? 'Secure Mode' : 'Vulnerable Mode'}</span>
        </div>
      </div>

      <div className="sqli-grid-layout">
        {/* Left Column: Simulated Web Login Form */}
        <div className="sqli-app-card">
          <div className="sim-card-header">
            <div className="window-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="window-title">https://internal-portal.studyverse.edu/login</span>
          </div>

          <div className="sim-card-body">
            <div className="app-login-brand">
              <div className="brand-icon-box">🔐</div>
              <h4>University Student & Staff Portal</h4>
              <p>Simulated Enterprise Authentication Gateway</p>
            </div>

            {/* Quick Fill Payload Buttons */}
            <div className="quick-fill-bar">
              <span className="quick-fill-label">Test Payloads:</span>
              <button
                type="button"
                className="btn-quick-payload"
                onClick={() => handleQuickFill('valid')}
              >
                Normal Login
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => handleQuickFill('sqli-bypass')}
              >
                ' OR '1'='1' --
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => handleQuickFill('sqli-admin')}
              >
                admin' --
              </button>
            </div>

            <form onSubmit={handleLogin} className="sim-login-form">
              <div className="sim-field-group">
                <label htmlFor="sqli-user">Username</label>
                <input
                  id="sqli-user"
                  type="text"
                  className="sim-input font-mono"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. student or ' OR '1'='1' --"
                  required
                />
              </div>

              <div className="sim-field-group">
                <label htmlFor="sqli-pass">Password</label>
                <input
                  id="sqli-pass"
                  type="text"
                  className="sim-input font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. student123"
                />
              </div>

              <div className="sim-form-actions">
                <button type="submit" className="btn-sim-action btn-login">
                  {isSecureMode ? '🛡️ Run Secure Auth' : '⚡ Perform Login Request'}
                </button>
                <button type="button" className="btn-sim-reset" onClick={handleReset}>
                  Reset Inputs
                </button>
              </div>
            </form>

            {/* Simulated Live Login Status Banner */}
            <div className={`sim-status-banner status-${loginStatus.type}`}>
              <div className="status-header">
                <span className="status-title">{loginStatus.title}</span>
                {loginStatus.role && <span className="status-role-badge">{loginStatus.role}</span>}
              </div>
              <p className="status-message">{loginStatus.message}</p>
              {loginStatus.user && (
                <div className="status-session-data">
                  <span>Logged in as: <strong>{loginStatus.user}</strong></span>
                  <span>Session Token: <code className="font-mono">sim_auth_token_77a9</code></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Database Activity Engine */}
        <div className="sqli-db-card">
          <div className="sim-card-header db-header">
            <span className="db-indicator">● LIVE DATABASE CONSOLE</span>
            <span className="db-engine-name">PostgreSQL 15 (Simulated Engine)</span>
          </div>

          <div className="sim-card-body db-body">
            <div className="db-query-visualization">
              <div className="db-section-label">Constructed Database Query:</div>
              {queryLog ? (
                <div className="db-code-view">
                  {isSecureMode && queryLog.parameterizedSql && (
                    <div className="sql-step">
                      <div className="sql-step-label">1. Compiled Prepared Statement Template:</div>
                      <pre className="sql-code-block text-cyan">{queryLog.parameterizedSql}</pre>
                    </div>
                  )}

                  <div className="sql-step">
                    <div className="sql-step-label">
                      {isSecureMode ? '2. Execution with Bound Literals:' : 'Direct Executed SQL Query:'}
                    </div>
                    <pre
                      className={`sql-code-block ${
                        queryLog.logicAltered ? 'text-red highlight-vuln' : 'text-green'
                      }`}
                    >
                      {queryLog.rawSql}
                    </pre>
                  </div>

                  {isSecureMode && queryLog.params && (
                    <div className="sql-params-list">
                      <div className="sql-step-label">Bound Parameters (Escaped Data Only):</div>
                      {queryLog.params.map((p, idx) => (
                        <div key={idx} className="param-item">
                          <span className="param-index">${idx + 1}:</span>
                          <span className="param-value font-mono">"{p}"</span>
                          <span className="param-type">(type: VARCHAR literal)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="db-empty-state">
                  <p>Awaiting authentication submission...</p>
                  <span>Submit the login form on the left to see database query reconstruction.</span>
                </div>
              )}
            </div>

            {/* Simulated Query Execution Stats */}
            {queryLog && (
              <div className="db-stats-bar">
                <div className="stat-item">
                  <span className="stat-label">Rows Returned:</span>
                  <span className={`stat-val ${queryLog.rowsReturned > 0 ? 'text-green' : 'text-amber'}`}>
                    {queryLog.rowsReturned} row(s)
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Execution Time:</span>
                  <span className="stat-val font-mono">{queryLog.executionTimeMs} ms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Logic Altered:</span>
                  <span className={`stat-val ${queryLog.logicAltered ? 'text-red font-bold' : 'text-green'}`}>
                    {queryLog.logicAltered ? 'YES (TAUTOLOGY INJECTED)' : 'NO'}
                  </span>
                </div>
              </div>
            )}

            {/* Educational Breakdown */}
            <div className="db-explanation-box">
              <div className="exp-title">💡 How this is evaluated in the engine:</div>
              {!isSecureMode ? (
                <p className="exp-text">
                  In vulnerable mode, the string <code className="font-mono text-red">' OR '1'='1' --</code> breaks
                  the SQL syntax. The engine evaluates <code className="font-mono">username = ''</code> (FALSE) OR{' '}
                  <code className="font-mono">'1'='1'</code> (TRUE). Because TRUE or anything is TRUE, the WHERE clause
                  matches the table rows, and <code className="font-mono">--</code> discards the rest of the password check!
                </p>
              ) : (
                <p className="exp-text">
                  In secure mode, the database separates code from data. The query template is compiled first. The string{' '}
                  <code className="font-mono text-cyan">' OR '1'='1' --</code> is stored strictly in memory as a literal
                  value for <code className="font-mono">$1</code>. The database looks for an actual user named{' '}
                  <code className="font-mono text-cyan">" ' OR '1'='1' -- "</code>, finding 0 matches.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

