import type { ReactNode } from 'react';
import { profile } from '@/data/profile';
import { company, roles } from '@/data/experience';
import { projects } from '@/data/projects';
import { skillGroups } from '@/data/skills';
import type { ProjectId } from '@/types';

/** Side effects a command may trigger in the page around the terminal. */
export interface TerminalContext {
  openProject: (id: ProjectId) => void;
  downloadResume: () => void;
}

export type CommandResult = { lines: ReactNode[] } | { clear: true };

interface Command {
  description: string;
  usage?: string;
  run: (args: string[], ctx: TerminalContext) => CommandResult;
}

const accent = 'text-signal-soft';
const dim = 'text-faint';
const link = 'text-cyan underline decoration-cyan/40 underline-offset-2 hover:decoration-cyan';

const projectIds = projects.map((p) => p.id);

export const commands: Record<string, Command> = {
  help: {
    description: 'List available commands',
    run: () => ({
      lines: [
        <span className={dim}>Available commands:</span>,
        ...Object.entries(commands).map(([name, c]) => (
          <span>
            <span className={`inline-block w-28 ${accent}`}>{c.usage ?? name}</span>
            <span className="text-fg-soft">{c.description}</span>
          </span>
        )),
        <span className={dim}>Tip: ↑/↓ for history, Tab to autocomplete, Ctrl+L to clear.</span>,
      ],
    }),
  },
  about: {
    description: 'Professional introduction',
    run: () => ({
      lines: [
        <span className="font-semibold text-fg">
          {profile.name} · {profile.role}
        </span>,
        <span className={dim}>{profile.location}</span>,
        <span className="text-fg-soft">{profile.intro}</span>,
      ],
    }),
  },
  skills: {
    description: 'Technology stack by category',
    run: () => ({
      lines: skillGroups.map((g) => (
        <span>
          <span className={`inline-block w-44 ${accent}`}>{g.name}</span>
          <span className="text-fg-soft">{g.skills.map((s) => s.name).join(', ')}</span>
        </span>
      )),
    }),
  },
  projects: {
    description: 'Featured projects',
    run: () => ({
      lines: [
        ...projects.map((p) => (
          <span>
            <span className={`inline-block w-24 ${accent}`}>{p.id}</span>
            <span className="text-fg">{p.name}</span>
            <span className={dim}> · {p.period}</span>
          </span>
        )),
        <span className={dim}>Run “open &lt;id&gt;” for the full case study, e.g. open csrd</span>,
      ],
    }),
  },
  open: {
    description: 'Open a project case study',
    usage: 'open <id>',
    run: (args, ctx) => {
      const id = args[0] as ProjectId | undefined;
      if (!id || !projectIds.includes(id)) {
        return {
          lines: [<span className="text-danger">Usage: open &lt;id&gt;. Known ids: {projectIds.join(', ')}</span>],
        };
      }
      ctx.openProject(id);
      return { lines: [<span className="text-success">Opening {projects.find((p) => p.id === id)!.name}…</span>] };
    },
  },
  experience: {
    description: 'Career history',
    run: () => ({
      lines: [
        <span className="text-fg">
          {company.name}, {company.location} <span className={dim}>· full-time {company.period}</span>
        </span>,
        ...roles.map((r) => (
          <span>
            <span className={`inline-block w-40 ${dim}`}>
              {r.start} – {r.end}
            </span>
            <span className={accent}>{r.title}</span>
            <span className="text-fg-soft"> · {r.project}</span>
          </span>
        )),
      ],
    }),
  },
  contact: {
    description: 'Contact details',
    run: () => ({
      lines: [
        <span>
          <span className={`inline-block w-24 ${dim}`}>email</span>
          <a className={link} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </span>,
        <span>
          <span className={`inline-block w-24 ${dim}`}>linkedin</span>
          <a className={link} href={profile.linkedin} target="_blank" rel="noreferrer">
            {profile.linkedin.replace('https://www.', '')}
          </a>
        </span>,
        ...(profile.github
          ? [
              <span>
                <span className={`inline-block w-24 ${dim}`}>github</span>
                <a className={link} href={profile.github} target="_blank" rel="noreferrer">
                  {profile.github.replace('https://', '')}
                </a>
              </span>,
            ]
          : []),
        <span>
          <span className={`inline-block w-24 ${dim}`}>location</span>
          <span className="text-fg-soft">{profile.location}</span>
        </span>,
      ],
    }),
  },
  resume: {
    description: 'Download my resume (PDF)',
    run: (_args, ctx) => {
      ctx.downloadResume();
      return {
        lines: [
          <span className="text-success">Downloading {profile.resumeFileName}…</span>,
          <span className={dim}>
            Nothing happened?{' '}
            <a className={link} href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Open the PDF
            </a>
          </span>,
        ],
      };
    },
  },
  clear: {
    description: 'Clear the terminal',
    run: () => ({ clear: true }),
  },
};

export const commandNames = Object.keys(commands);

/** Parses and runs one line of input. */
export function execute(input: string, ctx: TerminalContext): CommandResult {
  const [name, ...args] = input.trim().split(/\s+/);
  const command = commands[name.toLowerCase()];
  if (!command) {
    return {
      lines: [
        <span className="text-danger">command not found: {name}</span>,
        <span className="text-faint">Type “help” to see what’s available.</span>,
      ],
    };
  }
  return command.run(args, ctx);
}

/** Completes a partial command or project id. Returns null when ambiguous or unknown. */
export function complete(input: string): string | null {
  const parts = input.trimStart().split(/\s+/);
  if (parts.length === 1) {
    const matches = commandNames.filter((c) => c.startsWith(parts[0].toLowerCase()));
    return matches.length === 1 ? `${matches[0]} ` : null;
  }
  if (parts[0] === 'open' && parts.length === 2) {
    const matches = projectIds.filter((id) => id.startsWith(parts[1].toLowerCase()));
    return matches.length === 1 ? `open ${matches[0]}` : null;
  }
  return null;
}
