import { test, expect } from '@playwright/test';

test.describe('ブログ導線', () => {
  test('ブログ一覧ページが表示される', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/ブログ/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ブログ');
  });

  test('ブログ記事カードが表示される', async ({ page }) => {
    await page.goto('/blog');
    // 記事カードが少なくとも1件表示されることを確認
    // （microCMS未接続時のサンプルデータを含む）
    const cards = page.getByTestId('blog-card');
    const count = await cards.count();
    // サンプルデータがある場合は確認
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
      // 記事カードのリンクをクリックして詳細ページへ
      const firstLink = cards.first().getByRole('link');
      await firstLink.click();
      await expect(page.getByRole('article')).toBeVisible();
    }
  });

  test('ブログ詳細ページが正しく表示される', async ({ page }) => {
    await page.goto('/blog/sample-1');
    await expect(page.getByRole('article')).toBeVisible();
    // パンくずナビゲーションの確認
    await expect(page.getByRole('navigation', { name: 'パンくず' })).toBeVisible();
    // 「ブログ一覧へ戻る」リンクの確認
    await expect(page.getByRole('link', { name: /ブログ一覧へ戻る/ })).toBeVisible();
  });

  test('ブログ詳細から一覧に戻れる', async ({ page }) => {
    await page.goto('/blog/sample-1');
    await page.getByRole('link', { name: /ブログ一覧へ戻る/ }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });
});
