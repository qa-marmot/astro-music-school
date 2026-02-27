import { test, expect } from '@playwright/test';

test.describe('フォーム表示確認', () => {
  test('体験レッスンフォームが正しく表示される', async ({ page }) => {
    await page.goto('/trial');

    const form = page.getByTestId('trial-form');
    await expect(form).toBeVisible();

    // 必須フィールドの確認
    await expect(page.getByLabel(/お名前/)).toBeVisible();
    await expect(page.getByLabel(/フリガナ/)).toBeVisible();
    await expect(page.getByLabel(/メールアドレス/)).toBeVisible();
    await expect(page.getByLabel(/電話番号/)).toBeVisible();
    await expect(page.getByLabel(/ご希望の楽器/)).toBeVisible();

    // 送信ボタン確認
    await expect(page.getByTestId('trial-submit-btn')).toBeVisible();
  });

  test('楽器セレクトボックスに正しい選択肢が含まれる', async ({ page }) => {
    await page.goto('/trial');
    const select = page.getByLabel(/ご希望の楽器/);
    await expect(select).toBeVisible();

    // 各楽器オプションを確認
    await expect(select.getByRole('option', { name: 'ピアノ' })).toBeAttached();
    await expect(select.getByRole('option', { name: 'バイオリン' })).toBeAttached();
    await expect(select.getByRole('option', { name: '声楽' })).toBeAttached();
    await expect(select.getByRole('option', { name: 'フルート' })).toBeAttached();
  });

  test('お問い合わせフォームが正しく表示される', async ({ page }) => {
    await page.goto('/contact');

    const form = page.getByTestId('contact-form');
    await expect(form).toBeVisible();

    await expect(page.getByLabel(/お名前/)).toBeVisible();
    await expect(page.getByLabel(/メールアドレス/)).toBeVisible();
    await expect(page.getByLabel(/お問い合わせ種別/)).toBeVisible();
    await expect(page.getByLabel(/お問い合わせ内容/)).toBeVisible();

    await expect(page.getByTestId('contact-submit-btn')).toBeVisible();
  });

  test('お問い合わせ種別セレクトに正しい選択肢がある', async ({ page }) => {
    await page.goto('/contact');
    const select = page.getByLabel(/お問い合わせ種別/);
    await expect(select.getByRole('option', { name: '体験レッスンについて' })).toBeAttached();
    await expect(select.getByRole('option', { name: 'レッスン内容について' })).toBeAttached();
    await expect(select.getByRole('option', { name: '料金・スケジュールについて' })).toBeAttached();
  });
});

test.describe('ページ基本表示確認', () => {
  const pages = [
    { path: '/',        title: 'Harmony Music School' },
    { path: '/about',   title: '教室紹介' },
    { path: '/lessons', title: 'レッスン内容' },
    { path: '/pricing', title: '料金プラン' },
    { path: '/trial',   title: '体験レッスン' },
    { path: '/blog',    title: 'ブログ' },
    { path: '/contact', title: 'お問い合わせ' },
    { path: '/faq',     title: 'よくあるご質問' },
    { path: '/access',  title: 'アクセス' },
  ];

  for (const { path, title } of pages) {
    test(`${path} ページが表示される`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(new RegExp(title));
      // h1タグが存在することを確認
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });
  }
});
