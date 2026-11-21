import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PreviewFrameProps {
  title: string;
  interactive: boolean;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

/** Window chrome shared by every project preview. Non-interactive previews are hidden from assistive tech. */
export function PreviewFrame({ title, interactive, children, className, actions }: PreviewFrameProps) {
  return (
    <div
      className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-950/85 text-left',
        !interactive && 'pointer-events-none select-none',
        className,
      )}
      aria-hidden={interactive ? undefined : true}
      inert={!interactive}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-white/[0.06] px-3 py-2">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </span>
        <span className="truncate text-[0.7rem] text-faint">{title}</span>
        <span className="ml-auto flex items-center gap-2">
          {actions}
          <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[0.65rem] text-faint">
            {interactive ? 'Illustrative · sample data' : 'Illustrative'}
          </span>
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

export interface PreviewProps {
  interactive?: boolean;
  className?: string;
}
