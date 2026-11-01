import { useState } from 'react';

interface CloudSecuritySimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function CloudSecuritySimulation({ onStepComplete, onSimulationSuccess }: CloudSecuritySimulationProps) {
  const [isHardened, setIsHardened] = useState(false);
  const [testResult, setTestResult] = useState<{
    status: number;
    message: string;
    isLeaked: boolean;
    data?: string;
  } | null>(null);

  const VULNERABLE_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::studyverse-finance-backups/*"
    }
  ]
}`;

  const SECURE_POLICY = `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceTLSRequestsOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::studyverse-finance-backups/*",
      "Condition": {
        "Bool": { "aws:SecureTransport": "false" }
      }
    },
    {
      "Sid": "RestrictToFinanceRoleAndVPC",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/FinanceWorkerRole"
      },
      "Action": [ "s3:GetObject" ],
      "Resource": "arn:aws:s3:::studyverse-finance-backups/*",
      "Condition": {
        "StringEquals": {
          "aws:sourceVpce": "vpce-01a2b3c4d5e6f7g8h"
        }
      }
    }
  ]
}`;

  const handleTestCurl = () => {
    if (!isHardened) {
      setTestResult({
        status: 200,
        message: 'HTTP/2 200 OK — Object retrieved anonymously from public internet!',
        isLeaked: true,
        data: 'CONFIDENTIAL: Q3 Financial Ledger\n- Total Student Grants: $4,500,000\n- Operating Reserve: $12,800,000\n- Bank Swift: SVBKUS33XXX',
      });
      onStepComplete?.(1);
      onStepComplete?.(2);
    } else {
      setTestResult({
        status: 403,
        message: 'HTTP/2 403 Forbidden — AccessDenied: Anonymous caller does not satisfy IAM Role or VPC condition.',
        isLeaked: false,
      });
      onStepComplete?.(3);
      onSimulationSuccess?.();
    }
  };

  return (
    <div className="simulation-cloud-root">
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Active Cloud Policy:</span>
          <span className={`sim-mode-tag ${isHardened ? 'is-secure' : 'is-vulnerable'}`}>
            {isHardened ? '🛡️ Hardened IAM Least Privilege (VPC Scoped)' : '⚠️ Overly Permissive Wildcard (Principal: *)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isHardened}
              onChange={(e) => {
                setIsHardened(e.target.checked);
                setTestResult(null);
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isHardened ? 'Secure Policy' : 'Insecure Policy'}</span>
        </div>
      </div>

      <div className="cloud-grid-layout">
        <div className="cloud-card">
          <div className="sim-card-header">
            <span className="window-title">☁️ AWS S3 Resource Policy Editor: studyverse-finance-backups</span>
          </div>

          <div className="sim-card-body">
            <div className="policy-editor-box font-mono">
              <pre className="policy-json-code">
                {isHardened ? SECURE_POLICY : VULNERABLE_POLICY}
              </pre>
            </div>

            <div className="policy-actions-row">
              <button
                type="button"
                className={`btn-sim-action ${isHardened ? 'btn-danger' : 'btn-secure'}`}
                onClick={() => {
                  setIsHardened(!isHardened);
                  setTestResult(null);
                }}
              >
                {isHardened ? '↩️ Revert to Permissive Wildcard' : '🛡️ Deploy Hardened IAM Least Privilege Policy'}
              </button>
            </div>
          </div>
        </div>

        <div className="cloud-card">
          <div className="sim-card-header db-header">
            <span className="window-title">💻 Anonymous Internet Caller Probe</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label>Simulate External Anonymous Download (curl probe):</label>
              <div className="curl-cmd-display font-mono text-cyan">
                $ curl -I https://studyverse-finance-backups.s3.amazonaws.com/q3_ledger.pdf
              </div>
            </div>

            <button type="button" className="btn-sim-action" onClick={handleTestCurl}>
              🚀 Execute Public Download Probe
            </button>

            {testResult && (
              <div
                className={`cloud-test-result font-mono ${
                  testResult.isLeaked ? 'result-leak' : 'result-blocked'
                }`}
              >
                <div className="result-head">
                  <span className="result-icon">{testResult.isLeaked ? '🚨' : '🛡️'}</span>
                  <span className="result-status">{testResult.message}</span>
                </div>

                {testResult.isLeaked && testResult.data && (
                  <div className="leaked-data-box">
                    <span className="leaked-label">[EXPOSED SENSITIVE DATA EXTRACTED]:</span>
                    <pre className="leaked-content">{testResult.data}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

