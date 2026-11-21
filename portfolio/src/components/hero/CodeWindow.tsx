import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useRef, type PointerEvent } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { codeTokens, tokenClass, totalChars } from './codeTokens';
import { profile } from '@/data/profile';

/**
 * Glass editor window that types out a JSX "profile" and tilts toward the pointer.
 * Screen readers get a plain-language summary instead of the code.
 */
export function CodeWindow({ startDelay = 1100 }: { startDelay?: number }) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const { count, done } = useTypewriter(totalChars, { speed: 11, startDelay, enabled: !reduce });

  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 150, damping: 20 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!fine || reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  // Slice the token list down to the number of characters typed so far
  let remaining = count;
  const visible = [] as { text: string; cls: string }[];
  for (const [text, type] of codeTokens) {
    if (remaining <= 0) break;
    const part = text.slice(0, remaining);
    remaining -= part.length;
    visible.push({ text: part, cls: tokenClass[type] });
  }

  return (
    <div className="[perspective:1400px]" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.figure
        style={{ rotateX, rotateY }}
        className="glass relative overflow-hidden rounded-card [transform-style:preserve-3d]"
      >
        {/* top edge highlight */}
        <div aria-hidden="true" className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b7f]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffc76b]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#4fd6a3]/70" />
          </div>
          <span className="font-mono text-xs text-muted">Engineer.tsx</span>
        </div>

        <figcaption className="sr-only">
          {profile.name}: {profile.role} with {profile.experience} of experience in React, TypeScript and Redux Toolkit. Built
          100+ screens, cut page load time by up to 60%, led a team of 4, and delivered for AT&T, Etihad Airways and Hilton.
        </figcaption>

        <pre
          aria-hidden="true"
          className="relative min-h-[18.5rem] overflow-x-auto px-5 py-5 font-mono text-[0.78rem] leading-[1.75] sm:text-[0.84rem]"
        >
          {/* invisible full text reserves the final size so the layout never jumps */}
          <code className="invisible block whitespace-pre">{codeTokens.map(([t]) => t).join('')}</code>
          <code className="absolute inset-0 block px-5 py-5 whitespace-pre">
            {visible.map((v, i) => (
              <span key={i} className={v.cls}>
                {v.text}
              </span>
            ))}
            <span
              className={`ml-px inline-block h-[1.05em] w-[0.5ch] translate-y-[0.18em] bg-signal-soft ${done ? 'animate-blink' : ''}`}
            />
          </code>
        </pre>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 font-mono text-[0.7rem] text-faint">
          <span>TSX</span>
          <span>{profile.location}</span>
        </div>
      </motion.figure>
    </div>
  );
}
