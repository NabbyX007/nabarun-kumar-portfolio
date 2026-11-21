import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { Building2, ChevronDown } from 'lucide-react';
import { Fragment, useId, useRef, useState, type ReactNode } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Chip } from '@/components/ui/Chip';
import { company, roles } from '@/data/experience';
import type { Role, RoleFocus } from '@/types';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

const focusLabels: Record<RoleFocus, string> = {
  leadership: 'Team leadership',
  enterprise: 'Enterprise apps',
  migration: 'Angular → React migration',
  ai: 'AI & LLM integration',
  performance: 'Performance',
  mentoring: 'Code reviews & mentoring',
  delivery: 'End-to-end delivery',
};
const focusOrder = Object.keys(focusLabels) as RoleFocus[];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "Mar 2021" → month index since year 0. "Present" → this month. */
function toMonth(label: string) {
  if (label === 'Present') {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [mon, year] = label.split(' ');
  return Number(year) * 12 + MONTHS.indexOf(mon);
}

/** Inclusive tenure, e.g. "2 yrs 2 mos". */
function tenure(start: string, end: string) {
  const months = toMonth(end) - toMonth(start) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? 's' : ''}`, m && `${m} mo${m > 1 ? 's' : ''}`].filter(Boolean).join(' ');
}

/** Numbers that carry the story: percentages, "100+", "team of 4", "4 frontend developers". */
const METRIC = /(\d+%|\d+\+|team of \d+|\d+ frontend developers|North America)/gi;

/** Renders text with its metrics lifted out so achievements are scannable. */
function Emphasize({ text }: { text: string }): ReactNode {
  const parts = text.split(METRIC);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">
        {/\d+%/.test(part) ? <span className="text-gradient">{part}</span> : part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function RoleCard({ role, defaultOpen, activeFocus }: { role: Role; defaultOpen: boolean; activeFocus: RoleFocus | null }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const expandable = role.highlights.length > 1;

  return (
    <div
      className={cn(
        'glass group/role relative overflow-hidden rounded-card transition-[border-color,box-shadow] duration-500',
        open ? 'border-signal/25 shadow-[var(--shadow-lift)]' : 'hover:border-white/[0.2]',
      )}
    >
      {role.current && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(143_176_255/0.7),transparent)]" />
      )}
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="font-mono text-xs tracking-wide text-signal-soft">
            <time>{role.start}</time> — <time>{role.end}</time>
            <span className="text-faint"> · {tenure(role.start, role.end)}</span>
          </p>
          {role.current && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-success" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Current
            </span>
          )}
          {role.tags?.map((t) => (
            <span key={t} className="rounded-full border border-violet/30 bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet-soft">
              {t}
            </span>
          ))}
        </div>
        <h3 className="mt-3.5 text-xl leading-snug font-semibold tracking-[-0.02em] text-fg sm:text-[1.4rem]">{role.title}</h3>
        <p className="mt-1 text-[0.95rem] font-medium text-fg-soft">{role.project}</p>
        <p className="mt-4 leading-relaxed text-muted">
          <Emphasize text={role.summary} />
        </p>

        {role.focus && role.focus.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5" aria-label="Focus areas">
            {role.focus.map((f) => (
              <li
                key={f}
                className={cn(
                  'flex items-center gap-1.5 text-xs transition-colors duration-300',
                  activeFocus === f ? 'text-signal-soft' : 'text-faint',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn('h-1 w-1 rounded-full transition-colors', activeFocus === f ? 'bg-signal-soft' : 'bg-line-strong')}
                />
                {focusLabels[f]}
              </li>
            ))}
          </ul>
        )}

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {role.tech.map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>

        {expandable && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="mt-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-fg-soft transition-colors hover:text-fg"
          >
            {open ? 'Hide responsibilities' : 'Show responsibilities'}
            <span className="grid h-6 w-6 place-items-center rounded-full border border-white/10 transition-colors group-hover/role:border-signal/40">
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={cn('transition-transform duration-500 ease-out-expo', open && 'rotate-180')}
              />
            </span>
          </button>
        )}
      </div>

      {expandable && (
        <div
          id={panelId}
          className={cn(
            'grid transition-[grid-template-rows] duration-500 ease-out-expo',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden" inert={!open}>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3.5 border-t border-white/[0.06] bg-ink-950/30 px-6 py-6 sm:px-7"
                >
                  {role.highlights.map((h, i) => (
                    <motion.li
                      key={h}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.05 * i, ease: easeOutExpo }}
                      className="flex gap-3.5 leading-relaxed text-fg-soft"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.2em] grid h-5 w-5 shrink-0 place-items-center rounded-md border border-signal/25 bg-signal/10 font-mono text-[0.65rem] text-signal-soft"
                      >
                        {i + 1}
                      </span>
                      <span>
                        <Emphasize text={h} />
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

/** Timeline node that lights up once the reader reaches it. */
function TimelineNode({ current }: { current?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reached = useInView(ref, { margin: '0px 0px -40% 0px', once: true });
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        'absolute top-8 -left-8 grid h-[15px] w-[15px] place-items-center rounded-full border bg-ink-900 transition-[border-color,box-shadow] duration-700 sm:-left-10 sm:h-[23px] sm:w-[23px]',
        reached ? 'border-signal/70 shadow-[0_0_0_4px_rgb(91_140_255/0.12)]' : 'border-line-strong',
      )}
    >
      {current && reached && <span className="animate-pulse-ring absolute inset-0 rounded-full border border-signal/60" />}
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full transition-[background-color,box-shadow,transform] duration-700 sm:h-2 sm:w-2',
          reached ? 'scale-110 bg-signal shadow-[0_0_12px_#5b8cff]' : 'bg-faint',
        )}
      />
    </span>
  );
}

export function Experience() {
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ['start 0.75', 'end 0.6'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const headTop = useTransform(fill, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);
  const headOpacity = useTransform(fill, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);
  const [focus, setFocus] = useState<RoleFocus | null>(null);
  const matches = (role: Role) => !focus || !!role.focus?.includes(focus);

  return (
    <Section id="experience" labelledBy="experience-title">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="experience-title"
            eyebrow="02 · Experience"
            title="From intern to frontend lead, at one company."
            lede="At Accenture since 2020, moving from IoT prototypes to a chatbot used across North America to leading a team on GenAI products."
          />
          <Reveal delay={0.1} className="glass mt-8 flex items-start gap-4 rounded-card p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-white/[0.08] bg-white/[0.04] text-fg">
              <Building2 size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-fg">{company.name}</p>
              <p className="text-sm text-muted">
                {company.location}, {company.period}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{company.note}</p>
            </div>
          </Reveal>
        </div>

        <div className="min-w-0">
        <div className="mb-8" role="group" aria-label="Highlight roles by focus area">
          <p className="mb-3 text-sm text-muted">Highlight roles by focus</p>
          <div className="flex flex-wrap gap-2">
            {[null, ...focusOrder].map((f) => {
              const on = focus === f;
              return (
                <button
                  key={f ?? 'all'}
                  type="button"
                  onClick={() => setFocus(f)}
                  aria-pressed={on}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[0.8125rem] transition-[border-color,background-color,color] duration-300',
                    on
                      ? 'border-signal/50 bg-signal/15 text-fg'
                      : 'border-line bg-ink-900/50 text-fg-soft hover:border-line-strong hover:text-fg',
                  )}
                >
                  {f ? focusLabels[f] : 'All roles'}
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            {focus ? `${roles.filter(matches).length} roles highlighted for ${focusLabels[focus]}` : ''}
          </p>
        </div>

        <ol ref={railRef} className="relative space-y-6 pl-8 sm:pl-10" aria-label="Career timeline">
          {/* rail, progress fill and its glowing head */}
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line sm:left-[11px]" />
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px sm:left-[11px]">
            <motion.span
              style={{ scaleY: fill }}
              className="absolute inset-0 origin-top bg-[linear-gradient(180deg,#5b8cff,#9a7bff,#63e3f2)] shadow-[0_0_10px_rgb(91_140_255/0.6)]"
            />
            <motion.span
              style={{ top: headTop, opacity: headOpacity }}
              className="absolute left-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-full rounded-full bg-[linear-gradient(180deg,transparent,#bba7ff)] blur-[1px]"
            />
          </span>
          {roles.map((role, i) => (
            <Reveal as="li" key={role.id} delay={i * 0.06} className="relative">
              <div
                className={cn(
                  'transition-[opacity,filter] duration-500',
                  !matches(role) && 'opacity-35 saturate-50',
                )}
              >
                <TimelineNode current={role.current} />
                <RoleCard role={role} defaultOpen={i === 0} activeFocus={focus} />
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
      </div>
    </Section>
  );
}
