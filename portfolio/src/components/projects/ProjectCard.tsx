import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, UserRound } from 'lucide-react';
import { useRef, type CSSProperties } from 'react';
import type { Project, ProjectId } from '@/types';
import { previews } from './previews';
import { useSpotlight } from '@/hooks/useSpotlight';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

/** One accent per project, used for its glow and back layers. RGB triplets. */
const accents: Record<ProjectId, string> = {
  csrd: '79 214 163',
  itinerary: '99 227 242',
  andi: '91 140 255',
  retail: '154 123 255',
  aiis: '255 196 107',
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (project: Project, trigger: HTMLElement) => void;
  highlighted?: boolean;
  className?: string;
  previewHeight?: string;
}

export function ProjectCard({ project, index, onOpen, highlighted, className, previewHeight = 'h-56' }: ProjectCardProps) {
  const Preview = previews[project.id];
  const onPointerMove = useSpotlight<HTMLElement>();
  const accent = { '--accent': accents[project.id] } as CSSProperties;
  // Observe the card, not the clipped preview: a fully clipped element never reports as visible
  const cardRef = useRef<HTMLElement>(null);
  const revealed = useInView(cardRef, { once: true, amount: 0.2 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay: (index % 3) * 0.09, ease: easeOutExpo }}
      className={cn('flex min-w-0', className)}
    >
      <article
        ref={cardRef}
        onPointerMove={onPointerMove}
        style={accent}
        className={cn(
          'glass spotlight group relative flex w-full flex-col overflow-hidden rounded-card transition-[border-color,box-shadow,transform] duration-500 ease-out-expo',
          'hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift),0_30px_70px_-40px_rgb(var(--accent)/0.55)] focus-within:shadow-[var(--shadow-lift)]',
          highlighted && 'border-signal/50 shadow-[var(--shadow-glow)]',
        )}
      >
        {/* Accent light pooling behind the preview */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[80%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.22),transparent)] opacity-60 transition-opacity duration-700 group-hover:opacity-100"
        />

        <div className={cn('relative px-5 pt-5', previewHeight)}>
          {/* Layered composition: two back plates fan out as the preview lifts */}
          <div
            aria-hidden="true"
            className="absolute inset-x-9 top-3 bottom-0 rounded-panel border border-white/[0.06] bg-[linear-gradient(180deg,rgb(var(--accent)/0.12),transparent)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-1.5 group-hover:-rotate-[1.5deg]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-7 top-4 bottom-0 rounded-panel border border-white/[0.07] bg-ink-850/80 transition-transform duration-700 ease-out-expo group-hover:-translate-y-0.5 group-hover:rotate-[1deg]"
          />
          {/* Image-style reveal: the preview wipes in from the bottom as the card enters */}
          <motion.div
            // Reduced motion: no wipe, the preview is simply there
            initial={reduceMotion ? false : { clipPath: 'inset(100% 0% 0% 0% round 16px 16px 0 0)' }}
            animate={revealed ? { clipPath: 'inset(0% 0% 0% 0% round 16px 16px 0 0)' } : undefined}
            transition={{ duration: 1.1, delay: 0.15 + (index % 3) * 0.09, ease: easeOutExpo }}
            className="relative h-full overflow-hidden rounded-t-panel shadow-[0_-10px_40px_-20px_rgb(0_0_0/0.8)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:scale-[1.012]"
          >
            <Preview />

            {/* Details revealed on hover or keyboard focus */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 translate-y-full bg-[linear-gradient(180deg,transparent,rgb(6_9_20/0.92)_35%)] px-4 pt-10 pb-4 opacity-0 transition-[transform,opacity] duration-500 ease-out-expo group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <p className="flex items-start gap-2 text-sm leading-snug text-fg">
                <TrendingUp size={16} className="mt-0.5 shrink-0 text-[rgb(var(--accent))]" />
                {project.outcomes[0]}
              </p>
            </div>
          </motion.div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-ink-850/70" />
        </div>

        <div className="relative flex flex-1 flex-col border-t border-white/[0.06] p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <span className="rounded-full border border-[rgb(var(--accent)/0.3)] bg-[rgb(var(--accent)/0.08)] px-2.5 py-0.5 text-xs font-medium text-[rgb(var(--accent))]">
              {project.category}
            </span>
            <span className="font-mono text-xs tracking-wide text-faint">{project.period}</span>
          </div>
          <h3 className="mt-2.5 text-[1.3rem] leading-snug font-semibold tracking-[-0.02em] text-fg">
            <button
              type="button"
              onClick={(e) => onOpen(project, e.currentTarget)}
              className="text-left after:absolute after:inset-0 after:z-[3] after:rounded-card after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-signal-soft"
            >
              {project.name}
            </button>
          </h3>
          <p className="mt-2 leading-relaxed text-muted">{project.tagline}</p>
          <p className="mt-3 flex items-center gap-2 text-sm text-fg-soft">
            <UserRound size={14} aria-hidden="true" className="shrink-0 text-faint" />
            <span className="sr-only">My role: </span>
            {project.roleShort}
          </p>
          <div className="mt-auto flex items-end justify-between gap-4 pt-6">
            <ul className="flex flex-wrap gap-1.5" aria-label="Key technologies">
              {project.stack.slice(0, 3).map((s) => (
                <li key={s} className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-0.5 text-xs text-fg-soft">
                  {s}
                </li>
              ))}
            </ul>
            <span
              aria-hidden="true"
              className="flex h-10 shrink-0 items-center gap-0 overflow-hidden rounded-full border border-white/10 px-[11px] text-sm text-fg-soft transition-all duration-500 ease-out-expo group-hover:gap-2 group-hover:border-[rgb(var(--accent)/0.5)] group-hover:bg-[rgb(var(--accent)/0.12)] group-hover:pl-4 group-hover:text-fg"
            >
              <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-500 ease-out-expo group-hover:max-w-28">
                Case study
              </span>
              <ArrowUpRight size={18} className="shrink-0 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
