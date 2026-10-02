import React, { useEffect, useRef } from 'react';

export const CursorRing: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, on = false;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      tx = e.clientX;
      ty = e.clientY;
      if (!on) {
        on = true;
        cx = tx;
        cy = ty;
        el.classList.add('on');
      }
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor], a, button');
      el.classList.toggle('hot', !!target);
    };

    let animId: number;
    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      animId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver);
    animId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerover', handlePointerOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <div className="cur-dot" id="cursor" ref={dotRef} aria-hidden="true" />;
};
