import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { ParticleScene } from './components/ParticleScene';
import { HeroContent } from './components/HeroContent';
import { ScrollActionsOverlay } from './components/ScrollActionsOverlay';
import { RoutePlaceholderModal, type PlaceholderRoute } from './components/RoutePlaceholderModal';
import { ScrollIndicator } from './components/ScrollIndicator';
import { Footer } from './components/Footer';
import { AmbientAudio } from './audio/ambientAudio';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useScrollParallax } from './hooks/useScrollParallax';
import type { ParticleEngine } from './particles/particleEngine';
import { CompleteNotes } from './pages/CompleteNotes';
import { PracticalsPage } from './pages/PracticalsPage';

function parseAppPage(): 'home' | 'notes' | 'practicals' {
  const hash = window.location.hash;
  const path = window.location.pathname;

  if (hash.startsWith('#practicals') || path.startsWith('/practicals')) return 'practicals';
  if (hash.startsWith('#notes') || path.startsWith('/notes')) return 'notes';
  return 'home';
}

export default function App() {
  const engineRef = useRef<ParticleEngine | null>(null);
  const audioRef = useRef<AmbientAudio | null>(null);
  const [audioOn, setAudioOn] = useState(false);
  const [activeModalRoute, setActiveModalRoute] = useState<PlaceholderRoute>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'notes' | 'practicals'>(() => {
    return parseAppPage();
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('studyverse-theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });
  const reducedMotion = useReducedMotion();

  // Apply theme to root html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('studyverse-theme', theme);
    } catch {
      // storage unavailable
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Scroll tracking: heroExit & awaProgress drive HTML UI opacity & transforms smoothly on home
  const { heroExit, awaProgress } = useScrollParallax(engineRef);

  // Synchronize with browser hash and history popstate (browser back/forward)
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPage(parseAppPage());
    };

    window.addEventListener('hashchange', onLocationChange);
    window.addEventListener('popstate', onLocationChange);
    return () => {
      window.removeEventListener('hashchange', onLocationChange);
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  const toggleAudio = useCallback(async () => {
    if (!audioRef.current) audioRef.current = new AmbientAudio();
    const audio = audioRef.current;
    if (audio.running) {
      engineRef.current?.setAudioSource(null);
      setAudioOn(false);
      await audio.stop();
    } else {
      try {
        await audio.start();
        engineRef.current?.setAudioSource(audio.getLevels);
        setAudioOn(true);
      } catch (err) {
        console.warn('StudyVerse: audio unavailable', err);
      }
    }
  }, []);

  useEffect(() => {
    if (audioOn && audioRef.current) {
      engineRef.current?.setAudioSource(audioRef.current.getLevels);
    }
  }, [audioOn, reducedMotion]);

  useEffect(() => () => { void audioRef.current?.stop(); }, []);

  const handleNavigateHome = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentPage('home');
    window.location.hash = '#home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateNotes = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentPage('notes');
    if (!window.location.hash.startsWith('#notes')) {
      window.location.hash = '#notes';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigatePracticals = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentPage('practicals');
    if (!window.location.hash.startsWith('#practicals')) {
      window.location.hash = '#practicals';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModalRoute(null);
  }, []);

  return (
    <>
      <ParticleScene engineRef={engineRef} reducedMotion={reducedMotion} theme={theme} />
      <div className="vignette" aria-hidden="true" />

      <Header
        audioOn={audioOn}
        onToggleAudio={toggleAudio}
        onNavigateHome={handleNavigateHome}
        onNavigateNotes={handleNavigateNotes}
        onNavigatePracticals={handleNavigatePracticals}
        currentPage={currentPage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {currentPage === 'home' && (
        <main id="home">
          {/* HERO SECTION: 100vh hero viewport with Typography on left & Particle centerpiece on right */}
          <section className="hero" aria-label="StudyVerse educational homepage">
            <div className="hero-container">
              <HeroContent
                onNavigateNotes={handleNavigateNotes}
                onNavigatePracticals={handleNavigatePracticals}
                heroExit={heroExit}
              />
            </div>
            <ScrollIndicator />
          </section>

          {/* PHASE 2 & 3: SCROLL-DRIVEN CINEMATIC PARTICLE SEQUENCE (AWA & PROFESSIONAL INTRO) */}
          <section className="awa-scroll-track" aria-hidden="true" />

          {/* Action Buttons overlay for the formed AWA & Introduction particle sequence */}
          <ScrollActionsOverlay
            onNavigateNotes={handleNavigateNotes}
            onNavigatePracticals={handleNavigatePracticals}
            awaProgress={awaProgress}
          />

          {/* FOOTER: Reveals as particles clear */}
          <Footer
            onNavHome={handleNavigateHome}
            onNavigateNotes={handleNavigateNotes}
            onNavigatePracticals={handleNavigatePracticals}
            currentPage="home"
          />
        </main>
      )}

      {currentPage === 'notes' && (
        <div className="notes-page-root">
          <CompleteNotes />
          <Footer
            onNavHome={handleNavigateHome}
            onNavigateNotes={handleNavigateNotes}
            onNavigatePracticals={handleNavigatePracticals}
            currentPage="notes"
          />
        </div>
      )}

      {currentPage === 'practicals' && (
        <div className="practicals-page-wrapper">
          <PracticalsPage />
          <Footer
            onNavHome={handleNavigateHome}
            onNavigateNotes={handleNavigateNotes}
            onNavigatePracticals={handleNavigatePracticals}
            currentPage="practicals"
          />
        </div>
      )}

      {/* Placeholder Modal if needed */}
      <RoutePlaceholderModal
        route={activeModalRoute}
        onClose={handleCloseModal}
      />
    </>
  );
}
