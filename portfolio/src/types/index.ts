export type SectionId = 'home' | 'impact' | 'about' | 'experience' | 'projects' | 'skills' | 'terminal' | 'contact';

export interface NavItem {
  id: SectionId;
  label: string;
}

/** Career themes a visitor can filter the timeline by. */
export type RoleFocus = 'leadership' | 'enterprise' | 'migration' | 'ai' | 'performance' | 'mentoring' | 'delivery';

export interface Role {
  id: string;
  title: string;
  project: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  tech: string[];
  /** Short tags such as "Team lead" shown next to the role title */
  tags?: string[];
  current?: boolean;
  /** Themes this role demonstrates, used by the timeline filter */
  focus?: RoleFocus[];
}

export type ProjectId = 'csrd' | 'itinerary' | 'andi' | 'retail' | 'aiis';

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface Project {
  id: ProjectId;
  name: string;
  /** Short product category shown as a badge, e.g. "GenAI · Enterprise reporting" */
  category: string;
  period: string;
  /** Who it was for, kept general where the client is confidential */
  context: string;
  tagline: string;
  overview: string;
  problem: string;
  role: string;
  /** One-line version of `role` for the project card */
  roleShort: string;
  /** Explains what the preview shows and what is illustrative */
  previewNote: string;
  contributions: string[];
  features: string[];
  challenges: ChallengeSolution[];
  outcomes: string[];
  stack: string[];
  /** Visible note when details are deliberately limited */
  confidentialityNote?: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  /** Projects where this skill was used, by project id */
  usedIn?: ProjectId[];
}
