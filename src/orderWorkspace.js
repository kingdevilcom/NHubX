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
    .map((service) => ({ ...service, orderId: order.id, orderTitle: order.title, overdue: service.dueDate < today })))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export const needsCustomerAction = (order) => ['Quote sent', 'Review'].includes(order.stage);

export function filterAdminOrders(orders, search, stage) {
  const term = search.trim().toLowerCase();
  return orders.filter((order) => (!stage || stage === order.stage)
    && (!term || [order.title, order.customerName, order.customerEmail, order.id].some((value) => value?.toLowerCase().includes(term))));
}
