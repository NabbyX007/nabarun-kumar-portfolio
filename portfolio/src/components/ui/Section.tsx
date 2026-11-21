import type { ReactNode } from 'react';
import type { SectionId } from '@/types';
import { cn } from '@/lib/cn';

interface SectionProps {
  id: SectionId;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, labelledBy, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn('relative py-24 outline-none md:py-32', className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
