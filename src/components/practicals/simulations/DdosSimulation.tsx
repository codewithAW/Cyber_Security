import { useState, useEffect } from 'react';

interface DdosSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function DdosSimulation({ onStepComplete, onSimulationSuccess }: DdosSimulationProps) {
  const [trafficMode, setTrafficMode] = useState<'normal' | 'syn-flood' | 'http-flood'>('normal');
  const [synCookiesEnabled, setSynCookiesEnabled] = useState(false);
  const [rateLimiterEnabled, setRateLimiterEnabled] = useState(false);
  const [wafScrubbingEnabled, setWafScrubbingEnabled] = useState(false);

  const [metrics, setMetrics] = useState({
    rps: 50,
    cpuPercent: 12,
    memoryPercent: 24,
    droppedPercent: 0,
    status: 'OPTIMAL (GREEN)',
  });

  useEffect(() => {
    let rps = 50;
    let baseCpu = 12;
    let baseMem = 24;
    let dropped = 0;

    if (trafficMode === 'syn-flood') {
      rps = 5000;
      baseCpu = 98;
      baseMem = 89;
      dropped = 68;

      if (synCookiesEnabled) {
        baseCpu -= 55;
        baseMem -= 45;
        dropped -= 45;
      }
      if (wafScrubbingEnabled) {
        baseCpu -= 22;
        baseMem -= 20;
        dropped = Math.max(0, dropped - 20);
      }
    } else if (trafficMode === 'http-flood') {
      rps = 2800;
      baseCpu = 94;
      baseMem = 82;
      dropped = 52;

      if (rateLimiterEnabled) {
        baseCpu -= 48;
        baseMem -= 35;
        dropped = Math.max(0, dropped - 35);
      }
      if (wafScrubbingEnabled) {
        baseCpu -= 28;
        baseMem -= 25;
        dropped = Math.max(0, dropped - 15);
      }
    }

    baseCpu = Math.max(12, Math.min(100, baseCpu));
    baseMem = Math.max(20, Math.min(100, baseMem));
    dropped = Math.max(0, Math.min(100, dropped));

    let status = 'OPTIMAL (GREEN)';
    if (baseCpu > 80) status = 'CRITICAL OVERLOAD (RED)';
    else if (baseCpu > 40) status = 'MODERATE STRESS (YELLOW)';

    setMetrics({
      rps,
      cpuPercent: baseCpu,
      memoryPercent: baseMem,
      droppedPercent: dropped,
      status,
    });

    if (trafficMode !== 'normal') {
      onStepComplete?.(2);
      if (baseCpu < 35 && dropped < 10) {
        onStepComplete?.(3);
        onSimulationSuccess?.();
      }
    } else {
      onStepComplete?.(1);
    }
  }, [trafficMode, synCookiesEnabled, rateLimiterEnabled, wafScrubbingEnabled]);

