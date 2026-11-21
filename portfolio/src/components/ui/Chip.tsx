import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-ink-800/70 px-3 py-1 text-[0.8125rem] leading-5 text-fg-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}
