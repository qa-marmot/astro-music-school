import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/lessons', name: 'lessons' },
  { path: '/pricing', name: 'pricing' },
  { path: '/trial', name: 'trial' },
  { path: '/contact', name: 'contact' },
  { path: '/faq', name: 'faq' },
  { path: '/access', name: 'access' },
  { path: '/blog', name: 'blog' },
];

const widths = [360, 390, 768, 1024, 1280, 1440];

test.describe('主要ページのvisual regression', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop Chromium projectで基準画像を管理します');
  test.setTimeout(60_000);

  for (const pageInfo of pages) {
    for (const width of widths) {
      test(`${pageInfo.name}-${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.route('https://images.pexels.com/**', (route) => route.fulfill({
          status: 200,
          contentType: 'image/svg+xml',
          body: '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#ded5c5"/></svg>',
        }));
        await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
        await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
        await page.goto(pageInfo.path);
        await page.evaluate(async () => {
          await document.fonts?.ready;
          document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => { image.loading = 'eager'; });
        });
        await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete), undefined, { timeout: 5_000 }).catch(() => {});
        await expect(page).toHaveScreenshot(`${pageInfo.name}-${width}.png`, {
          fullPage: true,
          animations: 'disabled',
          maxDiffPixelRatio: 0.01,
          timeout: 15_000,
        });
      });
    }
  }
});
