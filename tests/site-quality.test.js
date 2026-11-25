import assert from 'node:assert/strict';
import test from 'node:test';
import { fireThemeVariables, monthlyFireThemes, nextFireThemeChange, resolveFireTheme } from '../src/fireTheme.js';
import { preparePlanEnquiry } from '../src/planEnquiry.js';
import { getEnquiryPlan, getEnquiryStage, isAnalyticsEventPath, pricingEventPaths, summarizeRecentEnquiries } from '../src/enquiryTracking.js';
import { entryPlan, whatsappEnquiryUrl } from '../src/salesOffer.js';
import { classifyLeadSource, leadSourceEventPath, readEnquirySource, withLeadSource } from '../src/leadSource.js';
import { sendEnquiryAlert } from '../functions/enquiryAlert.js';
import { orderTemplateType, renderEmail } from '../functions/emailTemplates.js';
import { orderApi } from '../server/orders.js';
import { allocateOrderNumber, assignMissingOrderNumbers } from '../server/orderNumbers.js';
import { orderEmailSummary } from '../server/orderJobs.js';
import { billingRecord, renderBillingRecord } from '../src/billingRecord.js';
import { filterAdminOrders, needsCustomerAction, upcomingRenewals } from '../src/orderWorkspace.js';
import { customerOrder, nextAnnualDate, reminderDays } from '../server/orderModel.js';

test('all twelve palettes can rotate automatically or stay pinned', () => {
  assert.equal(new Set(monthlyFireThemes.map(({ primary }) => primary)).size, 12);
  for (const [index, theme] of monthlyFireThemes.entries()) {
    assert.equal(resolveFireTheme('auto', new Date(Date.UTC(2026, index, 15))), theme);
    assert.equal(resolveFireTheme(String(index + 1)), theme);
  }
  assert.equal(fireThemeVariables(resolveFireTheme('original'))['--fire-primary'], '255 60 0');
  assert.equal(resolveFireTheme('unknown'), resolveFireTheme('auto'));
});

test('automatic rotation and its displayed upcoming change agree at Sri Lanka midnight', () => {
  const before = new Date('2026-12-31T18:29:59Z');
  const change = nextFireThemeChange(before);
  assert.equal(change.toISOString(), '2026-12-31T18:30:00.000Z');
  assert.equal(resolveFireTheme('auto', before), monthlyFireThemes[11]);
  assert.equal(resolveFireTheme('auto', change), monthlyFireThemes[0]);
  assert.equal(nextFireThemeChange(change).toISOString(), '2027-01-31T18:30:00.000Z');
});

