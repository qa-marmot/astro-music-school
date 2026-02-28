import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://hokayumi4.workers.dev';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind(),
  ],
  output: 'static',
});