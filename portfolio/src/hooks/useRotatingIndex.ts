import { useEffect, useState } from 'react';

/** Cycles through 0..length-1 on an interval; pauses when `paused` is true. */
export function useRotatingIndex(length: number, intervalMs = 2600, paused = false) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % length), intervalMs);
    return () => window.clearInterval(id);
  }, [length, intervalMs, paused]);

  return index;
}
