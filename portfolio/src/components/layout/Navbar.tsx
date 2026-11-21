import { motion } from 'framer-motion';
import { Menu, SquareTerminal } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { navItems } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useScrolled } from '@/hooks/useScrolled';
import { scrollToSection } from '@/lib/scroll';
import { springSnappy } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { buttonClasses } from '@/components/ui/Button';
import { MobileMenu } from './MobileMenu';

export function Navbar({ active }: { active: string }) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ x: 0, width: 0, visible: false });
  const [hovered, setHovered] = useState<string | null>(null);
  // The pill follows the hovered link, then glides back to the active section
  const target = hovered ?? active;

  // Measure the target link so the highlight pill can glide to it
  useLayoutEffect(() => {
    const measure = () => {
      const el = linkRefs.current[target];
      if (!el) {
        setIndicator((s) => ({ ...s, visible: false }));
        return;
      }
      setIndicator({ x: el.offsetLeft, width: el.offsetWidth, visible: true });
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener('resize', measure);
  }, [target]);

  const go = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)]">
        <div
          className={cn(
            'absolute inset-0 -z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-500',
            scrolled
              ? 'border-white/[0.06] bg-ink-900/70 backdrop-blur-xl backdrop-saturate-150'
              : 'border-transparent bg-transparent',
          )}
        />
        <nav aria-label="Primary" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <a href="#home" onClick={go('home')} className="group flex items-center gap-3 rounded-lg" aria-label={`${profile.name}, back to top`}>
            <span className="grid h-9 w-9 place-items-center rounded-control border border-white/10 bg-[linear-gradient(135deg,rgb(91_140_255/0.25),rgb(154_123_255/0.2))] font-display text-sm font-bold tracking-tight text-fg shadow-[0_6px_18px_-8px_rgb(91_140_255/0.7)] transition-transform duration-500 ease-out-expo group-hover:scale-105 group-hover:rotate-[-6deg]">
              {profile.initials}
            </span>
            <span className="hidden font-display text-[0.95rem] font-semibold tracking-tight text-fg whitespace-nowrap transition-colors group-hover:text-signal-soft sm:block md:hidden lg:block">{profile.name}</span>
          </a>

          <div
            onPointerLeave={() => setHovered(null)}
            className="relative hidden items-center rounded-full border border-white/[0.07] bg-ink-800/50 p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] backdrop-blur-xl md:flex"
          >
            <motion.span
              aria-hidden="true"
              className="absolute top-1 bottom-1 left-0 rounded-full border border-signal/25 bg-[linear-gradient(110deg,rgb(91_140_255/0.22),rgb(154_123_255/0.18))]"
              initial={false}
              animate={{ x: indicator.x, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
              transition={springSnappy}
            />
            {navItems.map((item) => (
              <a
                key={item.id}
                ref={(el) => {
                  linkRefs.current[item.id] = el;
                }}
                href={`#${item.id}`}
                onClick={go(item.id)}
                onPointerEnter={() => setHovered(item.id)}
                onFocus={() => setHovered(item.id)}
                onBlur={() => setHovered(null)}
                aria-current={active === item.id ? 'location' : undefined}
                className={cn(
                  'relative z-10 rounded-full px-4 py-1.5 text-sm transition-colors duration-300',
                  target === item.id ? 'text-fg' : 'text-muted',
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#terminal"
              onClick={go('terminal')}
              aria-label="Open the developer terminal"
              title="Developer terminal"
              className="grid h-10 w-10 place-items-center rounded-control border border-white/10 bg-ink-800/60 text-muted transition-[border-color,color] duration-300 hover:border-signal/40 hover:text-fg"
            >
              <SquareTerminal size={18} aria-hidden="true" />
            </a>
            <a href="#contact" onClick={go('contact')} className={buttonClasses('secondary', 'md', 'hidden h-10 px-4 text-sm sm:inline-flex')}>
              Let’s connect
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-control border border-white/10 bg-ink-800/60 text-fg md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} active={active} />
    </>
  );
}
