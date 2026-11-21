import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';

/**
 * A soft pool of light that trails the pointer, sitting behind the content.
 * Mouse and trackpad only, skipped for reduced motion. It moves with
 * `transform` on a single rAF loop that stops once it catches up.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const target = { ...pos };
    let raf = 0;

    const render = () => {
      pos.x += (target.x - pos.x) * 0.12;
      pos.y += (target.y - pos.y) * 0.12;
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      const settled = Math.abs(target.x - pos.x) < 0.5 && Math.abs(target.y - pos.y) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.opacity = '1';
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    render();
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-10 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.075),rgb(154_123_255/0.04)_45%,transparent)] opacity-0 transition-opacity duration-700 will-change-transform"
    />
  );
}
