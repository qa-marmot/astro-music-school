import { test, expect } from '@playwright/test';

async function fillTrialForm(page: import('@playwright/test').Page) {
  await page.getByLabel(/お名前/).fill('山田 花子');
  await page.getByLabel(/メールアドレス/).fill('hanako@example.com');
  await page.getByLabel(/ご希望の楽器/).selectOption('piano');
  await page.getByLabel(/プライバシーポリシー/).check();
}

test('trial queryで4コースだけを事前選択する', async ({ page }) => {
  await page.goto('/trial?instrument=violin');
  await expect(page.getByLabel(/ご希望の楽器/)).toHaveValue('violin');
  await page.goto('/trial?instrument=flute');
  await expect(page.getByLabel(/ご希望の楽器/)).toHaveValue('');
});

test('必須項目のエラーをフィールドへ関連付ける', async ({ page }) => {
  await page.goto('/trial');
  await page.getByTestId('trial-submit-btn').click();
  await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#name-error')).toBeVisible();
  await expect(page.locator('#privacy-error')).toBeVisible();
  await expect(page.locator('#name')).toBeFocused();
});

test('送信先未設定では成功表示にしない', async ({ page }) => {
  await page.goto('/trial');
  await fillTrialForm(page);
  await page.getByTestId('trial-submit-btn').click();
  await expect(page.getByText('デモのため送信されません').first()).toBeVisible();
  await expect(page.locator('#trial-success')).toBeHidden();
});

test('trialはAPI 2xxの後だけ成功表示する', async ({ page }) => {
  let payload: Record<string, unknown> | undefined;
  await page.route('**/form-test', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 204 });
  });
  await page.goto('/trial');
  await page.locator('#trial-form').evaluate((form) => (form as HTMLFormElement).dataset.endpoint = '/form-test');
  await fillTrialForm(page);
  await page.getByTestId('trial-submit-btn').click();
  await expect(page.locator('#trial-success')).toBeVisible();
  expect(payload?.type).toBe('trial');
  expect(payload?.instrument).toBe('piano');
});

test('trialはAPI 5xxをエラー表示する', async ({ page }) => {
  await page.route('**/form-test', (route) => route.fulfill({ status: 500 }));
  await page.goto('/trial');
  await page.locator('#trial-form').evaluate((form) => (form as HTMLFormElement).dataset.endpoint = '/form-test');
  await fillTrialForm(page);
  await page.getByTestId('trial-submit-btn').click();
  await expect(page.locator('#trial-submit-error')).toBeVisible();
  await expect(page.locator('#trial-success')).toBeHidden();
});

test('contactもAPI 2xxの後だけ成功表示する', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/form-test', async (route) => {
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 100));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
  await page.goto('/contact');
  await page.locator('#contact-form').evaluate((form) => (form as HTMLFormElement).dataset.endpoint = '/form-test');
  await page.getByLabel(/お名前/).fill('山田 花子');
  await page.getByLabel(/メールアドレス/).fill('hanako@example.com');
  await page.getByLabel(/お問い合わせ種別/).selectOption('lesson');
  await page.getByLabel(/お問い合わせ内容/).fill('レッスンについて質問があります。');
  await page.getByLabel(/プライバシーポリシー/).check();
  const submit = page.getByTestId('contact-submit-btn');
  await submit.dblclick();
  await expect(page.locator('#contact-success')).toBeVisible();
  expect(requestCount).toBe(1);
});
