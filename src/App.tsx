import { useEffect } from 'react';
import { useUIStore } from './store/uiStore';
import { Scene } from './components/3d/Scene';
import { LoadingScreen } from './components/overlay/LoadingScreen';
import { CustomCursor } from './components/overlay/CustomCursor';
import { HUDNav } from './components/overlay/HUDNav';
import { AIChatPanel } from './components/overlay/AIChatPanel';
import { SectionIndicator } from './components/overlay/SectionIndicator';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/sections/Footer';

function App() {
  const { isLoading, setActiveSection } = useUIStore();

  // Force scroll to top on reload
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(i);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  // Secret mode: double-click bottom-right corner
  useEffect(() => {
    const handleDblClick = (e: MouseEvent) => {
      if (
        e.clientX > window.innerWidth - 100 &&
        e.clientY > window.innerHeight - 100
      ) {
        useUIStore.getState().toggleSecretMode();
        document.body.style.filter =
          useUIStore.getState().isSecretMode ? 'hue-rotate(180deg)' : '';
      }
    };
    window.addEventListener('dblclick', handleDblClick);
    return () => window.removeEventListener('dblclick', handleDblClick);
  }, []);

  return (
    <>
      <LoadingScreen />
      <CustomCursor />

      {!isLoading && (
        <>
          <Scene />
          <HUDNav />
          <SectionIndicator />
          <AIChatPanel />

          <main style={{ position: 'relative', zIndex: 1 }}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
          </main>
        </>
      )}
    </>
  );
}

export default App;
