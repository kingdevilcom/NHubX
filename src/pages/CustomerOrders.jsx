import { useCallback, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { Package, RefreshCw } from 'lucide-react';
import { app } from '../firebase';
import { formatLkr, orderButton, orderRequest } from '../orders';
import { hasPendingRevision, needsCustomerAction, nextOrderActions, upcomingRenewals } from '../orderWorkspace';
import OrderSummary from '../components/OrderSummary';
import OrderChat from '../components/OrderChat';
import OrderReview from '../components/OrderReview';

const auth = getAuth(app);
const filters = [['all', 'All orders'], ['action', 'Needs my action'], ['active', 'Active'], ['delivered', 'Delivered']];

export default function CustomerOrders() {
  const [user, setUser] = useState(undefined);
  const [result, setResult] = useState(null);
  const markChatRead = useCallback((id) => setResult((current) => current && ({
    ...current,
    orders: current.orders.map((order) => order.id === id ? { ...order, unreadMessages: 0 } : order),
  })), []);
  const orders = user?.uid === result?.uid ? (result?.orders ?? []) : [];
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');
  const [refreshCount, setRefreshCount] = useState(0);
  const [feedbackOrder, setFeedbackOrder] = useState(null);
  const [feedback, setFeedback] = useState('');
  const ordersToReview = orders.filter(needsCustomerAction);
  const visible = orders.filter((order) => filter === 'all' || (filter === 'action' && needsCustomerAction(order)) || (filter === 'active' && order.stage !== 'Delivered') || (filter === 'delivered' && order.stage === 'Delivered'));

  useEffect(() => {
    document.title = 'My orders | NHubX';
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    let current = true;
    orderRequest('list').then((rows) => { if (current) setResult({ uid: user.uid, orders: rows }); })
      .catch((err) => { if (current) setError(err.message); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [user, refreshCount]);

  async function change(action, order, message) {
    setPending(order.id);
    setError('');
    setNotice('');
    try {
      await orderRequest(action, { id: order.id, operation: crypto.randomUUID(), message });
      setResult((current) => current?.uid === user.uid ? {
        ...current,
        orders: current.orders.map((item) => item.id !== order.id ? item : action === 'requestChanges'
          ? { ...item, revisionRequest: { status: 'pending', message } }
          : { ...item, stage: action === 'accept' ? 'Accepted' : 'Delivered' }),
      } : current);
      setNotice(action === 'requestChanges' ? 'Your feedback was sent to NHubX.' : action === 'accept' ? 'Quote accepted.' : 'Delivery approved.');
      setFeedbackOrder(null);
      setFeedback('');
      setFilter('all');
      setRefreshCount((count) => count + 1);
    } catch (err) {
      setError(err.message);
    } finally { setPending(null); }
  }

  const signIn = () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider).catch((err) => { setError(err.message); setLoading(false); });
  };

  return (
    <section className="mx-auto min-h-screen max-w-5xl px-5 pb-16 pt-28 sm:pt-32">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div><h1 className="text-4xl font-black tracking-tight">My orders</h1><p className="mt-2 text-gray-400">Review quotes, track delivery, and manage annual renewals.</p></div>
        {user && <div className="flex max-w-full flex-wrap items-center gap-2 text-sm"><span className="break-all text-gray-400">{user.email}</span><button type="button" aria-label="Refresh orders" disabled={loading || Boolean(pending)} onClick={() => { setError(''); setLoading(true); setRefreshCount((count) => count + 1); }} className="rounded-lg border border-white/15 p-2 disabled:opacity-50"><RefreshCw size={16} /></button><button onClick={() => { setResult(null); setError(''); setNotice(''); setFilter('all'); setFeedback(''); setFeedbackOrder(null); signOut(auth).catch((err) => setError(err.message)); }} className="rounded-lg border border-white/15 px-3 py-2">Sign out</button></div>}
      </header>
      {user === undefined && <p className="mt-5" role="status">Checking sign-in…</p>}
      {user === null && <div className="glass mt-6 max-w-xl rounded-2xl p-6"><Package size={26} className="mb-3 text-nhubx-glow-primary" aria-hidden="true" /><h2 className="mb-2 text-lg font-bold">Sign in to your orders</h2><p className="mb-4 text-gray-400">Use the Google account with the same email address as your quote.</p><button className={orderButton} disabled={loading} onClick={signIn}>Sign in with Google</button></div>}
      {error && <p role="alert" className="mt-4 text-red-300">{error}</p>}
      {user && !error && result?.uid !== user.uid && <p className="mt-6 text-gray-400" role="status">Loading orders…</p>}
      {user && notice && <p role="status" className="mt-4 rounded-xl border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm text-green-300">{notice}</p>}
      {user && result?.uid === user.uid && !orders.length && !error && <div className="glass mt-6 rounded-2xl p-6"><p className="font-semibold">No orders found for this email.</p><p className="mt-2 text-sm text-gray-400">Use the email on your quote, or choose a plan if you’re starting a new project.</p><Link to="/pricing" className={orderButton + ' mt-4 inline-block'}>View plans</Link></div>}
      {user && orders.length > 0 && <>
        <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[['Needs your action', ordersToReview.length], ['Development balance', formatLkr(orders.filter((order) => order.stage !== 'Quote sent').reduce((sum, order) => sum + order.total - order.paid, 0))], ['Renewals due soon or overdue', upcomingRenewals(orders).length]].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-sm text-gray-400">{label}</dt><dd className="mt-1 text-xl font-bold">{value}</dd></div>
          ))}
        </dl>
        <div aria-label="Filter orders" className="mt-5 flex flex-wrap gap-2">{filters.map(([id, label]) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => setFilter(id)} className={`rounded-lg border px-3 py-2 text-sm ${filter === id ? 'border-nhubx-glow-primary/40 bg-nhubx-glow-primary/10 text-nhubx-glow-primary' : 'border-white/15 text-gray-300 hover:bg-white/5'}`}>{label}</button>)}</div>
        {!visible.length && <p className="mt-4 text-sm text-gray-400">No orders in this view.</p>}
      </>}
      {user && visible.map((order) => (
        <article key={order.id} className="glass mt-5 rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div><p className="text-sm font-semibold">{hasPendingRevision(order) ? 'Changes requested' : needsCustomerAction(order) ? 'Needs your action' : 'What’s next'}</p><p className="mt-1 text-sm text-gray-400">{hasPendingRevision(order) ? 'NHubX has your feedback. You’ll be able to review the updated delivery here.' : nextOrderActions[order.stage]}</p></div>
            {needsCustomerAction(order) && <div className="flex flex-wrap gap-2">
              {order.stage === 'Review' && <button type="button" disabled={Boolean(pending)} aria-expanded={feedbackOrder === order.id} className="rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold disabled:opacity-50" onClick={() => { setFeedbackOrder(feedbackOrder === order.id ? null : order.id); setFeedback(''); }}>Request changes</button>}
              <button type="button" className={orderButton} disabled={Boolean(pending)} onClick={() => change(order.stage === 'Review' ? 'approveDelivery' : 'accept', order)}>{pending === order.id ? 'Saving…' : order.stage === 'Review' ? 'Approve delivery' : 'Accept quote'}</button>
            </div>}
          </div>
          {feedbackOrder === order.id && needsCustomerAction(order) && <form className="mb-4 space-y-3 rounded-xl border border-white/10 p-4" onSubmit={(event) => { event.preventDefault(); if (feedback.trim()) change('requestChanges', order, feedback.trim()); }}>
            <label className="block text-sm font-semibold">What would you like changed?<textarea rows={3} maxLength={1500} required value={feedback} onChange={(event) => setFeedback(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/15 bg-[#151515] p-3 text-base" /></label>
            <button className={orderButton} disabled={Boolean(pending) || !feedback.trim()}>Send feedback</button>
          </form>}
          {order.revisionRequest && <details className="mb-4 rounded-xl border border-white/10 p-4 text-sm"><summary className="cursor-pointer font-semibold">Latest review feedback</summary><p className="mt-2 whitespace-pre-wrap break-words text-gray-300">{order.revisionRequest.message}</p>{order.revisionRequest.response && <p className="mt-3 whitespace-pre-wrap break-words text-gray-400">NHubX: {order.revisionRequest.response}</p>}</details>}
          <OrderSummary order={order} showProgress />
          <OrderChat order={order} onRead={markChatRead} />
          <OrderReview order={order} onSubmitted={(id) => setResult((current) => current && ({
            ...current,
            orders: current.orders.map((item) => item.id === id ? { ...item, reviewStatus: 'pending', reviewModerationReason: null } : item),
          }))} />
        </article>
      ))}
    </section>
  );
}
