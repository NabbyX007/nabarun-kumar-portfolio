import { Boxes, Gauge, Layers } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { profile } from '@/data/profile';

const principles = [
  {
    icon: Layers,
    title: 'Architecture that scales with the team',
    body: 'Clear component boundaries, predictable state with Redux Toolkit, and shared coding standards, so four developers or forty can work in one codebase without stepping on each other.',
  },
  {
    icon: Gauge,
    title: 'Performance as a feature',
    body: 'Code splitting, lazy loading and memoization applied where profiling says they matter. It’s how I cut page load time by 40% on one product and 60% on another.',
  },
  {
    icon: Boxes,
    title: 'Components worth reusing',
    body: 'Design systems and component libraries built from Figma, so every new screen starts from tested, accessible parts instead of from scratch.',
  },
];


export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="about-title"
            eyebrow="01 · About"
            title="Frontend that holds up at enterprise scale."
            lede={`I’m ${profile.name}, a ${profile.role} at Accenture in ${profile.location}. For ${profile.experience} I’ve turned complex business workflows into interfaces people can actually use: payments inside a telecom chatbot, GenAI travel planning, sustainability reporting.`}
          />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              My work sits where design meets engineering. I translate Figma into responsive, cross-browser React, and I care as
              much about the codebase the next developer inherits as the screen the user sees.
            </p>
          </Reveal>
        </div>

        <div>
          <ul className="space-y-6">
            {principles.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} as="li" delay={i * 0.08} className="group -mx-4 flex gap-5 rounded-card p-4 transition-colors duration-500 hover:bg-white/[0.025]">
                <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-control border border-signal/20 bg-[linear-gradient(135deg,rgb(91_140_255/0.18),rgb(154_123_255/0.08))] text-signal-soft shadow-[0_8px_20px_-12px_rgb(91_140_255/0.8)] transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:-rotate-6">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
