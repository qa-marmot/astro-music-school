import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Cloudflare Pages の環境変数 PUBLIC_SITE_URL を使用
// 未設定時はビルドが通るようにフォールバックを設定
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://your-school.pages.dev';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind(),
    sitemap(),
  ],
  output: 'static',
});
