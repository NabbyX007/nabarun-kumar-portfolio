import {
  siAxios,
  siBabel,
  siCss3,
  siDialogflow,
  siDocker,
  siFigma,
  siHtml5,
  siJavascript,
  siJest,
  siJsonwebtokens,
  siMui,
  siOpenai,
  siReact,
  siRedux,
  siSass,
  siTailwindcss,
  siTestinglibrary,
  siTypescript,
  siVite,
  siWebpack,
  siReactrouter,
  siNpm,
  siGit,
  siPostman,
  siMongodb,
  siPostgresql,
  siClaude,
  siJson,
  type BrandIcon,
} from './brandIcons.data';
import {
  Blocks,
  Cloudy,
  Component,
  Cpu,
  Hourglass,
  LayoutGrid,
  Network,
  Palette,
  Share2,
  Sparkles,
  Split,
  Anchor,
  Bug,
  Boxes,
  FlaskConical,
  GitPullRequest,
  MessagesSquare,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export type IconDef = { brand: BrandIcon } | { lucide: LucideIcon; color: string };

/**
 * Brand marks where one exists, otherwise a descriptive line icon.
 * This module is loaded as its own chunk (see SkillIcon.tsx) to keep ~13 KB of
 * path data off the critical path.
 */
const icons: Record<string, IconDef> = {
  'React.js': { brand: siReact },
  'React Hooks': { lucide: Anchor, color: '#61dafb' },
  'React Router': { brand: siReactrouter },
  'JavaScript (ES6+)': { brand: siJavascript },
  TypeScript: { brand: siTypescript },
  HTML5: { brand: siHtml5 },
  CSS3: { brand: siCss3 },
  SCSS: { brand: siSass },
  Redux: { brand: siRedux },
  'Redux Toolkit': { brand: siRedux },
  'Context API': { lucide: Share2, color: '#61dafb' },
  'Design Systems': { lucide: Palette, color: '#bba7ff' },
  'Reusable Component Libraries': { lucide: Component, color: '#8fb0ff' },
  'Micro Frontends': { lucide: LayoutGrid, color: '#63e3f2' },
  'Material UI': { brand: siMui },
  'Tailwind CSS': { brand: siTailwindcss },
  Figma: { brand: siFigma },
  Jest: { brand: siJest },
  'React Testing Library': { brand: siTestinglibrary },
  'Unit Testing': { lucide: FlaskConical, color: '#4fd6a3' },
  Debugging: { lucide: Bug, color: '#ff9aa6' },
  'Code Reviews': { lucide: GitPullRequest, color: '#bba7ff' },
  'Lazy Loading': { lucide: Hourglass, color: '#ffc46b' },
  'Code Splitting': { lucide: Split, color: '#8fb0ff' },
  Memoization: { lucide: Cpu, color: '#4fd6a3' },
  Vite: { brand: siVite },
  Webpack: { brand: siWebpack },
  Babel: { brand: siBabel },
  'Azure DevOps': { lucide: Cloudy, color: '#3b9cff' },
  npm: { brand: siNpm },
  Git: { brand: siGit },
  'CI/CD': { lucide: Workflow, color: '#63e3f2' },
  Docker: { brand: siDocker },
  Postman: { brand: siPostman },
  'REST APIs': { lucide: Network, color: '#8fb0ff' },
  Axios: { brand: siAxios },
  JSON: { brand: siJson },
  'JWT Authentication': { brand: siJsonwebtokens },
  'Microservices Integration': { lucide: Boxes, color: '#8fb0ff' },
  'OpenAI APIs': { brand: siOpenai },
  'LLM APIs': { lucide: Sparkles, color: '#bba7ff' },
  'Google Dialogflow': { brand: siDialogflow },
  'Chatbot UI': { lucide: MessagesSquare, color: '#8fb0ff' },
  'Claude Code': { brand: siClaude },
  MongoDB: { brand: siMongodb },
  PostgreSQL: { brand: siPostgresql },
};

/** Brand colours that are too dark to read on navy are lifted to a light tone. */
function readable(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const color = `#${hex.replace('#', '')}`;
  if (luminance < 0.2) return '#c3cae0'; // near-black marks: use the light text tone
  if (luminance < 0.45) return `color-mix(in oklab, ${color} 60%, #fff)`; // mid-dark: keep the hue, lift it
  return color;
}

/** Colour used for a skill's icon and hover glow. */
export function skillColor(name: string) {
  const def = icons[name];
  if (!def) return '#8fb0ff';
  return 'brand' in def ? readable(def.brand.hex) : def.color;
}

export function skillIconDef(name: string): IconDef {
  return icons[name] ?? { lucide: Blocks, color: '#8fb0ff' };
}
