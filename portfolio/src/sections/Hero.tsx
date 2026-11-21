import { motion } from 'framer-motion';
import { ArrowRight, Component, Download, Sparkles } from 'lucide-react';
import type { MouseEvent, ReactNode } from 'react';
import { profile } from '@/data/profile';
import { DotField } from '@/components/background/DotField';
import { GlowOrbs } from '@/components/background/GlowOrbs';
import { CodeWindow } from '@/components/hero/CodeWindow';
import { RoleRotator } from '@/components/hero/RoleRotator';
import { ButtonLink, buttonClasses } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { downloadResume, interceptResumeDownload } from '@/lib/resume-download';
import { scrollToSection } from '@/lib/scroll';
import { easeOutExpo } from '@/lib/motion';

/** Number of trailing headline words rendered in animated gradient type. */
const GRADIENT_WORDS = 3;

/** The page-load sequence: everything waits for `ready`, then rises in order. */
function Rise({ ready, delay, children, className }: { ready: boolean; delay: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
      transition={{ duration: 0.9, delay, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}

/** Small data callout that floats over the code window. */
function FloatingStat({ icon, value, label, className, delay, ready }: { icon: ReactNode; value: string; label: string; className: string; delay: number; ready: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.9, delay, ease: easeOutExpo }}
      className={`glass absolute z-10 hidden items-center gap-3 rounded-panel px-3.5 py-2.5 sm:flex ${className}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal-soft">{icon}</span>
      <span>
        <span className="block font-display text-base leading-tight font-semibold text-fg">{value}</span>
        <span className="block text-xs text-muted">{label}</span>
      </span>
    </motion.div>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const words = profile.headline.split(' ');
  const gradientFrom = words.length - GRADIENT_WORDS;

  const onResume = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!interceptResumeDownload) return;
    e.preventDefault();
    void downloadResume();
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24 outline-none md:pt-32 md:pb-28"
    >
      {/* Layered backdrop: beam → colour fields → interactive dots → horizon grid → fade */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="animate-beam absolute -top-32 left-1/2 h-[46rem] w-[56rem] max-w-[160vw] origin-top bg-[conic-gradient(from_180deg_at_50%_0%,transparent_150deg,rgb(143_176_255/0.13)_172deg,rgb(187_167_255/0.16)_180deg,rgb(143_176_255/0.13)_188deg,transparent_210deg)] blur-2xl" />
        <GlowOrbs />
        <DotField className="mask-fade-b" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] [perspective:600px]">
          <div className="bg-grid absolute inset-x-[-50%] top-0 bottom-[-40%] origin-top [transform:rotateX(62deg)] [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_60%,transparent)] opacity-60" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-900" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
        <div>
          <Rise ready={ready} delay={0}>
            <div className="flex items-center gap-3.5">
              <span className="relative grid h-12 w-12 place-items-center rounded-panel bg-[linear-gradient(135deg,#5b8cff,#9a7bff,#63e3f2)] p-px shadow-[0_8px_24px_-8px_rgb(91_140_255/0.6)]">
                <span className="grid h-full w-full place-items-center rounded-[15px] bg-ink-850 font-display text-base font-bold text-fg">
                  {profile.initials}
                </span>
              </span>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-fg">{profile.name}</p>
                <p className="flex items-center gap-2 text-sm text-muted">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal" />
                    <span className="relative h-2 w-2 rounded-full bg-signal" />
                  </span>
                  {profile.role}, {profile.location}
                </p>
              </div>
            </div>
          </Rise>

          <h1
            id="hero-title"
            className="mt-9 text-[2.75rem] leading-[1] font-semibold tracking-[-0.045em] text-fg sm:text-[4rem] lg:text-[4.6rem]"
          >
            <span className="sr-only">{profile.headline}</span>
            <span aria-hidden="true">
              {words.map((word, i) => {
                const gradient = i >= gradientFrom;
                return (
                  <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <motion.span
                      className={gradient ? 'text-gradient-animated inline-block' : 'inline-block'}
                      // Offsetting the gradient phase per word makes the colour read as one continuous flow
                      style={gradient ? { animationDelay: `${-(i - gradientFrom) * 0.9}s` } : undefined}
                      initial={{ y: '110%', rotate: 4 }}
                      animate={ready ? { y: '0%', rotate: 0 } : { y: '110%', rotate: 4 }}
                      transition={{ duration: 1, delay: 0.08 + i * 0.06, ease: easeOutExpo }}
                    >
                      {word}
                      {i < words.length - 1 ? ' ' : ''}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          </h1>

          <Rise ready={ready} delay={0.5} className="mt-7">
            <RoleRotator items={profile.rotating} />
          </Rise>

          <Rise ready={ready} delay={0.58}>
            <p className="mt-5 max-w-xl text-base leading-[1.7] text-muted sm:text-[1.0625rem]">{profile.intro}</p>
          </Rise>

          <Rise ready={ready} delay={0.68} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('projects');
                }}
                className={buttonClasses('primary', 'lg', 'pr-5')}
              >
                <span>Explore projects</span>
                <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                variant="secondary"
                size="lg"
                href={profile.resumeUrl}
                download={profile.resumeFileName}
                onClick={onResume}
                icon={<Download size={18} aria-hidden="true" />}
                iconPosition="start"
              >
                Download resume
              </ButtonLink>
            </Magnetic>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className={buttonClasses('ghost', 'lg', 'px-4 underline-offset-[6px] decoration-signal/50 hover:underline')}
            >
              Let’s connect
            </a>
          </Rise>

          <Rise ready={ready} delay={0.82} className="mt-14">
            <p className="eyebrow text-faint">Enterprise work delivered for</p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Clients">
              {profile.clients.map((c, i) => (
                <li key={c} className="flex items-center gap-6 font-display text-lg font-medium tracking-tight text-fg-soft/80">
                  {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line-strong" />}
                  <span className="transition-colors duration-300 hover:text-fg">{c}</span>
                </li>
              ))}
            </ul>
          </Rise>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96 }}
          animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.96 }}
          transition={{ duration: 1.1, delay: 0.35, ease: easeOutExpo }}
          className="relative w-full min-w-0"
        >
          {/* Layered composition: glow → offset back plate → editor → floating stats */}
          <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.24),rgb(154_123_255/0.08)_60%,transparent)] blur-2xl" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rotate-[2.5deg] rounded-card border border-white/[0.06] bg-ink-850/60" />
          {ready && <CodeWindow startDelay={700} />}
          {!ready && <div className="h-[24rem]" />}
          <FloatingStat
            ready={ready}
            delay={1.1}
            icon={<Sparkles size={16} />}
            value="GenAI interfaces"
            label="LLM and chatbot UIs"
            className="-bottom-6 -left-6"
          />
          <FloatingStat
            ready={ready}
            delay={1.25}
            icon={<Component size={16} />}
            value="Design systems"
            label="reusable component libraries"
            className="-top-6 -right-4"
          />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToSection('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-lg text-xs text-faint transition-colors hover:text-fg-soft md:flex [@media(max-height:760px)]:hidden"
        aria-label="Scroll to About"
      >
        <span className="relative flex h-9 w-6 justify-center rounded-full border border-white/15 pt-2" aria-hidden="true">
          <span className="animate-scroll-cue h-1.5 w-1 rounded-full bg-signal-soft" />
        </span>
      </motion.button>
    </section>
  );
}
