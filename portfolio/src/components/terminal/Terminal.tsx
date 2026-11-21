import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { complete, execute, type TerminalContext } from './commands';
import { cn } from '@/lib/cn';

interface Entry {
  id: number;
  input?: string;
  lines: ReactNode[];
}

const QUICK = ['help', 'about', 'projects', 'skills', 'experience', 'contact', 'resume', 'clear'];
const DEMO = 'help';

function Prompt() {
  return (
    <span aria-hidden="true" className="shrink-0 select-none">
      <span className="text-success">nabarun</span>
      <span className="text-faint">@</span>
      <span className="text-signal-soft">portfolio</span>
      <span className="text-faint"> ~ </span>
      <span className="text-violet-soft">❯</span>
    </span>
  );
}

/** A working command-line interface to the portfolio content. */
export function Terminal({ context }: { context: TerminalContext }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const inView = useInView(rootRef, { once: true, amount: 0.5 });

  const [entries, setEntries] = useState<Entry[]>([
    {
      id: 0,
      lines: [
        <span className="text-fg-soft">Welcome. This terminal runs real commands against the portfolio content.</span>,
        <span className="text-faint">Type “help” to get started.</span>,
      ],
    },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const [demo, setDemo] = useState<'pending' | 'typing' | 'done'>('pending');
  const [demoText, setDemoText] = useState('');

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) {
        setEntries((e) => [...e, { id: nextId.current++, input: '', lines: [] }]);
        return;
      }
      setHistory((h) => (h[h.length - 1] === input ? h : [...h, input]));
      setCursor(null);
      const result = execute(input, context);
      if ('clear' in result) {
        setEntries([]);
        return;
      }
      setEntries((e) => [...e, { id: nextId.current++, input, lines: result.lines }]);
    },
    [context],
  );

  // Keep the newest output in view, scrolling only the terminal, never the page
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, demoText]);

  // One-time demo: type "help" when the terminal first scrolls into view.
  // A ref tracks the start so changing `demo` state doesn't re-run (and cancel) this effect.
  const demoStarted = useRef(false);
  const demoRef = useRef(demo);
  demoRef.current = demo;
  useEffect(() => {
    if (!inView || demoStarted.current) return;
    demoStarted.current = true;
    if (demoRef.current === 'done') return; // visitor already started typing
    if (reduce) {
      setDemo('done');
      run(DEMO);
      return;
    }
    setDemo('typing');
    let i = 0;
    let finish = 0;
    const timer = window.setInterval(() => {
      // Stop if the visitor took over (clicked a command chip or typed)
      if (demoRef.current === 'done') {
        window.clearInterval(timer);
        setDemoText('');
        return;
      }
      i += 1;
      setDemoText(DEMO.slice(0, i));
      if (i >= DEMO.length) {
        window.clearInterval(timer);
        finish = window.setTimeout(() => {
          setDemoText('');
          if (demoRef.current !== 'done') run(DEMO);
          setDemo('done');
        }, 350);
      }
    }, 110);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(finish);
      // Interrupted before finishing (e.g. StrictMode remount): allow a clean restart
      if (demoRef.current !== 'done') demoStarted.current = false;
    };
  }, [inView, reduce, run]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (e.key === 'ArrowDown') {
      if (cursor === null) return;
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue('');
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === 'Tab' && value.trim()) {
      // Only capture Tab while there is something to complete, so keyboard users can still tab out
      const completed = complete(value);
      if (completed) {
        e.preventDefault();
        setValue(completed);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  const typingDemo = demo === 'typing';

  return (
    <div ref={rootRef}>
      <div
        className="glass relative overflow-hidden rounded-card font-mono text-[0.8rem] leading-relaxed sm:text-[0.84rem]"
        onClick={() => {
          // Clicking the window focuses the prompt, unless the visitor is selecting text or clicking a link
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
        }}
      >
        <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(143_176_255/0.6),transparent)]" />
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b7f]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc76b]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4fd6a3]/70" />
          </div>
          <span className="text-xs text-muted">nabarun@portfolio: ~</span>
          <span className="ml-auto hidden text-xs text-faint sm:inline">zsh</span>
        </div>

        <div ref={scrollRef} className="scroll-thin h-[22rem] overflow-y-auto px-4 py-4 sm:h-[24rem] sm:px-5">
          <div role="log" aria-live="polite" aria-label="Terminal output" className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id}>
                {entry.input !== undefined && (
                  <p className="flex flex-wrap gap-x-2">
                    <Prompt />
                    <span className="text-fg">{entry.input}</span>
                  </p>
                )}
                {entry.lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.035, 0.4) }}
                    className="break-words"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <label className="mt-3 flex flex-wrap items-center gap-x-2">
            <Prompt />
            <span className="sr-only">Terminal command</span>
            <span className="relative min-w-[8rem] flex-1">
              {typingDemo && (
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-fg">
                  {demoText}
                  <span className="ml-px inline-block h-[1.1em] w-[0.55em] animate-blink bg-signal-soft" />
                </span>
              )}
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (demo !== 'done') setDemo('done');
                }}
                onKeyDown={onKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                readOnly={typingDemo}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                className="h-8 w-full bg-transparent text-fg caret-signal-soft outline-none"
              />
              {!focused && !value && !typingDemo && (
                <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-0 h-[1.1em] w-[0.55em] -translate-y-1/2 animate-blink bg-signal-soft/80" />
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Touch-friendly shortcuts that run real commands */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Run a command">
        {QUICK.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              setDemo('done');
              setDemoText('');
              run(cmd);
            }}
            className={cn(
              'h-9 rounded-full border border-line bg-ink-900/60 px-3.5 font-mono text-[0.8rem] text-fg-soft transition-[border-color,color,transform] duration-300',
              'hover:-translate-y-0.5 hover:border-signal/40 hover:text-fg',
            )}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
