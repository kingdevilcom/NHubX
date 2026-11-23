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
});

export const isAnalyticsEventPath = (path) => path?.startsWith('/_events/');
