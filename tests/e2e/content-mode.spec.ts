import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/lessons', '/pricing', '/trial', '/contact', '/faq', '/access', '/blog', '/privacy'];

test('デモモードは全ページをnoindexにし、構造化データを出さない', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  }
});

test('デモ注記は上部帯ではなくフッターに集約する', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.demo-banner')).toHaveCount(0);
  await expect(page.locator('footer').getByText(/デモサイトです/)).toHaveCount(1);
});

test('robots.txtはデモで全クロールを拒否する', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.ok()).toBe(true);
  const body = await response.text();
  expect(body).toContain('User-agent: *');
  expect(body).toContain('Disallow: /');
});

test('フォーム送信先未設定の警告はフォーム内だけに表示する', async ({ page }) => {
  await page.goto('/trial');
  await expect(page.locator('#trial-demo-notice')).toBeVisible();
  await page.goto('/contact');
  await expect(page.locator('#contact-demo-notice')).toBeVisible();
  await page.goto('/');
  await expect(page.getByText('デモのため送信されません')).toHaveCount(0);
});
