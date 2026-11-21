import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Code2, Figma, Monitor, MousePointer2, Ruler, Smartphone, Users } from 'lucide-react';
import { Suspense, lazy, useRef, useState, type ReactNode } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { StatCard } from '@/components/ui/StatCard';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

// Source text and highlighter load as their own chunk, only when the section is near
const CodePanel = lazy(() => import('@/components/craft/CodePanel'));

type Variant = 'default' | 'highlight';

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-faint">{label}</span>
      <div className="flex gap-0.5 rounded-lg bg-white/[0.04] p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors',
              value === o.value ? 'bg-signal/20 text-fg' : 'text-muted hover:text-fg-soft',
            )}
          >
            {o.icon}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Redline measurement shown in inspect mode. */
function Redline({ className, label, vertical }: { className: string; label: string; vertical?: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('pointer-events-none absolute z-10 flex items-center justify-center', className)}
    >
      <span className={cn('bg-[#ff6bb5]', vertical ? 'h-full w-px' : 'h-px w-full')} />
      <span className="absolute rounded bg-[#ff6bb5] px-1 font-mono text-[0.6rem] leading-4 text-white">{label}</span>
    </motion.span>
  );
}

const tokens = [
  ['radius', 'card · 24px'],
  ['padding', '24px'],
  ['value', 'display 56 / 1.0'],
  ['label', 'sans 16 / medium'],
  ['fill', 'surface · 86%'],
  ['shadow', 'shadow-card'],
];

export function Craft() {
  const [variant, setVariant] = useState<Variant>('highlight');
  const [loading, setLoading] = useState(false);
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [inspect, setInspect] = useState(true);
  const [replay, setReplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: '400px 0px' });
  const visible = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Section id="craft" labelledBy="craft-title">
      <SectionHeading
        id="craft-title"
        eyebrow="05 · Code meets design"
        title="From Figma frame to production component."
        lede="The card on the left is the real StatCard from the Impact section, rendered live. Change its props and the usage code updates. The other tabs are the actual source files running this site."
      />

      <div ref={ref} className="mt-14 grid min-w-0 gap-5 lg:grid-cols-2">
        {/* DESIGN */}
        <Reveal className="min-w-0">
          <div className="glass flex h-full flex-col overflow-hidden rounded-card">
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5 text-xs">
              <Figma size={14} aria-hidden="true" className="text-[#a259ff]" />
              <span className="text-fg-soft">Design · Metrics</span>
              <span className="ml-auto flex items-center gap-1.5 text-faint">
                <MousePointer2 size={12} aria-hidden="true" /> StatCard selected
              </span>
            </div>

            {/* Canvas */}
            <div className="relative flex min-h-[22rem] flex-1 items-center justify-center overflow-hidden bg-ink-950/60 bg-[radial-gradient(rgb(143_154_185/0.16)_1px,transparent_1px)] bg-[size:16px_16px] p-8 sm:p-10">
              <motion.div
                layout
                transition={{ duration: 0.6, ease: easeOutExpo }}
                className={cn('relative w-full', viewport === 'mobile' ? 'max-w-[15rem]' : 'max-w-[22rem]')}
              >
                {/* frame label and selection box */}
                <span className="absolute -top-6 left-0 font-mono text-[0.65rem] text-[#a5b8ff]">
                  StatCard / variant={variant}
                  {loading && ' / loading'}
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute -inset-1.5 z-10 rounded-[28px] border border-[#5b8cff]">
                  {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map((pos) => (
                    <span key={pos} className={cn('absolute h-2 w-2 border border-[#5b8cff] bg-white', pos)} />
                  ))}
                </span>

                <AnimatePresence>
                  {inspect && (
                    <>
                      <Redline key="pad-t" className="top-0 left-1/2 h-6 -translate-x-1/2" label="24" vertical />
                      <Redline key="pad-l" className="top-1/2 left-0 w-6 -translate-y-1/2" label="24" />
                      <Redline key="w" className="right-0 -bottom-5 left-0 h-3" label={viewport === 'mobile' ? '240' : '352'} />
                    </>
                  )}
                </AnimatePresence>

                <StatCard
                  key={`${variant}-${loading}-${replay}`}
                  value={4}
                  label="Frontend developers led"
                  description="On a GenAI reporting product built from scratch."
                  icon={<Users size={18} aria-hidden="true" />}
                  variant={variant}
                  loading={loading}
                  start={visible}
                />
              </motion.div>
            </div>

            {/* Properties */}
            <div className="grid gap-3 border-t border-white/[0.06] p-4 sm:grid-cols-2">
              <Segmented
                label="Variant"
                value={variant}
                onChange={setVariant}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'highlight', label: 'Highlight' },
                ]}
              />
              <Segmented
                label="State"
                value={loading ? 'loading' : 'ready'}
                onChange={(v) => setLoading(v === 'loading')}
                options={[
                  { value: 'ready', label: 'Ready' },
                  { value: 'loading', label: 'Loading' },
                ]}
              />
              <Segmented
                label="Frame"
                value={viewport}
                onChange={setViewport}
                options={[
                  { value: 'desktop', label: 'Desktop', icon: <Monitor size={12} aria-hidden="true" /> },
                  { value: 'mobile', label: 'Mobile', icon: <Smartphone size={12} aria-hidden="true" /> },
                ]}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspect((v) => !v)}
                  aria-pressed={inspect}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition-colors',
                    inspect ? 'border-[#ff6bb5]/40 bg-[#ff6bb5]/10 text-fg' : 'border-white/10 text-muted hover:text-fg-soft',
                  )}
                >
                  <Ruler size={12} aria-hidden="true" /> Inspect
                </button>
                <button
                  type="button"
                  onClick={() => setReplay((n) => n + 1)}
                  className="inline-flex h-8 items-center rounded-md border border-white/10 px-2.5 text-xs text-muted transition-colors hover:text-fg-soft"
                >
                  Replay count
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {inspect && (
                <motion.dl
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOutExpo }}
                  className="grid grid-cols-2 gap-x-4 gap-y-1.5 overflow-hidden border-t border-white/[0.06] px-4 py-3 font-mono text-[0.7rem] sm:grid-cols-3"
                >
                  {tokens.map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="text-faint">{k}</dt>
                      <dd className="truncate text-fg-soft">{v}</dd>
                    </div>
                  ))}
                </motion.dl>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* CODE */}
        <Reveal delay={0.08} className="min-w-0">
          <div className="relative h-[34rem] lg:h-full lg:min-h-[34rem]">
            <span
              aria-hidden="true"
              className="absolute top-1/2 -left-5 z-10 hidden h-px w-5 bg-[linear-gradient(90deg,transparent,#8fb0ff)] lg:block"
            />
            <span aria-hidden="true" className="absolute top-1/2 -left-3 z-10 hidden -translate-y-1/2 lg:block">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-signal/40 bg-ink-900 text-signal-soft">
                <Code2 size={12} />
              </span>
            </span>
            {near ? (
              <Suspense fallback={<div className="glass h-full animate-pulse rounded-card" />}>
                <CodePanel variant={variant} loading={loading} />
              </Suspense>
            ) : (
              <div className="glass h-full rounded-card" />
            )}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Practices shown">
          {['Typed props with TypeScript', 'Reusable component', 'Custom hook', 'API integration with timeout', 'Responsive layout', 'Design tokens', 'Reduced-motion aware'].map(
            (t) => (
              <li key={t} className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-fg-soft">
                {t}
              </li>
            ),
          )}
        </ul>
      </Reveal>
    </Section>
  );
}
