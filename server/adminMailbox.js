import process from 'node:process';
import { OrderError } from './orderError.js';
import { resend } from './orderJobs.js';

const idPattern = /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i;
const asList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const afterQuery = (limit, after) => new URLSearchParams({ limit, ...(after ? { after } : {}) });
const nextPage = (page) => page.has_more ? page.data.at(-1)?.id ?? null : null;
const pathFor = (folder) => folder === 'inbox' ? 'emails/receiving' : 'emails';
const projectEmail = (mail) => ({
  id: mail.id, from: mail.from, to: asList(mail.to), subject: mail.subject,
  createdAt: mail.created_at, status: mail.last_event,
});
const content = (mail) => ({
  ...projectEmail(mail),
  text: mail.text?.slice(0, 100_000) ?? '',
  html: mail.text?.trim() ? '' : mail.html?.slice(0, 150_000) ?? '',
});

function isReply(mail, originalId) {
  const target = originalId.trim().replace(/^<|>$/g, '');
  return Object.entries(mail.headers ?? {}).some(([name, value]) => {
    if (!['in-reply-to', 'references'].includes(name.toLowerCase())) return false;
    return asList(value).some((entry) => typeof entry === 'string' && entry.split(/[<>\s]+/).includes(target));
  });
}

export async function adminMailbox(admin, input, { env = process.env, request = resend } = {}) {
  if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
  const key = env.RESEND_MAILBOX_API_KEY || env.RESEND_API_KEY;
  if (!key) throw new OrderError('unavailable', 'Configure a Resend API key in Vercel to read email.');
  const { action, folder, id, after } = input;
  if (![id, after].every((value) => value === undefined || (typeof value === 'string' && idPattern.test(value)))) {
    throw new OrderError('invalid-argument', 'Invalid email reference.');
  }

  async function read(path) {
    try {
      const response = await request(path, { headers: { Authorization: 'Bearer ' + key } });
      if (response.ok) return await response.json();
      if ([401, 403].includes(response.status)) throw new OrderError('unavailable', 'Resend denied mailbox access. Set RESEND_MAILBOX_API_KEY to a full-access Resend key in Vercel.');
      if (response.status === 429) throw new OrderError('unavailable', 'Resend is limiting requests. Wait a moment and try again.');
      if (response.status === 404) throw new OrderError('not-found', 'This email is no longer available in Resend.');
    } catch (error) {
      if (error instanceof OrderError) throw error;
    }
    throw new OrderError('unavailable', 'The mailbox could not be loaded. Try again.');
  }

  if (!['inbox', 'sent'].includes(folder)) throw new OrderError('invalid-argument', 'Choose Inbox or Sent.');
  const path = pathFor(folder);
  if (action === 'adminMailboxList') {
    const page = await read(path + '?' + afterQuery(20, after));
    return { items: page.data.map(projectEmail), next: nextPage(page) };
  }
  if (!id) throw new OrderError('invalid-argument', 'Choose an email.');
  if (action === 'adminMailboxRead') {
    return content(await read(path + '/' + id + (folder === 'inbox' ? '?html_format=cid' : '')));
  }

  const original = await read('emails/' + id);
  if (!original.message_id) return { items: [], next: null, unavailable: true };
  const query = afterQuery(5, after);
  const replyAddresses = asList(original.reply_to);
  for (const address of replyAddresses.length ? replyAddresses : asList(original.from)) {
    query.append('to', /<([^<>]+)>$/.exec(address)?.[1] ?? address);
  }
  const page = await read('emails/receiving?' + query);
  const sentAt = Date.parse(original.created_at);
  const candidates = page.data.filter((mail) => !(Date.parse(mail.created_at) < sentAt));
  const received = await Promise.all(candidates.map((mail) => read('emails/receiving/' + mail.id + '?html_format=cid')));
  return {
    items: received.filter((mail) => isReply(mail, original.message_id)).map(content),
    next: candidates.length === page.data.length ? nextPage(page) : null,
  };
}
