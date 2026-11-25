import { FieldPath } from 'firebase-admin/firestore';
import { firebaseServer } from '../server/firebaseAdmin.js';
import { publicReview } from '../server/orderConversation.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Use GET.' });
  }
  const rawLimit = req.query?.limit;
  if (rawLimit !== undefined && (typeof rawLimit !== 'string' || !/^(?:[1-9]|1[0-9]|20)$/.test(rawLimit))) {
    return res.status(400).json({ error: 'Invalid review page size.' });
  }
  const limit = rawLimit === undefined ? 20 : Number(rawLimit);
  try {
    const client = await firebaseServer();
    if (!client) return res.status(503).json({ error: 'Reviews are temporarily unavailable.' });
    const reviews = client.db.collection('publishedOrderReviews');
    let query = reviews.orderBy('publishedAt', 'desc').orderBy(FieldPath.documentId(), 'desc');
    if (req.query?.before !== undefined) {
      const cursor = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z~[a-zA-Z0-9]{20}$/.test(req.query.before) && typeof req.query.before === 'string' ? req.query.before.split('~') : null;
      if (!cursor) return res.status(400).json({ error: 'Invalid review page.' });
      query = query.startAfter(...cursor);
    }
    const [page, summary] = await Promise.all([query.limit(limit + 1).get(), client.db.collection('reviewMetadata').doc('totals').get()]);
    const last = page.docs[limit - 1];
    const next = page.size > limit ? last.data().publishedAt + '~' + last.id : null;
    const count = summary.data()?.count ?? 0;
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ next, reviews: page.docs.slice(0, limit).map((doc) => publicReview(doc.data())), count, average: count ? summary.data().ratingSum / count : null });
  } catch (error) {
    console.error('Public reviews failed:', error.code || error.name);
    return res.status(503).json({ error: 'Reviews are temporarily unavailable.' });
  }
}
