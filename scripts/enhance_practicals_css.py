with open('src/styles/practicals.css', 'r', encoding='utf-8') as f:
    content = f.read()

practicals_additions = """

/* ==========================================================================
   HCI & PROFESSIONAL LIGHT MODE REDESIGN — PRACTICALS
   Fixes all dark boxes in simulated databases, forms, envelopes, diffs & tools
   (Preserves only true terminal console screens as requested by user)
   ========================================================================== */

/* 1. Simulated Database & Live Data Consoles in Light Mode */
[data-theme="light"] .sim-card-header.db-header {
  background: #f8fafc !important;
  border-bottom: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .db-body {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
}

[data-theme="light"] .db-code-view {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .db-table-mock th {
  background: #f1f5f9 !important;
  color: #0f172a !important;
  border-bottom: 2px solid #cbd5e1 !important;
  font-weight: 700;
}

[data-theme="light"] .db-table-mock td {
  color: #334155 !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

/* 2. Security Alerts & Stolen Credential Displays in Light Mode */
[data-theme="light"] .alert-stolen-box {
  background: #fef2f2 !important;
  border: 1.5px solid #fecaca !important;
  color: #991b1b !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.08) !important;
}

[data-theme="light"] .rendered-dom-box {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
}

/* 3. Phishing Envelope & Email Inspector in Light Mode */
[data-theme="light"] .email-header-envelope {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .email-body-content {
  background: #ffffff !important;
  color: #0f172a !important;
}

/* 4. Cryptographic Ciphers & Intercepted Traffic */
[data-theme="light"] .ciphertext-box {
  background: #f8fafc !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
}

[data-theme="light"] .intercept-box {
  background: #f0f9ff !important;
  border: 1.5px solid #bae6fd !important;
  color: #0369a1 !important;
}

[data-theme="light"] .target-hash-display {
  background: #f8fafc !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
}

[data-theme="light"] .hash-output-entry {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

/* 5. Cloud IAM, JSON Policies & Commands */
[data-theme="light"] .json-output-box {
  background: #f8fafc !important;
  border: 1.5px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .policy-editor-box {
  background: #ffffff !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
}

[data-theme="light"] .curl-cmd-display {
  background: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
}

[data-theme="light"] .telemetry-feed {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

/* 6. OSINT & Malware Diff Viewers */
[data-theme="light"] .whois-results-box {
  background: #ffffff !important;
  border: 1.5px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .commit-diff-box {
  background: #ffffff !important;
  border: 1.5px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .behavior-events-list {
  background: #ffffff !important;
  border: 1.5px solid #e2e8f0 !important;
  color: #0f172a !important;
}

[data-theme="light"] .fw-add-rule-form {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
}

[data-theme="light"] .eval-path-tracer {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

/* 7. Browser Mockup Window & Payload Pills */
.window-dots {
  margin-right: 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.browser-mockup-address {
  display: flex !important;
  align-items: center !important;
}

[data-theme="light"] .sim-status-box {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #0f172a !important;
}

/* Clickable Payload Chips */
.test-payload-chip,
.payload-quick-insert,
.sqli-payload-btn {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 3px 4px;
}

[data-theme="light"] .test-payload-chip,
[data-theme="light"] .payload-quick-insert,
[data-theme="light"] .sqli-payload-btn {
  background: #fff7ed !important;
  border: 1.5px solid #fed7aa !important;
  color: #c2410c !important;
}

[data-theme="light"] .test-payload-chip:hover,
[data-theme="light"] .payload-quick-insert:hover,
[data-theme="light"] .sqli-payload-btn:hover {
  background: #ffedd5 !important;
  border-color: #f97316 !important;
  transform: translateY(-1px);
}

/* ==========================================================================
   MULTI-DEVICE RESPONSIVENESS OVERHAUL — PRACTICALS
   ========================================================================== */

/* Hub Progress Overview on Mobile & Tablet */
@media (max-width: 640px) {
  .compact-progress-overview {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
    margin-bottom: 1.25rem !important;
  }

  .stat-card-compact {
    padding: 12px 14px !important;
    min-height: auto !important;
  }

  .stat-card-compact .stat-val {
    font-size: 22px !important;
  }

  .stat-card-compact .stat-lbl {
    font-size: 11px !important;
  }

  .hero-heading {
    font-size: 1.75rem !important;
    line-height: 1.2 !important;
  }

  .hero-tagline {
    font-size: 0.95rem !important;
  }
}

/* Workspace Top Bar & Multi-Column Layout Polish */
@media (max-width: 1024px) {
  .workspace-top-bar {
    flex-wrap: wrap !important;
    padding: 12px 16px !important;
    gap: 12px !important;
  }

  .top-bar-left {
    flex: 1 1 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .top-bar-center,
  .top-bar-right {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
}

@media (max-width: 640px) {
  .workspace-top-bar {
    padding: 10px 12px !important;
    gap: 8px !important;
  }

  .workspace-breadcrumbs {
    display: none !important;
  }

  .btn-workspace-back {
    height: 42px !important;
    padding: 0 14px !important;
    font-size: 13px !important;
  }

  .btn-workspace-reset,
  .btn-workspace-nav {
    height: 42px !important;
    padding: 0 12px !important;
    font-size: 12px !important;
  }

  .mobile-workspace-tabs {
    display: flex !important;
    position: sticky !important;
    top: 56px !important;
    z-index: 20 !important;
    background: var(--bg, #050b14) !important;
    border-bottom: 1px solid var(--border, rgba(99, 217, 255, 0.2)) !important;
    padding: 4px 8px !important;
    gap: 6px !important;
  }

  [data-theme="light"] .mobile-workspace-tabs {
    background: #ffffff !important;
    border-bottom-color: #e2e8f0 !important;
  }

  .mob-tab-btn {
    flex: 1 !important;
    height: 42px !important;
    font-size: 12px !important;
    padding: 0 4px !important;
    border-radius: 8px !important;
  }

  /* Form Inputs on Touch Screens */
  .sim-input,
  .sim-select,
  .sim-textarea {
    min-height: 44px !important;
    font-size: 15px !important;
  }

  .btn-sim-action {
    min-height: 44px !important;
    font-size: 14px !important;
  }
}
"""

with open('src/styles/practicals.css', 'a', encoding='utf-8') as f:
    f.write(practicals_additions)

print("Successfully appended HCI & Light Mode redesign to practicals.css!")

