with open('src/styles/notes.css', 'r', encoding='utf-8') as f:
    content = f.read()

notes_additions = """

/* ==========================================================================
   HCI & PROFESSIONAL LIGHT MODE REDESIGN — COMPLETE NOTES
   Resolves all dark box issues, improves contrast, hierarchy and affordances
   ========================================================================== */

/* 1. Process Flow Diagram Cards in Light Mode (No More Dark Boxes) */
[data-theme="light"] .diagram-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.03) !important;
}

[data-theme="light"] .diagram-badge {
  background: #fff7ed !important;
  border: 1px solid #ffedd5 !important;
  color: #c2410c !important;
  font-weight: 800;
}

[data-theme="light"] .diagram-title {
  color: #0f172a !important;
  font-weight: 700;
}

[data-theme="light"] .flow-node {
  background: #f8fafc !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
  transition: all 0.2s ease;
}

[data-theme="light"] .flow-node:hover {
  background: #ffffff !important;
  border-color: #0284c7 !important;
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.12) !important;
  transform: translateY(-2px);
}

[data-theme="light"] .flow-node-badge {
  background: #e0f2fe !important;
  color: #0369a1 !important;
  border: 1px solid #bae6fd !important;
  font-weight: 700;
}

[data-theme="light"] .flow-node-label {
  color: #0f172a !important;
  font-weight: 700;
  font-size: 14px;
}

[data-theme="light"] .flow-node-sublabel {
  color: #475569 !important;
  font-size: 12px;
}

[data-theme="light"] .flow-node-highlight {
  background: #f0fdf4 !important;
  border-color: #22c55e !important;
  box-shadow: 0 0 14px rgba(34, 197, 94, 0.15) !important;
}

[data-theme="light"] .flow-connector .connector-arrow {
  color: #0284c7 !important;
}

[data-theme="light"] .flow-connector .connector-line {
  background: #cbd5e1 !important;
}

[data-theme="light"] .diagram-caption {
  color: #475569 !important;
  border-left: 3px solid #0284c7 !important;
  background: #f8fafc;
  padding: 8px 12px;
  border-radius: 0 6px 6px 0;
  margin-top: 14px;
}

/* 2. Educational Note Callouts Light Mode (High Contrast & Clear Affordances) */
[data-theme="light"] .note-callout {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 3px 12px rgba(15, 23, 42, 0.04) !important;
}

[data-theme="light"] .note-callout-definition,
[data-theme="light"] .callout-definition {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-left: 4px solid #0284c7 !important;
}

[data-theme="light"] .note-callout-example,
[data-theme="light"] .callout-example {
  background: #f0fdf4 !important;
  border: 1px solid #dcfce7 !important;
  border-left: 4px solid #16a34a !important;
}

[data-theme="light"] .note-callout-warning,
[data-theme="light"] .callout-warning {
  background: #fffbeb !important;
  border: 1px solid #fef3c7 !important;
  border-left: 4px solid #ea580c !important;
}

[data-theme="light"] .note-callout-formula,
[data-theme="light"] .callout-formula {
  background: #f0f9ff !important;
  border: 1px solid #e0f2fe !important;
  border-left: 4px solid #0284c7 !important;
}

[data-theme="light"] .note-callout-exam,
[data-theme="light"] .callout-exam {
  background: #faf5ff !important;
  border: 1px solid #f3e8ff !important;
  border-left: 4px solid #7c3aed !important;
}

[data-theme="light"] .note-callout-concept,
[data-theme="light"] .callout-concept {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-left: 4px solid #0284c7 !important;
}

[data-theme="light"] .note-callout-badge {
  background: #f1f5f9 !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1 !important;
  font-weight: 700;
}

[data-theme="light"] .note-callout-warning .note-callout-badge {
  background: #fff7ed !important;
  color: #c2410c !important;
  border-color: #ffedd5 !important;
}

[data-theme="light"] .note-callout-title {
  color: #0f172a !important;
  font-weight: 700;
}

[data-theme="light"] .note-callout-body,
[data-theme="light"] .note-callout-body p {
  color: #1e293b !important;
  line-height: 1.7;
}

/* 3. Tables & Data Matrices in Light Mode */
[data-theme="light"] .notes-table-container {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03) !important;
}

[data-theme="light"] .notes-table th {
  background: #f8fafc !important;
  color: #0f172a !important;
  border-bottom: 2px solid #cbd5e1 !important;
  font-weight: 700;
}

[data-theme="light"] .notes-table td {
  color: #334155 !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

[data-theme="light"] .notes-table tr:hover td {
  background: #f8fafc !important;
}

/* 4. Exam Cards in Light Mode */
[data-theme="light"] .exam-card {
  background: #ffffff !important;
  border: 1.5px solid #fde68a !important;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.08) !important;
}

[data-theme="light"] .exam-header {
  background: #fffbeb !important;
  border-bottom: 1px solid #fde68a !important;
}

[data-theme="light"] .exam-title {
  color: #92400e !important;
}

[data-theme="light"] .exam-content {
  color: #1e293b !important;
}

/* 5. Chapter Orientation & Intro Cards in Light Mode */
[data-theme="light"] .intro-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
}

[data-theme="light"] .intro-card-title {
  color: #0f172a !important;
}

[data-theme="light"] .intro-card-p {
  color: #334155 !important;
}

/* 6. Technical Visual Viewport in Light Mode */
[data-theme="light"] .tech-svg-viewport {
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 10px;
}

/* 7. Code Blocks in Notes */
[data-theme="light"] .code-block-container {
  background: #0f172a !important;
  border: 1px solid #334155 !important;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08) !important;
}

[data-theme="light"] .code-header {
  background: #1e293b !important;
  border-bottom: 1px solid #334155 !important;
  color: #f1f5f9 !important;
}

[data-theme="light"] .code-title {
  color: #f8fafc !important;
}

/* ==========================================================================
   MULTI-DEVICE RESPONSIVENESS OVERHAUL — COMPLETE NOTES
   Smart layouts for Mobile (320px-767px), Tablet (768px-1024px), Desktop (1025px+)
   ========================================================================== */

/* Tablet & Medium Screen Polish */
@media (max-width: 1024px) {
  .notes-layout-container {
    display: flex;
    flex-direction: row;
    position: relative;
  }

  .notes-main-content {
    max-width: 100%;
    padding: 24px 20px 60px;
  }
}

/* Mobile Screens (<= 768px) */
@media (max-width: 768px) {
  .notes-layout-container {
    display: block;
    width: 100%;
  }

  .notes-sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: min(85vw, 320px);
    height: 100vh;
    height: 100dvh;
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 12px 0 36px rgba(0, 0, 0, 0.6);
  }

  .notes-sidebar.is-open {
    transform: translateX(0);
  }

  .notes-main-content {
    padding: 16px 14px 48px;
    width: 100%;
  }

  /* Search Bar Input on Mobile */
  .search-input-wrapper input {
    font-size: 14px;
    padding-left: 38px;
    height: 42px;
  }

  /* Process Flow Diagram on Mobile: Stacks Vertically for 100% Readability */
  .diagram-flow-container {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }

  .flow-node {
    width: 100% !important;
    min-width: 100% !important;
  }

  .flow-connector {
    display: flex !important;
    justify-content: center !important;
    padding: 4px 0 !important;
  }

  .connector-arrow {
    transform: rotate(90deg) !important;
    font-size: 16px !important;
  }

  .connector-line {
    display: none !important;
  }

  /* Technical Visual SVGs on Mobile: Fluid Scale & Responsive */
  .tech-svg-viewport {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 12px 8px;
  }

  .tech-svg {
    min-width: 320px;
    width: 100%;
    height: auto;
    display: block;
  }

  /* Tables: Horizontal Scrollable Wrapper */
  .notes-table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  .notes-table {
    min-width: 480px;
  }

  /* Before-After Split Grids: Stack Vertically */
  .before-after-split-grid {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }

  /* Chapter Navigation: Stack Vertically */
  .chapter-nav-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  .chapter-nav-btn {
    width: 100%;
    min-height: 48px;
  }
}

/* Small Handhelds (<= 480px) */
@media (max-width: 480px) {
  .complete-notes-page {
    padding-top: 60px;
  }

  .chapter-title {
    font-size: 22px !important;
    line-height: 1.25 !important;
  }

  .topic-title {
    font-size: 17px !important;
  }

  .diagram-title {
    font-size: 15px !important;
  }

  .note-callout {
    padding: 14px 14px !important;
  }
}
"""

with open('src/styles/notes.css', 'a', encoding='utf-8') as f:
    f.write(notes_additions)

print("Successfully appended HCI & Light Mode redesign to notes.css!")

