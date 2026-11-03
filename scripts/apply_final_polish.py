# 1. Update practicals.css with high contrast payloads, window mockup, and tablet/mobile topbar styling
with open('src/styles/practicals.css', 'r', encoding='utf-8') as f:
    prac_css = f.read()

prac_refinements = """

/* High Contrast Quick Payloads & Browser Mockup */
[data-theme="light"] .btn-quick-payload {
  background: #f1f5f9 !important;
  border: 1.5px solid #cbd5e1 !important;
  color: #0f172a !important;
  font-weight: 600 !important;
}

[data-theme="light"] .btn-quick-payload:hover {
  background: #e2e8f0 !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}

[data-theme="light"] .btn-quick-payload.payload-warn {
  background: #fff7ed !important;
  border: 1.5px solid #fed7aa !important;
  color: #c2410c !important;
  font-weight: 700 !important;
}

[data-theme="light"] .btn-quick-payload.payload-warn:hover {
  background: #ffedd5 !important;
  border-color: #ea580c !important;
}

[data-theme="light"] .sim-card-header {
  background: #f8fafc !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

[data-theme="light"] .window-title {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  padding: 3px 12px !important;
  border-radius: 999px !important;
  color: #0f172a !important;
  font-weight: 600 !important;
  font-size: 11.5px !important;
}

/* Tablet & Mobile Workspace Topbar Ergonomics */
@media (max-width: 1024px) {
  .workspace-top-bar {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: space-between !important;
    align-items: center !important;
    gap: 12px !important;
    padding: 12px 16px !important;
  }

  .top-bar-left {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex: 1 1 auto !important;
    min-width: 0 !important;
  }

  .workspace-breadcrumbs {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    max-width: 340px !important;
    font-size: 12px !important;
  }

  .top-bar-center {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }

  .top-bar-right {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
}

@media (max-width: 640px) {
  .workspace-top-bar {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
    padding: 10px 12px !important;
  }

  .top-bar-left {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
  }

  .workspace-breadcrumbs {
    display: none !important;
  }

  .top-bar-center {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    width: 100% !important;
  }

  .top-bar-right {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    width: 100% !important;
  }

  .btn-workspace-reset,
  .btn-workspace-nav {
    flex: 1 !important;
    height: 42px !important;
  }
}
"""

with open('src/styles/practicals.css', 'a', encoding='utf-8') as f:
    f.write(prac_refinements)

print("Updated practicals.css with ergonomics & styling!")

# 2. Update global.css mobile header
with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    glob_css = f.read()

glob_refinements = """

/* Responsive mobile header ergonomics */
@media (max-width: 640px) {
  .site-header {
    padding: 10px 14px !important;
  }
  .brand {
    gap: 7px !important;
  }
  .brand-name {
    display: inline-block !important;
    font-size: 11px !important;
    letter-spacing: 0.16em !important;
  }
  .site-nav {
    gap: 8px !important;
  }
  .nav-link {
    font-size: 11.5px !important;
    padding: 4px 6px !important;
  }
  .orb-toggle,
  .theme-toggle-btn {
    width: 32px !important;
    height: 32px !important;
  }
}
"""

with open('src/styles/global.css', 'a', encoding='utf-8') as f:
    f.write(glob_refinements)

print("Updated global.css with responsive mobile header ergonomics!")

