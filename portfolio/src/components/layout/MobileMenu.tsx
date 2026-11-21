import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { navItems } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { scrollToSection } from '@/lib/scroll';
import { easeOutExpo } from '@/lib/motion';
import { cn } from '@/lib/cn';
import { LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  active: string;
}

export function MobileMenu({ open, onClose, active }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const navigate = (id: string) => {
    onClose();
    // wait for the sheet to start closing so scroll lock is released
    window.setTimeout(() => scrollToSection(id), 60);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="glass-strong fixed inset-0 z-[60] flex flex-col px-6 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-12 items-center justify-between">
            <span className="font-display text-base font-semibold text-fg">{profile.name}</span>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-control border border-white/10 bg-ink-800/60 text-fg"
              aria-label="Close menu"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + i * 0.05, ease: easeOutExpo }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.id);
                    }}
                    aria-current={active === item.id ? 'location' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-panel px-3 py-3 font-display text-[2rem] font-semibold tracking-[-0.03em] transition-colors active:bg-white/[0.04]',
                      active === item.id ? 'text-fg' : 'text-muted',
                    )}
                  >
                    {item.label}
                    {active === item.id && <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5 text-sm text-muted">
            <a href={`mailto:${profile.email}`} className="truncate hover:text-fg">
              {profile.email}
            </a>
            <span className="ml-auto flex gap-2">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:text-fg">
                <LinkedInIcon className="h-4 w-4" />
              </a>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:text-fg">
                  <GitHubIcon className="h-4 w-4" />
                </a>
              )}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