  return (
    <div className="simulation-ddos-root">
      <div className="ddos-telemetry-grid">
        <div className="metric-tile">
          <span className="tile-label">Incoming Traffic Load:</span>
          <span className="tile-value font-mono text-cyan">{metrics.rps.toLocaleString()} RPS</span>
          <span className="tile-sub text-subtle">Requests Per Second</span>
        </div>

        <div className="metric-tile">
          <span className="tile-label">Server CPU Utilization:</span>
          <span
            className={`tile-value font-mono ${
              metrics.cpuPercent > 80 ? 'text-red' : metrics.cpuPercent > 40 ? 'text-amber' : 'text-green'
            }`}
          >
            {metrics.cpuPercent}%
          </span>
          <div className="mini-progress-bar">
            <div
              className={`mini-fill ${
                metrics.cpuPercent > 80 ? 'fill-red' : metrics.cpuPercent > 40 ? 'fill-amber' : 'fill-green'
              }`}
              style={{ width: `${metrics.cpuPercent}%` }}
            />
          </div>
        </div>

        <div className="metric-tile">
          <span className="tile-label">Connection Table Memory:</span>
          <span className="tile-value font-mono">{metrics.memoryPercent}%</span>
          <div className="mini-progress-bar">
            <div className="mini-fill" style={{ width: `${metrics.memoryPercent}%` }} />
          </div>
        </div>

        <div className="metric-tile">
          <span className="tile-label">Legitimate Dropped Requests:</span>
          <span
            className={`tile-value font-mono ${metrics.droppedPercent > 20 ? 'text-red' : 'text-green'}`}
          >
            {metrics.droppedPercent}% Packet Loss
          </span>
          <span className="tile-sub font-bold">{metrics.status}</span>
        </div>
      </div>

      <div className="ddos-controls-grid">
        <div className="ddos-card">
          <div className="sim-card-header db-header">
            <span className="window-title">⚡ Traffic Simulation Generator</span>
          </div>

          <div className="sim-card-body">
            <div className="traffic-mode-buttons">
              <button
                type="button"
                className={`btn-traffic-mode ${trafficMode === 'normal' ? 'is-active-mode' : ''}`}
                onClick={() => setTrafficMode('normal')}
              >
                <div className="mode-name">🟢 Normal Student Baseline (50 RPS)</div>
                <div className="mode-desc">Standard browsing traffic across course pages.</div>
              </button>

              <button
                type="button"
                className={`btn-traffic-mode ${trafficMode === 'syn-flood' ? 'is-active-mode mode-warn' : ''}`}
                onClick={() => setTrafficMode('syn-flood')}
              >
                <div className="mode-name text-red">🔴 Layer 4 SYN Flood (5,000 RPS)</div>
                <div className="mode-desc">Exhausts OS half-open connection table with spoofed SYNs.</div>
              </button>

              <button
                type="button"
                className={`btn-traffic-mode ${trafficMode === 'http-flood' ? 'is-active-mode mode-warn' : ''}`}
                onClick={() => setTrafficMode('http-flood')}
              >
                <div className="mode-name text-red">🔴 Layer 7 HTTP App Flood (2,800 RPS)</div>
                <div className="mode-desc">Repeated heavy database queries from distributed bot clients.</div>
              </button>
            </div>
          </div>
        </div>

        <div className="ddos-card">
          <div className="sim-card-header">
            <span className="window-title">🛡️ Active Infrastructure Defenses</span>
          </div>

          <div className="sim-card-body">
            <p className="defense-intro">
              Toggle defensive controls below to observe how edge scrubbing and kernel optimizations mitigate resource
              starvation:
            </p>

            <div className="defense-toggle-list">
              <label className="defense-checkbox-card">
                <input
                  type="checkbox"
                  checked={synCookiesEnabled}
                  onChange={(e) => setSynCookiesEnabled(e.target.checked)}
                />
                <div className="defense-info">
                  <span className="defense-title">Enable Kernel TCP SYN Cookies</span>
                  <span className="defense-desc">
                    Encodes connection state into sequence numbers, eliminating memory allocation for half-open queues.
                  </span>
                </div>
              </label>

              <label className="defense-checkbox-card">
                <input
                  type="checkbox"
                  checked={rateLimiterEnabled}
                  onChange={(e) => setRateLimiterEnabled(e.target.checked)}
                />
                <div className="defense-info">
                  <span className="defense-title">Deploy Token Bucket Rate Limiting (100 req/min)</span>
                  <span className="defense-desc">
                    Throttles repetitive application-layer requests per client IP with immediate 429 Too Many Requests.
                  </span>
                </div>
              </label>

              <label className="defense-checkbox-card">
                <input
                  type="checkbox"
                  checked={wafScrubbingEnabled}
                  onChange={(e) => setWafScrubbingEnabled(e.target.checked)}
                />
                <div className="defense-info">
                  <span className="defense-title">Cloud WAF / Anycast Scrubbing Center</span>
                  <span className="defense-desc">
                    Filters automated bots, geo-anomalies, and malformed packet floods at edge data centers.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

