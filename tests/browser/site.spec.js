import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://firestore.googleapis.com/**', (route) => route.abort());
  await page.route('**/api/country', (route) => route.fulfill({ json: { country: 'LK' } }));
});

test('homepage navigation loads pricing on demand', async ({ page, isMobile }) => {
  const modules = [];
  page.on('request', (request) => modules.push(request.url()));
  await page.addInitScript(() => {
    const observer = new MutationObserver(() => {
      const splash = document.querySelector('[role="status"][aria-label="Loading NHubX"]');
      if (splash?.textContent.includes('INITIALIZING SYSTEMS...') && /\b\d+%/.test(splash.textContent)) {
        document.documentElement.dataset.sawStartupSplash = 'true';
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-saw-startup-splash', 'true');
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
  const pricingChunk = Promise.withResolvers();
  await page.route('**/assets/Pricing-*.js', async (route) => {
    await pricingChunk.promise;
    await route.continue();
  });
  try {
    await navigation.getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page.getByRole('main').getByRole('status', { name: 'Loading page' })).toBeVisible();
    await expect(navigation).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading NHubX' })).toHaveCount(0);
  } finally {
    pricingChunk.resolve();
  }
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('button', { name: 'Choose plan' })).toHaveCount(5);
  expect(modules.some((url) => /\/assets\/Pricing-/.test(url))).toBe(true);
});

test('pricing retains details after validation and restores keyboard focus', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
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
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.locator('html').evaluate((element) => element.style.getPropertyValue('--fire-primary'))).toBe('249 82 36');
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('December shows a Santa hat and melts snow when a pointer approaches', async ({ page, isMobile }) => {
  await page.clock.setFixedTime(new Date('2026-12-15T10:00:00Z'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const action = page.getByRole('link', { name: 'View pricing' });
  await expect(action).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).locator('[data-logo-season="christmas"]')).toBeVisible();
  await expect(page.locator('canvas[data-seasonal-drift="christmas"]')).toBeVisible();
  await expect.poll(() => action.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe('1');
  if (!isMobile) {
    const box = await action.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y - 16);
    await expect(action).toHaveAttribute('data-snow-melting', '');
    await expect.poll(() => action.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe('0');
    await page.mouse.move(4, 4);
    await expect(action).not.toHaveAttribute('data-snow-melting', '');
  }
});

test('May shows Vesak lanterns and a pahan with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.setFixedTime(new Date('2026-05-15T10:00:00Z'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const footer = page.getByRole('contentinfo');
  await expect(footer.locator('.vesak-footer-lantern')).toBeVisible();
  await expect(footer.locator('.vesak-footer-pahan')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('project case studies show real screenshots and demo links', async ({ page }) => {
  await page.goto('/projects', { waitUntil: 'domcontentloaded' });
  const studies = page.getByRole('region', { name: 'Project case studies' });
  await expect(studies.getByRole('heading', { name: 'NextPath Advisory' })).toBeVisible({ timeout: 15_000 });
  await expect(studies.getByRole('heading', { name: 'RoutineX' })).toBeVisible();
  for (const image of await studies.getByRole('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
  }
  await expect(studies.getByRole('link', { name: /RoutineX live demo/ })).toHaveAttribute('href', 'https://routinex.nhubx.com/');
});

test('pricing comparison and FAQs clarify the plan costs and handover', async ({ page }) => {
  await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
  const comparison = page.getByRole('region', { name: 'Scrollable plan comparison' });
  const mini = comparison.getByRole('row', { name: /Mini/ });
  await expect(mini.getByRole('cell', { name: 'LKR 4,999' })).toBeVisible();
  await expect(mini.getByRole('cell', { name: 'LKR 499/year' })).toBeVisible();
  const question = page.getByText('Who owns the website and its accounts?', { exact: true });
  await question.click();
  await expect(page.getByText(/proposal will spell out what files and account access/)).toBeVisible();
});
