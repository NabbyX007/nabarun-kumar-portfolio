import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import type { Project } from '@/types';
import { projects } from '@/data/projects';
import { previews } from './previews';
import { Chip } from '@/components/ui/Chip';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { easeOutExpo } from '@/lib/motion';

interface ProjectDialogProps {
  project: Project;
  onClose: () => void;
  onNavigate: (project: Project) => void;
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      <div className="mt-2.5 leading-relaxed text-muted">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
          <span className="text-fg-soft">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Case-study dialog. Lazy-loaded so its code only downloads when a visitor opens a project. */
export default function ProjectDialog({ project, onClose, onNavigate }: ProjectDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const Preview = previews[project.id];
  const index = projects.findIndex((p) => p.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  useLockBodyScroll(true);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project.id]);

  const titleId = `dialog-title-${project.id}`;

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-ink-950/75 backdrop-blur-md" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="glass-strong relative flex max-h-[92svh] w-full max-w-5xl flex-col overflow-hidden rounded-t-card outline-none sm:rounded-card"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
      >
        <div className="flex shrink-0 items-start gap-4 border-b border-white/[0.06] px-6 py-5 sm:px-8">
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="rounded-full border border-signal/25 bg-signal/10 px-2.5 py-0.5 text-xs font-medium text-signal-soft">
                {project.category}
              </span>
              <span>
                {project.period}, {project.context}
              </span>
            </p>
            <h2 id={titleId} className="mt-1 text-2xl font-semibold text-fg sm:text-3xl">
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-control border border-white/10 text-fg-soft transition-colors hover:bg-white/[0.06] hover:text-fg"
            aria-label="Close case study"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div ref={scrollRef} className="scroll-thin min-h-0 flex-1 overflow-y-auto px-6 py-7 pb-[calc(env(safe-area-inset-bottom,0px)+1.75rem)] sm:px-8">
          <p className="max-w-3xl text-lg leading-relaxed text-fg-soft">{project.tagline}</p>

          <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="h-[22rem] sm:h-[24rem]">
                <Preview interactive />
              </div>
              <div className="mt-3 rounded-panel border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm leading-relaxed">
                <p className="font-medium text-fg-soft">Illustrative UI, not the production application</p>
                <p className="mt-1 text-muted">{project.previewNote}</p>
              </div>
            </div>
            <div className="space-y-7">
              <Block title="Overview">
                <p>{project.overview}</p>
              </Block>
              <Block title="Business problem">
                <p>{project.problem}</p>
              </Block>
              <Block title="My role">
                <p className="mb-3">{project.role}</p>
                <Bullets items={project.contributions} />
              </Block>
            </div>
          </div>

          <div className="mt-10 grid gap-8 border-t border-white/[0.06] pt-8 md:grid-cols-2">
            <Block title="Key features">
              <Bullets items={project.features} />
            </Block>
            <Block title="Outcomes">
              <ul className="space-y-2.5">
                {project.outcomes.map((o) => (
                  <li key={o} className="rounded-control border border-success/20 bg-success/[0.06] px-4 py-2.5 text-fg-soft">
                    {o}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-8">
            <h3 className="text-base font-semibold text-fg">Technical challenges and solutions</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {project.challenges.map((c) => (
                <div key={c.challenge} className="rounded-panel border border-white/[0.07] bg-ink-800/60 p-5">
                  <p className="text-sm font-medium text-violet-soft">Challenge</p>
                  <p className="mt-1 text-fg-soft">{c.challenge}</p>
                  <p className="mt-4 text-sm font-medium text-cyan">Solution</p>
                  <p className="mt-1 text-muted">{c.solution}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-t border-white/[0.06] pt-8">
            <h3 className="text-base font-semibold text-fg">Technology stack</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s}>
                  <Chip>{s}</Chip>
                </li>
              ))}
            </ul>
            {project.confidentialityNote && <p className="mt-5 text-sm text-faint">{project.confidentialityNote}</p>}
          </div>

          <nav aria-label="Other projects" className="mt-10 grid gap-3 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onNavigate(prev)}
              className="group flex items-center gap-3 rounded-panel border border-white/[0.07] p-4 text-left transition-colors hover:border-signal/30"
            >
              <ChevronLeft size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:-translate-x-0.5" />
              <span className="min-w-0">
                <span className="block text-xs text-faint">Previous project</span>
                <span className="block truncate text-fg-soft">{prev.name}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate(next)}
              className="group flex items-center justify-end gap-3 rounded-panel border border-white/[0.07] p-4 text-right transition-colors hover:border-signal/30"
            >
              <span className="min-w-0">
                <span className="block text-xs text-faint">Next project</span>
                <span className="block truncate text-fg-soft">{next.name}</span>
              </span>
              <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
            </button>
          </nav>
        </div>
      </motion.div>
    </motion.div>
  );
}
