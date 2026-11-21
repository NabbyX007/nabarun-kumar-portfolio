import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useCallback, useState } from 'react';
import type { Project } from '@/types';
import { navItems } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { PageLoader } from '@/components/layout/PageLoader';
import { Footer } from '@/components/layout/Footer';
import { AmbientBackground } from '@/components/background/AmbientBackground';
import { CursorGlow } from '@/components/background/CursorGlow';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Experience } from '@/sections/Experience';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Contact } from '@/sections/Contact';
import { Impact } from '@/sections/Impact';
import { TerminalSection } from '@/sections/TerminalSection';

// The case-study dialog is split into its own chunk and only loads when opened.
const ProjectDialog = lazy(() => import('@/components/projects/ProjectDialog'));

const sectionIds = ['home', ...navItems.map((n) => n.id)] as const;

export default function App() {
  const [ready, setReady] = useState(false);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const active = useActiveSection(sectionIds);

  const handleLoaded = useCallback(() => setReady(true), []);
  const openCaseStudy = useCallback((project: Project) => setOpenProject(project), []);
  const closeCaseStudy = useCallback(() => setOpenProject(null), []);

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[120] -translate-y-20 rounded-lg bg-signal px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-[env(safe-area-inset-top,0px)]"
      >
        Skip to content
      </a>
      <AmbientBackground />
      <CursorGlow />
      <PageLoader onDone={handleLoaded} />
      <ScrollProgress />
      <Navbar active={active} />

      <main id="main">
        <Hero ready={ready} />
        <Impact />
        <About />
        <Experience />
        <Projects onOpen={openCaseStudy} />
        <Skills onOpenProject={openCaseStudy} />
        <TerminalSection onOpenProject={openCaseStudy} />
        <Contact />
      </main>
      <Footer />

      <Suspense fallback={null}>
        <AnimatePresence>
          {openProject && (
            <ProjectDialog key="project-dialog" project={openProject} onClose={closeCaseStudy} onNavigate={setOpenProject} />
          )}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
