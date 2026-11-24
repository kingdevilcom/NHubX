const portal = 'https://www.nhubx.com/orders';

function resend(path, options = {}) {
  return fetch('https://api.resend.com/' + path, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    signal: AbortSignal.timeout(5000),
  });
}

async function finishFailure(ref, field, response) {
  const status = response.status;
  const permanent = status >= 400 && status < 500 && ![401, 403, 409, 429].includes(status);
  await ref.update({ [field]: !permanent, lastDeliveryStatus: status });
}

async function deliver(doc) {
  const mail = doc.data();
  // Resend retains idempotency keys for a limited period. Mark ambiguous older sends for review.
  let started = mail.firstAttemptAt;
  if (!started) {
    started = await doc.ref.firestore.runTransaction(async (tx) => {
      const current = (await tx.get(doc.ref)).data();
      if (!current.pending) return null;
      if (current.firstAttemptAt) return current.firstAttemptAt;
      const timestamp = new Date().toISOString();
      tx.update(doc.ref, { firstAttemptAt: timestamp });
      return timestamp;
    });
  }
  if (!started) return;
  if (Date.now() - Date.parse(started) >= 23 * 3_600_000) {
    await doc.ref.update({ pending: false, lastDeliveryStatus: 'review' });
    return;
  }
  const response = await resend('emails', {
    method: 'POST',
    headers: { 'Idempotency-Key': 'order-' + doc.id },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || 'orders@email.nhubx.com',
      to: [mail.to],
      subject: mail.subject,
      text: mail.message + '\n\n' + portal,
    }),
  });
  if (!response.ok) {
    await finishFailure(doc.ref, 'pending', response);
    if (response.status < 500 && ![409, 429].includes(response.status)) {
      await doc.ref.update({ firstAttemptAt: null });
    }
    return;
  }
  const result = await response.json();
  await doc.ref.update({ pending: false, resendEmailId: result.id, sentAt: new Date().toISOString() });
}

async function syncContact(doc) {
  const { email } = doc.data();
  const path = 'contacts/' + encodeURIComponent(email);
  let response = await resend(path);
  if (response.status === 404) {
    response = await resend('contacts', {
      method: 'POST',
      body: JSON.stringify({ email, unsubscribed: true }),
    });
    if (response.status === 409) response = await resend(path);
  }
  if (!response.ok) return finishFailure(doc.ref, 'syncPending', response);
  const result = await response.json();
  await doc.ref.update({ syncPending: false, resendContactId: result.id, syncedAt: new Date().toISOString() });
}

export async function flushOrderJobs(db, batchSize = 4) {
  if (!process.env.RESEND_API_KEY) return;
  const [emails, customers] = await Promise.all([
    db.collection('orderEmails').where('pending', '==', true).limit(batchSize).get(),
    db.collection('customers').where('syncPending', '==', true).limit(batchSize).get(),
  ]);
  const results = await Promise.allSettled([...emails.docs.map(deliver), ...customers.docs.map(syncContact)]);
  if (results.some(({ status }) => status === 'rejected')) console.error('Some order notifications will be retried.');
}
