import { useCallback, useRef, type PointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useFinePointer } from './useMediaQuery';

/**
 * Pulls an element gently toward the pointer while hovered.
 * Disabled for touch input and reduced-motion users.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const enabled = fine && !reduce;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 260, damping: 18, mass: 0.4 });

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (!enabled || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      rawX.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      rawY.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [enabled, rawX, rawY, strength],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { ref, style: { x, y }, handlers: { onPointerMove, onPointerLeave } };
}
