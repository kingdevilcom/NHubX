import { createHash } from 'node:crypto';
import { orderEmailHistory, refreshOrderEmail } from './orderJobs.js';
import { customerOrder, nextAnnualDate, orderStages, reminderDays, serviceTypes } from './orderModel.js';

export class OrderError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const timezone = 'Asia/Colombo';
const todayInColombo = () => new Intl.DateTimeFormat('sv-SE', { timeZone: timezone }).format(new Date());

const invalid = (message) => { throw new OrderError('invalid-argument', message); };
const text = (value, limit, label, required = true) => {
  if (typeof value !== 'string' || value.length > limit || (required && !value.trim())) invalid('Check ' + label + '.');
  return value.trim();
};
function amount(value) {
  if (!Number.isSafeInteger(value) || value <= 0 || value > 100_000_000) invalid('Enter a valid whole-LKR amount.');
  return value;
}
function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) invalid('Enter a valid date.');
  const parsed = new Date(value);
  if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== value) invalid('Enter a valid date.');
  return value;
}
const renewalDates = (services) => services.map((item) => item.dueDate);
const log = (order, message) => [...order.timeline.slice(-59), { message, at: new Date().toISOString() }];
const emailBody = (customerEmail, subject, message, orderId) => ({ to: customerEmail, subject, message, orderId, createdAt: new Date().toISOString(), pending: true });

