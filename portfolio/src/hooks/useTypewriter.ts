import { useEffect, useState } from 'react';

interface Options {
  /** Milliseconds per character */
  speed?: number;
  startDelay?: number;
  /** When false the full text is shown immediately */
  enabled?: boolean;
}

/** Reveals `length` characters over time and reports how many are visible. */
export function useTypewriter(length: number, { speed = 22, startDelay = 400, enabled = true }: Options = {}) {
  const [count, setCount] = useState(enabled ? 0 : length);

  useEffect(() => {
    if (!enabled) {
      setCount(length);
      return;
    }
    setCount(0);
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t + startDelay;
      const next = Math.max(0, Math.min(length, Math.floor((t - start) / speed)));
      setCount(next);
      if (next < length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [length, speed, startDelay, enabled]);

  return { count, done: count >= length };
}
