import { useState } from 'react';

interface NetworkScanSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

interface NetworkHost {
  id: string;
  ip: string;
  hostname: string;
  os: string;
  role: string;
  ports: Array<{
    port: number;
    proto: string;
    state: 'open' | 'filtered' | 'closed';
    service: string;
    version: string;
    isVulnerable?: boolean;
    vulnNote?: string;
  }>;
}

export function NetworkScanSimulation({ onStepComplete, onSimulationSuccess }: NetworkScanSimulationProps) {
  const HOSTS: NetworkHost[] = [
    {
      id: 'host-gateway',
      ip: '192.168.1.1',
      hostname: 'gateway.studyverse.local',
      os: 'OpenWrt Linux 21.02',
      role: 'Subnet Router & DNS Forwarder',
      ports: [
        { port: 53, proto: 'udp', state: 'open', service: 'domain', version: 'dnsmasq 2.85' },
        { port: 80, proto: 'tcp', state: 'open', service: 'http', version: 'uHTTPd router web UI' },
        { port: 443, proto: 'tcp', state: 'open', service: 'ssl/https', version: 'uHTTPd' },
      ],
    },
    {
      id: 'host-staging',
      ip: '192.168.1.50',
      hostname: 'staging-app.studyverse.local',
      os: 'Ubuntu 22.04 LTS (Kernel 5.15)',
      role: 'Internal Staging Application & File Server',
      ports: [
        {
          port: 21,
          proto: 'tcp',
          state: 'open',
          service: 'ftp',
          version: 'vsftpd 2.3.4 (Anonymous Access Enabled)',
          isVulnerable: true,
          vulnNote: 'CRITICAL: Cleartext authentication and legacy backdoor version vsftpd 2.3.4 with anonymous uploads enabled!',
        },
        { port: 22, proto: 'tcp', state: 'open', service: 'ssh', version: 'OpenSSH 8.9p1 Ubuntu' },
        { port: 80, proto: 'tcp', state: 'open', service: 'http', version: 'nginx 1.18.0' },
        {
          port: 3306,
          proto: 'tcp',
          state: 'open',
          service: 'mysql',
          version: 'MySQL 5.5.62',
          isVulnerable: true,
          vulnNote: 'HIGH: Database listening on public interface 0.0.0.0 instead of 127.0.0.1 (localhost).',
        },
      ],
    },
    {
      id: 'host-workstation',
      ip: '192.168.1.105',
      hostname: 'dev-workstation-03.studyverse.local',
      os: 'Windows 11 Enterprise',
      role: 'Developer Desktop Workstation',
      ports: [
        { port: 135, proto: 'tcp', state: 'filtered', service: 'msrpc', version: 'Microsoft Windows RPC' },
        { port: 445, proto: 'tcp', state: 'filtered', service: 'microsoft-ds', version: 'SMB' },
        { port: 3389, proto: 'tcp', state: 'closed', service: 'ms-wbt-server', version: 'RDP Disabled' },
      ],
    },
  ];

  const [selectedHostId, setSelectedHostId] = useState<string>('host-staging');
  const [scanType, setScanType] = useState<'-sS' | '-sV'>('-sV');
  const [isScanning, setIsScanning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'StudyVerse Virtual Recon Terminal v2.4',
    'Type or select a host target and scan flag to perform reconnaissance.',
  ]);
  const [scanDone, setScanDone] = useState(false);

  const activeHost = HOSTS.find((h) => h.id === selectedHostId) || HOSTS[1];

  const handleRunScan = () => {
    setIsScanning(true);
    setScanDone(false);
    const cmd = `nmap ${scanType} -p 1-65535 -T4 ${activeHost.ip}`;

    setTerminalOutput([
      `$ ${cmd}`,
      `Starting Nmap 7.94 at ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC`,
      `Initiating SYN Stealth Scan against ${activeHost.hostname} (${activeHost.ip})...`,
    ]);

    setTimeout(() => {
      setTerminalOutput((prev) => [
        ...prev,
        `Scanning ${activeHost.ports.length} services...`,
        `Completed SYN Stealth Scan in 0.82s (1000 total ports scanned)`,
        `Nmap scan report for ${activeHost.hostname} (${activeHost.ip})`,
        `Host is up (0.00045s latency).`,
        `PORT     STATE    SERVICE     VERSION`,
        ...activeHost.ports.map(
          (p) => `${p.port.toString().padEnd(8)} ${p.state.padEnd(8)} ${p.service.padEnd(11)} ${p.version}`
        ),
        ``,
        `Nmap done: 1 IP address (1 host up) scanned.`,
      ]);
      setIsScanning(false);
      setScanDone(true);
      onStepComplete?.(1);
      if (scanType === '-sV') onStepComplete?.(2);
    }, 800);
  };

  const handleFlagFinding = (p: typeof activeHost.ports[0]) => {
    if (p.isVulnerable) {
      alert(`🎯 High-Risk Finding Verified!\n\nPort ${p.port} (${p.service}):\n${p.vulnNote}`);
      onStepComplete?.(3);
      onSimulationSuccess?.();
    } else {
      alert(`Port ${p.port} (${p.service}) appears to be a standard operational service.`);
    }
  };

  return (
    <div className="simulation-scan-root">
      <div className="scan-grid-layout">
        <div className="scan-card">
          <div className="sim-card-header">
            <span className="window-title">🌐 Subnet Architecture Topology: 192.168.1.0/24</span>
          </div>

          <div className="sim-card-body">
            <div className="subnet-hosts-list">
              {HOSTS.map((h) => {
                const isSelected = h.id === selectedHostId;
                return (
                  <button
                    type="button"
                    key={h.id}
                    className={`host-node-card ${isSelected ? 'host-selected' : ''}`}
                    onClick={() => {
                      setSelectedHostId(h.id);
                      setScanDone(false);
                    }}
                  >
                    <div className="node-icon">🖥️</div>
                    <div className="node-details">
                      <div className="node-ip font-mono text-cyan">{h.ip}</div>
                      <div className="node-host font-bold">{h.hostname}</div>
                      <div className="node-role text-subtle">{h.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="scan-controls-bar">
              <div className="sim-field-group">
                <label>Nmap Scan Profile:</label>
                <div className="scan-options-row">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="scanProfile"
                      checked={scanType === '-sS'}
                      onChange={() => setScanType('-sS')}
                    />
                    <span>-sS (SYN Stealth Scan)</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="scanProfile"
                      checked={scanType === '-sV'}
                      onChange={() => setScanType('-sV')}
                    />
                    <span>-sV (Service Version Detection)</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                className="btn-sim-action"
                onClick={handleRunScan}
                disabled={isScanning}
              >
                {isScanning ? '⏳ Probing Ports...' : `🚀 Scan Target ${activeHost.ip}`}
              </button>
            </div>
          </div>
        </div>

        <div className="scan-card">
          <div className="sim-card-header db-header">
            <span className="window-title">💻 Kali Terminal Output (CLI Emulation)</span>
          </div>

          <div className="sim-card-body">
            <div className="scan-terminal-screen font-mono">
              {terminalOutput.map((line, idx) => (
                <div key={idx} className="term-line">
                  {line}
                </div>
              ))}
            </div>

            {scanDone && (
              <div className="discovered-ports-panel">
                <div className="panel-title">🔎 Discovered Open Ports & Attack Surface Analysis:</div>
                <div className="port-items-grid">
                  {activeHost.ports.map((p) => (
                    <div
                      key={p.port}
                      className={`port-item-card ${p.isVulnerable ? 'port-vulnerable' : 'port-normal'}`}
                    >
                      <div className="port-head">
                        <span className="port-badge font-mono">{p.port}/{p.proto}</span>
                        <span className="port-state font-mono">{p.state}</span>
                      </div>
                      <div className="port-svc font-bold">{p.service}</div>
                      <div className="port-version font-mono text-subtle">{p.version}</div>

                      {p.isVulnerable && (
                        <div className="port-action-box">
                          <button
                            type="button"
                            className="btn-flag-vuln"
                            onClick={() => handleFlagFinding(p)}
                          >
                            ⚠️ Audit Vulnerability
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

