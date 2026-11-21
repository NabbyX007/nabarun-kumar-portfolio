import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

/**
 * Resolves the public site URL for canonical, Open Graph and sitemap URLs.
 * Order: VITE_SITE_URL (set this for a custom domain) → Vercel's production
 * domain (provided automatically on Vercel builds) → local preview.
 */
function resolveSiteUrl(env: Record<string, string>) {
  const url =
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    'http://localhost:4173';
  return url.replace(/\/+$/, '');
}

/** Injects the site URL into index.html and emits sitemap.xml and robots.txt. */
function seo(siteUrl: string): Plugin {
  return {
    name: 'portfolio-seo',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env } as Record<string, string>;
  return {
    plugins: [react(), tailwindcss(), seo(resolveSiteUrl(env))],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    build: {
      rollupOptions: {
        output: {
          // Keep framework code in long-cached vendor chunks.
          manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] },
        },
      },
    },
  };
});
