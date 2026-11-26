export const stages = ['Quote sent', 'Accepted', 'In progress', 'Review', 'Delivered'];

export const nextOrderActions = {
  'Quote sent': 'Review the scope and pricing, then accept the quote to get started.',
  Accepted: 'Your quote is accepted. Check the agreed deposit on your invoice and contact NHubX for bank-transfer details.',
  'In progress': 'Work is underway. Check the timeline for updates.',
  Review: 'Review the delivery and approve it when you’re ready.',
  Delivered: 'Your order is complete. Invoices, receipts and annual services are still available here.',
};

export function colomboToday(now = new Date()) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Colombo' }).format(now);
}

export function upcomingRenewals(orders, today = colomboToday()) {
  const cutoff = new Date(Date.parse(today) + 30 * 86_400_000).toISOString().slice(0, 10);
  return orders.flatMap((order) => order.services.filter((service) => service.dueDate <= cutoff)
    .map((service) => ({ ...service, orderId: order.id, orderNumber: order.orderNumber, orderTitle: order.title, overdue: service.dueDate < today })))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export const hasPendingRevision = (order) => order.stage === 'Review' && order.revisionRequest?.status === 'pending';
export const needsCustomerAction = (order) => ['Quote sent', 'Review'].includes(order.stage) && !hasPendingRevision(order);

export function customerOrdersForView(orders, search, filter) {
  return filterAdminOrders(orders, search, '').filter((order) => filter === 'all'
    || (filter === 'action' && needsCustomerAction(order))
    || (filter === 'active' && order.stage !== 'Delivered')
    || (filter === 'delivered' && order.stage === 'Delivered'))
    .sort((a, b) => Number(needsCustomerAction(b)) - Number(needsCustomerAction(a))
      || (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
      || a.id.localeCompare(b.id));
}

export function filterAdminOrders(orders, search, stage) {
  const term = search.trim().toLowerCase();
  const billingSequence = /^(?:inv|ren|rct)-(\d+)(?:-|$)/.exec(term)?.[1];
  return orders.filter((order) => (!stage || (stage === 'revision' ? hasPendingRevision(order) : stage === 'unread' ? order.chat?.adminUnread > 0 : stage === order.stage))
    && (!term || (billingSequence && order.orderNumber === 'NHX-' + billingSequence.padStart(5, '0'))
      || [order.orderNumber, order.title, order.customerName, order.customerEmail, order.id].some((value) => value?.toLowerCase().includes(term))));
}
