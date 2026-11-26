import { OrderError } from './orderError.js';

const invalid = (message) => { throw new OrderError('invalid-argument', message); };
const deny = () => { throw new OrderError('permission-denied', 'This action is not available to your account.'); };
export const moderationReasons = ['Spam', 'Abuse', 'Personal information', 'Unrelated to the order'];

export function canViewOrder(order, auth, admin) {
  return admin || (order.customerEmail === auth.email?.toLowerCase() && (!order.ownerUid || order.ownerUid === auth.uid));
}

export function publicReview(review) {
  const { displayName, rating, comment, publishedAt } = review;
  return { displayName, rating, comment, publishedAt };
}

export function adminReviewName(review) {
  return { editableName: review.hiddenDisplayName ?? (review.displayName === 'Verified customer' ? '' : review.displayName) };
}

function validatedText(value, max, message) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) invalid(message);
  return value.trim();
}

export function reviewEdits(input, review) {
  const { editableName } = adminReviewName(review);
  if (typeof input.showName !== 'boolean') invalid('Choose whether to show the customer name.');
  if (input.showName && !editableName) invalid('The customer chose to keep their name private.');
  const displayName = input.showName ? validatedText(input.displayName, 80, 'Enter a display name of up to 80 characters.') : 'Verified customer';
  const comment = validatedText(input.comment, 1000, 'Write a review of up to 1,000 characters.');
  if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(displayName + ' ' + comment)) invalid('Remove email addresses from the review.');
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) invalid('Choose a rating from 1 to 5.');
  return { displayName, comment, rating: input.rating, hiddenDisplayName: input.showName ? null : editableName || null };
}

export function checkReviewVersion(review, input) {
  if ((review.editVersion ?? 0) !== input.editVersion) invalid('This review has changed. Refresh the list and try again.');
}

