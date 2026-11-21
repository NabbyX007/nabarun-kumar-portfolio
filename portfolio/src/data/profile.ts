export const profile = {
  name: 'Nabarun Kumar',
  initials: 'NK',
  role: 'Senior React Frontend Developer',
  location: 'Bengaluru, India',
  experience: '5+ years',
  email: 'nabarun1908@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nabarun-kumar',
  /** Add your GitHub profile URL here; the GitHub links appear once it is set. */
  github: 'https://github.com/NabbyX007' as string,
  resumeUrl: '/Nabarun_Kumar_Resume.pdf',
  resumeFileName: 'Nabarun_Kumar_Resume.pdf',
  headline: 'Building Digital Experiences That Make an Impact.',
  intro:
    'For 5+ years at Accenture I’ve turned complex enterprise workflows into fast, responsive interfaces with React, TypeScript and Redux Toolkit: 100+ screens, from AT&T’s customer-facing chatbot to GenAI reporting tools.',
  rotating: [
    'GenAI chat interfaces',
    'enterprise reporting workflows',
    'reusable component libraries',
    'Angular-to-React migrations',
    'fast, responsive UIs',
  ],
  clients: ['AT&T', 'Etihad Airways', 'Hilton'],
  certifications: ['Microsoft Certified: Azure Fundamentals (AZ-900)', 'Claude Certified Architect – Foundations'],
  education: {
    degree: 'B.E., Electrical & Electronics Engineering',
    school: 'Siddaganga Institute of Technology, Tumkur',
    year: '2020',
  },
} as const;
