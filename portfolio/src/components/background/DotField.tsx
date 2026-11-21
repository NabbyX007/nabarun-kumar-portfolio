import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

interface DotFieldProps {
  className?: string;
  spacing?: number;
  radius?: number;
}

/**
 * A grid of dots that brighten and swell around the pointer.
 * Draws only while the pointer is moving and the canvas is on screen;
 * renders a single static frame for reduced-motion users.
 */
export function DotField({ className, spacing = 30, radius = 170 }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let energy = 0; // fades the effect in and out

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * spacing;
          const y = r * spacing + spacing / 2;
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const t = Math.max(0, 1 - dist / radius) * energy;
          const eased = t * t * (3 - 2 * t);
          // Blue on the left, violet on the right, brighter near the pointer
          const mix = x / Math.max(width, 1);
          const red = Math.round(91 + (154 - 91) * mix);
          const green = Math.round(140 + (123 - 140) * mix);
          const alpha = 0.13 + eased * 0.75;
          const size = 0.9 + eased * 1.6;
          ctx.fillStyle = `rgba(${red}, ${green}, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      const target = pointer.tx > -9000 ? 1 : 0;
      energy += (target - energy) * 0.08;
      draw();
      const settled =
        Math.abs(pointer.tx - pointer.x) < 0.3 && Math.abs(pointer.ty - pointer.y) < 0.3 && Math.abs(target - energy) < 0.01;
      raf = settled || !visible ? 0 : requestAnimationFrame(loop);
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (pointer.x < -9000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      kick();
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
      kick();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);

    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, spacing, radius]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)} />;
}
