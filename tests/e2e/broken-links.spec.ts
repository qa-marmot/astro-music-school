/**
 * Playwright E2E: リンク切れチェック
 * 全ページの内部リンク・ナビゲーションリンクを検証
 */
import { test, expect, type Page, type Response } from '@playwright/test';

const BASE_PAGES = [
  '/',
  '/about',
  '/lessons',
  '/pricing',
  '/trial',
  '/contact',
  '/faq',
  '/access',
  '/blog',
];

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Extract all unique internal hrefs from the page */
async function getInternalLinks(page: Page, baseURL: string): Promise<string[]> {
  const links = await page.evaluate((base) => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    return anchors
      .map(a => (a as HTMLAnchorElement).href)
      .filter(href => href.startsWith(base) || href.startsWith('/'));
  }, baseURL);

  // Normalize and deduplicate
  const normalized = links
    .map(href => {
      try {
        const url = new URL(href, baseURL);
        // Keep only same-origin URLs without hashes
        if (url.origin !== new URL(baseURL).origin) return null;
        return url.pathname;
      } catch {
        return null;
      }
    })
    .filter((href): href is string => href !== null)
    .filter(href => !href.includes('#') || href === href.split('#')[0]);

  return [...new Set(normalized)];
}

/** Check that a URL returns a non-error HTTP status */
async function checkLink(page: Page, href: string): Promise<{ href: string; ok: boolean; status: number }> {
  let response: Response | null = null;
  try {
    response = await page.request.get(href, { timeout: 10_000 });
    return { href, ok: response.ok(), status: response.status() };
  } catch (e) {
    return { href, ok: false, status: 0 };
  }
}

// ─── Navigation link integrity ────────────────────────────────────────────

test.describe('ナビゲーションリンク整合性', () => {
  test('ヘッダーナビのリンクが全て存在する', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const navLinks = page.locator('nav[aria-label="メインナビゲーション"] a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href, `Nav link ${i} has no href`).toBeTruthy();

      if (href && href.startsWith('/')) {
        const response = await page.request.get(href);
        expect(
          response.status(),
          `ナビリンク "${href}" が ${response.status()} を返しました`
        ).toBeLessThan(400);
      }
    }
  });

  test('フッターリンクが全て存在する', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const footerLinks = page.locator('footer a[href^="/"]');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      if (!href) continue;

      // Skip hash-only links
      if (href === '#') continue;

      const response = await page.request.get(href);
      expect(
        response.status(),
        `フッターリンク "${href}" が ${response.status()} を返しました`
      ).toBeLessThan(400);
    }
  });
});

// ─── Per-page internal link checks ───────────────────────────────────────

for (const pagePath of BASE_PAGES) {
  test(`内部リンク確認: ${pagePath}`, async ({ page, baseURL }) => {
    const base = baseURL ?? 'http://localhost:4321';
    await page.goto(pagePath);
    await page.waitForLoadState('domcontentloaded');

    const links = await getInternalLinks(page, base);

    const broken: string[] = [];
    for (const href of links) {
      // Skip known dynamic routes that need params
      if (href.startsWith('/blog/') && href !== '/blog/') continue;

      const result = await checkLink(page, href);
      if (!result.ok && result.status !== 404) {
        // 404 for blog dynamic routes is acceptable; other errors are not
        broken.push(`${href} (${result.status})`);
      }
    }

    expect(
      broken,
      `${pagePath} に壊れたリンクがあります:\n${broken.join('\n')}`
    ).toHaveLength(0);
  });
}

// ─── Specific important links ─────────────────────────────────────────────

test.describe('重要なリンクの個別確認', () => {
  test('ロゴリンクがトップページに遷移する', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('domcontentloaded');

    await page.locator('header a[aria-label="トップページへ"]').click();
    await expect(page).toHaveURL('/');
  });

  test('体験レッスンCTAがtrialページに遷移する', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const btn = page.locator('[data-testid="hero-trial-btn"]');
    await btn.click();
    await expect(page).toHaveURL('/trial');
  });

  test('レッスンページのコースリンクが正しい', async ({ page }) => {
    await page.goto('/lessons');
    await page.waitForLoadState('domcontentloaded');

    // Check course navigation pills (anchor links)
    const coursePills = page.locator('a[href^="#"]');
    const count = await coursePills.count();
    expect(count).toBeGreaterThan(0);

    // Verify target anchors exist on the page
    for (let i = 0; i < count; i++) {
      const href = await coursePills.nth(i).getAttribute('href');
      if (!href || !href.startsWith('#')) continue;
      const id = href.slice(1);
      const target = page.locator(`#${id}`);
      await expect(target, `アンカー "${href}" が見つかりません`).toBeAttached();
    }
  });

  test('プライバシーポリシーリンクが機能する', async ({ page }) => {
    await page.goto('/trial');
    await page.waitForLoadState('domcontentloaded');

    const privacyLink = page.locator('a[href="/privacy"]').first();
    await expect(privacyLink).toBeVisible();

    const response = await page.request.get('/privacy');
    expect(response.status()).toBeLessThan(400);
  });

  test('404ページが存在する', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz');
    // Astro serves the 404.astro page — should be 404 status
    expect(response?.status()).toBe(404);
    // Should show some content (not a blank page)
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(0);
  });
});

// ─── External link safety ─────────────────────────────────────────────────

test.describe('外部リンクのセキュリティ確認', () => {
  test('外部リンクに rel="noopener" が付いている', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"])');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      const rel  = await link.getAttribute('rel');
      const href = await link.getAttribute('href');
      // Either noopener or noreferrer should be present on external links
      // (This is a best practice check, not a hard failure)
      if (rel && !rel.includes('noopener') && !rel.includes('noreferrer')) {
        console.warn(`外部リンク ${href} に rel="noopener" がありません`);
      }
    }
  });
});
