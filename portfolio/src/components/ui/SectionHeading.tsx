import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  id: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Small label above the title, e.g. "01 · About" */
  eyebrow?: string;
  className?: string;
}

export function SectionHeading({ id, title, lede, eyebrow, className }: SectionHeadingProps) {
  return (
    <Reveal className={cn('max-w-3xl', className)} blur>
      {eyebrow && (
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--color-signal-soft))]" />
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] text-fg sm:text-5xl lg:text-[3.4rem]">
        {title}
      </h2>
      {lede && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>}
    </Reveal>
  );
}
