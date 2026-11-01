import { useEffect, useState } from 'react';

export function ScrollIndicator() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onClick = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });

  return (
    <button
      type="button"
      className={`scroll-indicator ${scrolled ? 'is-hidden' : ''}`}
      onClick={onClick}
      aria-label="Scroll down"
    >
      <span className="scroll-label">Scroll Down</span>
      <svg className="scroll-arrow" viewBox="0 0 12 16" aria-hidden="true">
        <path
          d="M6 1v13M1.5 9.5 6 14l4.5-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}


