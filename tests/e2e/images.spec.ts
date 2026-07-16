import { test, expect } from '@playwright/test';

test('ヒーロー画像はresponsive形式とLCP属性を持つ', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('main picture img').first();
  await expect(hero).toHaveAttribute('alt', /個人レッスンのイメージ/);
  await expect(hero).toHaveAttribute('loading', 'eager');
  await expect(hero).toHaveAttribute('fetchpriority', 'high');
  await expect(hero).toHaveAttribute('decoding', 'async');
  await expect(hero).toHaveAttribute('width', /\d+/);
  await expect(hero).toHaveAttribute('height', /\d+/);
  await expect(page.locator('main picture source[type="image/avif"]').first()).toHaveAttribute('srcset', /(\.avif|f=avif)/);
  await expect(page.locator('main picture source[type="image/webp"]').first()).toHaveAttribute('srcset', /(\.webp|f=webp)/);
});

test('ヒーロー以外の編集画像は遅延読み込みされる', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('main picture img');
  await expect(images).toHaveCount(2);
  await expect(images.nth(1)).toHaveAttribute('loading', 'lazy');
});

test('表示画像はすべてalt属性を持ち、外部画像URLを使わない', async ({ page }) => {
  for (const path of ['/', '/about', '/lessons', '/access', '/blog']) {
    await page.goto(path);
    const imageState = await page.locator('img').evaluateAll((images) => images.map((image) => ({
      hasAlt: image.hasAttribute('alt'),
      src: image.getAttribute('src') ?? '',
    })));
    expect(imageState.every((image) => image.hasAlt), `${path}: altがない画像があります`).toBe(true);
    expect(imageState.every((image) => !/^https?:\/\//.test(image.src)), `${path}: 外部画像があります`).toBe(true);
  }
});

test('画像読み込みに失敗しても表示領域を保持する', async ({ page }) => {
  await page.route('**/_astro/home-guidance*', (route) => route.abort());
  await page.goto('/');
  const frame = page.locator('.editorial-image__frame').nth(1);
  const box = await frame.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(200);
  expect(box!.height).toBeGreaterThan(120);
  expect(box!.width / box!.height).toBeCloseTo(1.5, 1);
});

test('モバイルでは設定した焦点位置を適用する', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const position = await page.locator('main picture img').first().evaluate((image) => getComputedStyle(image).objectPosition);
  expect(position).toBe('58% 50%');
});
