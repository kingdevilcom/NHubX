import { useRef, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

export default function OrderEmailPanel({ order }) {
  const [messages, setMessages] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const retry = useRef(null);

  async function loadHistory() {
    setMessages(await orderRequest('emailHistory', { id: order.id }));
  }

  async function refresh() {
    setBusy(true);
    setNotice('');
    try { await loadHistory(); }
    catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }

  async function send(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const { subject, message } = Object.fromEntries(new FormData(form));
    const fingerprint = JSON.stringify([subject, message]);
    if (retry.current?.fingerprint !== fingerprint) retry.current = { fingerprint, operation: crypto.randomUUID() };
    setBusy(true);
    setNotice('');
    try {
      await orderRequest('sendEmail', { id: order.id, subject, message, operation: retry.current.operation });
      retry.current = null;
      form.reset();
      setNotice('Email saved. Check its status below.');
      await loadHistory().catch(() => setNotice('Email saved. Refresh the history to see its status.'));
    } catch (error) {
      setNotice(error.message);
    } finally { setBusy(false); }
  }

  async function check(emailId) {
    setBusy(true);
    setNotice('');
    try {
      const updated = await orderRequest('checkEmail', { id: order.id, emailId });
      setMessages((current) => ({
        quote: current.quote?.id === emailId ? updated : current.quote,
        history: current.history.map((item) => item.id === emailId ? updated : item),
      }));
    } catch (error) { setNotice(error.message); }
    finally { setBusy(false); }
  }

  const history = messages ? [messages.quote, ...messages.history].filter(Boolean) : [];
  return (
    <details className="mt-3 border-t border-white/10 pt-3" onToggle={(event) => {
      if (event.currentTarget.open && !messages && !busy) refresh();
    }}>
      <summary className="cursor-pointer font-semibold">Customer email</summary>
      <p className="mt-3 break-all text-sm text-gray-400">To {order.customerEmail}</p>
      <form onSubmit={send} className="mt-3 space-y-3">
        <label className="block">Subject<input name="subject" className={orderField} maxLength={160} required /></label>
        <label className="block">Message<textarea name="message" className={orderField} maxLength={4000} rows={4} required /></label>
        <button className={orderButton} disabled={busy}>Send email</button>
      </form>
      <p className="mt-3 text-sm text-gray-300" role="status">{notice || (busy ? 'Working…' : '')}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">Email history</h3>
        <button type="button" disabled={busy} onClick={refresh} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-50">Refresh history</button>
      </div>
      {messages && history.length === 0 && <p className="mt-2 text-sm text-gray-400">No emails recorded for this order.</p>}
      <ul className="mt-2 divide-y divide-white/10">
        {history.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
            <div><p className="font-medium">{item.subject}</p><p className="text-gray-400">{item.status}</p></div>
            {item.canCheck && <button type="button" disabled={busy} onClick={() => check(item.id)} className="rounded-lg border border-white/15 px-3 py-1.5 disabled:opacity-50">Check delivery</button>}
          </li>
        ))}
      </ul>
    </details>
  );
}
