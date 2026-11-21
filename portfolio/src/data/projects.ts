import type { Project, ProjectId } from '@/types';

/**
 * Project details are taken from Nabarun's resume. Client names appear only
 * where they are already public on the resume; everything else is described
 * in general terms. Metrics are only listed where the resume states them.
 */
export const projects: Project[] = [
  {
    id: 'csrd',
    name: 'GenAI CSRD Reporting Application',
    category: 'GenAI · Sustainability reporting',
    period: 'Aug 2025 – Present',
    context: 'Enterprise sustainability reporting',
    tagline: 'A GenAI-assisted workflow for preparing CSRD sustainability disclosures, built from scratch by a team I lead.',
    overview:
      'A GenAI-powered application that helps organisations prepare disclosures under the EU Corporate Sustainability Reporting Directive (CSRD). Users work through the reporting standards, upload their existing disclosure documents and review a gap assessment of what is still missing.',
    problem:
      'CSRD reporting means checking large sets of company documents against detailed European reporting standards and finding where disclosures are missing. Done by hand, that work is slow, document-heavy and hard to track across teams.',
    role: 'Frontend lead for a team of 4 developers, responsible for architecture, coding standards and delivery.',
    roleShort: 'Frontend lead, team of 4',
    previewNote:
      'Illustrative recreation of the reporting workflow with sample standards and coverage figures. No client data or production screens are shown.',
    contributions: [
      'Set up the frontend from scratch on React, React Hooks, Redux Toolkit and React Router with REST API integration.',
      'Built the CSRD Standards, Default Disclosure Document Upload and Gap Assessment Dashboard pages.',
      'Defined frontend coding standards, ran code reviews and mentored junior developers.',
      'Used AI-assisted development with Claude Code to accelerate delivery.',
    ],
    features: [
      'Guided reporting workflow across standards, document upload and gap assessment',
      'Document upload for existing default disclosures',
      'Gap Assessment Dashboard summarising disclosure coverage',
      'Responsive layouts for data-heavy reporting pages',
    ],
    challenges: [
      {
        challenge: 'Data-heavy reporting pages were slow to load.',
        solution:
          'Profiled the workflow and applied frontend performance optimization, reducing page load time by 40%.',
      },
      {
        challenge: 'Four developers building a new product in parallel risked inconsistent code.',
        solution:
          'Set shared frontend coding standards and made code review part of every change, so features followed one structure.',
      },
    ],
    outcomes: ['40% faster page loads across the reporting workflow', 'A team of 4 delivering against shared standards'],
    stack: ['React', 'React Hooks', 'Redux Toolkit', 'React Router', 'REST APIs', 'Claude Code'],
  },
  {
    id: 'itinerary',
    name: 'GenAI Travel Itinerary Planner',
    category: 'GenAI · Travel & hospitality',
    period: 'May 2023 – Aug 2025',
    context: 'Travel and hospitality brands, including Qatar, Etihad Airways and Hilton Hotels',
    tagline: 'A chatbot that turns a conversation into a personalised trip plan of image cards you can rearrange.',
    overview:
      'A GenAI itinerary-planning chatbot. Travellers describe their trip in conversation, and the app generates a personalised day-by-day itinerary presented as interactive image cards that can be reordered and adjusted.',
    problem:
      'Travel brands wanted to offer planning that feels personal without manual agent effort. Raw LLM output is long text, which is hard for travellers to scan, compare and change.',
    role: 'Sole frontend developer, owning the UI from first screen to production.',
    roleShort: 'Sole frontend developer',
    previewNote:
      'Illustrative recreation of the planning flow with a sample trip. The real product generated itineraries with OpenAI and Google image APIs.',
    contributions: [
      'Built the complete React UI and integrated OpenAI LLM and Google image APIs.',
      'Built a drag-and-drop itinerary editor for reordering and personalising plans.',
      'Migrated the React implementation to Angular, then added user preferences, login and authentication, and an admin panel.',
      'Wrote unit tests with Jest and React Testing Library, and ran CI/CD pipelines and environment checks in Azure DevOps.',
    ],
    features: [
      'Conversational trip planning backed by an LLM',
      'Itineraries rendered as image cards using Google image APIs',
      'Drag-and-drop reordering of plans',
      'User preferences, authentication and an admin panel',
    ],
    challenges: [
      {
        challenge: 'Image-rich itinerary pages loaded slowly.',
        solution: 'Applied memoization and lazy loading, cutting page load time by 60%.',
      },
      {
        challenge: 'The product needed to move from React to Angular mid-project.',
        solution:
          'Migrated the implementation to Angular and continued shipping new features, including preferences, authentication and the admin panel.',
      },
    ],
    outcomes: ['60% faster page loads', 'Delivered for Qatar, Etihad Airways and Hilton Hotels'],
    stack: ['React', 'OpenAI API', 'Google image APIs', 'Angular', 'Jest', 'React Testing Library', 'Azure DevOps'],
  },
  {
    id: 'andi',
    name: 'AT&T ANDi Virtual Assistant',
    category: 'Conversational AI · Telecom',
    period: 'Mar 2021 – Apr 2023',
    context: 'AT&T, live to customers across North America',
    tagline: 'Payments, devices and orders inside AT&T’s customer-facing chatbot.',
    overview:
      'ANDi is AT&T’s customer-facing virtual assistant. I built several of its features, including the Payment Page used for the Payments feature launch and the Devices & Orders experience.',
    problem:
      'Customers needed to pay bills and check devices and orders inside the chat itself, rather than being sent to other channels, which meant rich, secure UI within a conversational flow.',
    role: 'Frontend developer working with the Product Owner, the Platform team and Google’s Dialogflow team.',
    roleShort: 'Frontend developer',
    previewNote:
      'Illustrative recreation of the in-chat payment and order experiences. Branding, account data and production screens are not reproduced.',
    contributions: [
      'Built the React Payment Page with debit and credit card billing for the Payments feature launch.',
      'Designed user workflows with the Product Owner and built the Devices & Orders feature UI.',
      'Designed custom Google Dialogflow JSON payloads together with the Google team.',
      'Remediated Veracode security findings and resolved high-priority production issues.',
    ],
    features: [
      'In-chat bill payment with debit and credit cards',
      'Devices & Orders views inside the conversation',
      'Rich chatbot responses driven by custom Dialogflow payloads',
      'UX refinements based on live-user feedback',
    ],
    challenges: [
      {
        challenge: 'Standard chatbot responses could not express payment forms or order details.',
        solution:
          'Worked with the Google team to design custom Dialogflow JSON payloads that the React UI renders as rich components.',
      },
      {
        challenge: 'A payments feature for live customers had to meet strict security and stability bars.',
        solution:
          'Remediated vulnerabilities flagged in Veracode scans and debugged high-priority production issues to keep releases stable.',
      },
    ],
    outcomes: ['Features live to AT&T customers across North America', 'Shipped the Payment Page for the Payments feature launch'],
    stack: ['React', 'JavaScript', 'Google Dialogflow', 'REST APIs', 'Veracode'],
  },
  {
    id: 'retail',
    name: 'Retail AI for Commerce',
    category: 'AI platform · Retail commerce',
    period: '2023 – 2025',
    context: 'AI platform for retail commerce',
    tagline: 'Login and dashboard features for an AI commerce platform, delivered alongside the travel planner.',
    overview:
      'An AI platform for retail commerce. I contributed the login and dashboard features while working on the GenAI Travel Itinerary Planner in parallel.',
    problem:
      'The platform needed a dependable sign-in experience and a dashboard that gives users a clear starting point into the product.',
    role: 'Frontend contributor for authentication and dashboard features.',
    roleShort: 'Frontend contributor, login & dashboard',
    previewNote:
      'My delivered scope was the login and dashboard features. The dashboard figures and chart here are illustrative placeholders, not product data or functionality.',
    contributions: [
      'Built the login feature.',
      'Built dashboard features.',
      'Delivered in parallel with the GenAI Travel Itinerary Planner.',
    ],
    features: ['Sign-in flow', 'Dashboard landing experience'],
    challenges: [
      {
        challenge: 'Contributing to a second product while owning the frontend of another.',
        solution:
          'Kept the features self-contained and drew on the authentication work already done for the travel planner.',
      },
    ],
    outcomes: ['Login and dashboard features delivered alongside a primary project'],
    stack: ['React', 'REST APIs'],
    confidentialityNote: 'Details are kept brief to respect client confidentiality.',
  },
  {
    id: 'aiis',
    name: 'Accenture Industrial Intelligence Suite',
    category: 'Industrial analytics · Migration',
    period: 'Aug 2025 – Present',
    context: 'Accenture industrial analytics platform',
    tagline: 'Modernising a legacy Angular platform into reusable React and TypeScript components.',
    overview:
      'Accenture Industrial Intelligence Suite (AIIS) is being migrated from Angular to React. I deliver new screens and features as part of that migration, rebuilding legacy modules as reusable components.',
    problem:
      'Legacy Angular modules were harder to extend and keep consistent. The product needed a modern, component-based UI without losing what users rely on.',
    role: 'React developer delivering new screens and features for the migration.',
    roleShort: 'React developer, Angular-to-React migration',
    previewNote:
      'Illustrative asset-monitoring screen showing how a legacy module is rebuilt as reusable React components. Figures are sample data.',
    contributions: [
      'Deliver new screens and features in React and TypeScript.',
      'Rebuild legacy modules as reusable, component-based UI.',
      'Implement interfaces from Figma designs.',
    ],
    features: [
      'Reusable React components replacing legacy Angular modules',
      'New screens built from Figma designs',
      'Typed component APIs with TypeScript',
    ],
    challenges: [
      {
        challenge: 'Migrating module by module while the product stays in use.',
        solution:
          'Rebuilt each legacy module as reusable React components from the Figma designs, so new screens share one component base.',
      },
    ],
    outcomes: ['Migration in progress, with new screens shipping as reusable React components'],
    stack: ['React', 'TypeScript', 'Figma', 'Angular (legacy)'],
  },
];

export const projectById = (id: ProjectId) => projects.find((p) => p.id === id)!;
