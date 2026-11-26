import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Search } from 'lucide-react';
import { formatLkr, orderButton, orderField, orderRequest, stages } from '../orders';
import { filterAdminOrders, hasPendingRevision, upcomingRenewals } from '../orderWorkspace';
import OrderSummary from './OrderSummary';
import OrderChat from './OrderChat';
import OrderEmailPanel from './OrderEmailPanel';

export default function AdminOrders() {
  const [params, setParams] = useSearchParams();
  const enquiryId = params.get('enquiry') || '';
  const [orders, setOrders] = useState([]);
  const markChatRead = useCallback((id) => {
    setSelectedId(id);
    setOrders((current) => current.map((order) =>
      order.id === id && order.chat?.adminUnread ? { ...order, chat: { ...order.chat, adminUnread: 0 } } : order));
  }, []);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const retry = useRef(null);
  const detail = useRef(null);

  async function loadOrders() {
    setLoading(true);
    setLoadError('');
    try { setOrders(await orderRequest('list', { admin: true })); }
    catch (err) { setLoadError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadOrders(); }, []);

  function selectOrder(id, clearFilters = false) {
    if (clearFilters) { setSearch(''); setStage(''); }
    setSelectedId(id);
    if (matchMedia('(max-width: 1023px)').matches) requestAnimationFrame(() => detail.current?.scrollIntoView({ block: 'start' }));
  }

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
      const result = await orderRequest(action, { ...input, operation: retry.current.operation });
      retry.current = null;
      if (action !== 'update') form.reset();
      setNotice(action === 'create' ? 'Quote saved. Open Customer email on the order to check its email status.' : action === 'resubmitDelivery' ? 'Updated delivery saved and customer notification queued.' : 'Saved.');
      await loadOrders();
      if (action === 'create') {
        if (enquiryId) setParams({ tab: 'orders' }, { replace: true });
        selectOrder(result.id, true);
      }
    } catch (err) { setNotice(err.message); }
    finally { setBusy(false); }
  }

  const renewals = upcomingRenewals(orders);
  const visible = filterAdminOrders(orders, search, stage);
  const selected = (stage === 'unread' ? orders : visible).find((order) => order.id === selectedId) ?? visible[0];
  const order = selected;
  const stats = [
    ['Open orders', orders.filter((order) => order.stage !== 'Delivered').length],
    ['Quotes awaiting approval', orders.filter((order) => order.stage === 'Quote sent').length],
    ['Changes requested', orders.filter(hasPendingRevision).length],
    ['Unpaid development', formatLkr(orders.filter((order) => order.stage !== 'Quote sent').reduce((sum, order) => sum + order.total - order.paid, 0))],
    ['Renewals due soon or overdue', renewals.length],
  ];

  return (
    <section className="space-y-5">
      {!loadError && (!loading || orders.length > 0) && <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {stats.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#19191b] p-4"><dt className="text-sm text-gray-400">{label}</dt><dd className="mt-2 text-xl font-bold sm:text-2xl">{value}</dd></div>)}
      </dl>}
      {notice && <p role="status" className="rounded-lg border border-white/10 p-3 text-sm text-gray-300">{notice}</p>}
      <details className="rounded-xl border border-white/10 bg-[#19191b] p-5" open={Boolean(enquiryId) || undefined}>
        <summary className="cursor-pointer text-base font-semibold text-nhubx-glow-primary">Create quote</summary>
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
      {renewals.length > 0 && <details className="rounded-xl border border-white/10 bg-[#19191b] p-5">
        <summary className="cursor-pointer font-semibold">Upcoming and overdue renewals ({renewals.length})</summary>
        <ul className="mt-3 divide-y divide-white/10">{renewals.map((item) => <li key={item.id} className="py-2 text-sm"><button type="button" className="text-left text-gray-300 hover:text-white hover:underline" onClick={() => selectOrder(item.orderId, true)}>{item.orderNumber && item.orderNumber + ' · '}{item.orderTitle} · {item.type} · {formatLkr(item.amount)} · <span className={item.overdue ? 'text-red-300' : 'text-gray-400'}>{item.overdue ? 'Overdue' : 'Due'} {item.dueDate}</span></button></li>)}</ul>
      </details>}
      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,1.6fr)]">
        <section className="min-w-0 self-start rounded-xl border border-white/10 bg-[#19191b] p-4" aria-label="Order list">
          <div className="flex items-center justify-between gap-3"><div><h2 className="font-bold">Order list</h2>{!loading && !loadError && <p className="mt-1 text-xs text-gray-400">{visible.length} of {orders.length} loaded orders</p>}</div><button type="button" aria-label="Refresh orders" disabled={loading || busy} onClick={loadOrders} className="rounded-lg border border-white/15 p-2 text-gray-300 disabled:opacity-50"><RefreshCw size={16} /></button></div>
          <div className="mt-3 grid gap-2">
            <label className="relative"><span className="sr-only">Search orders</span><Search size={16} aria-hidden="true" className="absolute left-2.5 top-2.5 text-gray-400" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, invoice or customer" className={orderField + ' pl-8'} /></label>
            <label><span className="sr-only">Filter orders by stage</span><select value={stage} onChange={(event) => setStage(event.target.value)} className={orderField}><option value="">All stages</option><option value="unread">Unread messages</option><option value="revision">Changes requested</option>{stages.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          {loadError && <p role="alert" className="mt-3 text-sm text-red-300">{loadError}</p>}
          {loading && <p role="status" className="mt-3 text-sm text-gray-400">Loading orders…</p>}
          {!loading && !loadError && !visible.length && <p className="mt-3 text-sm text-gray-400">{orders.length ? 'No orders match these filters.' : 'No orders yet. Create a quote to start.'}</p>}
          {visible.length > 0 && <ul className="mt-3 max-h-[34rem] space-y-1 overflow-y-auto pr-1">
            {visible.map((order) => <li key={order.id}><button type="button" aria-current={selected?.id === order.id ? 'true' : undefined} onClick={() => selectOrder(order.id)} className={`w-full rounded-lg border p-3 text-left ${selected?.id === order.id ? 'border-nhubx-glow-primary/35 bg-nhubx-glow-primary/10' : 'border-transparent hover:bg-white/5'}`}><strong className="block truncate text-sm">{order.title}</strong><span className="mt-1 block truncate text-xs text-gray-400">{order.orderNumber && order.orderNumber + ' · '}{order.customerName} · {hasPendingRevision(order) ? 'Changes requested' : order.stage}</span>{order.chat?.adminUnread > 0 && <span className="mt-1 block text-xs text-orange-300">{order.chat.adminUnread} unread</span>}</button></li>)}
          </ul>}
        </section>
        <div ref={detail} className="min-w-0 scroll-mt-4">
        {order && (
        <article key={order.id} className="rounded-xl border border-white/10 bg-[#19191b] p-5">
          <OrderSummary order={order} showProgress />
          <OrderChat order={order} admin onRead={markChatRead} />
          <p className="mt-3 break-all text-sm text-gray-400">{order.customerName} · {order.customerEmail}</p>
          {order.revisionRequest && <section aria-label="Review feedback" className="mt-4 rounded-xl border border-nhubx-glow-primary/30 bg-nhubx-glow-primary/5 p-4">
            <h3 className="font-bold">{hasPendingRevision(order) ? 'Changes requested' : 'Latest review feedback'}</h3>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-300">{order.revisionRequest.message}</p>
            {hasPendingRevision(order) ? <form className="mt-4 space-y-3" onSubmit={(event) => submit(event, 'resubmitDelivery', { id: order.id })}>
              <label className="block text-sm">Updated delivery link<input className={orderField + ' mt-1'} name="deliveryUrl" type="url" maxLength={512} defaultValue={order.deliveryUrl} required /></label>
              <label className="block text-sm">What changed? <span className="text-gray-400">(optional)</span><textarea className={orderField + ' mt-1'} rows={3} maxLength={1000} name="response" /></label>
              <button className={orderButton} disabled={busy}>Send updated delivery for review</button>
            </form> : order.revisionRequest.response && <p className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-400">Your response: {order.revisionRequest.response}</p>}
          </section>}
          <OrderEmailPanel order={order} />
          <details className="mt-3 border-t border-white/10 pt-3">
            <summary className="cursor-pointer font-semibold">Order details</summary>
            <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={(event) => submit(event, 'update', { id: order.id })}>
              <label>Stage<select key={order.stage + ':' + Boolean(hasPendingRevision(order))} name="stage" defaultValue={order.stage} className={orderField}>{(hasPendingRevision(order) ? [order.stage] : stages.slice(stages.indexOf(order.stage))).map((stage) => <option key={stage}>{stage}</option>)}</select></label>
              <label>Delivery link<input name="deliveryUrl" type="url" defaultValue={order.deliveryUrl} className={orderField} /></label>
              <label className="sm:col-span-2">Private notes<textarea name="privateNotes" maxLength={1500} defaultValue={order.privateNotes} className={orderField} /></label>
              <button className={orderButton} disabled={busy}>Save order update</button>
            </form>
          </details>
          <details className="mt-3 border-t border-white/10 pt-3">
            <summary className="cursor-pointer font-semibold">Development payments</summary>
            <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(event) => submit(event, 'payment', { id: order.id })}>
              <label>Development payment (LKR)<input name="amount" type="number" min={1} max={order.total - order.paid} step={1} required className={orderField} /></label>
              <button className={orderButton} disabled={busy || order.total === order.paid}>Record payment</button>
            </form>
          </details>
          <details className="mt-3 border-t border-white/10 pt-3">
            <summary className="cursor-pointer font-semibold">Annual services and renewals</summary>
            <form className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3" onSubmit={(event) => submit(event, 'addService', { id: order.id })}>
              <label>Recurring service<select name="type" className={orderField}>{['Hosting', 'Domain', 'Maintenance'].map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Annual fee (LKR)<input name="amount" type="number" min={1} step={1} required className={orderField} /></label>
              <label>First renewal date<input name="dueDate" type="date" required className={orderField} /></label>
              <button className={orderButton} disabled={busy}>Add annual service</button>
            </form>
            {order.services.map((item) => <form key={item.id} className="mt-3 flex flex-wrap items-center justify-between gap-3" onSubmit={(event) => submit(event, 'renewal', { id: order.id, serviceId: item.id, cycle: item.dueDate })}><p className="text-sm">{item.type} · {item.dueDate} · {formatLkr(item.amount)}</p><button className={orderButton} disabled={busy}>Confirm renewal payment</button></form>)}
          </details>
        </article>
        )}
        </div>
      </div>
    </section>
  );
}
