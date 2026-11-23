import assert from 'node:assert/strict';
import test from 'node:test';
import { fireThemeVariables, monthlyFireThemes, nextFireThemeChange, resolveFireTheme } from '../src/fireTheme.js';
import { preparePlanEnquiry } from '../src/planEnquiry.js';
import { seasonalMotifs } from '../src/seasonalMotifs.js';
import { getEnquiryPlan, getEnquiryStage, isAnalyticsEventPath, pricingEventPaths } from '../src/enquiryTracking.js';

test('all twelve palettes can rotate automatically or stay pinned', () => {
  assert.equal(new Set(monthlyFireThemes.map(({ primary }) => primary)).size, 12);
  assert.equal(new Set(monthlyFireThemes.map(({ season }) => season)).size, 12);
  for (const [index, theme] of monthlyFireThemes.entries()) {
    assert.ok(seasonalMotifs[theme.season]);
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
});
