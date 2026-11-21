import { motion } from 'framer-motion';
import { Bot, Check, CreditCard, Package, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PreviewFrame, type PreviewProps } from './PreviewFrame';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

type Msg =
  | { id: number; from: 'bot' | 'user'; kind: 'text'; text: string }
  | { id: number; from: 'bot'; kind: 'payment' }
  | { id: number; from: 'bot'; kind: 'order' };

const greeting: Msg = { id: 0, from: 'bot', kind: 'text', text: 'Hi! I can help with your bill, devices and orders.' };

function PaymentCard() {
  const [method, setMethod] = useState<'debit' | 'credit'>('debit');
  const [state, setState] = useState<'ready' | 'paying' | 'paid'>('ready');

  useEffect(() => {
    if (state !== 'paying') return;
    const t = window.setTimeout(() => setState('paid'), 900);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <div className="w-full max-w-[15rem] rounded-xl border border-white/[0.08] bg-ink-800 p-2.5">
      <div className="flex items-baseline justify-between">
        <span className="text-[0.65rem] text-muted">Amount due</span>
        <span className="font-display text-base font-semibold text-fg">$84.20</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-white/[0.04] p-0.5" role="radiogroup" aria-label="Card type">
        {(['debit', 'credit'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={method === m}
            onClick={() => setMethod(m)}
            disabled={state !== 'ready'}
            className={cn(
              'rounded-md py-1 text-[0.65rem] transition-colors',
              method === m ? 'bg-signal/25 text-fg' : 'text-muted hover:text-fg-soft',
            )}
          >
            {m === 'debit' ? 'Debit card' : 'Credit card'}
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.06] px-2 py-1.5 text-[0.68rem] text-fg-soft">
        <CreditCard size={13} aria-hidden="true" className="text-signal-soft" />
        <span className="capitalize">{method}</span> ending 4242
      </div>
      {state === 'paid' ? (
        <p className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-success/15 py-1.5 text-[0.7rem] font-medium text-success" role="status">
          <Check size={13} aria-hidden="true" /> Payment received
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setState('paying')}
          disabled={state === 'paying'}
          className="mt-2 w-full rounded-lg bg-[linear-gradient(110deg,#4a7bff,#7a68ff)] py-1.5 text-[0.7rem] font-medium text-white disabled:opacity-70"
        >
          {state === 'paying' ? 'Processing…' : 'Pay $84.20'}
        </button>
      )}
    </div>
  );
}

function OrderCard() {
  const steps = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered'];
  const current = 2;
  return (
    <div className="w-full max-w-[15rem] rounded-xl border border-white/[0.08] bg-ink-800 p-2.5">
      <div className="flex items-center gap-2 text-[0.7rem] text-fg">
        <Package size={13} aria-hidden="true" className="text-signal-soft" /> New phone
      </div>
      <ol className="mt-2 space-y-1.5">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2 text-[0.66rem]">
            <span
              className={cn(
                'grid h-3.5 w-3.5 place-items-center rounded-full border',
                i < current && 'border-success bg-success text-ink-900',
                i === current && 'border-signal bg-signal/20',
                i > current && 'border-line-strong',
              )}
            >
              {i < current && <Check size={9} aria-hidden="true" />}
            </span>
            <span className={i <= current ? 'text-fg-soft' : 'text-faint'}>{s}</span>
            {i === current && <span className="ml-auto text-[0.6rem] text-signal-soft">Today</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function AndiPreview({ interactive = false, className }: PreviewProps) {
  const initial: Msg[] = interactive
    ? [greeting]
    : [greeting, { id: 1, from: 'user', kind: 'text', text: 'Pay my bill' }, { id: 2, from: 'bot', kind: 'payment' }];
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const nextId = useRef(10);

  useEffect(() => {
    const el = scroller.current;
    if (interactive && el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, interactive]);

  const ask = (text: string, reply: 'payment' | 'order') => {
    if (typing) return;
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', kind: 'text', text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        reply === 'payment'
          ? { id: nextId.current++, from: 'bot', kind: 'text', text: 'Here’s your current balance. Choose how you’d like to pay.' }
          : { id: nextId.current++, from: 'bot', kind: 'text', text: 'Your order is on its way.' },
        { id: nextId.current++, from: 'bot', kind: reply },
      ]);
    }, 700);
  };

  const used = new Set(messages.filter((m) => m.kind !== 'text').map((m) => m.kind));

  return (
    <PreviewFrame
      title="Virtual assistant"
      interactive={interactive}
      className={className}
      actions={
        interactive && messages.length > 1 ? (
          <button
            type="button"
            onClick={() => setMessages([greeting])}
            className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] text-muted hover:bg-white/[0.05] hover:text-fg"
          >
            <RotateCcw size={11} aria-hidden="true" /> Start over
          </button>
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <div ref={scroller} className="flex-1 space-y-2 overflow-y-auto p-3 scroll-thin" aria-live={interactive ? 'polite' : undefined}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={interactive ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className={cn('flex gap-2', m.from === 'user' && 'justify-end')}
            >
              {m.from === 'bot' && (
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/20 text-signal-soft">
                  <Bot size={11} aria-hidden="true" />
                </span>
              )}
              {m.kind === 'text' && (
                <p
                  className={cn(
                    'max-w-[80%] rounded-2xl px-2.5 py-1.5 text-[0.72rem] leading-snug',
                    m.from === 'user' ? 'rounded-br-md bg-signal/25 text-fg' : 'rounded-tl-md bg-white/[0.05] text-fg-soft',
                  )}
                >
                  {m.text}
                </p>
              )}
              {m.kind === 'payment' && <PaymentCard />}
              {m.kind === 'order' && <OrderCard />}
            </motion.div>
          ))}
          {typing && (
            <div className="flex gap-1 pl-7" aria-label="Assistant is typing">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-white/[0.06] p-2">
          {!used.has('payment') && (
            <button
              type="button"
              onClick={() => ask('Pay my bill', 'payment')}
              className="rounded-full border border-signal/40 px-2.5 py-1 text-[0.68rem] text-signal-soft hover:bg-signal/10"
            >
              Pay my bill
            </button>
          )}
          {!used.has('order') && (
            <button
              type="button"
              onClick={() => ask('Track my order', 'order')}
              className="rounded-full border border-signal/40 px-2.5 py-1 text-[0.68rem] text-signal-soft hover:bg-signal/10"
            >
              Track my order
            </button>
          )}
          {used.has('payment') && used.has('order') && <span className="px-1 py-1 text-[0.66rem] text-faint">That’s the demo. Start over to try again.</span>}
        </div>
      </div>
    </PreviewFrame>
  );
}
