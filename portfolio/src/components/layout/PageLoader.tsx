import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';
import { easeOutExpo } from '@/lib/motion';

/**
 * Brief monogram reveal on first load, then the panel lifts away like a curtain.
 * About one second in total. Skipped entirely for reduced-motion users.
 */
export function PageLoader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(!reduce);

  useEffect(() => {
    if (reduce) {
      onDone();
      return;
    }
    // Signal ready as the curtain starts lifting, so the hero entrance plays during the reveal
    const t = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, 1000);
    return () => window.clearTimeout(t);
  }, [reduce, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          aria-hidden="true"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink-950"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgb(91_140_255/0.14),transparent)]" />
          <div aria-hidden="true" className="bg-noise absolute inset-0 opacity-[0.04]" />
          {/* glowing lower edge of the curtain */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,#8fb0ff,#bba7ff,transparent)]" />

          <motion.div
            className="relative flex flex-col items-center gap-5"
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <motion.span
              className="text-gradient-animated font-display text-6xl font-bold tracking-[-0.04em]"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
            >
              {profile.initials}
            </motion.span>
            <span className="relative block h-px w-32 overflow-hidden bg-white/10">
              <motion.span
                className="absolute inset-y-0 left-0 w-full origin-left bg-[linear-gradient(90deg,#5b8cff,#9a7bff,#63e3f2)]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: easeOutExpo }}
              />
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="eyebrow block text-muted"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay: 0.15, ease: easeOutExpo }}
              >
                {profile.name}
              </motion.span>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
