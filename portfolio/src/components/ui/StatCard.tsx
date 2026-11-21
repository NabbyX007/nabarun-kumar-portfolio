import type { ReactNode } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/cn';

export interface StatCardProps {
  /** The number to count up to. */
  value: number;
  label: string;
  description?: string;
  prefix?: string;
  suffix?: string;
  icon?: ReactNode;
  variant?: 'default' | 'highlight';
  /** Shows a skeleton while data is loading. */
  loading?: boolean;
  /** Begin the count-up animation, e.g. when the card scrolls into view. */
  start?: boolean;
  className?: string;
}

/** A single headline metric with an animated counter. */
export function StatCard({
  value,
  label,
  description,
  prefix = '',
  suffix = '',
  icon,
  variant = 'default',
  loading = false,
  start = true,
  className,
}: StatCardProps) {
  const count = useCountUp(value, { start: start && !loading });

  return (
    <div
      className={cn(
        'glass relative flex h-full flex-col overflow-hidden rounded-card p-6',
        variant === 'highlight' && 'border-signal/30 shadow-[var(--shadow-glow)]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.18),transparent)]"
      />
      {icon && (
        <span className="grid h-10 w-10 place-items-center rounded-control border border-white/[0.08] bg-signal/10 text-signal-soft">
          {icon}
        </span>
      )}

      {loading ? (
        <div className="mt-6 space-y-3" aria-busy="true" aria-label={`Loading ${label}`}>
          <div className="h-11 w-28 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-4 w-40 animate-pulse rounded bg-white/[0.05]" />
        </div>
      ) : (
        <>
          <p className="mt-6 font-display text-5xl leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums sm:text-[3.4rem]">
            {/* Screen readers get the final value, not every intermediate number */}
            <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
            <span aria-hidden="true" className="text-gradient">
              {prefix}
              {count}
              {suffix}
            </span>
          </p>
          <p className="mt-3 font-medium text-fg">{label}</p>
          {description && <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>}
        </>
      )}
    </div>
  );
}
