export const leadSources = Object.freeze({
  google: 'Google',
  social: 'Social media',
  outreach: 'Outreach',
  direct: 'Direct or unknown',
  referral: 'Other websites',
});

const socialSites = ['facebook.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'youtube.com', 'twitter.com', 'x.com'];
const sessionKey = 'nhubxLeadSource';
const sourceFooter = /\n\nNHubX enquiry source: (google|social|outreach|direct|referral)$/;
let recordedVisit = false;
let visitSource;

function matchesSite(host, domain) {
  return host === domain || host.endsWith('.' + domain);
}

export function classifyLeadSource(search, referrer) {
  const campaign = new URLSearchParams(search);
  const medium = campaign.get('utm_medium')?.toLowerCase();
  const source = campaign.get('utm_source')?.toLowerCase();
  if (medium === 'outreach' || source === 'nhubx_outreach') return 'outreach';
  if (source === 'google') return 'google';
  if (['social', 'social-media', 'paid_social'].includes(medium)) return 'social';

  let host;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'direct';
  }

  if (!host || matchesSite(host, 'nhubx.com')) return 'direct';
  if (/^google\.(?:com|[a-z]{2}|(?:com|co)\.[a-z]{2})$/.test(host)) return 'google';
  if (socialSites.some((domain) => matchesSite(host, domain)) || host === 't.co') return 'social';
  return 'referral';
}

export function currentLeadSource() {
  if (visitSource) return visitSource;
  try {
    const saved = window.sessionStorage.getItem(sessionKey);
    if (Object.hasOwn(leadSources, saved)) {
      visitSource = saved;
      return visitSource;
    }
  } catch {
    // Attribution can continue in memory when browser storage is unavailable.
  }
  visitSource = classifyLeadSource(window.location.search, document.referrer);
  return visitSource;
}

export function captureLeadVisit() {
  if (recordedVisit) return null;
  recordedVisit = true;
  const source = currentLeadSource();
  try {
    if (window.sessionStorage.getItem(sessionKey) === source) return null;
    window.sessionStorage.setItem(sessionKey, source);
  } catch {
    // The in-memory flag still prevents duplicate tracking on this page.
  }
  return source;
}

export function leadSourceEventPath(source, action) {
  if (!Object.hasOwn(leadSources, source) || !['visit', 'enquiry'].includes(action)) return null;
  return '/_events/lead-source/' + source + '/' + action;
}

export function withLeadSource(message, source) {
  return Object.hasOwn(leadSources, source) ? message + '\n\nNHubX enquiry source: ' + source : message;
}

export function readEnquirySource(message) {
  const match = sourceFooter.exec(message ?? '');
  return { source: match ? leadSources[match[1]] : null, message: match ? message.slice(0, match.index) : message };
}
