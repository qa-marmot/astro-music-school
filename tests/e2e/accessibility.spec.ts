import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/lessons', '/pricing', '/trial', '/contact', '/faq', '/access', '/blog'];

for (const path of pages) {
  test(`${path} にcritical/seriousのアクセシビリティ違反がない`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts?.ready);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const blockingViolations = results.violations.filter((violation) =>
      violation.impact === 'critical' || violation.impact === 'serious'
    );
    expect(blockingViolations).toEqual([]);
  });
}

test('キーボードでモバイルメニューを開閉できる', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const button = page.locator('#mobile-menu-btn');
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toBeFocused();
});

test('reduced motionでは継続アニメーションを使用しない', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  // Astro dev toolbar lives in a shadow root and has its own loading animation.
  // Scope this assertion to the rendered site UI rather than development tooling.
  const animated = await page.locator('#site-header *, #main-content *, footer *').evaluateAll((nodes) => nodes.filter((node) => {
    const style = getComputedStyle(node);
    return style.animationName !== 'none' && style.animationDuration !== '0s';
  }).length);
  expect(animated).toBe(0);
});
