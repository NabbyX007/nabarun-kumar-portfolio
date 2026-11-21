import { useMemo } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Terminal } from '@/components/terminal/Terminal';
import type { TerminalContext } from '@/components/terminal/commands';
import { projectById } from '@/data/projects';
import type { Project } from '@/types';
import { downloadResume } from '@/lib/resume-download';

interface TerminalSectionProps {
  onOpenProject: (project: Project) => void;
}

export function TerminalSection({ onOpenProject }: TerminalSectionProps) {
  const context = useMemo<TerminalContext>(
    () => ({
      openProject: (id) => onOpenProject(projectById(id)),
      downloadResume: () => void downloadResume(),
    }),
    [onOpenProject],
  );

  return (
    <Section id="terminal" labelledBy="terminal-title">
      <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="terminal-title"
            eyebrow="06 · Terminal"
            title="Prefer the command line?"
            lede="An optional, fully working terminal. Every command reads the same data as the rest of the page, and “open csrd” opens a real case study."
          />
          <Reveal delay={0.1}>
            <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              {[
                ['↑ ↓', 'Command history'],
                ['Tab', 'Autocomplete'],
                ['Ctrl + L', 'Clear output'],
                ['Enter', 'Run command'],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <dt>
                    <kbd className="inline-flex min-w-9 justify-center rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-xs text-fg-soft">
                      {key}
                    </kbd>
                  </dt>
                  <dd className="text-muted">{label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal delay={0.05}>
          <Terminal context={context} />
        </Reveal>
      </div>
    </Section>
  );
}