export async function orderConversation(db, auth, admin, input) {
  const { action } = input;
  if (action === 'reviewQueue') {
    if (!admin) deny();
    const pending = await db.collection('orderReviews').where('status', '==', 'pending').limit(50).get();
    return pending.docs.map((snapshot) => {
      const review = snapshot.data();
      const edited = { ...review, ...review.edits };
      const { displayName, rating, comment } = edited;
      return { id: snapshot.id, displayName, rating, comment, ...adminReviewName(edited), createdAt: review.createdAt, orderNumber: review.orderNumber, editVersion: review.editVersion ?? 0 };
    }).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  if (typeof input.id !== 'string' || !/^[\w-]{1,110}$/.test(input.id)) invalid('Invalid order ID.');
  const ref = db.collection('orders').doc(input.id);
  const reviewRef = db.collection('orderReviews').doc(input.id);
  const messages = ref.collection('chat');
  const role = admin && input.admin === true ? 'admin' : 'customer';
  const access = (order) => {
    if (!order) throw new OrderError('not-found', 'Order not found.');
    if (!canViewOrder(order, auth, role === 'admin')) deny();
  };
  const assertOwner = (order) => {
    access(order);
    if (!canViewOrder(order, auth, false)) deny();
  };
  if (action === 'editPendingReview') {
    if (!admin) deny();
    return db.runTransaction(async (tx) => {
      const review = (await tx.get(reviewRef)).data();
      if (!review) throw new OrderError('not-found', 'Review not found.');
      if (review.status !== 'pending' || review.createdAt !== input.createdAt) invalid('This review has changed. Refresh the queue and try again.');
      checkReviewVersion(review, input);
      const edits = reviewEdits(input, { ...review, ...review.edits });
      const editVersion = input.editVersion + 1;
      tx.update(reviewRef, { edits, editVersion });
      return { ...edits, ...adminReviewName(edits), editVersion };
    });
  }
  if (action === 'moderateReview') {
    if (!admin) deny();
    if (!['published', 'withheld'].includes(input.status)) invalid('Choose a moderation action.');
    if (input.status === 'withheld' && !moderationReasons.includes(input.reason)) invalid('Choose a moderation reason.');
    const totals = db.collection('reviewMetadata').doc('totals');
    return db.runTransaction(async (tx) => {
      const [orderSnapshot, reviewSnapshot] = await tx.getAll(ref, reviewRef);
      const order = orderSnapshot.data();
      const review = reviewSnapshot.data();
      if (!order || !review) throw new OrderError('not-found', 'Review not found.');
      if (review.status === input.status) return { status: review.status };
      if (review.status !== 'pending') invalid('This review has already been moderated.');
      if (input.createdAt && input.createdAt !== review.createdAt) invalid('This review has changed. Refresh the queue before moderating it.');
      if (input.editVersion !== undefined || review.editVersion !== undefined) checkReviewVersion(review, input);
      const publishedAt = input.status === 'published' ? new Date().toISOString() : null;
      const reason = input.status === 'withheld' ? input.reason : null;
      if (publishedAt) {
        const existing = (await tx.get(totals)).data();
        const published = publicReview({ ...review, ...review.edits, publishedAt });
        tx.set(totals, { count: (existing?.count ?? 0) + 1, ratingSum: (existing?.ratingSum ?? 0) + published.rating });
        tx.create(db.collection('publishedOrderReviews').doc(), {
          ...published,
          ...(review.edits?.hiddenDisplayName ? { hiddenDisplayName: review.edits.hiddenDisplayName } : {}),
        });
      }
      tx.update(reviewRef, { status: input.status, publishedAt, reason });
      tx.update(ref, { reviewStatus: input.status, reviewModerationReason: reason });
      return { status: input.status };
    });
  }
  if (action === 'submitReview') {
    const comment = validatedText(input.comment, 1000, 'Write a review of up to 1,000 characters.');
    if (/[^\s@]+@[^\s@]+\.[a-z]{2,}/i.test(comment)) invalid('Remove email addresses before submitting a public review.');
    if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5 || input.consent !== true || !['anonymous', 'firstName'].includes(input.display)) invalid('Choose a rating, display name, and consent to publish.');
    return db.runTransaction(async (tx) => {
      const [orderSnapshot, reviewSnapshot] = await tx.getAll(ref, reviewRef);
      const order = orderSnapshot.data();
      assertOwner(order);
      if (order.stage !== 'Delivered') invalid('Reviews are available after delivery.');
      const previous = reviewSnapshot.data();
      if (previous && !(input.resubmit === true && previous.status === 'withheld')) {
        invalid('A review has already been submitted for this order.');
      }
      const firstName = typeof order.customerName === 'string' ? order.customerName.trim().split(/\s+/)[0] : '';
      const displayName = input.display === 'firstName' && firstName && !firstName.includes('@') ? firstName : 'Verified customer';
      const previousTime = previous ? Date.parse(previous.createdAt) : 0;
      const createdAt = new Date(Math.max(Date.now(), previousTime + 1)).toISOString();
      const review = { rating: input.rating, comment, displayName, status: 'pending', createdAt, orderNumber: order.orderNumber ?? null };
      if (previous) tx.set(reviewRef, review);
      else tx.create(reviewRef, review);
      tx.update(ref, { reviewStatus: 'pending', reviewModerationReason: null, ownerUid: auth.uid });
      return { status: 'pending' };
    });
  }
  if (action === 'chatList') {
    return db.runTransaction(async (tx) => {
      const order = (await tx.get(ref)).data();
      access(order);
      const before = Number.isSafeInteger(input.before) && input.before > 0 ? input.before : null;
      const after = !before && Number.isSafeInteger(input.after) && input.after >= 0 ? input.after : null;
      const unread = role === 'admin' ? 'adminUnread' : 'customerUnread';
      const latest = order.chat?.sequence ?? 0;
      if (after === latest && !order.chat?.[unread]) return { messages: [], older: false, more: false };
      let query = messages.orderBy('sequence', after === null ? 'desc' : 'asc');
      const cursor = before ?? after;
      if (cursor !== null) query = query.startAfter(cursor);
      const page = await tx.get(query.limit(31));
      const shown = page.docs.slice(0, 30).map((item) => ({ id: item.id, ...item.data() }));
      const more = after !== null && page.size > 30;
      if (!before && !more && order.chat?.[unread] && (after === null || shown.at(-1)?.sequence === latest)) {
        tx.update(ref, { chat: { ...order.chat, [unread]: 0 } });
      }
      return { messages: after === null ? shown.reverse() : shown, older: after === null && page.size > 30, more };
    });
  }
  if (action === 'chatSend') {
    const message = validatedText(input.message, 2000, 'Enter a message of up to 2,000 characters.');
    if (typeof input.operation !== 'string' || !/^[a-f0-9-]{36}$/i.test(input.operation)) invalid('Invalid message ID.');
    const item = messages.doc(input.operation);
    return db.runTransaction(async (tx) => {
      const [orderSnapshot, existing] = await tx.getAll(ref, item);
      const order = orderSnapshot.data();
      access(order);
      if (existing.exists) {
        if (existing.data().role !== role) deny();
        return { id: existing.id };
      }
      const chat = order.chat ?? {};
      const sequence = (chat.sequence ?? 0) + 1;
      const unread = role === 'admin' ? 'customerUnread' : 'adminUnread';
      const createdAt = new Date().toISOString();
      tx.create(item, { role, text: message, sequence, createdAt });
      tx.update(ref, { chat: { ...chat, sequence, [unread]: (chat[unread] ?? 0) + 1 }, ...(role === 'customer' ? { ownerUid: auth.uid } : {}) });
      return { id: item.id };
    });
  }
  invalid('Unknown action.');
}
