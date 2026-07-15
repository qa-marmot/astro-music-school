import { test, expect } from '@playwright/test';

test.describe('ブログ導線', () => {
  test('ブログ一覧ページが表示される', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/ブログ/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ブログ');
  });

  test('ブログ記事カードが表示される', async ({ page }) => {
    await page.goto('/blog');
    const cards = page.getByTestId('blog-card');
    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
      const firstLink = cards.first().getByRole('link');
      await firstLink.click();
      await expect(page.getByRole('article')).toBeVisible();
    } else {
      await expect(page.getByText('記事はまだありません')).toBeVisible();
    }
  });

  test('CMS未設定時は架空のサンプル詳細を公開しない', async ({ page }) => {
    const response = await page.goto('/blog/sample-1');
    expect(response?.status()).toBe(404);
  });
});
