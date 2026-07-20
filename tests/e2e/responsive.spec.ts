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
  await page.evaluate(async () => {
    await document.fonts?.ready;
  }).catch(() => {});
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
      const desktopNav = page.locator('nav[aria-label="主要ナビゲーション"]');
      await expect(desktopNav).toBeVisible();

      // N9-derived menu trigger remains available on desktop
      const mobileBtn = page.locator('#mobile-menu-btn');
      await expect(mobileBtn).toBeVisible();
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
      const desktopNav = page.locator('nav[aria-label="主要ナビゲーション"]');
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
  test('1280×800でヒーローの主要情報と写真の焦点がファーストビューに収まる', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await waitForPageReady(page);

    for (const selector of ['.home-hero h1', '.home-hero__kicker', '[data-testid="hero-trial-btn"]']) {
      const box = await page.locator(selector).boundingBox();
      expect(box, `${selector} が表示されていません`).not.toBeNull();
      expect((box?.y ?? 0) + (box?.height ?? 0), `${selector} がファーストビューからはみ出しています`).toBeLessThanOrEqual(800);
    }

    const imageBox = await page.locator('.home-hero__image img').boundingBox();
    expect(imageBox).not.toBeNull();
    expect((imageBox?.y ?? 0) + (imageBox?.height ?? 0) * 0.58, 'ヒーロー写真の焦点がファーストビューからはみ出しています').toBeLessThanOrEqual(800);
  });

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

  test('CTAの有料体験ボタンが表示される', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    const btn = page.locator('[data-testid="cta-trial-btn"]');
    await expect(btn).toBeVisible();
  });
});

test.describe('Hallmark必須幅のレイアウト安全性', () => {
  test('320・375・414・768pxで主要ページに横スクロールがない', async ({ page }) => {
    test.setTimeout(60_000);
    for (const width of [320, 375, 414, 768]) {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1024 });
      for (const pg of PAGES) {
        await page.goto(pg.path);
        await waitForPageReady(page);
        await checkNoHorizontalScroll(page, { name: `Hallmark-${width}`, width, height: width < 768 ? 844 : 1024 });
      }
    }
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
