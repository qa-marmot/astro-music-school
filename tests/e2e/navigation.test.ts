import { test, expect } from '@playwright/test';

test.describe('メインナビゲーション導線', () => {
  test('トップ → レッスン → 体験 → お問い合わせ の導線が機能する', async ({ page }) => {
    // トップページ
    await page.goto('/');
    await expect(page).toHaveTitle(/Harmony Music School/);

    // ヒーローセクションの確認
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();

    // レッスンページへ
    const lessonsLink = page.getByTestId('hero-lessons-btn');
    await expect(lessonsLink).toBeVisible();
    await lessonsLink.click();
    await expect(page).toHaveURL(/\/lessons/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('レッスン内容');

    // 体験レッスンページへ（レッスンページ内のCTAから）
    const trialLink = page.getByRole('link', { name: /体験レッスン/ }).first();
    await trialLink.click();
    await expect(page).toHaveURL(/\/trial/);
    await expect(page.getByTestId('trial-form')).toBeVisible();

    // お問い合わせページへ（ナビゲーションから）
    await page.getByRole('link', { name: 'お問い合わせ' }).first().click();
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByTestId('contact-form')).toBeVisible();
  });

  test('CTAボタン（体験レッスン）がトップページに表示される', async ({ page }) => {
    await page.goto('/');
    const ctaBtn = page.getByTestId('cta-trial-btn');
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toHaveAttribute('href', '/trial');
  });
});

test.describe('ヘッダーナビゲーション', () => {
  test('各ナビリンクが正しいページに遷移する', async ({ page }) => {
    await page.goto('/');

    // 教室紹介
    await page.getByRole('link', { name: '教室紹介' }).first().click();
    await expect(page).toHaveURL(/\/about/);

    // 料金
    await page.goto('/');
    await page.getByRole('link', { name: '料金' }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
  });

  test('ロゴクリックでトップページに戻る', async ({ page }) => {
    await page.goto('/about');
    await page.getByRole('link', { name: 'トップページへ' }).click();
    await expect(page).toHaveURL('/');
  });
});
