import { useState } from 'react';

interface FirewallSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

interface FirewallRule {
  id: string;
  order: number;
  sourceIp: string;
  destPort: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  action: 'ALLOW' | 'DROP';
  description: string;
}

interface TestPacket {
  id: string;
  name: string;
  srcIp: string;
  dstPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  description: string;
}

export function FirewallSimulation({ onStepComplete, onSimulationSuccess }: FirewallSimulationProps) {
  const [rules, setRules] = useState<FirewallRule[]>([
    {
      id: 'r1',
      order: 1,
      sourceIp: 'Any (0.0.0.0/0)',
      destPort: '80',
      protocol: 'TCP',
      action: 'ALLOW',
      description: 'Allow public HTTP web traffic',
    },
    {
      id: 'r2',
      order: 2,
      sourceIp: 'Any (0.0.0.0/0)',
      destPort: '443',
      protocol: 'TCP',
      action: 'ALLOW',
      description: 'Allow public HTTPS encrypted web traffic',
    },
    {
      id: 'r3',
      order: 3,
      sourceIp: '10.0.0.0/24',
      destPort: '22',
      protocol: 'TCP',
      action: 'ALLOW',
      description: 'Allow SSH remote administration ONLY from internal management subnet',
    },
    {
      id: 'r4',
      order: 4,
      sourceIp: 'Any (0.0.0.0/0)',
      destPort: 'Any',
      protocol: 'TCP',
      action: 'DROP',
      description: 'Default-Deny: Implicit drop all other unapproved TCP traffic',
    },
  ]);

  const TEST_PACKETS: TestPacket[] = [
    {
      id: 'p1',
      name: 'Legitimate Web Visitor',
      srcIp: '198.51.100.44',
      dstPort: 443,
      protocol: 'TCP',
      description: 'Public student accessing HTTPS website portal',
    },
    {
      id: 'p2',
      name: 'Authorized Admin SSH Session',
      srcIp: '10.0.0.15',
      dstPort: 22,
      protocol: 'TCP',
      description: 'Internal engineer SSH from management subnet 10.0.0.0/24',
    },
    {
      id: 'p3',
      name: 'Malicious External SSH Brute Force',
      srcIp: '203.0.113.89',
      dstPort: 22,
      protocol: 'TCP',
      description: 'Foreign internet IP attempting unauthorized root SSH access',
    },
    {
      id: 'p4',
      name: 'Telnet Probe (Insecure Port 23)',
      srcIp: '192.0.2.77',
      dstPort: 23,
      protocol: 'TCP',
      description: 'Automated worm scanning for legacy unencrypted Telnet service',
    },
    {
      id: 'p5',
      name: 'Database Direct Connection (Port 3306)',
      srcIp: '198.51.100.200',
      dstPort: 3306,
      protocol: 'TCP',
      description: 'External caller trying to directly access MySQL database port',
    },
  ];

  const [selectedPacket, setSelectedPacket] = useState<TestPacket>(TEST_PACKETS[0]);
  const [evaluationResult, setEvaluationResult] = useState<{
    matchedRule: FirewallRule;
    action: 'ALLOW' | 'DROP';
    path: Array<{ ruleId: string; evaluated: boolean; matched: boolean }>;
    explanation: string;
  } | null>(null);

  const [newSrcIp, setNewSrcIp] = useState('192.168.1.0/24');
  const [newPort, setNewPort] = useState('8080');
  const [newAction, setNewAction] = useState<'ALLOW' | 'DROP'>('ALLOW');

  const handleTestPacket = () => {
    const path: Array<{ ruleId: string; evaluated: boolean; matched: boolean }> = [];
    let matchedRule: FirewallRule | null = null;

    for (const rule of rules) {
      const portMatch = rule.destPort === 'Any' || parseInt(rule.destPort) === selectedPacket.dstPort;
      let ipMatch = false;
      if (rule.sourceIp.includes('Any')) {
        ipMatch = true;
      } else if (rule.sourceIp === '10.0.0.0/24') {
        ipMatch = selectedPacket.srcIp.startsWith('10.0.0.');
      } else if (rule.sourceIp === selectedPacket.srcIp) {
        ipMatch = true;
      }

      const isMatch = portMatch && ipMatch;
      path.push({ ruleId: rule.id, evaluated: true, matched: isMatch });

      if (isMatch) {
        matchedRule = rule;
        break;
      }
    }

    if (!matchedRule) {
      matchedRule = rules[rules.length - 1];
    }

    const explanation =
      matchedRule.action === 'ALLOW'
        ? `Packet ACCEPTED by Rule #${matchedRule.order} (${matchedRule.description}). Traffic matched approved criteria.`
        : `Packet DROPPED by Rule #${matchedRule.order} (${matchedRule.description}). Traffic rejected by default-deny security policy.`;

    setEvaluationResult({
      matchedRule,
      action: matchedRule.action,
      path,
      explanation,
    });

    onStepComplete?.(2);
    if (selectedPacket.id === 'p3' && matchedRule.action === 'DROP') {
      onSimulationSuccess?.();
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule: FirewallRule = {
      id: `r_${Date.now()}`,
      order: rules.length,
      sourceIp: newSrcIp,
      destPort: newPort,
      protocol: 'TCP',
      action: newAction,
      description: `Custom ${newAction} rule for port ${newPort}`,
    };

    const updated = [...rules];
    updated.splice(updated.length - 1, 0, newRule);
    updated.forEach((r, idx) => {
      r.order = idx + 1;
    });

    setRules(updated);
    onStepComplete?.(3);
  };

  return (
    <div className="simulation-firewall-root">
      <div className="fw-grid-layout">
        {/* Left Column: Active Firewall Rule Set Table */}
        <div className="fw-card fw-rules-table-card">
          <div className="sim-card-header">
            <span className="window-title">🛡️ Stateful Ingress Filter Rule Table (Evaluated Sequentially)</span>
          </div>

          <div className="sim-card-body">
            <div className="rules-table-wrapper">
              <table className="fw-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Source IP</th>
                    <th>Port</th>
                    <th>Proto</th>
                    <th>Action</th>
                    <th>Policy Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((r) => {
                    const isMatchedInEval = evaluationResult?.matchedRule.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        className={`rule-row ${isMatchedInEval ? 'row-matched' : ''} ${
                          r.action === 'ALLOW' ? 'row-allow' : 'row-drop'
                        }`}
                      >
                        <td className="font-mono text-cyan">#{r.order}</td>
                        <td className="font-mono">{r.sourceIp}</td>
                        <td className="font-mono font-bold">{r.destPort}</td>
                        <td className="font-mono">{r.protocol}</td>
                        <td>
                          <span className={`badge-action ${r.action === 'ALLOW' ? 'badge-allow' : 'badge-drop'}`}>
                            {r.action}
                          </span>
                        </td>
                        <td className="rule-desc">{r.description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Quick Add Custom Rule Form */}
            <form onSubmit={handleAddRule} className="fw-add-rule-form">
              <div className="add-rule-title">➕ Append Ingress Rule (Inserted Before Default Drop)</div>
              <div className="add-rule-inputs">
                <input
                  type="text"
                  className="sim-input font-mono"
                  placeholder="Source IP (e.g. 192.168.1.0/24)"
                  value={newSrcIp}
                  onChange={(e) => setNewSrcIp(e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="sim-input font-mono"
                  placeholder="Port (e.g. 8080)"
                  value={newPort}
                  onChange={(e) => setNewPort(e.target.value)}
                  required
                />
                <select
                  className="sim-input font-mono"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                >
                  <option value="ALLOW">ALLOW</option>
                  <option value="DROP">DROP</option>
                </select>
                <button type="submit" className="btn-sim-action">
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Synthetic Packet Generator & Trace Inspector */}
        <div className="fw-card fw-packet-card">
          <div className="sim-card-header db-header">
            <span className="window-title">📦 Synthetic Packet Inspection & Tracer</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label>Select Test Packet to Send Through Firewall:</label>
              <div className="packet-preset-buttons">
                {TEST_PACKETS.map((pkt) => (
                  <button
                    type="button"
                    key={pkt.id}
                    className={`btn-packet-preset ${selectedPacket.id === pkt.id ? 'is-active-packet' : ''}`}
                    onClick={() => {
                      setSelectedPacket(pkt);
                      setEvaluationResult(null);
                      onStepComplete?.(1);
                    }}
                  >
                    <div className="pkt-top">
                      <span className="pkt-name">{pkt.name}</span>
                      <span className="pkt-port font-mono">Port {pkt.dstPort}</span>
                    </div>
                    <div className="pkt-meta font-mono">Src: {pkt.srcIp}</div>
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="btn-sim-action btn-fire-packet" onClick={handleTestPacket}>
              ⚡ Inject Selected Packet Through Firewall
            </button>

            {evaluationResult && (
              <div className={`eval-result-card ${evaluationResult.action === 'ALLOW' ? 'res-allow' : 'res-drop'}`}>
                <div className="eval-head">
                  <span className="eval-icon">{evaluationResult.action === 'ALLOW' ? '✅' : '🛑'}</span>
                  <h4>
                    Verdict: PACKET {evaluationResult.action}ED (Matched Rule #{evaluationResult.matchedRule.order})
                  </h4>
                </div>

                <p className="eval-explanation">{evaluationResult.explanation}</p>

                <div className="eval-path-tracer font-mono">
                  <div className="tracer-label">Sequential Evaluation Trace:</div>
                  {rules.map((r) => {
                    const step = evaluationResult.path.find((p) => p.ruleId === r.id);
                    if (!step) {
                      return (
                        <div key={r.id} className="trace-item text-subtle">
                          Rule #{r.order}: Skipped (Evaluation stopped at earlier match)
                        </div>
                      );
                    }
                    return (
                      <div
                        key={r.id}
                        className={`trace-item ${step.matched ? 'trace-hit text-green font-bold' : 'trace-miss text-subtle'}`}
                      >
                        Rule #{r.order} ({r.sourceIp}:{r.destPort}): {step.matched ? '✓ MATCHED -> APPLIED VERDICT' : '✗ No match'}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

