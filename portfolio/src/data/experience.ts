import type { Role } from '@/types';

export const company = {
  name: 'Accenture',
  location: 'Bengaluru, India',
  period: 'Dec 2020 – Present',
  note: 'Full-time since December 2020, after an internship at the Accenture Innovation Hub from January to June 2020.',
};

export const roles: Role[] = [
  {
    id: 'senior-analyst',
    title: 'Application Development Senior Analyst',
    project: 'GenAI CSRD Reporting & Accenture Industrial Intelligence Suite',
    start: 'Aug 2025',
    end: 'Present',
    current: true,
    tags: ['Team lead'],
    summary:
      'Leading a team of 4 frontend developers on a GenAI reporting product built from scratch, while delivering screens for the Angular-to-React migration of AIIS.',
    highlights: [
      'Lead a team of 4 frontend developers building a GenAI-powered CSRD reporting application from scratch with React, React Hooks, Redux Toolkit, React Router and REST APIs.',
      'Built the responsive reporting workflow: CSRD Standards, Default Disclosure Document Upload and the Gap Assessment Dashboard.',
      'Reduced page load time by 40% on the reporting workflow through frontend performance optimization.',
      'Deliver new screens and features for the Angular-to-React migration of AIIS, turning legacy modules into reusable React and TypeScript components from Figma designs.',
      'Run code reviews, define frontend coding standards and mentor junior developers; use AI-assisted development with Claude Code to speed up delivery.',
    ],
    tech: ['React', 'TypeScript', 'Redux Toolkit', 'React Router', 'REST APIs', 'Figma', 'Claude Code'],
    focus: ['leadership', 'enterprise', 'migration', 'ai', 'performance', 'mentoring'],
  },
  {
    id: 'analyst',
    title: 'Application Development Analyst',
    project: 'GenAI Travel Itinerary Planner',
    start: 'May 2023',
    end: 'Aug 2025',
    tags: ['Sole frontend developer'],
    summary:
      'Owned the entire frontend of a GenAI itinerary-planning chatbot delivered for travel and hospitality clients including Qatar, Etihad Airways and Hilton Hotels.',
    highlights: [
      'Built the complete React UI and integrated OpenAI LLM and Google image APIs to turn conversations into personalised itineraries shown as interactive image cards.',
      'Built a drag-and-drop itinerary editor and cut page load time by 60% with memoization and lazy loading.',
      'Migrated the React implementation to Angular and added user preferences, login and authentication, and an admin panel.',
      'Contributed login and dashboard features to Retail AI for Commerce in parallel.',
      'Owned delivery end to end in Agile sprints: development, unit testing with Jest and React Testing Library, CI/CD runs and environment checks in Azure DevOps.',
    ],
    tech: ['React', 'OpenAI API', 'Google image APIs', 'Angular', 'Jest', 'React Testing Library', 'Azure DevOps'],
    focus: ['enterprise', 'ai', 'performance', 'delivery'],
  },
  {
    id: 'associate',
    title: 'Application Development Associate / Analyst',
    project: 'ANDi Virtual Assistant for AT&T',
    start: 'Mar 2021',
    end: 'Apr 2023',
    tags: ['Live across North America'],
    summary:
      'Built features for AT&T’s customer-facing ANDi chatbot, which went live to users across North America.',
    highlights: [
      'Built the React Payment Page with debit and credit card billing for the Payments feature launch.',
      'Designed user workflows with the Product Owner and built the Devices & Orders feature UI.',
      'Worked with the Google team to design custom Google Dialogflow JSON payloads for rich chatbot responses.',
      'Partnered with the Platform team to improve chatbot UX using live-user feedback.',
      'Remediated security vulnerabilities flagged in Veracode scans and resolved high-priority production issues for stable releases.',
    ],
    tech: ['React', 'JavaScript', 'Google Dialogflow', 'REST APIs', 'Veracode'],
    focus: ['enterprise', 'ai'],
  },
  {
    id: 'intern',
    title: 'Software Developer Intern',
    project: 'Accenture Innovation Hub',
    start: 'Jan 2020',
    end: 'Jun 2020',
    summary: 'Developed IoT-based smart-helmet and tag solutions for oil and natural-gas industry use cases.',
    highlights: [
      'Developed IoT-based smart-helmet and tag solutions for oil and natural-gas industry use cases.',
    ],
    tech: ['IoT'],
  },
];
