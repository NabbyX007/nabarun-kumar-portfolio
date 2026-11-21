import { ArrowUp, Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { scrollToSection } from '@/lib/scroll';
import { LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons';

const iconLink =
  'grid h-10 w-10 place-items-center rounded-control border border-white/[0.08] text-muted transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:text-fg';

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-[linear-gradient(90deg,transparent,rgb(143_176_255/0.45),transparent)]" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-base font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript and Framer Motion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`mailto:${profile.email}`} className={iconLink} aria-label="Email">
            <Mail size={18} aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className={iconLink} aria-label="LinkedIn">
            <LinkedInIcon className="h-4 w-4" />
          </a>
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noreferrer" className={iconLink} aria-label="GitHub">
              <GitHubIcon className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="group ml-2 inline-flex h-10 items-center gap-2 rounded-control border border-white/[0.08] px-4 text-sm text-muted transition-colors duration-300 hover:border-signal/40 hover:text-fg"
          >
            Back to top
            <ArrowUp size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
