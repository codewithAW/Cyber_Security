import React from 'react';

interface FooterProps {
  onNavHome: () => void;
  onNavigateNotes?: (e: React.MouseEvent) => void;
  onNavigatePracticals?: (e: React.MouseEvent) => void;
  currentPage?: 'home' | 'notes' | 'practicals';
}

export function Footer({
  onNavHome,
  onNavigateNotes,
  onNavigatePracticals,
  currentPage = 'home',
}: FooterProps) {
  const dots = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return {
      x: 12 + Math.cos(a) * 8.5,
      y: 12 + Math.sin(a) * 4.2,
      r: i % 3 === 0 ? 1.0 : 0.65,
      warm: i % 4 === 0,
    };
  });

  return (
    <footer className="site-footer">
      <div className="footer-top-line" aria-hidden="true" />
      <div className="footer-content">
        <div className="footer-brand">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavHome(); }} className="brand" aria-label="StudyVerse home">
            <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
              <defs>
                <radialGradient id="sv-footer-core">
                  <stop offset="0%" stopColor="#E8F2FF" />
                  <stop offset="45%" stopColor="#63D9FF" />
                  <stop offset="100%" stopColor="#168BFF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="12" cy="12" r="5" fill="url(#sv-footer-core)" />
              <g transform="rotate(-24 12 12)">
                {dots.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.warm ? '#FF9D32' : '#63D9FF'} opacity={0.9} />
                ))}
              </g>
            </svg>
            <span className="brand-name">STUDYVERSE</span>
          </a>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <a
            href="#home"
            className={currentPage === 'home' ? 'footer-nav-link is-active' : 'footer-nav-link'}
            onClick={(e) => {
              e.preventDefault();
              onNavHome();
            }}
          >
            Home
          </a>
          <a
            href="#notes"
            className={currentPage === 'notes' ? 'footer-nav-link is-active' : 'footer-nav-link'}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigateNotes) onNavigateNotes(e);
            }}
          >
            Complete Notes
          </a>
          <a
            href="#practicals"
            className={currentPage === 'practicals' ? 'footer-nav-link is-active' : 'footer-nav-link'}
            onClick={(e) => {
              e.preventDefault();
              if (onNavigatePracticals) onNavigatePracticals(e);
            }}
          >
            Practicals
          </a>
        </nav>

        <div className="footer-copyright">
          <p>© 2026 STUDYVERSE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
