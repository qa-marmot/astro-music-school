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
  { path: '/blog/piano-practice-rhythm', name: 'blog-article' },
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
        await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
        await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
        await page.goto(pageInfo.path);
        await page.evaluate(async () => {
          await document.fonts?.ready;
          const lazyImages = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));
          for (const image of lazyImages) {
            image.loading = 'eager';
            image.scrollIntoView({ block: 'center' });
            await image.decode().catch(() => {});
          }
          window.scrollTo(0, 0);
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
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

test.describe('トップページの小画面構成', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop Chromium projectで基準画像を管理します');

  for (const width of [320, 375, 414]) {
    test(`home-critical-${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.evaluate(async () => { await document.fonts?.ready; });
      await page.locator('.home-hero img').evaluate((image: HTMLImageElement) => image.decode().catch(() => {}));
      await expect(page.locator('.home-hero')).toHaveScreenshot(`home-critical-${width}.png`, {
        animations: 'disabled',
        maxDiffPixelRatio: 0.01,
      });
    });
  }
});
