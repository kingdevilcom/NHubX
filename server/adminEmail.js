import process from 'node:process';
import { renderEmail } from '../functions/emailTemplates.js';
import { OrderError } from './orderError.js';
import { resend } from './orderJobs.js';

const emailPattern = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
const operationPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const validAddress = (value) => value.length <= 254 && emailPattern.test(value);

export async function adminEmail(admin, input, { env = process.env, request = resend } = {}) {
  if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
  const from = (env.ADMIN_EMAIL_FROM || env.ORDER_EMAIL_FROM || 'NHubX <orders@email.nhubx.com>').trim();
  const replyTo = env.ADMIN_EMAIL_REPLY_TO?.trim();
  const senderAddress = /^[^<>\r\n]+<([^<>]+)>$/.exec(from)?.[1] ?? from;
  const configured = Boolean(env.RESEND_API_KEY && validAddress(senderAddress) && (!replyTo || validAddress(replyTo)));
  if (input.action === 'adminEmailConfig') return { from, replyTo: replyTo || null, configured };
  if (!configured) throw new OrderError('unavailable', 'Check the Resend key and sender settings in Vercel.');

  const to = typeof input.to === 'string' ? input.to.trim() : '';
  const subject = typeof input.subject === 'string' ? input.subject.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!validAddress(to)) throw new OrderError('invalid-argument', 'Enter one valid recipient email address.');
  if (!subject || subject.length > 150 || /[\r\n]/.test(input.subject)) throw new OrderError('invalid-argument', 'Enter a subject of up to 150 characters on one line.');
  if (!message || message.length > 10000) throw new OrderError('invalid-argument', 'Enter a message of up to 10,000 characters.');
  if (typeof input.operation !== 'string' || !operationPattern.test(input.operation)) throw new OrderError('invalid-argument', 'Invalid send reference.');

  let response;
  let receipt;
  try {
    response = await request('emails', {
      method: 'POST',
      headers: { 'Idempotency-Key': 'admin-email-' + input.operation },
      body: JSON.stringify({
        from, to: [to], subject, ...(replyTo ? { reply_to: replyTo } : {}),
        ...renderEmail({ type: 'correspondence', subject, message }),
      }),
    });
    if (response.ok) receipt = await response.json();
  } catch {
    throw new OrderError('unavailable', 'The send could not be confirmed. Retry the unchanged draft.');
  }
  if (receipt?.id) return { id: receipt.id, to };
  if ([401, 403].includes(response.status)) throw new OrderError('unavailable', 'Resend rejected the sender or key. Check the verified domain and API key permissions.');
  if ([400, 422].includes(response.status)) throw new OrderError('invalid-argument', 'Resend rejected this email. Check the sender and recipient addresses.');
  if (response.status === 429) throw new OrderError('unavailable', 'Resend is limiting sends. Check your quota and retry the unchanged draft later.');
  throw new OrderError('unavailable', 'The send could not be confirmed. Retry the unchanged draft.');
}
