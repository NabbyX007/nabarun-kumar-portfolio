import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { PreviewFrame, type PreviewProps } from './PreviewFrame';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

type Status = 'running' | 'warning' | 'offline';

/** Sample data for the illustrative dashboard. */
const assets: { id: string; name: string; status: Status; load: number }[] = [
  { id: 'P-101', name: 'Feed pump', status: 'running', load: 72 },
  { id: 'C-204', name: 'Compressor', status: 'warning', load: 91 },
  { id: 'B-12', name: 'Conveyor', status: 'running', load: 58 },
  { id: 'T-3', name: 'Turbine', status: 'offline', load: 0 },
  { id: 'H-07', name: 'Heat exchanger', status: 'running', load: 64 },
];
const trend = [62, 66, 63, 70, 74, 71, 78, 76, 81, 79, 84, 82];

const statusStyle: Record<Status, string> = {
  running: 'bg-success/15 text-success',
  warning: 'bg-amber/15 text-amber',
  offline: 'bg-danger/15 text-danger',
};

/** Wraps a block and, when boundaries are on, labels it with its component name. */
function Block({ name, show, className, children }: { name: string; show: boolean; className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative rounded-lg border bg-ink-800/80 p-2 transition-colors duration-300',
        show ? 'border-dashed border-signal/50' : 'border-white/[0.06]',
        className,
      )}
    >
      {show && (
        <span className="absolute -top-2 left-1.5 rounded bg-signal px-1 font-mono text-[0.52rem] leading-4 text-white">
          {name}
        </span>
      )}
      {children}
    </div>
  );
}

function TrendChart() {
  const max = Math.max(...trend);
  const min = Math.min(...trend) - 6;
  const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * 100},${30 - ((v - min) / (max - min)) * 26}`).join(' ');
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-full min-h-8 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="aiis-trend" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#63e3f2" stopOpacity="0.3" />
          <stop offset="1" stopColor="#63e3f2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${pts} 100,32`} fill="url(#aiis-trend)" />
      <polyline points={pts} fill="none" stroke="#63e3f2" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function AiisPreview({ interactive = false, className }: PreviewProps) {
  const [mode, setMode] = useState<'legacy' | 'react'>(interactive ? 'legacy' : 'react');
  const [boundaries, setBoundaries] = useState(!interactive);
  const [filter, setFilter] = useState<'all' | Status>('all');

  const rows = filter === 'all' ? assets : assets.filter((a) => a.status === filter);
  const online = assets.filter((a) => a.status !== 'offline').length;
  const alerts = assets.filter((a) => a.status === 'warning').length;

  return (
    <PreviewFrame title="Asset monitoring screen" interactive={interactive} className={className}>
      <div className="flex h-full flex-col gap-2.5 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 rounded-lg bg-white/[0.05] p-0.5" role="radiogroup" aria-label="Implementation">
            {(
              [
                ['legacy', 'Angular module'],
                ['react', 'React components'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mode === id}
                onClick={() => setMode(id)}
                className={cn(
                  'rounded-md px-2 py-1 text-[0.66rem] transition-colors',
                  mode === id ? 'bg-signal/25 text-fg' : 'text-muted hover:text-fg-soft',
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {mode === 'react' && (
            <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-[0.62rem] text-muted">
              <input
                type="checkbox"
                checked={boundaries}
                onChange={(e) => setBoundaries(e.target.checked)}
                className="h-3 w-3 accent-[#5b8cff]"
              />
              Component boundaries
            </label>
          )}
        </div>

        <div className="relative min-h-0 flex-1">
          {mode === 'legacy' ? (
            <motion.div
              key="legacy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="h-full rounded-xl border border-danger/25 bg-danger/[0.04] p-2.5"
            >
              <p className="font-mono text-[0.62rem] text-[#ffb3bd]">asset-monitoring.component.html</p>
              <p className="mt-1 text-[0.6rem] text-faint">One large template: markup, state and table logic in a single module.</p>
              <div className="mt-2 space-y-1.5" aria-hidden="true">
                {[92, 70, 84, 58, 88, 64, 76, 50].map((w, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-white/[0.07]" style={{ width: `${w}%` }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="react"
              initial={interactive ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="grid h-full grid-cols-3 grid-rows-[auto_minmax(0,1fr)] gap-2"
            >
              {[
                { label: 'Assets online', value: `${online}/${assets.length}` },
                { label: 'Active alerts', value: String(alerts) },
                { label: 'Avg. load', value: `${Math.round(assets.reduce((n, a) => n + a.load, 0) / assets.length)}%` },
              ].map((k) => (
                <Block key={k.label} name="<KpiCard />" show={boundaries}>
                  <p className="truncate text-[0.58rem] text-muted">{k.label}</p>
                  <p className="font-display text-sm leading-tight font-semibold text-fg">{k.value}</p>
                </Block>
              ))}

              <Block name="<AssetTable />" show={boundaries} className="col-span-2 flex min-h-0 flex-col">
                <div className="flex gap-1" role="group" aria-label="Filter assets">
                  {(['all', 'warning', 'offline'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      aria-pressed={filter === f}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[0.58rem] capitalize transition-colors',
                        filter === f ? 'bg-signal/25 text-fg' : 'text-muted hover:text-fg-soft',
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <ul className="mt-1 min-h-0 flex-1 space-y-0.5 overflow-hidden">
                  {rows.map((a) => (
                    <li key={a.id} className="flex items-center gap-1.5 rounded px-1 py-[3px] text-[0.6rem] odd:bg-white/[0.02]">
                      <span className="w-9 shrink-0 font-mono text-faint">{a.id}</span>
                      <span className="min-w-0 flex-1 truncate text-fg-soft">{a.name}</span>
                      <span className={cn('rounded px-1 text-[0.54rem] capitalize', statusStyle[a.status])}>{a.status}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block name="<TrendChart />" show={boundaries} className="flex min-h-0 flex-col">
                <p className="text-[0.58rem] text-muted">Output, 12 h</p>
                <div className="min-h-0 flex-1">
                  <TrendChart />
                </div>
              </Block>
            </motion.div>
          )}
        </div>
      </div>
    </PreviewFrame>
  );
}
