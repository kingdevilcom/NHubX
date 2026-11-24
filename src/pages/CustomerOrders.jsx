import { useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { orderButton, orderRequest } from '../orders';
import OrderSummary from '../components/OrderSummary';

const auth = getAuth(app);

export default function CustomerOrders() {
  const [user, setUser] = useState(undefined);
  const [result, setResult] = useState(null);
  const orders = user?.uid === result?.uid ? (result?.orders ?? []) : [];
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  }, [user]);

  async function change(action, order) {
    setPending(order.id);
    setError('');
    try {
      await orderRequest(action, { id: order.id, operation: crypto.randomUUID() });
      setResult({ uid: user.uid, orders: await orderRequest('list') });
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
    <section className="mx-auto min-h-screen max-w-4xl px-5 pb-20 pt-32">
      <h1 className="text-4xl font-black">My orders</h1>
      <p className="mt-3 text-gray-400">Review quotes, track delivery and see what renews each year.</p>
      {user === undefined && <p className="mt-5" role="status">Checking sign-in…</p>}
      {user === null && <div className="glass mt-6 rounded-2xl p-6"><p className="mb-4 text-gray-300">Sign in with the Google account that uses the email on your quote.</p><button className={orderButton} disabled={loading} onClick={signIn}>Sign in with Google</button></div>}
      {user && <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"><p>{user.email}</p><button onClick={() => { setResult(null); setError(''); signOut(auth).catch((err) => setError(err.message)); }} className="rounded-lg border border-white/20 px-3 py-2">Sign out</button></div>}
      {error && <p role="alert" className="mt-4 text-red-300">{error}</p>}
      {user && !error && result?.uid !== user.uid && <p className="mt-6 text-gray-400" role="status">Loading orders…</p>}
      {user && result?.uid === user.uid && !orders.length && !error && <p className="mt-6 text-gray-400">No orders found for this email.</p>}
      {user && orders.map((order) => (
        <article key={order.id} className="glass mt-5 rounded-2xl p-5 sm:p-6">
          <OrderSummary order={order} />
          {['Quote sent', 'Review'].includes(order.stage) && <button className={orderButton + ' mt-4'} disabled={Boolean(pending)} onClick={() => change(order.stage === 'Review' ? 'approveDelivery' : 'accept', order)}>{pending === order.id ? 'Saving…' : order.stage === 'Review' ? 'Approve delivery' : 'Accept quote'}</button>}
        </article>
      ))}
    </section>
  );
}
