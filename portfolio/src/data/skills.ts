import type { SkillGroup } from '@/types';

/**
 * Skill groups from the resume. `usedIn` links a skill to the projects where
 * the resume shows it in use; skills without it are part of the general toolkit.
 * No proficiency ratings by design: the linked projects are the evidence.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    description: 'The core I build everything on.',
    skills: [
      { name: 'React.js', usedIn: ['csrd', 'itinerary', 'andi', 'retail', 'aiis'] },
      { name: 'React Hooks', usedIn: ['csrd'] },
      { name: 'React Router', usedIn: ['csrd'] },
      { name: 'JavaScript (ES6+)', usedIn: ['andi'] },
      { name: 'TypeScript', usedIn: ['aiis'] },
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'SCSS' },
    ],
  },
  {
    id: 'state',
    name: 'State management',
    description: 'Predictable data flow for large apps.',
    skills: [{ name: 'Redux' }, { name: 'Redux Toolkit', usedIn: ['csrd'] }, { name: 'Context API' }],
  },
  {
    id: 'architecture',
    name: 'UI & architecture',
    description: 'Systems that keep many screens consistent.',
    skills: [
      { name: 'Design Systems' },
      { name: 'Reusable Component Libraries', usedIn: ['aiis'] },
      { name: 'Micro Frontends' },
      { name: 'Material UI' },
      { name: 'Tailwind CSS' },
      { name: 'Figma', usedIn: ['aiis'] },
    ],
  },
  {
    id: 'testing',
    name: 'Testing & quality',
    description: 'Confidence to ship every sprint.',
    skills: [
      { name: 'Jest', usedIn: ['itinerary'] },
      { name: 'React Testing Library', usedIn: ['itinerary'] },
      { name: 'Unit Testing', usedIn: ['itinerary'] },
      { name: 'Debugging', usedIn: ['andi'] },
      { name: 'Code Reviews', usedIn: ['csrd'] },
    ],
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'Behind the 40% and 60% load-time cuts.',
    skills: [
      { name: 'Code Splitting' },
      { name: 'Lazy Loading', usedIn: ['itinerary'] },
      { name: 'Memoization', usedIn: ['itinerary'] },
    ],
  },
  {
    id: 'devops',
    name: 'Build & DevOps',
    description: 'From local build to deployed environment.',
    skills: [
      { name: 'Webpack' },
      { name: 'Babel' },
      { name: 'Vite' },
      { name: 'npm' },
      { name: 'Git' },
      { name: 'Azure DevOps', usedIn: ['itinerary'] },
      { name: 'CI/CD', usedIn: ['itinerary'] },
      { name: 'Docker' },
      { name: 'Postman' },
    ],
  },
  {
    id: 'apis',
    name: 'API & integration',
    description: 'Connecting interfaces to real services.',
    skills: [
      { name: 'REST APIs', usedIn: ['csrd', 'andi', 'retail'] },
      { name: 'JSON', usedIn: ['andi'] },
      { name: 'Axios' },
      { name: 'JWT Authentication' },
      { name: 'Microservices Integration' },
    ],
  },
  {
    id: 'ai',
    name: 'GenAI',
    description: 'Interfaces for LLMs and conversational AI.',
    skills: [
      { name: 'OpenAI APIs', usedIn: ['itinerary'] },
      { name: 'LLM APIs', usedIn: ['itinerary', 'csrd'] },
      { name: 'Google Dialogflow', usedIn: ['andi'] },
      { name: 'Chatbot UI', usedIn: ['itinerary', 'andi'] },
      { name: 'Claude Code', usedIn: ['csrd'] },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Data stores I’ve worked with.',
    skills: [{ name: 'MongoDB' }, { name: 'PostgreSQL' }],
  },
];
