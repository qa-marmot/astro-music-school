import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-school.pages.dev', // ← Cloudflare PagesのURLに変更
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'static',
});
