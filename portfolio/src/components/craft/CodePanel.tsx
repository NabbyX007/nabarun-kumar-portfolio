import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';
// The real source files that run this site, imported as text at build time
import statCardSource from '@/components/ui/StatCard.tsx?raw';
import countUpSource from '@/hooks/useCountUp.ts?raw';
import contactSource from '@/lib/contact.ts?raw';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

export interface UsageProps {
  variant: 'default' | 'highlight';
  loading: boolean;
}

type TokenType = 'comment' | 'string' | 'keyword' | 'number' | 'tag' | 'type' | 'fn' | 'plain';

const tokenClass: Record<TokenType, string> = {
  comment: 'text-faint italic',
  string: 'text-[#9fe0b4]',
  keyword: 'text-violet-soft',
  number: 'text-amber',
  tag: 'text-cyan',
  type: 'text-signal-soft',
  fn: 'text-[#ffd39a]',
  plain: 'text-fg-soft',
};

const PATTERN = new RegExp(
  [
    String.raw`(\/\/[^\n]*|\/\*[\s\S]*?\*\/)`, // comments
    String.raw`(\`(?:\\.|[^\`\\])*\`|'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")`, // strings
    String.raw`(\b(?:import|from|export|const|let|function|return|if|else|interface|type|extends|async|await|try|catch|finally|new|typeof|instanceof|as|default|true|false|null|undefined)\b)`,
    String.raw`(\b\d[\d_.]*\b)`, // numbers
    String.raw`(<\/?[A-Za-z][\w.]*)`, // JSX tags
    String.raw`(\b[A-Z][A-Za-z0-9]*\b)`, // types and components
    String.raw`(\b[a-z_$][\w$]*(?=\())`, // function calls
  ].join('|'),
  'g',
);
const GROUPS: TokenType[] = ['comment', 'string', 'keyword', 'number', 'tag', 'type', 'fn'];

/** A small, dependency-free highlighter for TS/TSX, returned as lines of tokens. */
function highlight(code: string) {
  const tokens: { text: string; type: TokenType }[] = [];
  let last = 0;
  for (const m of code.matchAll(PATTERN)) {
    if (m.index! > last) tokens.push({ text: code.slice(last, m.index), type: 'plain' });
    const group = m.slice(1).findIndex((g) => g !== undefined);
    tokens.push({ text: m[0], type: GROUPS[group] });
    last = m.index! + m[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), type: 'plain' });

  const lines: { text: string; type: TokenType }[][] = [[]];
  for (const t of tokens) {
    t.text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, type: t.type });
    });
  }
  return lines;
}

function usageSource({ variant, loading }: UsageProps) {
  return `import { Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';

export function TeamMetric({ inView }: { inView: boolean }) {
  return (
    <StatCard
      value={4}
      label="Frontend developers led"
      description="On a GenAI reporting product built from scratch."
      icon={<Users size={18} aria-hidden="true" />}
      variant="${variant}"
      loading={${loading}}
      start={inView}
    />
  );
}
`;
}

const files = [
  { id: 'usage', name: 'TeamMetric.tsx', note: 'Live: follows the controls' },
  { id: 'component', name: 'StatCard.tsx', note: 'Reusable, typed component' },
  { id: 'hook', name: 'useCountUp.ts', note: 'Custom hook' },
  { id: 'api', name: 'contact.ts', note: 'API integration' },
] as const;
type FileId = (typeof files)[number]['id'];

export default function CodePanel(props: UsageProps) {
  const [active, setActive] = useState<FileId>('usage');
  const { copied, copy } = useCopyToClipboard();

  const source = useMemo(() => {
    switch (active) {
      case 'usage':
        return usageSource(props);
      case 'component':
        return statCardSource;
      case 'hook':
        return countUpSource;
      case 'api':
        return contactSource;
    }
  }, [active, props]);
  const lines = useMemo(() => highlight(source.trimEnd()), [source]);
  const changed = active === 'usage' ? [10, 11] : [];

  return (
    <div className="glass flex h-full min-w-0 flex-col overflow-hidden rounded-card">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-white/[0.06] px-2 pt-2 scroll-thin" role="tablist" aria-label="Source files">
        {files.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            id={`code-tab-${f.id}`}
            aria-selected={active === f.id}
            aria-controls="code-panel"
            onClick={() => setActive(f.id)}
            className={cn(
              'relative shrink-0 rounded-t-lg px-3 py-2 font-mono text-xs transition-colors',
              active === f.id ? 'bg-ink-950/70 text-fg' : 'text-muted hover:text-fg-soft',
            )}
          >
            {f.name}
            {active === f.id && (
              <motion.span layoutId="code-tab-line" className="absolute inset-x-2 -bottom-px h-px bg-signal-soft" aria-hidden="true" />
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => copy(source)}
          className="ml-auto mb-1 inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-2 text-xs text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? <Check size={13} aria-hidden="true" className="text-success" /> : <Copy size={13} aria-hidden="true" />}
          <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-b border-white/[0.04] bg-ink-950/40 px-4 py-1.5 text-[0.7rem] text-faint">
        <span>{files.find((f) => f.id === active)!.note}</span>
        <span className="font-mono">{lines.length} lines</span>
      </div>

      <div
        id="code-panel"
        role="tabpanel"
        aria-labelledby={`code-tab-${active}`}
        tabIndex={0}
        className="scroll-thin relative min-h-0 flex-1 overflow-auto bg-ink-950/50 py-3 font-mono text-[0.75rem] leading-[1.7]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.pre
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="min-w-max"
          >
            <code>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex px-4 transition-colors duration-700',
                    changed.includes(i) && 'bg-signal/[0.09] shadow-[inset_2px_0_0_#8fb0ff]',
                  )}
                >
                  <span aria-hidden="true" className="mr-4 inline-block w-6 shrink-0 text-right text-faint/60 select-none">
                    {i + 1}
                  </span>
                  <span>
                    {line.length === 0 ? ' ' : line.map((t, j) => (
                      <span key={j} className={tokenClass[t.type]}>
                        {t.text}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </code>
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}
