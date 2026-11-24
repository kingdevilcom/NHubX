export const orderStages = ['Quote sent', 'Accepted', 'In progress', 'Review', 'Delivered'];
export const serviceTypes = ['Hosting', 'Domain', 'Maintenance'];

export function nextAnnualDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year + 1, month, 0)).getUTCDate();
  return [year + 1, String(month).padStart(2, '0'), String(Math.min(day, lastDay)).padStart(2, '0')].join('-');
}

export function reminderDays(dueDate, today) {
  return (Date.parse(dueDate) - Date.parse(today)) / 86_400_000;
}

export function customerOrder(order) {
  const { title, scope, total, deposit, paid, stage, dueDate, deliveryUrl, services, receipts, timeline, customerName, createdAt, orderNumber } = order;
  return { title, scope, total, deposit, paid, stage, dueDate, deliveryUrl, services, receipts, timeline, customerName, createdAt, orderNumber };
}
