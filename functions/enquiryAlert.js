import { renderEmail } from './emailTemplates.js';

const fiveMinutes = 5 * 60 * 1000;
const oneHour = 60 * 60 * 1000;

export async function sendEnquiryAlert({ createdAt, from, to, apiKey }, { now = Date.now(), request = fetch } = {}) {
  const created = Date.parse(createdAt);
  if (!Number.isFinite(created) || now - created >= oneHour) return;

  // Bursts share a single private alert; all individual enquiries are still in the inbox.
  const window = Math.floor(created / fiveMinutes);
  const response = await request('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + apiKey,
      'Content-Type': 'application/json',
      'Idempotency-Key': 'nhubx-enquiry-alert-' + window,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'New NHubX enquiries',
      ...renderEmail({ type: 'enquiry', subject: 'New NHubX enquiries', message: 'New website enquiries are waiting.' }),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error('The enquiry email provider returned HTTP ' + response.status);
}
