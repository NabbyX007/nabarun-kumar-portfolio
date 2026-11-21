import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/cn';

/** Wraps any control so it drifts slightly toward the pointer on hover. */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const { ref, style, handlers } = useMagnetic<HTMLDivElement>(strength);
  return (
    <motion.div ref={ref} style={style} {...handlers} className={cn('inline-flex', className)}>
      {children}
    </motion.div>
  );
}
