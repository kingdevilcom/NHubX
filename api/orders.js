import { FirebaseConfigError, firebaseServer } from '../server/firebaseAdmin.js';
import { OrderError, orderApi } from '../server/orders.js';
import { flushOrderJobs } from '../server/orderJobs.js';

const errorStatuses = { 'invalid-argument': 400, unauthenticated: 401, 'permission-denied': 403, 'not-found': 404, 'failed-precondition': 409, unavailable: 503 };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }
  const match = /^Bearer (\S+)$/.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({ error: 'Sign in to view orders.' });
  try {
    const client = await firebaseServer();
    if (!client) return res.status(503).json({ error: 'The order backend is awaiting Firebase configuration.' });
    let user;
    try { user = await client.auth.verifyIdToken(match[1], true); }
    catch { return res.status(401).json({ error: 'Please sign in again.' }); }
    const result = await orderApi(client.db, user, req.body);
    if (!['list', 'emailHistory', 'checkEmail', 'requestChanges', 'chatList', 'chatSend', 'submitReview', 'reviewQueue', 'moderateReview', 'editPendingReview', 'reviewPublished', 'reviewLinkProject', 'editPublishedReview', 'adminEmailConfig', 'adminEmailSend', 'adminMailboxList', 'adminMailboxRead', 'adminMailboxReplies'].includes(req.body?.action)) {
      await flushOrderJobs(client.db, 2, result.emailId).catch(() => console.error('Order notifications remain queued.'));
    }
    return res.status(200).json({ result });
  } catch (error) {
    if (error instanceof FirebaseConfigError) return res.status(503).json({ error: error.message });
    if (error instanceof OrderError) return res.status(errorStatuses[error.code]).json({ error: error.message });
    console.error('Order request failed:', error.code || error.name);
    return res.status(500).json({ error: 'Orders are temporarily unavailable.' });
  }
}
