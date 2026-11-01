import { useState } from 'react';

interface MitmSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function MitmSimulation({ onStepComplete, onSimulationSuccess }: MitmSimulationProps) {
  const [isHttps, setIsHttps] = useState(false);
  const [clientMessage, setClientMessage] = useState('Transfer $500 to Account #101 (PIN: 1337)');
  const [attackerTampered, setAttackerTampered] = useState(false);
  const [attackerPayload, setAttackerPayload] = useState('Transfer $500 to Attacker Account #999');

  const [simulationState, setSimulationState] = useState<'idle' | 'in-flight' | 'intercepted' | 'delivered'>('idle');
  const [serverReceived, setServerReceived] = useState<string | null>(null);
  const [serverVerdict, setServerVerdict] = useState<string | null>(null);

  const handleTransmit = () => {
    setSimulationState('in-flight');
    setServerReceived(null);
    setServerVerdict(null);

    setTimeout(() => {
      setSimulationState('intercepted');

      setTimeout(() => {
        if (!isHttps) {
          const finalMsg = attackerTampered ? attackerPayload : clientMessage;
          setServerReceived(finalMsg);
          setServerVerdict(
            attackerTampered
              ? '🚨 COMPROMISED: Server executed attacker-tampered transaction! Plain HTTP lacks integrity checks.'
              : '⚠️ INSECURE: Server processed transaction, but credentials were eavesdropped in cleartext.'
          );
          setSimulationState('delivered');
          onStepComplete?.(1);
          if (attackerTampered) {
            onStepComplete?.(2);
            onSimulationSuccess?.();
          }
        } else {
          if (attackerTampered) {
            setServerReceived('[CORRUPTED CIPHERTEXT RECEIVED]');
            setServerVerdict(
              '🛡️ REJECTED: TLS 1.3 AEAD MAC verification failed! Server detected payload tampering and aborted session.'
            );
          } else {
            setServerReceived(clientMessage);
            setServerVerdict(
              '✅ SECURE: Transmitted securely over TLS 1.3. Server certificate validated by trusted CA.'
            );
          }
          setSimulationState('delivered');
          onStepComplete?.(3);
        }
      }, 700);
    }, 600);
  };

  const handleReset = () => {
    setIsHttps(false);
    setClientMessage('Transfer $500 to Account #101 (PIN: 1337)');
    setAttackerTampered(false);
    setAttackerPayload('Transfer $500 to Attacker Account #999');
    setSimulationState('idle');
    setServerReceived(null);
    setServerVerdict(null);
  };

  return (
    <div className="simulation-mitm-root">
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Protocol:</span>
          <span className={`sim-mode-tag ${isHttps ? 'is-secure' : 'is-vulnerable'}`}>
            {isHttps ? '🔒 Secure HTTPS (TLS 1.3 AEAD Encrypted)' : '⚠️ Cleartext HTTP (Unencrypted Insecure)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isHttps}
              onChange={(e) => {
                setIsHttps(e.target.checked);
                setServerReceived(null);
                setServerVerdict(null);
                setSimulationState('idle');
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isHttps ? 'HTTPS Mode' : 'HTTP Mode'}</span>
        </div>
      </div>

      <div className="mitm-diagram-container">
        <div className="mitm-node node-client">
          <div className="node-icon-box">💻</div>
          <div className="node-title">Victim Client</div>
          <div className="node-ip font-mono">192.168.1.100</div>
          <div className="node-status-bubble text-cyan">
            {isHttps ? 'TLS Verified Cert ✓' : 'Plaintext TCP'}
          </div>
        </div>

        <div className="mitm-link-wire">
          <div className="wire-label font-mono">{isHttps ? 'TLS Channel' : 'ARP Poisoned Link'}</div>
          <div className="wire-arrow">➔</div>
        </div>

        <div className={`mitm-node node-attacker ${isHttps ? 'attacker-blind' : 'attacker-active'}`}>
          <div className="node-icon-box">🦹</div>
          <div className="node-title">Attacker Proxy (MitM)</div>
          <div className="node-ip font-mono">192.168.1.55 (ARP Spoof)</div>
          <div className="node-status-bubble text-red">
            {isHttps ? 'Encrypted Noise' : 'Full Intercept & Tamper'}
          </div>
        </div>

        <div className="mitm-link-wire">
          <div className="wire-label font-mono">{isHttps ? 'Authenticated AEAD' : 'Forwarded Packet'}</div>
          <div className="wire-arrow">➔</div>
        </div>

        <div className="mitm-node node-server">
          <div className="node-icon-box">🏦</div>
          <div className="node-title">Bank Backend Server</div>
          <div className="node-ip font-mono">198.51.100.1</div>
          <div className="node-status-bubble text-green">
            {isHttps ? 'Port 443 (TLS Validated)' : 'Port 80 (Cleartext)'}
          </div>
        </div>
      </div>

      <div className="mitm-controls-grid">
        <div className="mitm-card">
          <div className="sim-card-header">
            <span className="window-title">📤 Client Outbound Request</span>
          </div>
          <div className="sim-card-body">
            <div className="sim-field-group">
              <label htmlFor="mitm-client-msg">Bank Transfer Payload</label>
              <input
                id="mitm-client-msg"
                type="text"
                className="sim-input font-mono"
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn-sim-action"
              onClick={handleTransmit}
              disabled={simulationState === 'in-flight'}
            >
              🚀 Send Transaction Over Network
            </button>
            <button type="button" className="btn-sim-reset" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        <div className="mitm-card">
          <div className="sim-card-header db-header">
            <span className="window-title">🕵️ Attacker Sniffing Console</span>
          </div>
          <div className="sim-card-body">
            <div className="intercepted-preview">
              <span className="preview-label">Packet Payload As Seen by Attacker:</span>
              <pre className={`font-mono intercept-box ${isHttps ? 'text-subtle' : 'text-red'}`}>
                {isHttps
                  ? '7f4b82d90a1e3f899b5a... [ENCRYPTED CIPHERTEXT NOISE]'
                  : clientMessage}
              </pre>
            </div>

            <div className="tamper-toggle-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={attackerTampered}
                  onChange={(e) => setAttackerTampered(e.target.checked)}
                  disabled={isHttps}
                />
                <span>Enable Active MitM Modification (Change Recipient Account)</span>
              </label>
            </div>

            {attackerTampered && !isHttps && (
              <div className="sim-field-group">
                <label htmlFor="mitm-tamper-payload">Attacker Injected Replacement Payload</label>
                <input
                  id="mitm-tamper-payload"
                  type="text"
                  className="sim-input font-mono text-red"
                  value={attackerPayload}
                  onChange={(e) => setAttackerPayload(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {serverVerdict && (
        <div className={`mitm-verdict-banner ${isHttps ? 'verdict-secure' : 'verdict-insecure'}`}>
          <div className="verdict-title">{serverVerdict}</div>
          <div className="verdict-received font-mono">
            <strong>Server Actually Processed:</strong> <span>{serverReceived}</span>
          </div>
        </div>
      )}
    </div>
  );
}

