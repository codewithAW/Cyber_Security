import { useEffect, useRef } from 'react';

/** The quiet closing frame from the storyboard: "Learn · Build · Secure · Grow". */
export function Tagline() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-visible', entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="tagline" aria-label="Our motto">
      <p>
        Learn <span aria-hidden="true">·</span> Build <span aria-hidden="true">·</span> Secure{' '}
        <span aria-hidden="true">·</span> Grow
      </p>
    </section>
  );
}

