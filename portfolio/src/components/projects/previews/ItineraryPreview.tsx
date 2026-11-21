import { motion } from 'framer-motion';
import { Castle, ChevronDown, ChevronUp, Fish, GripVertical, Landmark, Palette, Plus, RotateCcw, Sparkles, Sun, Utensils } from 'lucide-react';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { PreviewFrame, type PreviewProps } from './PreviewFrame';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

const stops = [
  { id: 'mosque', place: 'Sheikh Zayed Grand Mosque', note: 'Morning visit, modest dress', icon: Landmark, art: 'from-[#5b8cff] to-[#63e3f2]' },
  { id: 'louvre', place: 'Louvre Abu Dhabi', note: 'Galleries and the dome', icon: Palette, art: 'from-[#9a7bff] to-[#5b8cff]' },
  { id: 'food', place: 'Corniche food walk', note: 'Local dishes at sunset', icon: Utensils, art: 'from-[#ffb37a] to-[#ff7a8a]' },
  { id: 'yas', place: 'Yas Island', note: 'Family day out', icon: Sun, art: 'from-[#63e3f2] to-[#4fd6a3]' },
];

/** Suggestions matched to the stated interests (food, history). */
const recommendations = [
  { id: 'qasr', place: 'Qasr Al Watan', note: 'Palace and national library', icon: Castle, art: 'from-[#ffc46b] to-[#9a7bff]', reason: 'History' },
  { id: 'market', place: 'Mina Zayed fish market', note: 'Fresh catch, cooked to order', icon: Fish, art: 'from-[#63e3f2] to-[#5b8cff]', reason: 'Food' },
];
const allStops = [...stops, ...recommendations];

type Status = 'idle' | 'loading' | 'done';

export function ItineraryPreview({ interactive = false, className }: PreviewProps) {
  const [status, setStatus] = useState<Status>(interactive ? 'idle' : 'done');
  const [order, setOrder] = useState(stops.map((s) => s.id));
  const dragFrom = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (status !== 'loading') return;
    const t = window.setTimeout(() => setStatus('done'), 900);
    return () => window.clearTimeout(t);
  }, [status]);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length || from === to) return;
    setOrder((cur) => {
      const next = [...cur];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const onDragStart = (i: number) => (e: DragEvent) => {
    dragFrom.current = i;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(i));
  };
  const onDrop = (i: number) => (e: DragEvent) => {
    e.preventDefault();
    if (dragFrom.current !== null) move(dragFrom.current, i);
    dragFrom.current = null;
    setOverIndex(null);
  };

  return (
    <PreviewFrame
      title="Trip planner"
      interactive={interactive}
      className={className}
      actions={
        interactive && status === 'done' ? (
          <button
            type="button"
            onClick={() => {
              setStatus('idle');
              setOrder(stops.map((s) => s.id));
            }}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] text-muted hover:bg-white/[0.05] hover:text-fg"
          >
            <RotateCcw size={11} aria-hidden="true" /> Reset
          </button>
        ) : null
      }
    >
      <div className="flex h-full flex-col gap-2.5 overflow-y-auto p-3 scroll-thin">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-signal/20 px-3 py-2 text-[0.72rem] leading-snug text-fg">
          Plan 4 days in Abu Dhabi for a family. We love food and history.
        </div>

        {status === 'idle' && (
          <button
            type="button"
            onClick={() => setStatus('loading')}
            className="mx-auto mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[linear-gradient(110deg,#4a7bff,#9a7bff)] px-3 py-1.5 text-[0.72rem] font-medium text-white"
          >
            <Sparkles size={13} aria-hidden="true" /> Generate itinerary
          </button>
        )}

        {status === 'loading' && (
          <div className="space-y-2" role="status" aria-label="Generating itinerary">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-white/[0.05]" />
            ))}
          </div>
        )}

        {status === 'done' && (
          <>
            {interactive && <p className="text-[0.65rem] text-faint">Drag cards or use the arrows to reorder days.</p>}
            <ol className="space-y-2" aria-label="Itinerary">
                {order.map((id, i) => {
                  const s = allStops.find((x) => x.id === id)!;
                  const Icon = s.icon;
                  return (
                    <li
                      key={id}
                      draggable={interactive}
                      onDragStart={onDragStart(i)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setOverIndex(i);
                      }}
                      onDragLeave={() => setOverIndex(null)}
                      onDrop={onDrop(i)}
                      onDragEnd={() => setOverIndex(null)}
                      className={cn(interactive && 'cursor-grab active:cursor-grabbing')}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: interactive ? i * 0.08 : 0, ease: easeOutExpo }}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl border bg-ink-800/80 p-1.5 pr-2 transition-colors',
                          overIndex === i ? 'border-signal/60' : 'border-white/[0.06]',
                        )}
                      >
                        <span className={cn('grid h-9 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white/90', s.art)}>
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.62rem] font-medium text-signal-soft">Day {i + 1}</p>
                          <p className="truncate text-[0.74rem] font-medium text-fg">{s.place}</p>
                          <p className="truncate text-[0.64rem] text-muted">{s.note}</p>
                        </div>
                        {interactive ? (
                          <span className="flex shrink-0 items-center">
                            <button
                              type="button"
                              onClick={() => move(i, i - 1)}
                              disabled={i === 0}
                              aria-label={`Move ${s.place} earlier`}
                              className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-white/[0.06] hover:text-fg disabled:opacity-30"
                            >
                              <ChevronUp size={14} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => move(i, i + 1)}
                              disabled={i === order.length - 1}
                              aria-label={`Move ${s.place} later`}
                              className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-white/[0.06] hover:text-fg disabled:opacity-30"
                            >
                              <ChevronDown size={14} aria-hidden="true" />
                            </button>
                          </span>
                        ) : (
                          <GripVertical size={14} aria-hidden="true" className="shrink-0 text-faint" />
                        )}
                      </motion.div>
                    </li>
                  );
                })}
            </ol>

            {recommendations.some((r) => !order.includes(r.id)) && (
              <div className="rounded-xl border border-dashed border-white/[0.08] p-2">
                <p className="flex items-center gap-1 text-[0.62rem] text-faint">
                  <Sparkles size={10} aria-hidden="true" className="text-violet-soft" /> Recommended for you · based on food & history
                </p>
                <ul className="mt-1.5 flex flex-wrap gap-1.5">
                  {recommendations
                    .filter((r) => !order.includes(r.id))
                    .map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => setOrder((o) => [...o, r.id])}
                          className="inline-flex items-center gap-1 rounded-full border border-violet/30 bg-violet/10 px-2 py-0.5 text-[0.64rem] text-fg-soft hover:bg-violet/20 hover:text-fg"
                        >
                          <Plus size={10} aria-hidden="true" />
                          {r.place}
                          <span className="text-faint">· {r.reason}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </PreviewFrame>
  );
}
