import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Bot, Boxes, Code, Database, Gauge, HardDrive, LayoutGrid, Plug, TestTubeDiagonal, Wrench, type LucideIcon } from 'lucide-react';
import { useMemo, useState, type CSSProperties } from 'react';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillIcon, skillColorFrom, useSkillIcons } from '@/components/ui/SkillIcon';
import { skillGroups } from '@/data/skills';
import { projectById } from '@/data/projects';
import type { Project, SkillGroup } from '@/types';
import { useSpotlight } from '@/hooks/useSpotlight';
import { cn } from '@/lib/cn';
import { easeOutExpo } from '@/lib/motion';

const groupIcons: Record<string, LucideIcon> = {
  frontend: Code,
  state: Database,
  architecture: Boxes,
  testing: TestTubeDiagonal,
  performance: Gauge,
  devops: Wrench,
  apis: Plug,
  ai: Bot,
  databases: HardDrive,
};

/**
 * Bento placement. The larger groups take two columns so every row of the
 * four-column grid fills exactly: [2,1,1] [2,2] [2,2] [2,2].
 */
const bento: { id: string; wide?: boolean }[] = [
  { id: 'frontend', wide: true },
  { id: 'state' },
  { id: 'performance' },
  { id: 'architecture', wide: true },
  { id: 'testing', wide: true },
  { id: 'devops', wide: true },
  { id: 'apis', wide: true },
  { id: 'ai', wide: true },
  { id: 'databases', wide: true },
];

const groupsById = Object.fromEntries(skillGroups.map((g) => [g.id, g])) as Record<string, SkillGroup>;
const orderedGroups = [
  ...bento.filter((b) => groupsById[b.id]).map((b) => ({ group: groupsById[b.id], wide: !!b.wide })),
  // Any group added to the data later still renders, after the planned layout
  ...skillGroups.filter((g) => !bento.some((b) => b.id === g.id)).map((group) => ({ group, wide: false })),
];

interface SkillsProps {
  onOpenProject: (project: Project, trigger: HTMLElement) => void;
}

