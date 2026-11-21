import { motion } from 'framer-motion';
import { BarChart3, Check, FileText, ListChecks, Upload } from 'lucide-react';
import { useState } from 'react';
import { PreviewFrame, type PreviewProps } from './PreviewFrame';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

const standards = [
  { code: 'E1', name: 'Climate change', coverage: 72 },
  { code: 'E2', name: 'Pollution', coverage: 48 },
  { code: 'E3', name: 'Water and marine resources', coverage: 35 },
  { code: 'S1', name: 'Own workforce', coverage: 81 },
  { code: 'G1', name: 'Business conduct', coverage: 64 },
];

const tabs = [
  { id: 'standards', label: 'Standards', icon: ListChecks },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'gaps', label: 'Gap assessment', icon: BarChart3 },
] as const;
type Tab = (typeof tabs)[number]['id'];

/** Coverage ring for the gap assessment. */
function CoverageRing({ value }: { value: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 36 36" className="h-12 w-12 shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="3.5" />
      <motion.circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="url(#csrd-ring)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 1, ease: easeOutExpo }}
      />
      <defs>
        <linearGradient id="csrd-ring" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#63e3f2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CsrdPreview({ interactive = false, className }: PreviewProps) {
  const [tab, setTab] = useState<Tab>('gaps');
  const [selected, setSelected] = useState<string[]>(['E1', 'E2', 'S1', 'G1']);
  const [uploaded, setUploaded] = useState(!interactive);
  const [visited, setVisited] = useState<Tab[]>(['gaps']);

  const go = (id: Tab) => {
    setTab(id);
    setVisited((v) => (v.includes(id) ? v : [...v, id]));
  };
  const stepsDone = [selected.length > 0, uploaded, visited.includes('gaps')].filter(Boolean).length;
  const progress = Math.round((stepsDone / tabs.length) * 100);

  const active = standards.filter((s) => selected.includes(s.code));
  const average = active.length ? Math.round(active.reduce((n, s) => n + s.coverage, 0) / active.length) : 0;

  const toggle = (code: string) =>
    setSelected((cur) => (cur.includes(code) ? cur.filter((c) => c !== code) : [...cur, code]));

  return (
    <PreviewFrame title="CSRD reporting workspace" interactive={interactive} className={className}>
      <div className="flex h-full">
        <nav aria-label="Reporting steps" className="flex w-[30%] min-w-[6.5rem] shrink-0 flex-col gap-1 border-r border-white/[0.06] p-2">
          {tabs.map(({ id, label, icon: Icon }, i) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-pressed={tab === id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[0.7rem] transition-colors',
                tab === id ? 'bg-signal/15 text-fg' : 'text-muted hover:bg-white/[0.04] hover:text-fg-soft',
              )}
            >
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded text-[0.6rem] text-faint">{i + 1}</span>
              <Icon size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 overflow-hidden p-3">
          {/* Reporting progress */}
          <div className="mb-2.5">
            <div className="flex items-center justify-between text-[0.62rem]">
              <span className="text-faint">FY reporting · step {tabs.findIndex((t) => t.id === tab) + 1} of {tabs.length}</span>
              <span className="text-fg-soft">{progress}% complete</span>
            </div>
            <div className="mt-1 flex gap-1" aria-hidden="true">
              {tabs.map((t, i) => (
                <span key={t.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-[linear-gradient(90deg,#5b8cff,#9a7bff)]"
                    initial={false}
                    animate={{ scaleX: i < stepsDone ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: easeOutExpo }}
                  />
                </span>
              ))}
            </div>
          </div>
          {tab === 'standards' && (
            <div>
              <p className="text-[0.7rem] text-muted">Choose the standards in scope</p>
              <ul className="mt-2 space-y-1.5">
                {standards.map((s) => {
                  const on = selected.includes(s.code);
                  return (
                    <li key={s.code}>
                      <button
                        type="button"
                        onClick={() => toggle(s.code)}
                        aria-pressed={on}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-[0.72rem] transition-colors',
                          on ? 'border-signal/40 bg-signal/10 text-fg' : 'border-white/[0.06] text-muted hover:text-fg-soft',
                        )}
                      >
                        <span className={cn('grid h-4 w-4 place-items-center rounded border', on ? 'border-signal bg-signal text-white' : 'border-line-strong')}>
                          {on && <Check size={11} aria-hidden="true" />}
                        </span>
                        <span className="font-medium">{s.code}</span>
                        <span className="truncate">{s.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {tab === 'upload' && (
            <div className="flex h-full flex-col">
              <p className="text-[0.7rem] text-muted">Default disclosure documents</p>
              <div className="mt-2 grid place-items-center rounded-xl border border-dashed border-line-strong px-3 py-4 text-center">
                <Upload size={18} aria-hidden="true" className="text-signal-soft" />
                <button
                  type="button"
                  onClick={() => setUploaded(true)}
                  className="mt-2 rounded-md bg-signal/20 px-2.5 py-1 text-[0.7rem] font-medium text-fg hover:bg-signal/30"
                >
                  Upload sample files
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {['Annual sustainability report.pdf', 'Workforce policy.docx'].map((f, i) => (
                  <li key={f} className="rounded-lg border border-white/[0.06] px-2 py-1.5">
                    <div className="flex items-center gap-2 text-[0.7rem] text-fg-soft">
                      <FileText size={12} aria-hidden="true" />
                      <span className="truncate">{f}</span>
                      {uploaded && <Check size={12} aria-hidden="true" className="ml-auto text-success" />}
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className="h-full w-full origin-left rounded-full bg-[linear-gradient(90deg,#5b8cff,#9a7bff)]"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: uploaded ? 1 : 0 }}
                        transition={{ duration: 1.1, delay: i * 0.25, ease: easeOutExpo }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === 'gaps' && (
            <div>
              <div className="flex items-center gap-3">
                <CoverageRing value={average} />
                <div className="min-w-0">
                  <p className="text-[0.7rem] text-muted">Disclosure coverage</p>
                  <p className="font-display text-xl leading-tight font-semibold text-fg">{average}%</p>
                </div>
                <p className="ml-auto text-right text-[0.62rem] leading-tight text-faint">
                  {active.length} standards
                  <br />
                  <span className="text-danger">{active.filter((s) => s.coverage < 50).length} need attention</span>
                </p>
              </div>
              <ul className="mt-2 space-y-2">
                {active.map((s, i) => (
                  <li key={s.code}>
                    <div className="flex justify-between text-[0.68rem]">
                      <span className="truncate text-fg-soft">
                        {s.code} {s.name}
                      </span>
                      <span className={s.coverage < 50 ? 'text-danger' : 'text-muted'}>{s.coverage}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        className={cn(
                          'h-full w-full origin-left rounded-full',
                          s.coverage < 50 ? 'bg-[linear-gradient(90deg,#ff7a8a,#ffb37a)]' : 'bg-[linear-gradient(90deg,#5b8cff,#63e3f2)]',
                        )}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: s.coverage / 100 }}
                        transition={{ duration: 0.9, delay: 0.05 * i, ease: easeOutExpo }}
                      />
                    </div>
                  </li>
                ))}
                {active.length === 0 && (
                  <li className="text-[0.7rem] text-muted">Select standards in step 1 to see the assessment.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </PreviewFrame>
  );
}
