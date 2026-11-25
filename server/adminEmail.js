import process from 'node:process';
import { renderEmail } from '../functions/emailTemplates.js';
import { OrderError } from './orderError.js';
import { resend } from './orderJobs.js';

const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
const operationPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const validAddress = (value) => value.length <= 254 && emailPattern.test(value);
const domainOf = (address) => address.split('@').at(-1).toLowerCase();
const founderAddress = 'founder@email.nhubx.com';
const founderName = 'Founder | NHubX';
const recipientLimit = 25;

export async function adminEmail(admin, input, { env = process.env, request = resend } = {}) {
  if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
  const defaultFrom = (env.ADMIN_EMAIL_FROM || env.ORDER_EMAIL_FROM || 'NHubX <orders@email.nhubx.com>').trim();
  const replyTo = env.ADMIN_EMAIL_REPLY_TO?.trim();
  const namedSender = /^([^<>\r\n]+)<([^<>]+)>$/.exec(defaultFrom);
  const senderAddress = namedSender?.[2] ?? defaultFrom;
  const senderDomain = domainOf(senderAddress);
  const configured = Boolean(env.RESEND_API_KEY && validAddress(senderAddress) && (!replyTo || validAddress(replyTo)));
  if (input.action === 'adminEmailConfig') {
    const founder = senderDomain === domainOf(founderAddress) ? { address: founderAddress, name: founderName } : null;
    return { from: defaultFrom, senderAddress, senderDomain, replyTo: replyTo || null, configured, founder, recipientLimit };
  }
  if (!configured) throw new OrderError('unavailable', 'Check the Resend key and sender settings in Vercel.');

  const selectedSender = typeof input.from === 'string' ? input.from.trim() : '';
  if (input.from !== undefined && (!validAddress(selectedSender) || domainOf(selectedSender) !== senderDomain)) {
    throw new OrderError('invalid-argument', 'Use a From address at @' + senderDomain + '.');
  }
  const address = selectedSender || senderAddress;
  let from = defaultFrom;
  if (address.toLowerCase() === founderAddress) from = founderName + ' <' + founderAddress + '>';
  else if (address !== senderAddress) from = namedSender ? namedSender[1].trim() + ' <' + address + '>' : address;

  const to = typeof input.to === 'string' && input.to.length <= 6500 ? input.to : '';
  const addresses = to.split(/[,;\r\n]+/).map((value) => value.trim()).filter(Boolean);
  if (!addresses.length || addresses.some((value) => !validAddress(value))) {
    throw new OrderError('invalid-argument', 'Enter valid recipient email addresses separated by commas or new lines.');
  }
  const recipients = [...new Map(addresses.map((value) => [value.toLowerCase(), value])).values()];
  if (recipients.length > recipientLimit) {
    throw new OrderError('invalid-argument', 'Send to up to ' + recipientLimit + ' recipients at a time.');
  }
  const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!subject || subject.length > 150 || /[\r\n]/.test(input.subject)) throw new OrderError('invalid-argument', 'Enter a subject of up to 150 characters on one line.');
  if (!message || message.length > 10000) throw new OrderError('invalid-argument', 'Enter a message of up to 10,000 characters.');
  if (typeof input.operation !== 'string' || !operationPattern.test(input.operation)) throw new OrderError('invalid-argument', 'Invalid send reference.');

  const email = {
    from, subject, ...(replyTo ? { reply_to: replyTo } : {}),
    ...renderEmail({ type: 'correspondence', subject, message }),
  };
  const batch = recipients.length > 1;
  const copies = recipients.map((recipient) => ({ ...email, to: [recipient] }));
  let response;
  let receipt;
  try {
    response = await request(batch ? 'emails/batch' : 'emails', {
      method: 'POST',
      headers: { 'Idempotency-Key': 'admin-email-' + input.operation },
      body: JSON.stringify(batch ? copies : copies[0]),
    });
    if (response.ok) receipt = await response.json();
  } catch {
    throw new OrderError('unavailable', 'The send could not be confirmed. Retry the unchanged draft.');
  }
  if (!batch && receipt?.id) return { id: receipt.id, to: recipients[0] };
  if (batch && Array.isArray(receipt?.data) && receipt.data.length === recipients.length && receipt.data.every((item) => item?.id)) {
    return { recipientCount: recipients.length };
  }
  if ([401, 403].includes(response.status)) throw new OrderError('unavailable', 'Resend rejected the sender or key. Check the verified domain and API key permissions.');
  if ([400, 422].includes(response.status)) throw new OrderError('invalid-argument', 'Resend rejected this email. Check the sender and recipient addresses.');
  if (response.status === 429) throw new OrderError('unavailable', 'Resend is limiting sends. Check your quota and retry the unchanged draft later.');
  throw new OrderError('unavailable', 'The send could not be confirmed. Retry the unchanged draft.');
}
