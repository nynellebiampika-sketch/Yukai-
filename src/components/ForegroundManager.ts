export function initForegroundManager(): () => void {
  const win = window;
  const doc = document;
  const sky = doc.getElementById('fg-sky');
  if (!sky) return () => {};

  const REDUCED = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stages = Array.from(doc.querySelectorAll<HTMLElement>('.fg'));
  const pairs = stages
    .map((stage) => ({ stage, section: stage.closest<HTMLElement>('.hero, .sec, .foot') }))
    .filter((pr): pr is { stage: HTMLElement; section: HTMLElement } => !!pr.section && !!sky);

  if (!pairs.length) return () => {};

  const homes = new Map<HTMLElement, HTMLElement>();
  const timers = new Map<HTMLElement, number>();
  let active: HTMLElement | null = null;

  pairs.forEach((pr) => {
    homes.set(pr.stage, pr.section);
  });

  function lift(stage: HTMLElement) {
    if (stage.parentNode === sky) return;
    sky?.appendChild(stage);
    void stage.offsetWidth;
  }

  function park(stage: HTMLElement) {
    const home = homes.get(stage);
    if (home && stage.parentNode !== home) {
      home.insertBefore(stage, home.firstChild);
    }
  }

  function retire(stage: HTMLElement | null) {
    if (!stage || stage === active) return;
    if (timers.has(stage)) {
      window.clearTimeout(timers.get(stage));
    }
    stage.classList.remove('fg-active');
    if (REDUCED) {
      park(stage);
      return;
    }
    stage.classList.add('fg-retiring');
    const timer = window.setTimeout(() => {
      stage.classList.remove('fg-retiring');
      timers.delete(stage);
      park(stage);
    }, 820);
    timers.set(stage, timer);
  }

  function activate(stage: HTMLElement) {
    if (!stage || stage === active) return;
    if (timers.has(stage)) {
      window.clearTimeout(timers.get(stage));
    }
    stage.classList.remove('fg-retiring');
    lift(stage);
    stage.classList.add('fg-active');
    const prior = active;
    active = stage;
    retire(prior);
  }

  let lastY = -1;
  let lastH = -1;

  function pickStage() {
    const vh = win.innerHeight;
    let best: HTMLElement | null = null;
    let bestScore = 0;

    for (let i = 0; i < pairs.length; i++) {
      const r = pairs[i].section.getBoundingClientRect();
      const vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis <= 0) continue;
      const score = vis / Math.max(1, Math.min(r.height, vh));
      if (score > bestScore) {
        bestScore = score;
        best = pairs[i].stage;
      }
    }

    if (best) activate(best);
    else if (active) {
      const prior = active;
      active = null;
      retire(prior);
    }
  }

  function watch() {
    const y = win.scrollY;
    const h = win.innerHeight;
    if (y !== lastY || h !== lastH) {
      lastY = y;
      lastH = h;
      pickStage();
    }
  }

  win.addEventListener('scroll', watch, { passive: true });
  win.addEventListener('resize', watch, { passive: true });
  setTimeout(pickStage, 200);

  // Pointer pull
  let lean = 0, leanT = 0;
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    leanT = (e.clientX / win.innerWidth - 0.5) * 34;
  };
  win.addEventListener('pointermove', onPointerMove, { passive: true });

  let animId: number;
  const drift = () => {
    lean += (leanT - lean) * 0.05;
    sky?.style.setProperty('--lean', `${lean.toFixed(2)}px`);
    watch();
    animId = requestAnimationFrame(drift);
  };
  animId = requestAnimationFrame(drift);

  return () => {
    win.removeEventListener('scroll', watch);
    win.removeEventListener('resize', watch);
    win.removeEventListener('pointermove', onPointerMove);
    cancelAnimationFrame(animId);
  };
}
