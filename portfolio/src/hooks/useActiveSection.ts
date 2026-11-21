import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in the middle band of the viewport.
 * Uses IntersectionObserver so no scroll handlers run on the main thread.
 */
export function useActiveSection(ids: readonly string[], fallback = 'home') {
  const [active, setActive] = useState<string>(fallback);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