export function Skills({ onOpenProject }: SkillsProps) {
  const [selected, setSelected] = useState<string | null>('Redux Toolkit');
  const [filter, setFilter] = useState<string>('all');
  const visibleGroups = filter === 'all' ? orderedGroups : orderedGroups.filter((g) => g.group.id === filter);
  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);
  const onPointerMove = useSpotlight<HTMLDivElement>();
  const icons = useSkillIcons();

  const selectedSkill = useMemo(() => {
    for (const g of skillGroups) {
      const s = g.skills.find((x) => x.name === selected);
      if (s) return { ...s, group: g.name };
    }
    return null;
  }, [selected]);

  return (
    <Section id="skills" labelledBy="skills-title">
      <SectionHeading
        id="skills-title"
        eyebrow="04 · Skills"
        title="Toolkit"
        lede="Grouped by what each tool is for, with no made-up proficiency scores. Select a skill to see the projects where I used it."
      />

      {/* Category filter. Plain toggle buttons: each one filters the grid below. */}
      <div className="mt-12 -mx-5 overflow-x-auto px-5 pb-2 scroll-thin sm:mx-0 sm:px-0" role="group" aria-label="Filter skills by category">
        <div className="relative flex w-max gap-1 rounded-full border border-white/[0.07] bg-ink-850/70 p-1">
          {[{ id: 'all', name: 'All', count: total }, ...orderedGroups.map(({ group }) => ({ id: group.id, name: group.name, count: group.skills.length }))].map(
            (tab) => {
              const on = filter === tab.id;
              const TabIcon = tab.id === 'all' ? LayoutGrid : (groupIcons[tab.id] ?? Code);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  aria-pressed={on}
                  className={cn(
                    'relative inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm whitespace-nowrap transition-colors duration-300',
                    on ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="skill-filter-pill"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-signal/30 bg-[linear-gradient(110deg,rgb(91_140_255/0.22),rgb(154_123_255/0.16))]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <TabIcon size={14} aria-hidden="true" className="relative" />
                  <span className="relative">{tab.name}</span>
                  <span className="relative font-mono text-[0.7rem] text-faint">{tab.count}</span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <motion.div layout className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
        {visibleGroups.map(({ group, wide }, gi) => {
          const focused = filter !== 'all';
          const Icon = groupIcons[group.id] ?? Code;
          const containsSelected = group.skills.some((s) => s.name === selected);
          return (
            <motion.div
              key={group.id}
              layout
              onPointerMove={onPointerMove}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: focused ? 0 : (gi % 4) * 0.06, ease: easeOutExpo }}
              className={cn(
                'glass spotlight group/card rounded-card p-5 transition-[border-color,box-shadow] duration-500 sm:p-6',
                focused ? 'sm:col-span-2 lg:col-span-4' : wide && 'sm:col-span-2',
                containsSelected && 'border-signal/35 shadow-[var(--shadow-glow)]',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-control border border-white/[0.08] bg-[linear-gradient(135deg,rgb(91_140_255/0.16),rgb(154_123_255/0.08))] text-signal-soft transition-transform duration-500 ease-out-expo group-hover/card:-rotate-6">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-fg">{group.name}</h3>
                    <p className="text-sm text-muted">{group.description}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-faint" aria-label={`${group.skills.length} skills`}>
                  {String(group.skills.length).padStart(2, '0')}
                </span>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const isOn = selected === skill.name;
                  const linked = !!skill.usedIn?.length;
                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        onClick={() => setSelected(isOn ? null : skill.name)}
                        aria-pressed={isOn}
                        style={{ '--brand': skillColorFrom(icons, skill.name) } as CSSProperties}
                        className={cn(
                          focused ? 'py-2 pr-4 pl-2 text-[0.9rem]' : 'py-1.5 pr-3.5 pl-1.5 text-[0.8125rem]',
                          'group/skill inline-flex items-center gap-2 rounded-full border transition-[border-color,background-color,color,box-shadow,transform] duration-300 ease-out-expo hover:-translate-y-0.5',
                          isOn
                            ? 'border-signal/60 bg-signal/15 text-fg shadow-[0_0_24px_-8px_rgb(91_140_255/0.9)]'
                            : 'border-line bg-ink-900/60 text-fg-soft hover:border-[color-mix(in_oklab,var(--brand)_45%,transparent)] hover:text-fg hover:shadow-[0_8px_24px_-12px_var(--brand)]',
                        )}
                      >
                        <span
                          className={cn(
                            'grid h-6 w-6 place-items-center rounded-full bg-white/[0.05] text-[var(--brand)] transition-[background-color,transform] duration-300 ease-out-expo group-hover/skill:scale-110 group-hover/skill:bg-[color-mix(in_oklab,var(--brand)_18%,transparent)]',
                            isOn && 'bg-[color-mix(in_oklab,var(--brand)_20%,transparent)]',
                          )}
                        >
                          <SkillIcon icons={icons} name={skill.name} size={13} />
                        </span>
                        {skill.name}
                        {linked && (
                          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-signal/70" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </motion.div>

      <div className="mt-4 min-h-[5.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {selectedSkill && (
            <motion.div
              key={selectedSkill.name}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: easeOutExpo }}
              className="glass flex flex-col gap-4 rounded-card p-5 sm:flex-row sm:items-center"
              style={{ '--brand': skillColorFrom(icons, selectedSkill.name) } as CSSProperties}
            >
              <div className="flex min-w-0 items-center gap-3.5 sm:w-64 sm:shrink-0">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-white/[0.08] bg-[color-mix(in_oklab,var(--brand)_14%,transparent)] text-[var(--brand)]">
                  <SkillIcon icons={icons} name={selectedSkill.name} size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-muted">{selectedSkill.group}</p>
                  <p className="truncate font-display text-xl font-semibold text-fg">{selectedSkill.name}</p>
                </div>
              </div>
              {selectedSkill.usedIn && selectedSkill.usedIn.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted">Used in</span>
                  {selectedSkill.usedIn.map((id) => {
                    const p = projectById(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={(e) => onOpenProject(p, e.currentTarget)}
                        className="group/p inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 py-1 pr-2.5 pl-3 text-sm text-fg transition-colors hover:border-signal/60 hover:bg-signal/20"
                      >
                        {p.name}
                        <ArrowUpRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover/p:rotate-45" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted">Part of my everyday toolkit across projects.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 flex items-center gap-2 text-sm text-faint">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-signal/70" />
        Linked to a project on this page
      </p>
    </Section>
  );
}
