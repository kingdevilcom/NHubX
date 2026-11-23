export const enquiryStages = ['New', 'Replied', 'Closed'];

const plans = new Set(['Mini', 'Launch Bundle', 'Starter', 'Business', 'Advanced']);

export function getEnquiryPlan(message) {
  const header = message?.split(/\r?\n/, 1)[0];
  const plan = /^Pricing plan enquiry: (.+)$/.exec(header)?.[1];
  return plans.has(plan) ? plan : null;
}

export function getEnquiryStage(stage) {
  return enquiryStages.includes(stage) ? stage : 'New';
}

export const pricingEventPaths = Object.freeze({
  visit: '/pricing',
  open: '/_events/pricing/open',
  submitted: '/_events/pricing/submitted',
  whatsappHome: '/_events/enquiry/whatsapp-home',
  whatsappPricing: '/_events/enquiry/whatsapp-pricing',
  whatsappService: '/_events/enquiry/whatsapp-service',
});

export const isAnalyticsEventPath = (path) => path?.startsWith('/_events/');

export function summarizeRecentEnquiries(events, now = new Date()) {
  const cutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  let visits = 0;
  let opens = 0;
  let sent = 0;

  for (const event of events) {
    const time = event.timestamp?.toMillis?.();
    if (!Number.isFinite(time) || time < cutoff || time > now.getTime()) continue;
    if (event.path === pricingEventPaths.visit) visits += 1;
    if (event.path === pricingEventPaths.open) opens += 1;
    if (event.path === pricingEventPaths.submitted) sent += 1;
  }

  return {
    opensPer100Visits: visits ? opens / visits * 100 : null,
    submissionsPer100Opens: opens ? sent / opens * 100 : null,
  };
}
