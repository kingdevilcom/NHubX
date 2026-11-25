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
  await expect(page.getByRole('heading', { name: 'Custom websites for Sri Lankan small businesses', level: 1 })).toBeVisible();
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

test('pricing shows inline errors, retains details offline, and restores keyboard focus', async ({ page, context }) => {
  test.setTimeout(60_000);
  await page.goto('/pricing', { waitUntil: 'domcontentloaded' });
  const opener = page.getByRole('button', { name: 'Choose plan' }).first();
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Mini' });
  await expect(dialog).toBeVisible();

  const submit = dialog.getByRole('button', { name: 'Send enquiry' });
  await submit.click();
  await expect(dialog.getByRole('alert')).toContainText('Enter at least two characters');
  await dialog.getByLabel('Your name').fill('Test Visitor');
  const email = dialog.getByLabel('Email address');
  await email.fill('visitor@');
  await submit.click();
  await expect(email).toBeFocused();
  await expect(dialog.getByRole('alert')).toContainText('Enter a valid email address');
  await email.fill('visitor@example.com');
  const phone = dialog.getByRole('textbox', { name: 'WhatsApp number' });
  await expect(phone).toBeHidden();
  await dialog.getByText(/Add a WhatsApp number/).click();
  await phone.fill('12345');
  await submit.click();
  await expect(phone).toBeFocused();
  await expect(phone).toHaveAttribute('aria-invalid', 'true');
  await expect(dialog.getByRole('alert')).toContainText('valid WhatsApp number');

  await phone.clear();
  await expect(dialog.getByRole('alert')).toHaveCount(0);
  await expect(dialog.getByLabel('Your name')).toHaveValue('Test Visitor');
  await expect(dialog.getByLabel('Email address')).toHaveValue('visitor@example.com');
  await page.setViewportSize({ width: 360, height: 440 });
  await submit.scrollIntoViewIfNeeded();
  await expect(submit).toBeInViewport();

  await context.setOffline(true);
  await submit.click();
  await expect(dialog.getByRole('alert')).toContainText('You’re offline');
  await expect(email).toHaveValue('visitor@example.com');
  await context.setOffline(false);

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

test('homepage turns a starting-price offer into a Mini quote or WhatsApp enquiry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const main = page.getByRole('main');
  await expect(main.getByText('LKR 4,999', { exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: /NextPath Advisory live demo/ })).toHaveAttribute('href', 'https://nextpath.profhelper.com');
  const whatsapp = new URL(await main.getByRole('link', { name: 'Chat on WhatsApp' }).getAttribute('href'));
  expect(whatsapp.origin).toBe('https://wa.me');
  expect(whatsapp.searchParams.get('text')).toContain('Mini website plan');

  await main.getByRole('link', { name: 'Get a quote' }).click();
  await expect(page).toHaveURL(/\/pricing\?plan=Mini$/);
  const dialog = page.getByRole('dialog', { name: 'Mini' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute('href', whatsapp.href);
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  const examples = page.getByRole('region', { name: 'See what we can build' });
  await expect(examples.getByRole('heading', { name: 'RoutineX' })).toBeVisible();
  const starter = main.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Starter', exact: true }) });
  const starterChat = new URL(await starter.getByRole('link', { name: 'Chat on WhatsApp' }).getAttribute('href'));
  expect(starterChat.searchParams.get('text')).toContain('Starter website plan');
});

test('service business landing page keeps outreach attribution through the quote link', async ({ page }) => {
  await page.goto('/websites-for-service-businesses?utm_source=nhubx_outreach&utm_medium=outreach', { waitUntil: 'domcontentloaded' });
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { name: 'Websites for Sri Lankan service businesses' })).toBeVisible({ timeout: 15_000 });
  await expect(main.getByText('From LKR 4,999', { exact: true })).toBeVisible();
  await expect(main.getByRole('link', { name: 'View NextPath live demo' })).toHaveAttribute('href', 'https://nextpath.profhelper.com');
  await main.getByRole('link', { name: 'Get a quote' }).click();
  await expect(page.getByRole('dialog', { name: 'Mini' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('nhubxLeadSource'))).toBe('outreach');
});

test('order portal requires sign-in before showing customer records', async ({ page }) => {
  await page.goto('/orders', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'My orders' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  await expect(page.getByText('Balance due', { exact: true })).toHaveCount(0);
});

test('admin sign-in preserves a quote creation deep link', async ({ page }) => {
  await page.goto('/admin?tab=orders&enquiry=example', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'NHubX Admin' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
  await expect(page).toHaveURL(/\?tab=orders&enquiry=example$/);
  await expect(page.getByRole('button', { name: 'Create and send quote' })).toHaveCount(0);
});

test('admin groups sections and preserves order and email navigation', async ({ page, isMobile }) => {
  const email = 'stharunindu@gmail.com';
  await page.addInitScript(({ email }) => {
    const getItem = Storage.prototype.getItem;
    const token = 'eyJhbGciOiJub25lIn0.' + btoa(JSON.stringify({ sub: 'admin-fixture', firebase: { sign_in_provider: 'google.com' } })) + '.signature';
    Storage.prototype.getItem = function (key) {
      return getItem.call(this, key) ?? (key.startsWith('firebase:authUser:') ? JSON.stringify({
        uid: 'admin-fixture', email, emailVerified: true, isAnonymous: false, providerData: [],
        stsTokenManager: { accessToken: token, refreshToken: 'fixture', expirationTime: Date.now() + 3_600_000 },
      }) : null);
    };
  }, { email });
  await page.route('https://identitytoolkit.googleapis.com/**', (route) => route.fulfill({
    json: { users: [{ localId: 'admin-fixture', email, emailVerified: true, displayName: 'Admin fixture' }] },
  }));
  await page.route('**/api/orders', (route) => {
    const { action } = route.request().postDataJSON();
    const result = action === 'adminEmailConfig'
      ? { configured: true, senderDomain: 'email.nhubx.com', senderAddress: 'orders@email.nhubx.com', recipientLimit: 25 }
      : action === 'adminMailboxList' ? { items: [], next: null } : action === 'list' ? [{
        id: 'fixture-order', orderNumber: 'NHX-00001', title: 'Example website', stage: 'Accepted',
        customerName: 'Example customer', customerEmail: 'client@example.com',
        total: 5000, paid: 0, deposit: 1000, services: [], timeline: [], receipts: [],
      }] : [];
    return route.fulfill({ json: { result } });
  });

  await page.goto('/admin?tab=orders&enquiry=example');
  await expect(page.getByRole('heading', { name: 'Orders', exact: true })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Create and send quote' })).toBeVisible();
  await expect(page.getByText('Development payments', { exact: true })).toBeVisible();
  await expect(page.getByText('Annual services and renewals', { exact: true })).toBeVisible();
  const navigation = page.getByRole('navigation', { name: 'Admin sections' });
  if (isMobile) {
    const toggle = page.getByRole('button', { name: /Admin sections Orders/i });
    await toggle.click();
    await expect(navigation).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
    await toggle.click();
  }
  await expect(navigation.getByText('Communication', { exact: true })).toBeVisible();
  await expect(navigation.getByText('Website', { exact: true })).toBeVisible();
  await navigation.getByRole('link', { name: 'Email', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\?tab=email$/);
  await expect(page.getByRole('heading', { name: 'Compose email' })).toBeVisible();
  if (isMobile) await expect(page.getByRole('button', { name: /Admin sections Email/i })).toHaveAttribute('aria-expanded', 'false');
  else await expect(navigation.getByRole('link', { name: 'Email', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Inbox', exact: true }).click();
  await expect(page.getByText('No email received by Resend yet.')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize().width);
});

test('reviews page explains when there are no verified reviews', async ({ page }) => {
  await page.route('**/api/reviews', (route) => route.fulfill({ json: { count: 0, average: null, reviews: [], next: null } }));
  await page.goto('/reviews');
  await expect(page.getByRole('heading', { name: 'Customer reviews' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('No verified customer reviews have been published yet.')).toBeVisible();
});

test('contact lists Matara and opens a city-level map', async ({ page }) => {
  await page.goto('/contact');
  const map = page.getByRole('link', { name: 'Matara, Sri Lanka on Google Maps (opens in a new tab)' });
  await expect(map).toBeVisible({ timeout: 15_000 });
  await expect(map).toHaveAttribute('href', /query=Matara%2C%20Sri%20Lanka$/);
  await expect(page.getByRole('contentinfo').getByText('Matara, Sri Lanka')).toBeVisible();
});
