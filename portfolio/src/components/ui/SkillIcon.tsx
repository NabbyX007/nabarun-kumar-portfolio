import { useEffect, useState } from 'react';

type IconModule = typeof import('./skillIconMap');

let loaded: IconModule | null = null;
let pending: Promise<IconModule> | null = null;

function loadIcons() {
  pending ??= import('./skillIconMap').then((m) => (loaded = m));
  return pending;
}

/**
 * Loads the skill icon set as a separate chunk once the browser is idle.
 * Until it arrives, icons render as empty placeholders of the same size,
 * so nothing shifts when they appear.
 */
export function useSkillIcons() {
  const [icons, setIcons] = useState<IconModule | null>(loaded);

  useEffect(() => {
    if (icons) return;
    let cancelled = false;
    const start = () => loadIcons().then((m) => !cancelled && setIcons(m));
    const idle = window.requestIdleCallback?.(start, { timeout: 2500 }) ?? window.setTimeout(start, 600);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [icons]);

  return icons;
}

const FALLBACK_COLOR = '#8fb0ff';

export function skillColorFrom(icons: IconModule | null, name: string) {
  return icons ? icons.skillColor(name) : FALLBACK_COLOR;
}

export function SkillIcon({ icons, name, size = 16, className }: { icons: IconModule | null; name: string; size?: number; className?: string }) {
  if (!icons) return <span aria-hidden="true" className={className} style={{ display: 'inline-block', width: size, height: size }} />;
  const def = icons.skillIconDef(name);
  if ('brand' in def) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" className={className}>
        <path d={def.brand.path} />
      </svg>
    );
  }
  const Icon = def.lucide;
  return <Icon size={size} aria-hidden="true" className={className} />;
}
