export const orderCounter = (db) => db.collection('orderMetadata').doc('numberSequence');

export function allocateOrderNumber(lastNumber) {
  if (!Number.isSafeInteger(lastNumber) || lastNumber < 0 || lastNumber >= Number.MAX_SAFE_INTEGER) {
    throw new Error('Invalid stored order number counter.');
  }
  const number = lastNumber + 1;
  return { number, reference: 'NHX-' + String(number).padStart(5, '0') };
}

export async function assignMissingOrderNumbers(db, snapshots) {
  const missing = snapshots.filter((snapshot) => !snapshot.data().orderNumber);
  if (!missing.length) return new Map();
  const counter = orderCounter(db);
  return db.runTransaction(async (tx) => {
    const [sequence, ...orders] = await tx.getAll(counter, ...missing.map(({ ref }) => ref));
    const liveOrders = orders.filter((order) => order.exists)
      .sort((a, b) => (a.data().createdAt ?? '').localeCompare(b.data().createdAt ?? '') || a.id.localeCompare(b.id));
    let lastNumber = sequence.data()?.lastNumber ?? 0;
    const previous = lastNumber;
    const references = new Map();
    for (const order of liveOrders) {
      const existing = order.data().orderNumber;
      if (existing) {
        references.set(order.id, existing);
        continue;
      }
      const assigned = allocateOrderNumber(lastNumber);
      lastNumber = assigned.number;
      references.set(order.id, assigned.reference);
      tx.update(order.ref, { orderNumber: assigned.reference });
    }
    if (lastNumber !== previous) tx.set(counter, { lastNumber }, { merge: true });
    return references;
  });
}

export async function backfillOrderNumbers(db) {
  const migration = db.collection('orderMetadata').doc('numberBackfill');
  const progress = (await migration.get()).data();
  if (progress?.complete) return;
  const orders = db.collection('orders');
  const byDate = orders.orderBy('createdAt');
  const cursorId = progress?.cursor;
  const cursor = cursorId ? await orders.doc(cursorId).get() : null;
  const page = await (cursor?.exists ? byDate.startAfter(cursor) : byDate).limit(100).get();
  await assignMissingOrderNumbers(db, page.docs);
  await migration.set({ cursor: page.docs.at(-1)?.id ?? cursorId ?? null, complete: page.size < 100 });
}
