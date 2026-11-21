# Nabarun Kumar — Portfolio

Personal portfolio for Nabarun Kumar, Senior React Frontend Developer.
Built with React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion and Lucide icons. No other runtime dependencies.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

Requires Node.js 18 or newer.

## Configuration

Copy `.env.example` to `.env.local` (local) or add the variables in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_CONTACT_ENDPOINT` | No | Form service URL that accepts a JSON POST, e.g. `https://formspree.io/f/<id>` or `https://api.web3forms.com/submit`. Without it the form opens a pre-filled email draft instead. |
| `VITE_CONTACT_ACCESS_KEY` | Web3Forms only | Sent as `access_key` in the request body. |
| `VITE_SITE_URL` | Custom domain only | Public URL for canonical, Open Graph, `sitemap.xml` and `robots.txt`. On Vercel the production domain is detected automatically (`VERCEL_PROJECT_PRODUCTION_URL`). |

Environment variables are read at **build time**, so redeploy after changing them.

## Editing content

All copy lives in `src/data/`, separate from the components:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, headline, intro, email, LinkedIn, **GitHub** (empty by default), resume path |
| `experience.ts` | Company, timeline roles, responsibilities and focus tags used by the timeline filter |
| `projects.ts` | Case studies: category, overview, problem, role, features, challenges, outcomes, stack, preview disclosure |
| `skills.ts` | Skill groups, and which projects each skill links to (`usedIn`) |
| `navigation.ts` | Navigation items |

- **GitHub:** set `github` in `profile.ts`. GitHub links then appear in the contact section, terminal, mobile menu and footer.
- **Resume:** replace `public/Nabarun_Kumar_Resume.pdf`.
- **Metrics:** the Impact section (`src/sections/Impact.tsx`) only lists verified figures. Add new ones only with a source.
- **Social preview:** `public/og-image.png` (1200×630) and `public/apple-touch-icon.png`.

## Sections

| Section | Highlights |
| --- | --- |
| Hero | Gradient headline, staggered entrance, magnetic CTAs, typed code window |
| Impact | Four animated counters (`StatCard` + `useCountUp`) |
| About | Engineering principles |
| Experience | Scroll-driven timeline, focus filter, tenure, expandable responsibilities with emphasised metrics |
| Projects | Five case-study cards with interactive, clearly labelled illustrative UI mockups and a lazy-loaded case-study dialog |
| Skills | Category filter, brand icons, skill → project links (no proficiency bars) |
| Code meets design | Figma-style canvas driving the real `StatCard`; code tabs show the site's actual source via `?raw` imports |
| Terminal | Working CLI: `help`, `about`, `skills`, `projects`, `open <id>`, `experience`, `contact`, `resume`, `clear`; history, Tab completion, Ctrl+L |
| Contact | Validated form (name, email, subject, message) with loading, success and error states, honeypot, email fallback |

## Project structure

```
src/
  components/
    background/   AmbientBackground, CursorGlow, DotField, GlowOrbs
    craft/        CodePanel (lazy chunk: source viewer + highlighter)
    hero/         CodeWindow, RoleRotator
    layout/       Navbar, MobileMenu, ScrollProgress, PageLoader, Footer
    projects/     ProjectCard, ProjectDialog (lazy), previews/
    terminal/     Terminal, commands
    ui/           Button, StatCard, SkillIcon (+ lazy icon map), Magnetic, Section, SectionHeading, Reveal, Chip, BrandIcons
  data/           All site content
  hooks/          useCountUp, useContactForm, useActiveSection, useMagnetic, useTypewriter, useFocusTrap, ...
  lib/            contact (form integration), cn, motion tokens, scroll, resume download
  sections/       Hero, Impact, About, Experience, Projects, Skills, Craft, TerminalSection, Contact
  types/          Shared TypeScript types
  index.css       Design tokens (@theme) and surface utilities
vite.config.ts    Includes a small plugin that injects the site URL and emits sitemap.xml / robots.txt
```

## Design system

Tokens are defined in `src/index.css` under `@theme` and used as Tailwind classes.

| Token | Value | Use |
| --- | --- | --- |
| `ink-900` | `#0A0F1E` | Page background |
| `signal` / `violet` / `cyan` | `#5B8CFF` / `#9A7BFF` / `#63E3F2` | Accents |
| `fg` / `muted` / `faint` | `#E7EBF6` / `#8F9AB9` / `#7C88AB` | Text (all ≥ 4.5:1 on surfaces) |
| `rounded-card` / `-panel` / `-control` | 24 / 16 / 12 px | Radius scale |
| `shadow-card` / `-lift` / `-glow` | | Elevation |

Type: Space Grotesk (display), Inter (body), Geist Mono (code), from Google Fonts.

## Accessibility and performance

- `prefers-reduced-motion`: loader, typing, counters, reveals and cursor glow are skipped; content appears immediately.
- Semantic landmarks, one `h1`, labelled sections, skip link, visible focus, focus-trapped dialogs that restore focus, `aria-live` for terminal output and form status, labelled inputs with inline errors.
- Code splitting: case-study dialog, code viewer and skill icon set load as separate chunks (icons on idle). React and Framer Motion are long-cached vendor chunks.
- No layout shift from lazy content: placeholders reserve the same space.

## Deploying to Vercel

1. Push the `portfolio/` folder to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repository. If the repo root is the parent folder, set **Root Directory** to `portfolio`.
3. Framework preset: **Vite** (detected). Build command `npm run build`, output directory `dist`.
4. Optional: add `VITE_CONTACT_ENDPOINT` (and `VITE_SITE_URL` for a custom domain) under Environment Variables.
5. Deploy. After adding a custom domain, set `VITE_SITE_URL` and redeploy so OG tags and the sitemap use it.

Or from the CLI: `npm i -g vercel`, then `vercel` in this folder (and `vercel --prod` for production).
