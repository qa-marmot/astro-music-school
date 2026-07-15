import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: SITE_URL,
  devToolbar: { enabled: false },
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'static',
});
