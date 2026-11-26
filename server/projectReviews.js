import { caseStudies } from '../src/projectCaseStudies.js';
import { adminReviewName, checkReviewVersion, publicReview, reviewEdits } from './orderConversation.js';
import { OrderError } from './orderError.js';

const publishedId = /^[\w-]{1,110}$/;
const invalid = (message) => { throw new OrderError('invalid-argument', message); };

export function validProjectReviewKey(key) {
  return typeof key === 'string' && (/^case-[\w-]{1,100}$/.test(key) || /^catalog-[\w-]{1,100}$/.test(key));
}

export async function reviewsByProject(collection, keys) {
  const results = await Promise.all(keys.map(async (key) => {
    // The prefix and date share a single Firestore index.
    const prefix = key + '~';
    const page = await collection.orderBy('projectReviewKey', 'desc').startAt(prefix + '\uf8ff').endAt(prefix).limit(2).get();
    return [key, page.docs.map((doc) => publicReview(doc.data()))];
  }));
  return Object.fromEntries(results);
}

export async function manageProjectReviews(db, admin, input) {
  if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
  const collection = db.collection('publishedOrderReviews');
  if (input.action === 'reviewPublished') {
    let query = collection.orderBy('publishedAt', 'desc');
    if (input.after !== undefined) {
      if (typeof input.after !== 'string' || !publishedId.test(input.after)) invalid('Invalid review page.');
      const cursor = await collection.doc(input.after).get();
      if (!cursor.exists) invalid('Refresh the list and try again.');
      query = query.startAfter(cursor);
    }
    const page = await query.limit(21).get();
    return {
      items: page.docs.slice(0, 20).map((doc) => {
        const review = doc.data();
        return { ...publicReview(review), ...adminReviewName(review), id: doc.id, projectKey: review.projectKey ?? '', editVersion: review.editVersion ?? 0 };
      }),
      next: page.size > 20 ? page.docs[19].id : null,
    };
  }

  const { id, projectKey } = input;
  if (typeof id !== 'string' || !publishedId.test(id)) invalid('Choose a published review.');
  const ref = collection.doc(id);
  if (input.action === 'editPublishedReview') {
    const totals = db.collection('reviewMetadata').doc('totals');
    return db.runTransaction(async (tx) => {
      const review = (await tx.get(ref)).data();
      if (!review) throw new OrderError('not-found', 'Published review not found.');
      checkReviewVersion(review, input);
      const edits = reviewEdits(input, review);
      if (edits.rating !== review.rating) {
        const summary = (await tx.get(totals)).data();
        if (!summary) throw new OrderError('failed-precondition', 'Review totals are unavailable.');
        tx.update(totals, { ratingSum: summary.ratingSum + edits.rating - review.rating });
      }
      const editVersion = input.editVersion + 1;
      tx.update(ref, { ...edits, editVersion });
      return { ...edits, ...adminReviewName(edits), editVersion };
    });
  }
  if (projectKey !== '' && !validProjectReviewKey(projectKey)) invalid('Choose an available project.');
  return db.runTransaction(async (tx) => {
    const review = (await tx.get(ref)).data();
    if (!review) throw new OrderError('not-found', 'Published review not found.');
    if (projectKey.startsWith('case-') && !caseStudies.some(({ id }) => projectKey === 'case-' + id)) invalid('Choose an available case study.');
    if (projectKey.startsWith('catalog-')) {
      const catalogId = projectKey.slice('catalog-'.length);
      if (!(await tx.get(db.collection('projects').doc(catalogId))).exists) invalid('Choose an available project.');
    }
    tx.update(ref, { projectKey: projectKey || null, projectReviewKey: projectKey ? projectKey + '~' + review.publishedAt + '~' + id : null });
    return { projectKey };
  });
}
