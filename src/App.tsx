import { useEffect, useRef, useState, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Preloader } from './components/Preloader';
import { CursorRing } from './components/CursorRing';
import { StillGardensViewer } from './components/StillGardensViewer';
import { SacredCraftModal } from './components/SacredCraftModal';
import { HeroSection } from './sections/HeroSection';
import { SanmonSection } from './sections/SanmonSection';
import { StillGardensSection } from './sections/StillGardensSection';
import { SacredCraftSection } from './sections/SacredCraftSection';
import { AfterlightSection } from './sections/AfterlightSection';
import { FooterSection } from './sections/FooterSection';
import { GARDEN_VIEWS, SACRED_CRAFT_LESSONS } from './data/yukaiData';
import { initSanctuary, SanctuaryInstance } from './webgl/SanctuaryScene';
import { initForegroundManager } from './components/ForegroundManager';
import { SacredCraftLesson } from './types/yukai';
import { templeAudio } from './audio/TempleAudio';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sanctuaryRef = useRef<SanctuaryInstance | null>(null);

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [activeGardenViewId, setActiveGardenViewId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<SacredCraftLesson | null>(null);
  const [activeRailIndex, setActiveRailIndex] = useState<number>(0);

  // Smooth scroll helper
  const scrollToSection = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const to = el.getBoundingClientRect().top + window.scrollY - (el.id === 'top' || el.id === 'hero' ? 0 : 10);
    const from = window.scrollY;
    const distance = to - from;
    const startTime = performance.now();
    const duration = Math.min(1500, 420 + Math.abs(distance) * 0.32);

    function step(now: number) {
      const k = Math.min(1, Math.max(0, (now - startTime) / duration));
      const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      window.scrollTo(0, from + distance * eased);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, []);

  // Generate noise grain tile
  useEffect(() => {
    const s = 180;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const x = c.getContext('2d');
    if (x) {
      const im = x.createImageData(s, s);
      const d = im.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = 128 + (Math.random() - 0.5) * 255;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(im, 0, 0);
      const grainEl = document.getElementById('grain');
      if (grainEl) {
        grainEl.style.backgroundImage = `url(${c.toDataURL()})`;
      }
    }
  }, []);

  // Initialize WebGL scene
  useEffect(() => {
    if (!canvasRef.current) return;
    const instance = initSanctuary(canvasRef.current);
    sanctuaryRef.current = instance;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      instance.setPointer(e.clientX, e.clientY);
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      instance.destroy();
    };
  }, []);

  // Scroll progression & chapter stations mapping
  useEffect(() => {
    let sections: { el: HTMLElement; top: number; height: number }[] = [];
    let docMax = 1;

    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-cam]'));
      sections = els.map((el) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return { el, top, height: r.height };
      });
      docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    measure();
    window.addEventListener('resize', measure, { passive: true });

    const camProgress = (y: number) => {
      const n = sections.length;
      if (n < 2) return Math.min(1, Math.max(0, y / docMax));
      if (y <= sections[0].top) return 0;
      for (let i = 0; i < n - 1; i++) {
        const a = sections[i].top;
        const b = sections[i + 1].top;
        if (y < b) return (i + (y - a) / Math.max(1, b - a)) / (n - 1);
      }
      const lastTop = sections[n - 1].top;
      return Math.min(1, Math.max(0, (n - 2 + 1 + (y - lastTop) / Math.max(1, docMax - lastTop)) / (n - 1)));
    };

    const handleScroll = () => {
      const y = window.scrollY;
      const progress = camProgress(y);
      sanctuaryRef.current?.setScrollProgress(progress);

      const mid = y + window.innerHeight * 0.42;
      let curIdx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (mid >= sections[i].top) curIdx = i;
      }

      setActiveRailIndex(curIdx);
      if (sections[curIdx]?.el.id) {
        setActiveSection(sections[curIdx].el.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(() => {
      measure();
      handleScroll();
    }, 600);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // IntersectionObserver reveals for headings & sections
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '-8% 0px -12% 0px', threshold: 0.01 }
    );

    const observeElements = () => {
      document.querySelectorAll('[data-rv], .sec, .hero, .foot, .display').forEach((el) => {
        io.observe(el);
      });
    };

    observeElements();
    const timer = setTimeout(observeElements, 500);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const handlePreloaderLoaded = useCallback(() => {
    document.body.classList.add('is-ready');
    const hero = document.getElementById('hero');
    if (hero) {
      hero.classList.add('is-in');
      hero.querySelectorAll('[data-rv], .display').forEach((el) => el.classList.add('is-in'));
    }
    // Wire foreground cutout planes
    initForegroundManager();
  }, []);

  const handleOpenGardenView = (id: number) => {
    templeAudio.playWaterDrop();
    setActiveGardenViewId(id);
  };

  const handleOpenLesson = (lesson: SacredCraftLesson) => {
    templeAudio.playBell(380, 3.2);
    setSelectedLesson(lesson);
  };

  return (
    <>
      {/* Three.js Canvas */}
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />

      {/* Atmospheric Overlays */}
      <div id="grade" aria-hidden="true" />
      <div id="vignette" />
      <div id="grain" />
      <CursorRing />

      {/* Preloader */}
      <Preloader onLoaded={handlePreloaderLoaded} />

      {/* Navigation */}
      <Navigation
        activeSection={activeSection}
        onNavigate={(id) => {
          if (id === 'top') {
            scrollToSection('hero');
          } else {
            scrollToSection(id);
          }
        }}
      />

      {/* Side Rail Dots */}
      <div className="rail" id="rail">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <i key={idx} className={idx === activeRailIndex ? 'on' : ''} />
        ))}
      </div>

      {/* Content Stream */}
      <div className="page" id="top">
        <HeroSection onChipClick={scrollToSection} />
        <SanmonSection onNavigate={scrollToSection} />
        <StillGardensSection
          views={GARDEN_VIEWS}
          onSelectGardenView={handleOpenGardenView}
        />
        <SacredCraftSection
          lessons={SACRED_CRAFT_LESSONS}
          onSelectLesson={handleOpenLesson}
        />
        <AfterlightSection onRestart={() => scrollToSection('hero')} />
        <FooterSection onNavigate={scrollToSection} />
      </div>

      {/* Foreground Skylight Host for Near-plane Cutouts */}
      <div id="fg-sky" aria-hidden="true" />

      {/* Interactive Garden View Inspector */}
      <StillGardensViewer
        views={GARDEN_VIEWS}
        activeViewId={activeGardenViewId}
        onClose={() => setActiveGardenViewId(null)}
        onSelectView={(id) => setActiveGardenViewId(id)}
      />

      {/* Interactive Sacred Craft Contemplation Drawer */}
      <SacredCraftModal
        lesson={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    </>
  );
}
