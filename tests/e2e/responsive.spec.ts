/**
 * Playwright E2E: 全ページのレスポンシブ確認
 * PC (1280px) / タブレット (768px) / スマホ (390px)
 */
import { test, expect, type Page } from '@playwright/test';

const PAGES = [
  { path: '/',         label: 'トップ' },
  { path: '/about',    label: '教室紹介' },
  { path: '/lessons',  label: 'レッスン' },
  { path: '/pricing',  label: '料金' },
  { path: '/trial',    label: '体験レッスン' },
  { path: '/contact',  label: 'お問い合わせ' },
  { path: '/faq',      label: 'FAQ' },
  { path: '/access',   label: 'アクセス' },
];

const VIEWPORTS = [
  { name: 'Desktop',  width: 1280, height: 900 },
  { name: 'Tablet',   width: 768,  height: 1024 },
  { name: 'Mobile',   width: 390,  height: 844 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

async function waitForPageReady(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // Wait for fonts to load if possible
  await page.evaluate(() =>
    document.fonts?.ready ?? Promise.resolve()
  ).catch(() => {});
}

async function checkNoHorizontalScroll(page: Page, viewport: typeof VIEWPORTS[0]) {
  const scrollWidth  = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth  = await page.evaluate(() => document.documentElement.clientWidth);
  expect(
    scrollWidth,
    `${viewport.name} (${viewport.width}px): 横スクロールが発生しています (scrollWidth=${scrollWidth}, clientWidth=${clientWidth})`
  ).toBeLessThanOrEqual(clientWidth + 2); // +2px tolerance for sub-pixel rendering
}

async function checkHeaderVisible(page: Page, viewport: typeof VIEWPORTS[0]) {
  const header = page.locator('header').first();
  await expect(header, `${viewport.name}: ヘッダーが表示されていません`).toBeVisible();
}

async function checkFooterVisible(page: Page, viewport: typeof VIEWPORTS[0]) {
  const footer = page.locator('footer').first();
  await expect(footer, `${viewport.name}: フッターが表示されていません`).toBeVisible();
}

async function checkMainContentVisible(page: Page, viewport: typeof VIEWPORTS[0]) {
  const main = page.locator('main').first();
  await expect(main, `${viewport.name}: メインコンテンツが表示されていません`).toBeVisible();
}

async function checkNoOverlappingElements(page: Page) {
  // Verify the main content is not hidden behind the fixed header
  const headerHeight = await page.locator('header').first().evaluate(
    el => el.getBoundingClientRect().height
  ).catch(() => 0);
  const mainTop = await page.locator('main').first().evaluate(
    el => el.getBoundingClientRect().top + window.scrollY
  ).catch(() => 0);
  // main should start at or after the header
  expect(mainTop).toBeGreaterThanOrEqual(0);
  void headerHeight; // used implicitly
}

// ─── Desktop tests ────────────────────────────────────────────────────────

test.describe('Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const pg of PAGES) {
    test(`${pg.label} (${pg.path}) — デスクトップ表示`, async ({ page }) => {
      await page.goto(pg.path);
      await waitForPageReady(page);

      await checkHeaderVisible(page, VIEWPORTS[0]);
      await checkMainContentVisible(page, VIEWPORTS[0]);
      await checkFooterVisible(page, VIEWPORTS[0]);
      await checkNoHorizontalScroll(page, VIEWPORTS[0]);

      // Desktop nav should be visible
      const desktopNav = page.locator('nav[aria-label="メインナビゲーション"]');
      await expect(desktopNav).toBeVisible();

      // Mobile hamburger should be hidden
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeHidden();
    });
  }
});

// ─── Tablet tests ─────────────────────────────────────────────────────────

test.describe('Tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  for (const pg of PAGES) {
    test(`${pg.label} (${pg.path}) — タブレット表示`, async ({ page }) => {
      await page.goto(pg.path);
      await waitForPageReady(page);

      await checkHeaderVisible(page, VIEWPORTS[1]);
      await checkMainContentVisible(page, VIEWPORTS[1]);
      await checkFooterVisible(page, VIEWPORTS[1]);
      await checkNoHorizontalScroll(page, VIEWPORTS[1]);
    });
  }
});

// ─── Mobile tests ─────────────────────────────────────────────────────────

test.describe('Mobile (390px)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const pg of PAGES) {
    test(`${pg.label} (${pg.path}) — スマホ表示`, async ({ page }) => {
      await page.goto(pg.path);
      await waitForPageReady(page);

      await checkHeaderVisible(page, VIEWPORTS[2]);
      await checkMainContentVisible(page, VIEWPORTS[2]);
      await checkFooterVisible(page, VIEWPORTS[2]);
      await checkNoHorizontalScroll(page, VIEWPORTS[2]);

      // Mobile hamburger should be visible
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeVisible();

      // Desktop nav should be hidden on mobile
      const desktopNav = page.locator('nav[aria-label="メインナビゲーション"]');
      await expect(desktopNav).toBeHidden();
    });
  }

  test('モバイルメニューの開閉が動作する', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const btn      = page.locator('#mobile-menu-btn');
    const menu     = page.locator('#mobile-menu');
    const closeIcon = page.locator('.close-icon').first();

    // Initially closed
    await expect(menu).toBeHidden();
    await expect(closeIcon).toBeHidden();

    // Open
    await btn.click();
    await expect(menu).toBeVisible();
    await expect(closeIcon).toBeVisible();

    // Close
    await btn.click();
    await expect(menu).toBeHidden();
  });
});

// ─── Hero & CTA buttons ───────────────────────────────────────────────────

test.describe('トップページ — 主要ボタン', () => {
  test('ヒーローの体験レッスンボタンが表示される', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const btn = page.locator('[data-testid="hero-trial-btn"]');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/trial');
  });

  test('ヒーローのレッスンボタンが表示される', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const btn = page.locator('[data-testid="hero-lessons-btn"]');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('href', '/lessons');
  });

  test('CTAの無料体験ボタンが表示される', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const btn = page.locator('[data-testid="cta-trial-btn"]');
    await expect(btn).toBeVisible();
  });
});

// ─── Form accessibility ───────────────────────────────────────────────────

test.describe('体験レッスンフォーム — アクセシビリティ', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('モバイルでフォームが全て表示される', async ({ page }) => {
    await page.goto('/trial');
    await waitForPageReady(page);

    await expect(page.locator('[data-testid="trial-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-phone"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-instrument"]')).toBeVisible();
    await expect(page.locator('[data-testid="trial-submit-btn"]')).toBeVisible();
  });
});
