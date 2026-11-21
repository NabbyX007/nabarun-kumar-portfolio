import type { Project } from '@/types';
import { projects } from '@/data/projects';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/projects/ProjectCard';

const layout: Record<Project['id'], { className: string; preview: string }> = {
  csrd: { className: 'md:col-span-2 lg:col-span-7', preview: 'h-72' },
  itinerary: { className: 'lg:col-span-5', preview: 'h-72' },
  andi: { className: 'lg:col-span-4', preview: 'h-64' },
  retail: { className: 'lg:col-span-4', preview: 'h-64' },
  aiis: { className: 'lg:col-span-4', preview: 'h-64' },
};

interface ProjectsProps {
  onOpen: (project: Project, trigger: HTMLElement) => void;
}

export function Projects({ onOpen }: ProjectsProps) {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        eyebrow="03 · Featured projects"
        title="Selected work"
        lede="Five enterprise products, from a chatbot used across North America to GenAI tools in active development. Open any project for the full case study and a working preview. Client details are kept general where the work is confidential."
      />
      <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            onOpen={onOpen}
            className={layout[project.id].className}
            previewHeight={layout[project.id].preview}
          />
        ))}
      </div>
    </Section>
  );
}