export async function orderApi(db, auth, data) {
  const orders = db.collection('orders');
  const outbox = db.collection('orderEmails');
  const email = auth?.email?.toLowerCase();
  if (!auth?.email_verified || !email) throw new OrderError('unauthenticated', 'Sign in with a verified email.');
  const admin = email === 'stharunindu@gmail.com';
  const input = data && typeof data === 'object' ? data : {};
  const { action } = input;

  if (action === 'emailHistory' || action === 'checkEmail') {
    if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
    const id = text(input.id, 110, 'order ID');
    if (!/^[\w-]+$/.test(id)) invalid('Invalid order ID.');
    if (action === 'emailHistory') return orderEmailHistory(outbox, id);
    const emailId = text(input.emailId, 240, 'email ID');
    if (!/^[\w-]+$/.test(emailId)) invalid('Invalid email ID.');
    const record = await outbox.doc(emailId).get();
    if (!record.exists || (record.data().orderId !== id && emailId !== id + '-quote')) throw new OrderError('not-found', 'Order email not found.');
    return refreshOrderEmail(record);
  }

  if (action === 'stageEnquiry') {
    if (!admin) throw new OrderError('permission-denied', 'Admin access required.');
    const id = text(input.id, 100, 'enquiry ID');
    if (!/^[\w-]+$/.test(id) || !['New', 'Replied', 'Closed'].includes(input.stage)) invalid('Choose a valid enquiry stage.');
    const ref = db.collection('messages').doc(id);
    await db.runTransaction(async (tx) => {
      if (!(await tx.get(ref)).exists) throw new OrderError('not-found', 'Enquiry not found.');
      tx.update(ref, { stage: input.stage, stageUpdatedAt: new Date() });
    });
    return { id };
  }

  if (action === 'list') {
    const query = admin && input.admin === true ? orders.orderBy('createdAt', 'desc') : orders.where('customerEmail', '==', email);
    const snapshot = await query.limit(100).get();
    return snapshot.docs.flatMap((doc) => {
      const order = doc.data();
      if (admin && input.admin === true) return [{ id: doc.id, ...order }];
      if (order.ownerUid && order.ownerUid !== auth.uid) return [];
      return [{ id: doc.id, ...customerOrder(order) }];
    });
  }

  const adminActions = ['create', 'update', 'addService', 'payment', 'renewal', 'sendEmail'];
  if (adminActions.includes(action) && !admin) throw new OrderError('permission-denied', 'Admin access required.');
  if (![...adminActions, 'accept', 'approveDelivery'].includes(action)) invalid('Unknown action.');
  const op = text(input.operation, 60, 'request ID');
  if (!/^[a-f0-9-]{36}$/i.test(op)) invalid('Invalid request ID.');

  if (action === 'create') {
    const enquiryId = typeof input.enquiryId === 'string' && /^[\w-]{1,100}$/.test(input.enquiryId) ? input.enquiryId : null;
    const enquiry = enquiryId ? (await db.collection('messages').doc(enquiryId).get()).data() : null;
    if (enquiryId && !enquiry) throw new OrderError('not-found', 'Enquiry not found.');
    const customerEmail = text(enquiry?.email ?? input.email, 120, 'customer email').toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) invalid('Enter a valid email.');
    const customerName = text(enquiry?.name ?? input.name, 80, 'customer name');
    const customerId = createHash('sha256').update(customerEmail).digest('hex');
    const ref = orders.doc(enquiryId ? 'enquiry-' + enquiryId : op);
    const customerRef = db.collection('customers').doc(customerId);
    await db.runTransaction(async (tx) => {
      const [existing, savedCustomer] = await Promise.all([tx.get(ref), tx.get(customerRef)]);
      if (existing.exists) return;
      const createdAt = new Date().toISOString();
      const total = amount(input.total);
      const deposit = input.deposit ? amount(input.deposit) : 0;
      if (deposit > total) invalid('Deposit cannot exceed the quote total.');
      const order = {
        customerName, customerEmail, ownerUid: null, origin: enquiryId, createdAt,
        title: text(input.title, 100, 'order title'), scope: text(input.scope, 1600, 'scope'),
        total, deposit, paid: 0, stage: 'Quote sent', dueDate: date(input.dueDate),
        privateNotes: '', deliveryUrl: '', services: [], renewalDates: [], receipts: [],
        timeline: [{ message: 'Quote sent', at: createdAt }],
      };
      tx.set(ref, order);
      if (!savedCustomer.exists) tx.create(customerRef, { email: customerEmail, name: customerName, syncPending: true });
      tx.set(outbox.doc(ref.id + '-quote'), emailBody(customerEmail, 'Your NHubX quote is ready', 'Sign in with this email to review your quote.', ref.id));
    });
    return { id: ref.id, emailId: ref.id + '-quote' };
  }

  const id = text(input.id, 110, 'order ID');
  if (!/^[\w-]+$/.test(id)) invalid('Invalid order ID.');
  const ref = orders.doc(id);
  const operation = ref.collection('operations').doc(op);
  await db.runTransaction(async (tx) => {
    const [snap, applied] = await Promise.all([tx.get(ref), tx.get(operation)]);
    if (!snap.exists) throw new OrderError('not-found', 'Order not found.');
    const order = snap.data();
    const customerAction = action === 'accept' || action === 'approveDelivery';
    if (customerAction && (order.customerEmail !== email || (order.ownerUid && order.ownerUid !== auth.uid))) {
      throw new OrderError('permission-denied', 'Order not available.');
    }
    if (applied.exists) return;
    if (action === 'sendEmail') {
      const subject = text(input.subject, 160, 'the email subject');
      if (/[\r\n]/.test(subject)) invalid('The email subject must be one line.');
      const message = text(input.message, 4000, 'the message');
      tx.create(outbox.doc(id + '-' + op), emailBody(order.customerEmail, subject, message, id));
      tx.create(operation, { at: new Date().toISOString() });
      return;
    }
    let changes;
    let notice;
    if (action === 'accept') {
      if (order.stage !== 'Quote sent') invalid('This quote is no longer waiting for acceptance.');
      changes = { stage: 'Accepted', ownerUid: auth.uid };
      notice = 'Quote accepted';
    } else if (action === 'approveDelivery') {
      if (order.stage !== 'Review') invalid('This order is not awaiting delivery approval.');
      changes = { stage: 'Delivered', ownerUid: auth.uid };
      notice = 'Delivery approved';
    } else if (action === 'update') {
      if (!orderStages.includes(input.stage) || orderStages.indexOf(input.stage) < orderStages.indexOf(order.stage)) invalid('Choose the current or a later stage.');
      const deliveryUrl = text(input.deliveryUrl ?? '', 512, 'delivery link', false);
      if (deliveryUrl && !/^https:\/\/[^\s]+$/i.test(deliveryUrl)) invalid('Use an HTTPS delivery link.');
      changes = { stage: input.stage, deliveryUrl, privateNotes: text(input.privateNotes ?? '', 1500, 'notes', false) };
      notice = changes.stage !== order.stage ? changes.stage : '';
    } else if (action === 'addService') {
      if (!serviceTypes.includes(input.type) || order.services.length >= 12) invalid('Choose a service and keep at most twelve renewals per order.');
      const services = [...order.services, { id: op, type: input.type, amount: amount(input.amount), dueDate: date(input.dueDate) }];
      changes = { services, renewalDates: renewalDates(services) };
      notice = input.type + ' renewal added';
    } else {
      if (order.receipts.length >= 400) invalid('This order has reached its receipt limit.');
      const service = order.services.find((item) => item.id === input.serviceId);
      if (action === 'renewal' && (!service || service.dueDate !== input.cycle)) invalid('That renewal cycle has already changed.');
      const received = action === 'renewal' ? service.amount : amount(input.amount);
      if (action === 'payment' && received > order.total - order.paid) invalid('Payment exceeds the order balance.');
      const receipt = { id: op, amount: received, label: action === 'renewal' ? service.type + ' renewal' : 'Development payment', at: new Date().toISOString() };
      changes = { receipts: [...order.receipts, receipt] };
      if (action === 'renewal') {
        changes.services = order.services.map((item) => item.id === service.id ? { ...item, dueDate: nextAnnualDate(item.dueDate) } : item);
        changes.renewalDates = renewalDates(changes.services);
      } else {
        changes.paid = order.paid + received;
      }
      notice = receipt.label + ' confirmed';
    }
    if (notice) {
      changes.timeline = log(order, notice);
      tx.set(outbox.doc(id + '-' + op), emailBody(order.customerEmail, 'NHubX order update', notice + '. Sign in to see the details.', id));
    }
    tx.update(ref, changes);
    tx.create(operation, { at: new Date().toISOString() });
  });
  return action === 'sendEmail' ? { id, emailId: id + '-' + op } : { id };
}

export async function queueRenewalReminders(db) {
  const orders = db.collection('orders');
  const outbox = db.collection('orderEmails');
  const today = todayInColombo();
  const dates = [1, 7, 30].map((days) => new Date(Date.parse(today) + days * 86_400_000).toISOString().slice(0, 10));
  const due = await orders.where('renewalDates', 'array-contains-any', dates).get();
  for (const candidate of due.docs) {
    await db.runTransaction(async (tx) => {
      const order = (await tx.get(candidate.ref)).data();
      if (!order) return;
      const reminders = order.services.filter((service) => [30, 7, 1].includes(reminderDays(service.dueDate, today)));
      const records = await Promise.all(reminders.map(async (service) => {
        const days = reminderDays(service.dueDate, today);
        const ref = outbox.doc('renew-' + candidate.id + '-' + service.id + '-' + service.dueDate + '-' + days);
        return { service, ref, saved: await tx.get(ref) };
      }));
      for (const { service, ref, saved } of records) {
        if (!saved.exists) tx.create(ref, emailBody(order.customerEmail, 'NHubX renewal reminder',
          service.type + ' renews on ' + service.dueDate + '. Amount due: LKR ' + service.amount + '. Sign in to review.', candidate.id));
      }
    });
  }
}
