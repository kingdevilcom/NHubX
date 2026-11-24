const portal = 'https://www.nhubx.com/orders';

const deliveryLabels = {
  delivered: 'Delivered', bounced: 'Bounced', complained: 'Complaint reported',
  delivery_delayed: 'Delivery delayed', failed: 'Send failed', suppressed: 'Suppressed',
  opened: 'Opened (reported by Resend)', clicked: 'Link clicked (reported by Resend)',
};

export function orderEmailSummary(id, record) {
  const status = record.resendEvent && Object.hasOwn(deliveryLabels, record.resendEvent)
    ? deliveryLabels[record.resendEvent]
    : record.sentAt ? 'Accepted by Resend' : record.pending ? 'Queued' : record.lastDeliveryStatus === 'review' ? 'Needs review' : 'Send failed';
  return { id, subject: record.subject, createdAt: record.createdAt ?? record.sentAt ?? null, status, canCheck: Boolean(record.resendEmailId) };
}

export async function orderEmailHistory(outbox, id) {
  const [quote, other] = await Promise.all([outbox.doc(id + '-quote').get(), outbox.where('orderId', '==', id).get()]);
  const history = other.docs.filter((doc) => doc.id !== quote.id).map((doc) => orderEmailSummary(doc.id, doc.data()));
  history.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  return { quote: quote.exists ? orderEmailSummary(quote.id, quote.data()) : null, history: history.slice(0, 20) };
}

export async function refreshOrderEmail(record) {
  const mail = record.data();
  if (mail.resendEmailId && process.env.RESEND_API_KEY) {
    const response = await resend('emails/' + encodeURIComponent(mail.resendEmailId));
    if (!response.ok) throw new Error('Resend delivery check returned ' + response.status);
    const { last_event: event } = await response.json();
    if (Object.hasOwn(deliveryLabels, event)) {
      await record.ref.update({ resendEvent: event });
      return orderEmailSummary(record.id, { ...mail, resendEvent: event });
    }
  }
  return orderEmailSummary(record.id, mail);
}

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

export async function flushOrderJobs(db, batchSize = 4, priorityEmailId) {
  if (!process.env.RESEND_API_KEY) return;
  const outbox = db.collection('orderEmails');
  const [emails, customers] = await Promise.all([
    priorityEmailId ? outbox.doc(priorityEmailId).get().then((doc) => [doc].filter((item) => item.data()?.pending))
      : outbox.where('pending', '==', true).limit(batchSize).get().then((snapshot) => snapshot.docs),
    db.collection('customers').where('syncPending', '==', true).limit(batchSize).get(),
  ]);
  const results = await Promise.allSettled([...emails.map(deliver), ...customers.docs.map(syncContact)]);
  if (results.some(({ status }) => status === 'rejected')) console.error('Some order notifications will be retried.');
}
