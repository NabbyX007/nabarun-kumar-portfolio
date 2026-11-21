import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

interface CountUpOptions {
  /** Start counting only when true, e.g. once the element is in view. */
  start?: boolean;
  /** Duration in seconds. */
  duration?: number;
}

/**
 * Counts from 0 to `target` with an ease-out curve.
 * Users who prefer reduced motion see the final value straight away.
 */
export function useCountUp(target: number, { start = true, duration = 1.6 }: CountUpOptions = {}) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [target, start, duration, reduceMotion]);

  return value;
}
