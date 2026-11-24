import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { formatLkr, orderButton, orderField, orderRequest, stages } from '../orders';
import OrderSummary from './OrderSummary';

export default function AdminOrders() {
  const [params] = useSearchParams();
  const enquiryId = params.get('enquiry') || '';
  const [orders, setOrders] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const retry = useRef(null);

  useEffect(() => { orderRequest('list', { admin: true }).then(setOrders).catch((err) => setNotice(err.message)); }, []);

  async function submit(event, action, extra = {}) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const input = { ...Object.fromEntries(new FormData(form)), ...extra };
    for (const field of ['total', 'deposit', 'amount']) if (field in input) input[field] = Number(input[field]);
    const fingerprint = JSON.stringify({ action, input });
    if (retry.current?.fingerprint !== fingerprint) retry.current = { fingerprint, operation: crypto.randomUUID() };
    setBusy(true);
    setNotice('');
    try {
      await orderRequest(action, { ...input, operation: retry.current.operation });
      setOrders(await orderRequest('list', { admin: true }));
      retry.current = null;
      if (action !== 'update') form.reset();
      setNotice('Saved.');
    } catch (err) { setNotice(err.message); }
    finally { setBusy(false); }
  }

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Colombo' }).format(new Date());
  const soon = new Date(Date.parse(today) + 30 * 86_400_000).toISOString().slice(0, 10);
  const renewals = orders.flatMap((order) => order.services.filter((item) => item.dueDate <= soon).map((item) => ({ ...item, order: order.title }))).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold">Orders and renewals</h2>
      <p role="status" className="text-sm text-gray-300">{notice}</p>
      <details className="glass rounded-xl p-5" open={Boolean(enquiryId) || undefined}>
        <summary className="cursor-pointer font-semibold">Create quote</summary>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(event) => submit(event, 'create', { enquiryId })}>
          {enquiryId ? <p className="sm:col-span-2 text-gray-400">Customer details will be taken from the selected enquiry.</p> : <>
            <label>Customer name<input className={orderField} name="name" maxLength={80} required /></label>
            <label>Customer email<input className={orderField} name="email" type="email" maxLength={120} required /></label>
          </>}
          <label>Order title<input className={orderField} name="title" maxLength={100} required /></label>
          <label>Expected delivery<input className={orderField} name="dueDate" type="date" required /></label>
          <label>Development total (LKR)<input className={orderField} name="total" type="number" min={1} step={1} required /></label>
          <label>Deposit (LKR)<input className={orderField} name="deposit" type="number" min={0} step={1} /></label>
          <label className="sm:col-span-2">Agreed scope<textarea className={orderField} name="scope" maxLength={1600} required /></label>
          <button className={orderButton} disabled={busy}>Create and send quote</button>
        </form>
      </details>
      <div className="glass rounded-xl p-5">
        <h3 className="font-bold">Renewals due in 30 days or overdue</h3>
        {renewals.length ? <ul className="mt-3 space-y-2">{renewals.map((item) => <li key={item.id} className="text-sm">{item.order} · {item.type} · {formatLkr(item.amount)} · {item.dueDate < today ? 'Overdue' : 'Due'} {item.dueDate}</li>)}</ul> : <p className="mt-2 text-sm text-gray-400">No upcoming renewals.</p>}
      </div>
      {orders.map((order) => (
        <article key={order.id} className="glass rounded-xl p-5">
          <OrderSummary order={order} />
          <p className="mt-3 break-all text-sm text-gray-400">{order.customerName} · {order.customerEmail}</p>
          <details className="mt-3 border-t border-white/10 pt-3">
            <summary className="cursor-pointer font-semibold">Manage order and payments</summary>
            <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={(event) => submit(event, 'update', { id: order.id })}>
              <label>Stage<select name="stage" defaultValue={order.stage} className={orderField}>{stages.slice(stages.indexOf(order.stage)).map((stage) => <option key={stage}>{stage}</option>)}</select></label>
              <label>Delivery link<input name="deliveryUrl" type="url" defaultValue={order.deliveryUrl} className={orderField} /></label>
              <label className="sm:col-span-2">Private notes<textarea name="privateNotes" maxLength={1500} defaultValue={order.privateNotes} className={orderField} /></label>
              <button className={orderButton} disabled={busy}>Save order update</button>
            </form>
            <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(event) => submit(event, 'payment', { id: order.id })}>
              <label>Development payment (LKR)<input name="amount" type="number" min={1} max={order.total - order.paid} step={1} required className={orderField} /></label>
              <button className={orderButton} disabled={busy || order.total === order.paid}>Record payment</button>
            </form>
            <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={(event) => submit(event, 'addService', { id: order.id })}>
              <label>Recurring service<select name="type" className={orderField}>{['Hosting', 'Domain', 'Maintenance'].map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Annual fee (LKR)<input name="amount" type="number" min={1} step={1} required className={orderField} /></label>
              <label>First renewal date<input name="dueDate" type="date" required className={orderField} /></label>
              <button className={orderButton} disabled={busy}>Add annual service</button>
            </form>
            {order.services.map((item) => <form key={item.id} className="mt-3 flex flex-wrap items-center justify-between gap-3" onSubmit={(event) => submit(event, 'renewal', { id: order.id, serviceId: item.id, cycle: item.dueDate })}><p className="text-sm">{item.type} · {item.dueDate} · {formatLkr(item.amount)}</p><button className={orderButton} disabled={busy}>Confirm renewal payment</button></form>)}
          </details>
        </article>
      ))}
    </section>
  );
}
