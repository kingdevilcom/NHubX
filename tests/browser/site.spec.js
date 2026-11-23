import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://firestore.googleapis.com/**', (route) => route.abort());
  await page.route('**/api/country', (route) => route.fulfill({ json: { country: 'LK' } }));
});

test('homepage navigation loads pricing on demand', async ({ page, isMobile }) => {
  const modules = [];
  page.on('request', (request) => modules.push(request.url()));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'NHubX', exact: true, level: 1 })).toBeVisible();
  expect(modules.some((url) => /\/assets\/Pricing-/.test(url))).toBe(false);

  if (isMobile) {
    const toggle = page.getByRole('button', { name: /navigation/ });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
    await toggle.click();
  }

  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await navigation.getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('button', { name: 'Choose plan' })).toHaveCount(5);
  expect(modules.some((url) => /\/assets\/Pricing-/.test(url))).toBe(true);
});

test('pricing retains details after validation and restores keyboard focus', async ({ page }) => {
  await page.goto('/pricing');
  const opener = page.getByRole('button', { name: 'Choose plan' }).first();
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Mini' });
  await expect(dialog).toBeVisible();

  await dialog.getByLabel('Your name').fill('Test Visitor');
  await dialog.getByLabel('Email address').fill('visitor@example.com');
  const phone = dialog.getByRole('textbox', { name: 'WhatsApp number' });
  await phone.fill('12345');
  const submit = dialog.getByRole('button', { name: 'Send enquiry' });
  await submit.click();
  await expect(phone).toBeFocused();
  await expect.poll(() => phone.evaluate((element) => element.validationMessage)).toContain('valid WhatsApp');

  await phone.fill('077 123 4567');
  await expect.poll(() => phone.evaluate((element) => element.validationMessage)).toBe('');
  await expect(dialog.getByLabel('Your name')).toHaveValue('Test Visitor');
  await expect(dialog.getByLabel('Email address')).toHaveValue('visitor@example.com');
  await page.setViewportSize({ width: 360, height: 440 });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeInViewport();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});

test('the current fire palette applies with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2026-12-31T18:30:00Z'));
  await page.goto('/');
  await expect.poll(() => page.locator('html').evaluate((element) => element.style.getPropertyValue('--fire-primary'))).toBe('249 82 36');
  await expect(page.locator('canvas')).toHaveCount(0);
});