function luminance(rgb) {
  const values = rgb.split(' ').map((channel) => {
    const value = Number(channel) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}

test('each fire preset clears 4.5:1 for dark button text and accent text on the base surface', () => {
  for (const theme of [resolveFireTheme('original'), ...monthlyFireThemes]) {
    const colors = [theme.primary, theme.secondary, theme.hover ?? theme.secondary];
    for (const color of colors) {
      assert.ok((luminance(color) + 0.05) / (luminance('16 6 0') + 0.05) >= 4.5, theme.name + ' button contrast');
      assert.ok((luminance(color) + 0.05) / (luminance('18 18 18') + 0.05) >= 4.5, theme.name + ' text contrast');
    }
  }
});

const plan = { name: 'Mini', price: '4,999', hosting: 'LKR 499/year' };
const form = { name: '  Test Visitor  ', country: 'LK', whatsapp: '077 123 4567', email: 'visitor@example.com', details: '  A portfolio  ' };

test('pricing enquiries validate input, normalize the number, and retain the requested plan', () => {
  assert.equal(preparePlanEnquiry(plan, { ...form, name: '  ' }).field, 'name');
  assert.equal(preparePlanEnquiry(plan, { ...form, whatsapp: '12345' }).field, 'whatsapp');
  assert.equal(preparePlanEnquiry(plan, { ...form, email: 'visitor@' }).field, 'email');
  assert.match(preparePlanEnquiry(plan, { ...form, whatsapp: '' }).message, /WhatsApp: Not provided/);
  const enquiry = preparePlanEnquiry(plan, form);
  assert.equal(enquiry.name, 'Test Visitor');
  assert.match(enquiry.message, /Pricing plan enquiry: Mini/);
  assert.match(enquiry.message, /WhatsApp: \+94 77 123 4567/);
  assert.match(enquiry.message, /Project details: A portfolio/);
  assert.equal(preparePlanEnquiry(plan, { ...form, whatsapp: '+94 77 123 4567' }).message, enquiry.message);
});

test('older enquiries retain their plan and default to New', () => {
  assert.equal(getEnquiryPlan(preparePlanEnquiry(plan, form).message), 'Mini');
  assert.equal(getEnquiryPlan('Hello, I am interested in a custom site'), null);
  assert.equal(getEnquiryStage(undefined), 'New');
  assert.equal(getEnquiryStage('Replied'), 'Replied');
  assert.equal(getEnquiryStage('Closed'), 'Closed');
});

test('pricing interaction paths are fixed and excluded from ordinary view totals', () => {
  assert.equal(pricingEventPaths.visit, '/pricing');
  assert.equal(isAnalyticsEventPath(pricingEventPaths.visit), false);
  assert.equal(isAnalyticsEventPath(pricingEventPaths.open), true);
  assert.equal(isAnalyticsEventPath(pricingEventPaths.submitted), true);
  assert.equal(isAnalyticsEventPath(pricingEventPaths.whatsappHome), true);
  assert.equal(isAnalyticsEventPath(pricingEventPaths.whatsappPricing), true);
});

test('recent enquiry ratios use the same date range and exclude WhatsApp clicks', () => {
  const now = new Date('2026-11-23T12:00:00Z');
  const event = (eventName, date = now) => ({ path: pricingEventPaths[eventName], timestamp: { toMillis: () => date.getTime() } });
  const activity = ['visit', 'visit', 'open', 'submitted', 'whatsappHome', 'whatsappPricing'].map((name) => event(name));
  activity.push(event('visit', new Date('2026-11-15T12:00:00Z')));
  assert.deepEqual(summarizeRecentEnquiries(activity, now), { opensPer100Visits: 50, submissionsPer100Opens: 100 });
  assert.deepEqual(summarizeRecentEnquiries([], now), { opensPer100Visits: null, submissionsPer100Opens: null });
});

test('WhatsApp uses the existing business number and prefills the selected plan', () => {
  const url = new URL(whatsappEnquiryUrl(entryPlan.name));
  assert.equal(url.hostname, 'wa.me');
  assert.equal(url.pathname, '/94740356525');
  assert.match(url.searchParams.get('text'), /Mini website plan/);
  assert.match(new URL(whatsappEnquiryUrl('Launch Bundle')).searchParams.get('text'), /Launch Bundle website plan/);
});

test('lead attribution stores categories and preserves the original enquiry', () => {
  assert.equal(classifyLeadSource('?utm_medium=outreach&tracking=personal', 'https://google.lk/search'), 'outreach');
  assert.equal(classifyLeadSource('', 'https://www.google.lk/search?q=personal'), 'google');
  assert.equal(classifyLeadSource('', 'https://l.instagram.com/example'), 'social');
  assert.equal(classifyLeadSource('', 'https://instagram.com.example.test/'), 'referral');
  assert.equal(classifyLeadSource('', 'https://www.nhubx.com/pricing'), 'direct');
  assert.equal(classifyLeadSource('', ''), 'direct');
  assert.equal(leadSourceEventPath('raw campaign string', 'enquiry'), null);
  assert.equal(leadSourceEventPath('outreach', 'enquiry'), '/_events/lead-source/outreach/enquiry');
  const message = preparePlanEnquiry(plan, form).message;
  assert.deepEqual(readEnquirySource(withLeadSource(message, 'google')), { source: 'Google', message });
  assert.deepEqual(readEnquirySource(message), { source: null, message });
});

test('enquiry alerts share a five-minute idempotency key and contain only an inbox notice', async () => {
  const requests = [];
  const request = async (url, options) => {
    requests.push({ url, headers: options.headers, body: JSON.parse(options.body) });
    return { ok: true };
  };
  const config = { from: 'alerts@example.com', to: 'owner@example.com', apiKey: 'test-only' };
  const now = Date.parse('2026-11-23T12:03:00Z');
  for (const createdAt of ['2026-11-23T12:01:00Z', '2026-11-23T12:02:00Z', '2026-11-23T10:00:00Z']) {
    await sendEnquiryAlert({ ...config, createdAt }, { now, request });
  }
  assert.equal(requests.length, 2);
  assert.deepEqual(requests[0], requests[1]);
  assert.equal(requests[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(requests[0].body.to, ['owner@example.com']);
  assert.match(requests[0].body.text, /https:\/\/www\.nhubx\.com\/admin/);
  assert.match(requests[0].body.html, /Private admin notice/);
});

test('each email template includes a branded HTML version and accessible plain text', () => {
  for (const type of ['quote', 'update', 'payment', 'renewal', 'message', 'enquiry']) {
    const { html, text } = renderEmail({ type, subject: '<Test subject>', message: 'First & second\n<script>bad</script>', details: [['Amount', 'LKR 499']] });
    const link = type === 'enquiry' ? 'https://www.nhubx.com/admin' : 'https://www.nhubx.com/orders';
    assert.ok(html.includes(link));
    assert.ok(text.includes(link));
    assert.match(html, /nhubx-logo\.png/);
    assert.match(html, /First &amp; second<br>&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>/);
    assert.match(text, /Amount: LKR 499/);
  }
  assert.equal(orderTemplateType({ subject: 'NHubX order update', message: 'Development payment confirmed.' }), 'payment');
});

test('renewal dates and customer projections keep private order fields out', () => {
  assert.equal(nextAnnualDate('2028-02-29'), '2029-02-28');
  assert.equal(reminderDays('2027-01-01', '2026-12-02'), 30);
  const visible = customerOrder({ title: 'Website', privateNotes: 'internal', customerEmail: 'owner@example.com', arbitraryInternalField: true });
  assert.equal(visible.title, 'Website');
  assert.equal('privateNotes' in visible, false);
  assert.equal('customerEmail' in visible, false);
  assert.equal('arbitraryInternalField' in visible, false);
});

test('order transactions handle renewal retries, delivery feedback, private chat and verified reviews', async () => {
  const id = 'abc';
  const records = new Map([['orders/' + id, {
    customerEmail: 'customer@example.com', stage: 'Delivered', timeline: [], receipts: [],
    services: [{ id: 'hosting', type: 'Hosting', dueDate: '2027-04-01', amount: 499 }],
  }]]);
  const collection = (path) => ({ doc: (name = "generated-public-id") => {
    const full = path + '/' + name;
    return { id: name, path: full, collection: (segment) => collection(full + '/' + segment) };
  }, orderBy: (field, direction) => {
    const sort = direction === 'asc' ? 1 : -1;
    let cursor;
    const query = {
      startAfter(value) { cursor = value; return query; },
      limit(size) {
        const docs = [...records.entries()]
          .filter(([key, item]) => key.startsWith(path + '/') && (cursor === undefined || (item[field] - cursor) * sort > 0))
          .sort(([, a], [, b]) => (a[field] - b[field]) * sort)
          .slice(0, size)
          .map(([key, item]) => ({ id: key.split('/').at(-1), data: () => item }));
        return { queryResult: { docs, size: docs.length } };
      },
    };
    return query;
  } });
  const snapshot = (ref) => ({ id: ref.id, exists: records.has(ref.path), data: () => records.get(ref.path) });
  const db = { collection, runTransaction: (callback) => callback({
    get: async (ref) => ref.queryResult ?? snapshot(ref),
    getAll: async (...refs) => refs.map(snapshot),
    set: (ref, value) => records.set(ref.path, value),
    create: (ref, value) => records.set(ref.path, value),
    update: (ref, value) => records.set(ref.path, { ...records.get(ref.path), ...value }),
  }) };
  const admin = { email: 'stharunindu@gmail.com', email_verified: true, uid: 'admin' };
  const payment = { action: 'renewal', id, serviceId: 'hosting', cycle: '2027-04-01', operation: '12345678-1234-1234-1234-123456789abc' };
  await assert.rejects(orderApi(db, { email: 'customer@example.com', email_verified: true }, payment), { code: 'permission-denied' });
  await orderApi(db, admin, payment);
  await orderApi(db, admin, payment);
  await assert.rejects(orderApi(db, admin, { ...payment, operation: '22345678-1234-1234-1234-123456789abc' }), /already changed/);
  const final = records.get('orders/' + id);
  assert.equal(final.services[0].dueDate, '2028-04-01');
  assert.equal(final.receipts.length, 1);
  assert.equal(final.receipts[0].amount, 499);
  const send = { action: 'sendEmail', id, subject: 'Next step', message: 'Please review the draft.', to: 'wrong@example.com', operation: '32345678-1234-1234-1234-123456789abc' };
  await assert.rejects(orderApi(db, { email: 'customer@example.com', email_verified: true }, send), { code: 'permission-denied' });
  await orderApi(db, admin, send);
  await orderApi(db, admin, send);
  assert.equal(records.get('orderEmails/' + id + '-' + send.operation).to, 'customer@example.com');
  assert.equal([...records.keys()].filter((path) => path.startsWith('orderEmails/')).length, 2);

  records.set('orders/review', { customerEmail: 'customer@example.com', stage: 'Review', timeline: [], title: 'Review project' });
  const customer = { email: 'customer@example.com', email_verified: true, uid: 'customer' };
  const feedback = { action: 'requestChanges', id: 'review', message: 'Please update the homepage.', operation: '42345678-1234-1234-1234-123456789abc' };
  await assert.rejects(orderApi(db, { ...customer, email: 'another@example.com' }, feedback), { code: 'permission-denied' });
  await orderApi(db, customer, feedback);
  const approval = { action: 'approveDelivery', id: 'review', operation: '52345678-1234-1234-1234-123456789abc' };
  await assert.rejects(orderApi(db, customer, approval), /not awaiting delivery approval/);
  assert.equal(records.get('orders/review').revisionRequest.status, 'pending');
  assert.equal(needsCustomerAction(records.get('orders/review')), false);
  assert.equal(filterAdminOrders([records.get('orders/review')], '', 'revision').length, 1);
  const update = { action: 'resubmitDelivery', id: 'review', deliveryUrl: 'https://example.com/updated', response: 'Homepage updated.', operation: '62345678-1234-1234-1234-123456789abc' };
  await assert.rejects(orderApi(db, customer, update), { code: 'permission-denied' });
  await orderApi(db, admin, update);
  assert.equal(records.get('orders/review').revisionRequest.status, 'addressed');
  assert.equal(needsCustomerAction(records.get('orders/review')), true);
  assert.equal(records.get('orderEmails/review-' + update.operation).pending, true);
  await orderApi(db, customer, approval);
  assert.equal(records.get('orders/review').stage, 'Delivered');

  const outsider = { ...customer, uid: 'wrong-user' };
  const message = { ...feedback, action: 'chatSend', admin: true };
  await assert.rejects(orderApi(db, outsider, message), { code: 'permission-denied' });
  await orderApi(db, customer, message);
  await orderApi(db, customer, message);
  assert.equal(records.get('orders/review/chat/' + message.operation).role, 'customer');
  assert.equal(records.get('orders/review').chat.adminUnread, 1);
  assert.equal(filterAdminOrders([records.get('orders/review')], '', 'unread').length, 1);
  for (let sequence = 2; sequence <= 37; sequence++) {
    records.set('orders/review/chat/message-' + sequence, { sequence, text: 'Stored message', role: 'customer' });
  }
  records.get('orders/review').chat = { sequence: 37, adminUnread: 37 };
  const chat = { action: 'chatList', id: 'review', admin: true };
  await assert.rejects(orderApi(db, outsider, chat), { code: 'permission-denied' });
  const first = await orderApi(db, admin, { ...chat, after: 1 });
  assert.deepEqual(first.messages.map((item) => item.sequence), Array.from({ length: 30 }, (_, i) => i + 2));
  assert.equal(first.more, true);
  assert.equal(records.get('orders/review').chat.adminUnread, 37);
  const latest = await orderApi(db, admin, { ...chat, after: 31 });
  assert.equal(latest.messages.at(-1).sequence, 37);
  assert.equal(latest.more, false);
  assert.equal(records.get('orders/review').chat.adminUnread, 0);

  const review = { action: 'submitReview', id: 'review', rating: 2, display: 'anonymous', consent: true, comment: 'The files were delivered but the timeline slipped.' };
  await assert.rejects(orderApi(db, outsider, review), { code: 'permission-denied' });
  await assert.rejects(orderApi(db, customer, { ...review, consent: false }), { code: 'invalid-argument' });
  await orderApi(db, customer, review);
  await assert.rejects(orderApi(db, customer, review), /already been submitted/);
  assert.equal(records.has('publishedOrderReviews/generated-public-id'), false);
  const publish = { action: 'moderateReview', id: 'review', status: 'published' };
  await assert.rejects(orderApi(db, customer, publish), { code: 'permission-denied' });
  await orderApi(db, admin, { ...publish, status: 'withheld', reason: 'Personal information' });
  assert.equal(records.get('orders/review').reviewStatus, 'withheld');
  await orderApi(db, customer, { ...review, resubmit: true });
  assert.equal(records.get('orders/review').reviewModerationReason, null);
  await assert.rejects(orderApi(db, admin, { ...publish, createdAt: '2026-01-01T00:00:00.000Z' }), /review has changed/);
  await orderApi(db, admin, publish);
  await orderApi(db, admin, publish);
  const published = records.get('publishedOrderReviews/generated-public-id');
  assert.deepEqual(Object.keys(published).sort(), ['comment', 'displayName', 'publishedAt', 'rating']);
  assert.equal(published.rating, 2);
  await assert.rejects(orderApi(db, customer, { ...review, resubmit: true }), /already been submitted/);
  assert.deepEqual(records.get('reviewMetadata/totals'), { count: 1, ratingSum: 2 });
});

test('order emails distinguish provider acceptance from delivery and expose no message body', () => {
  const record = { subject: 'Quote', to: 'customer@example.com', message: 'Private message', pending: true };
  assert.equal(orderEmailSummary('quote', record).status, 'Queued');
  const sent = { ...record, sentAt: '2026-11-24', resendEmailId: 'email-id' };
  assert.equal(orderEmailSummary('quote', sent).status, 'Accepted by Resend');
  const delivered = orderEmailSummary('quote', { ...sent, resendEvent: 'delivered' });
  assert.equal(delivered.status, 'Delivered');
  assert.equal('message' in delivered, false);
});

test('billing records show the correct amounts and escape customer and project text', () => {
  const order = { id: 'order-1', title: 'My <script> website', customerName: 'A & B', total: 4999, deposit: 2000, paid: 2000, createdAt: '2026-11-24T00:00:00Z' };
  const development = renderBillingRecord(billingRecord(order, 'development'));
  assert.match(development, /Balance due<\/th><td>LKR 2,999/);
  assert.match(development, /A &amp; B/);
  assert.doesNotMatch(development, /<script>/);
  const renewal = billingRecord(order, 'renewal', { id: 'hosting', type: 'Hosting', dueDate: '2027-11-24', amount: 499 });
  assert.equal(renewal.reference, 'REN-hosting-2027-11-24');
  assert.deepEqual(renewal.totals, [['Amount due', 499]]);
  const receipt = billingRecord(order, 'receipt', { id: 'abc', label: 'Development payment', at: '2026-11-23T19:00:00Z', amount: 2000 });
  assert.equal(receipt.date, '24 Nov 2026');
  assert.deepEqual(receipt.totals, [['Received', 2000]]);
});

test('order search and renewal priorities stay scoped to their intended status', () => {
  const orders = [
    { id: 'first', title: 'Portfolio', customerName: 'Maya', stage: 'Review', services: [{ id: 'old', dueDate: '2026-11-10' }] },
    { id: 'second', title: 'Shop', customerName: 'Hari', customerEmail: 'client@example.com', stage: 'Delivered', services: [{ id: 'soon', dueDate: '2026-12-24' }, { id: 'later', dueDate: '2026-12-25' }] },
  ];
  assert.deepEqual(filterAdminOrders(orders, ' client@ ', 'Delivered'), [orders[1]]);
  assert.deepEqual(filterAdminOrders(orders, 'client@', 'Review'), []);
  assert.deepEqual(orders.filter(needsCustomerAction), [orders[0]]);
  assert.deepEqual(upcomingRenewals(orders, '2026-11-24').map(({ id, overdue }) => [id, overdue]), [['old', true], ['soon', false]]);
});

test('existing orders receive sequential numbers once without replacing their IDs', async () => {
  assert.deepEqual(allocateOrderNumber(0), { number: 1, reference: 'NHX-00001' });
  assert.deepEqual(allocateOrderNumber(99999), { number: 100000, reference: 'NHX-100000' });
  const orders = new Map([
    ['orders/legacy-a', { createdAt: '2026-01-01' }],
    ['orders/legacy-b', { createdAt: '2026-01-02' }],
  ]);
  const doc = (path) => ({ path, id: path.split('/').at(-1) });
  const snapshot = (ref) => {
    const value = orders.get(ref.path);
    return { id: ref.id, ref, exists: Boolean(value), data: () => value };
  };
  const db = {
    collection: (path) => ({ doc: (id) => doc(path + '/' + id) }),
    runTransaction: (work) => work({
      getAll: async (...refs) => refs.map(snapshot),
      update: (ref, values) => orders.set(ref.path, { ...orders.get(ref.path), ...values }),
      set: (ref, value) => orders.set(ref.path, value),
    }),
  };
  const staleSnapshots = [snapshot(doc('orders/legacy-b')), snapshot(doc('orders/legacy-a'))];
  const assigned = await assignMissingOrderNumbers(db, staleSnapshots);
  assert.deepEqual([...assigned], [['legacy-a', 'NHX-00001'], ['legacy-b', 'NHX-00002']]);
  assert.deepEqual([...await assignMissingOrderNumbers(db, staleSnapshots)], [...assigned]);
  assert.equal(orders.get('orderMetadata/numberSequence').lastNumber, 2);
});

test('numbered orders use the same readable reference across search and billing', () => {
  const receipt = { id: 'private-uuid', label: 'Development payment', at: '2026-11-24T00:00:00Z', amount: 500 };
  const hosting = { id: 'another-private-uuid', type: 'Hosting', amount: 499, dueDate: '2027-11-24' };
  const order = { id: 'legacy-id', orderNumber: 'NHX-00008', title: 'Website', total: 4999, paid: 500, receipts: [receipt], services: [hosting] };
  assert.deepEqual(filterAdminOrders([order], 'nhx-00008', ''), [order]);
  assert.deepEqual(filterAdminOrders([order], 'INV-00008', ''), [order]);
  assert.deepEqual(filterAdminOrders([order], 'REN-00008-01-2027', ''), [order]);
  assert.equal(billingRecord(order, 'development').reference, 'INV-00008');
  assert.equal(billingRecord(order, 'renewal', hosting).reference, 'REN-00008-01-2027');
  assert.equal(billingRecord(order, 'receipt', receipt).reference, 'RCT-00008-01');
  assert.doesNotMatch(renderBillingRecord(billingRecord(order, 'receipt', receipt)), /private-uuid|legacy-id/);
});
