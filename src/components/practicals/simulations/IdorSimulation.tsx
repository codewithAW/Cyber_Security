import { useState } from 'react';

interface IdorSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function IdorSimulation({ onStepComplete, onSimulationSuccess }: IdorSimulationProps) {
  const [requestedId, setRequestedId] = useState('1042');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [responseLog, setResponseLog] = useState<{
    status: number;
    statusText: string;
    payload: any;
    isUnauthorizedLeak: boolean;
  } | null>(null);

  const DATABASE_RECORDS: Record<string, { name: string; age: number; condition: string; notes: string }> = {
    '1042': {
      name: 'Alice Cooper (Logged-in Student)',
      age: 21,
      condition: 'Seasonal Allergies',
      notes: 'Standard antihistamine prescription renewed.',
    },
    '1043': {
      name: 'Bob Henderson (Unauthorized Patient)',
      age: 48,
      condition: 'Cardiovascular Hypertension',
      notes: 'CONFIDENTIAL: Patient undergoing private cardiology treatment. Strictly confidential.',
    },
    '1044': {
      name: 'Charlie Miller (Unauthorized Patient)',
      age: 34,
      condition: 'Orthopedic Fracture Repair',
      notes: 'Physical therapy referral approved.',
    },
  };

  const handleFetch = () => {
    const id = requestedId.trim();

    if (!isSecureMode) {
      const record = DATABASE_RECORDS[id];
      if (record) {
        const isLeak = id !== '1042';
        setResponseLog({
          status: 200,
          statusText: '200 OK',
          payload: record,
          isUnauthorizedLeak: isLeak,
        });

        if (id === '1042') {
          onStepComplete?.(1);
        } else {
          onStepComplete?.(2);
          onSimulationSuccess?.();
        }
      } else {
        setResponseLog({
          status: 404,
          statusText: '404 Not Found',
          payload: { error: 'Record not found.' },
          isUnauthorizedLeak: false,
        });
      }
    } else {
      if (id === '1042') {
        setResponseLog({
          status: 200,
          statusText: '200 OK',
          payload: DATABASE_RECORDS['1042'],
          isUnauthorizedLeak: false,
        });
        onStepComplete?.(1);
      } else {
        setResponseLog({
          status: 403,
          statusText: '403 Forbidden',
          payload: {
            error: 'Access Denied: Authenticated session user (Alice #1042) does not have permission for record #' + id,
            securityPolicy: 'Tenant Ownership Enforcement (record.patientId === session.userId)',
          },
          isUnauthorizedLeak: false,
        });
        onStepComplete?.(3);
      }
    }
  };

  return (
    <div className="simulation-idor-root">
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Authorization Engine:</span>
          <span className={`sim-mode-tag ${isSecureMode ? 'is-secure' : 'is-vulnerable'}`}>
            {isSecureMode ? '🛡️ Session-Scoped Ownership Validation' : '⚠️ Blind Direct Object Lookup (IDOR)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isSecureMode}
              onChange={(e) => {
                setIsSecureMode(e.target.checked);
                setResponseLog(null);
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isSecureMode ? 'Secure Authorization' : 'Vulnerable Direct ID'}</span>
        </div>
      </div>

      <div className="idor-grid-layout">
        <div className="idor-card">
          <div className="sim-card-header">
            <span className="window-title">📡 REST API Request Inspector</span>
          </div>

          <div className="sim-card-body">
            <div className="session-token-box">
              <span className="token-label">Current Authenticated Session:</span>
              <div className="token-details font-mono">
                <span>User: <strong>Alice (ID: 1042)</strong></span>
                <span>Role: PATIENT</span>
                <span>Session JWT: <code className="text-cyan">eyJhbGci...sub:1042</code></span>
              </div>
            </div>

            <div className="sim-field-group">
              <label htmlFor="idor-api-url">API Endpoint URL (Tamper with :id parameter)</label>
              <div className="api-url-input-wrap font-mono">
                <span className="url-prefix">GET /api/v1/records/</span>
                <input
                  id="idor-api-url"
                  type="text"
                  className="url-id-input text-cyan"
                  value={requestedId}
                  onChange={(e) => setRequestedId(e.target.value)}
                />
              </div>
            </div>

            <div className="quick-ids-row">
              <span className="quick-label">Try IDs:</span>
              <button
                type="button"
                className="btn-quick-payload"
                onClick={() => setRequestedId('1042')}
              >
                1042 (Alice - My Record)
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => setRequestedId('1043')}
              >
                1043 (Bob - Foreign)
              </button>
              <button
                type="button"
                className="btn-quick-payload payload-warn"
                onClick={() => setRequestedId('1044')}
              >
                1044 (Charlie - Foreign)
              </button>
            </div>

            <div className="api-action-box">
              <button type="button" className="btn-sim-action" onClick={handleFetch}>
                ⚡ Send API Request
              </button>
            </div>
          </div>
        </div>

        <div className="idor-card">
          <div className="sim-card-header db-header">
            <span className="window-title">📄 Server HTTP Response Payload</span>
          </div>

          <div className="sim-card-body">
            {responseLog ? (
              <div className="idor-response-view font-mono">
                <div className="response-status-bar">
                  <span className="status-label">HTTP Status:</span>
                  <span
                    className={`status-code ${
                      responseLog.status === 200
                        ? responseLog.isUnauthorizedLeak
                          ? 'text-red font-bold'
                          : 'text-green'
                        : 'text-amber'
                    }`}
                  >
                    {responseLog.statusText}
                  </span>
                </div>

                {responseLog.isUnauthorizedLeak && (
                  <div className="leak-alert-pill">
                    🚨 CRITICAL IDOR LEAK: Unauthorized patient medical record exposed to Alice!
                  </div>
                )}

                <pre className="json-output-box">
                  {JSON.stringify(responseLog.payload, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="idor-empty-state">
                <p>Click "Send API Request" to observe server access control response.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

