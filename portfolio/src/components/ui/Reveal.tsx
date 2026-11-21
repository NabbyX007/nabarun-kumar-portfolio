import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { easeOutExpo } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Adds a soft focus-pull. Use on headings, not on large blocks. */
  blur?: boolean;
  as?: 'div' | 'li';
}

/** Fades content in once as it scrolls into view. Framer Motion skips the movement for reduced-motion users. */
export function Reveal({ children, className, delay = 0, y = 22, blur = false, as = 'div' }: RevealProps) {
  const Comp = as === 'li' ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, ...(blur && { filter: 'blur(8px)' }) }}
      whileInView={{ opacity: 1, y: 0, ...(blur && { filter: 'blur(0px)' }) }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: easeOutExpo }}
    >
      {children}
    </Comp>
  );
}
