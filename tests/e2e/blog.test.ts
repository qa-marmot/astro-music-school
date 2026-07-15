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
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toBeVisible();
    await cards.first().getByRole('link').click();
    await expect(page.getByRole('article')).toBeVisible();
  });

  test('カテゴリページに該当する記事を表示する', async ({ page }) => {
    await page.goto('/blog/category/practice');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('練習のヒント');
    await expect(page.getByTestId('blog-card')).toHaveCount(2);
  });

  test('存在しない記事は404になる', async ({ page }) => {
    const response = await page.goto('/blog/not-found');
    expect(response?.status()).toBe(404);
  });
});
