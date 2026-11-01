import React, { useEffect, useRef, useState } from 'react';

interface HeaderProps {
  audioOn: boolean;
  onToggleAudio: () => void;
  onNavigateHome?: (e: React.MouseEvent) => void;
  onNavigateNotes?: (e: React.MouseEvent) => void;
  onNavigatePracticals?: (e: React.MouseEvent) => void;
  currentPage?: 'home' | 'notes' | 'practicals';
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const NAV = [
  { label: 'Home', href: '#home', placeholder: false },
  { label: 'Complete Notes', href: '#notes', placeholder: false },
  { label: 'Practicals', href: '#practicals', placeholder: false },
];

/** Small particle-style emblem: an orbit ring of blue/orange dots around a glowing core. */
function Logo() {
  const dots = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return { x: 12 + Math.cos(a) * 8.5, y: 12 + Math.sin(a) * 4.2, r: i % 3 === 0 ? 1.1 : 0.7, warm: i % 4 === 0 };
  });
  return (
    <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <radialGradient id="sv-core">
          <stop offset="0%" stopColor="#E8F2FF" />
          <stop offset="45%" stopColor="#63D9FF" />
          <stop offset="100%" stopColor="#168BFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="5" fill="url(#sv-core)" />
      <g transform="rotate(-24 12 12)">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.warm ? '#FF9D32' : '#63D9FF'} opacity={0.9} />
        ))}
      </g>
      <circle cx="17.5" cy="6" r="0.9" fill="#FF9D32" />
      <circle cx="5.5" cy="18" r="0.6" fill="#168BFF" />
    </svg>
  );
}

export function Header({
  audioOn,
  onToggleAudio,
  onNavigateHome,
  onNavigateNotes,
  onNavigatePracticals,
  currentPage = 'home',
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onNav = (e: React.MouseEvent, item: (typeof NAV)[number]) => {
    e.preventDefault();
    if (item.href === '#home') {
      if (onNavigateHome) {
        onNavigateHome(e);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (item.href === '#notes') {
      if (onNavigateNotes) {
        onNavigateNotes(e);
      }
    } else if (item.href === '#practicals') {
      if (onNavigatePracticals) {
        onNavigatePracticals(e);
      } else {
        setToast(`${item.label} — coming soon`);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setToast(null), 2200);
      }
    } else if (item.placeholder) {
      setToast(`${item.label} — coming soon`);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(null), 2200);
    }
  };

  return (
    <header className="site-header">
      <a
        className="brand"
        href="#home"
        onClick={(e) => onNav(e, NAV[0])}
        aria-label="StudyVerse home"
      >
        <Logo />
        <span className="brand-name">STUDYVERSE</span>
      </a>
      <nav className="site-nav" aria-label="Primary">
        {NAV.map((item) => {
          const isActive =
            (item.href === '#home' && currentPage === 'home') ||
            (item.href === '#notes' && currentPage === 'notes') ||
            (item.href === '#practicals' && currentPage === 'practicals');

          return (
            <a
              key={item.label}
              href={item.href}
              className={isActive ? 'nav-link is-active' : 'nav-link'}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={item.placeholder || undefined}
              title={item.placeholder ? 'Coming soon' : undefined}
              onClick={(e) => onNav(e, item)}
            >
              {item.label}
            </a>
          );
        })}
        <button
          type="button"
          className={audioOn ? 'orb-toggle is-on' : 'orb-toggle'}
          onClick={onToggleAudio}
          aria-pressed={audioOn}
          aria-label={audioOn ? 'Mute ambient sound' : 'Play ambient sound (audio-reactive particles)'}
          title={audioOn ? 'Sound on' : 'Sound off'}
        >
          <span className="orb-dot" />
        </button>

        {onToggleTheme && (
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        )}
      </nav>
      <div className={toast ? 'nav-toast is-visible' : 'nav-toast'} role="status" aria-live="polite">
        {toast}
      </div>
    </header>
  );
}
