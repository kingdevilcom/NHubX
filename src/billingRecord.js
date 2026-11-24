const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

const lkr = (value) => 'LKR ' + new Intl.NumberFormat('en-LK').format(value);
const colomboDate = (value) => value
  ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Colombo' }).format(new Date(value))
  : '';

export function billingRecord(order, kind, entry) {
  const orderReference = order.orderNumber || order.id;
  const billingSequence = order.orderNumber?.replace(/^NHX-/, '') || order.id;
  const base = { project: order.title, customer: order.customerName, orderId: orderReference };
  const entryReference = (entries) => {
    const position = entries?.findIndex((item) => item.id === entry.id) ?? -1;
    return order.orderNumber && position >= 0 ? billingSequence + '-' + String(position + 1).padStart(2, '0') : entry.id;
  };
  if (kind === 'renewal') return {
    ...base, heading: 'Annual renewal invoice', reference: 'REN-' + entryReference(order.services) + '-' + (order.orderNumber ? entry.dueDate.slice(0, 4) : entry.dueDate),
    dateLabel: 'Payment due', date: colomboDate(entry.dueDate),
    description: entry.type + ' · annual renewal', amount: entry.amount,
    totals: [['Amount due', entry.amount]],
  };
  if (kind === 'receipt') return {
    ...base, heading: 'Payment receipt', reference: 'RCT-' + entryReference(order.receipts),
    dateLabel: 'Payment recorded', date: colomboDate(entry.at),
    description: entry.label, amount: entry.amount,
    totals: [['Received', entry.amount]],
  };
  return {
    ...base, heading: 'Website development invoice', reference: 'INV-' + billingSequence,
    dateLabel: 'Quote issued', date: colomboDate(order.createdAt),
    description: 'One-time website development', amount: order.total, scope: order.scope,
    totals: [['Development total', order.total], ['Agreed deposit', order.deposit], ['Payments received', order.paid], ['Balance due', order.total - order.paid]],
  };
}

export function renderBillingRecord(record) {
  const safe = escapeHtml;
  const { heading, reference, customer, project, orderId, description, amount, scope, totals, dateLabel, date } = record;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safe(heading)} | NHubX</title>
<style>
:root{font:15px/1.55 Arial,sans-serif;color:#231a18;background:#f5f2ef}
*{box-sizing:border-box}body{margin:0;padding:24px}
main{max-width:780px;margin:auto;background:#fff;padding:40px;border:1px solid #e4dcd6;border-radius:16px}
header,.meta{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}
header{align-items:center;padding-bottom:20px;border-bottom:3px solid #dc4f17}
.brand{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:800}.brand img{border-radius:8px}
h1{margin:25px 0 8px;font-size:32px;line-height:1.15}h2{font-size:16px;margin:0 0 6px}
p{margin:0 0 10px}small,.muted{color:#60534e}.reference{overflow-wrap:anywhere}
.meta{margin:24px 0}.meta>div{max-width:100%;overflow-wrap:anywhere}
table{width:100%;border-collapse:collapse}td,th{padding:10px 0;border-bottom:1px solid #ded5cf;text-align:left}td:last-child,th:last-child{text-align:right;white-space:nowrap}
.scope{white-space:pre-wrap;overflow-wrap:anywhere;color:#60534e;font-size:13px;margin:5px 0}
.totals{margin:22px 0 0 auto;max-width:330px}.totals tr:last-child{font-weight:bold;color:#a83b14}
footer{margin-top:28px;padding-top:14px;border-top:1px solid #ded5cf;color:#60534e}a{color:#a83b14}
button{border:0;border-radius:8px;background:#ef6a32;color:#301208;padding:10px 15px;font:inherit;font-weight:bold;cursor:pointer}
@media(max-width:540px){body{padding:12px}main{padding:20px}h1{font-size:27px}}
@media print{@page{margin:14mm}body{padding:0;background:#fff}main{padding:0;border:0;border-radius:0;max-width:none}button{display:none}tr{break-inside:avoid}}
</style></head><body><main>
<header><div class="brand"><img src="https://www.nhubx.com/nhubx-logo.png" width="42" height="42" alt="">NHubX</div><button type="button" onclick="window.print()">Print / Save PDF</button></header>
<h1>${safe(heading)}</h1><p class="muted reference">${safe(reference)}</p>
<div class="meta"><div><h2>Customer</h2><p>${safe(customer || 'NHubX customer')}</p><h2>Project</h2><p>${safe(project)}</p></div>
<div>${date ? `<h2>${safe(dateLabel)}</h2><p>${safe(date)}</p>` : ''}<h2>Order reference</h2><p class="reference">${safe(orderId)}</p></div></div>
<table><thead><tr><th scope="col">Description</th><th scope="col">Amount</th></tr></thead><tbody>
<tr><td>${safe(description)}${scope ? `<p class="scope">${safe(scope)}</p>` : ''}</td><td>${safe(lkr(amount))}</td></tr>
</tbody></table>
<table class="totals" aria-label="Payment summary"><tbody>${totals.map(([label, value]) => `<tr><th scope="row">${safe(label)}</th><td>${safe(lkr(value))}</td></tr>`).join('')}</tbody></table>
<footer>Issued by NHubX · <a href="mailto:contact@nhubx.com">contact@nhubx.com</a> · <a href="https://www.nhubx.com/orders">My Orders</a></footer>
</main></body></html>`;
}

export function openBillingRecord(order, kind, entry) {
  const record = billingRecord(order, kind, entry);
  const url = URL.createObjectURL(new Blob([renderBillingRecord(record)], { type: 'text/html;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
