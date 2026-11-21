import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRotatingIndex } from '@/hooks/useRotatingIndex';
import { easeOutExpo } from '@/lib/motion';

/** "I build ___" line that cycles through focus areas. Announced politely only once. */
export function RoleRotator({ items }: { items: readonly string[] }) {
  const reduce = useReducedMotion();
  const index = useRotatingIndex(items.length, 2600, !!reduce);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 text-lg text-muted sm:text-xl">
      <span>I build</span>
      <span className="sr-only">{items.join(', ')}</span>
      <span aria-hidden="true" className="relative inline-grid h-[1.6em] overflow-hidden align-bottom">
        <AnimatePresence initial={false}>
          <motion.span
            key={items[index]}
            initial={{ y: 26, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -26, opacity: 0 }}
            transition={{ duration: 0.55, ease: easeOutExpo }}
            className="col-start-1 row-start-1 font-medium whitespace-nowrap text-fg"
          >
            {items[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
