import { timingSafeEqual } from 'node:crypto';
import { firebaseServer } from '../server/firebaseAdmin.js';
import { flushOrderJobs } from '../server/orderJobs.js';
import { queueRenewalReminders } from '../server/orders.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Use GET.' });
  const secret = process.env.CRON_SECRET;
  const supplied = Buffer.from(req.headers.authorization || '');
  const expected = Buffer.from('Bearer ' + (secret || ''));
  if (!secret || supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const client = firebaseServer();
    if (!client) return res.status(503).json({ error: 'Firebase is awaiting configuration.' });
    await queueRenewalReminders(client.db);
    await flushOrderJobs(client.db, 20);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Order job failed:', error.code || error.name);
    return res.status(500).json({ error: 'Order job failed.' });
  }
}
