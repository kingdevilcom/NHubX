import { useCallback, useEffect, useRef, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

const dateLabel = new Intl.DateTimeFormat('en-LK', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Colombo' });

export default function OrderChat({ order, admin = false, onRead }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(null);
  const [older, setOlder] = useState([]);
  const [olderAvailable, setOlderAvailable] = useState(false);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const retry = useRef(null);
  const requestVersion = useRef(0);
  const lastSequence = useRef(null);
  const history = useRef(null);
  const followLatest = useRef(true);
  const unread = admin ? order.chat?.adminUnread : order.unreadMessages;

  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    setRefreshing(true);
    try {
      let more;
      do {
        const after = lastSequence.current ?? undefined;
        const data = await orderRequest('chatList', { id: order.id, admin, after });
        if (version !== requestVersion.current) return;
        lastSequence.current = data.messages.at(-1)?.sequence ?? after ?? 0;
        if (data.messages.length || after === undefined) {
          setPage((current) => current ? { ...current, messages: [...current.messages, ...data.messages] } : data);
        }
        more = data.more;
      } while (more && document.visibilityState === 'visible');
      setError('');
      if (!more) onRead?.(order.id);
    } finally {
      if (version === requestVersion.current) setRefreshing(false);
    }
  }, [order.id, admin, onRead]);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      load().catch((err) => { if (active) setError(err.message); });
    };
    refresh();
    const timer = setInterval(refresh, 30_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      active = false;
      requestVersion.current += 1;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [load, open]);

  useEffect(() => {
    if (open && history.current && followLatest.current) history.current.scrollTop = history.current.scrollHeight;
  }, [open, page]);

  async function loadOlder() {
    setBusy(true);
    setError('');
    try {
      const before = (older[0] ?? page?.messages[0])?.sequence;
      if (!before) return;
      const data = await orderRequest('chatList', { id: order.id, admin, before });
      followLatest.current = false;
      setOlder((saved) => [...data.messages, ...saved]);
      setOlderAvailable(data.older);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function send(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy) return;
    if (retry.current?.message !== message) retry.current = { message, operation: crypto.randomUUID() };
    setBusy(true);
    setError('');
    try {
      await orderRequest('chatSend', { id: order.id, admin, ...retry.current });
      setDraft('');
      retry.current = null;
      followLatest.current = true;
      await load();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  const messages = [...new Map([...older, ...(page?.messages ?? [])].map((item) => [item.id, item])).values()];
  return (
    <details className="mt-4 rounded-xl border border-white/10 p-4" onToggle={(event) => {
      followLatest.current = true;
      setOpen(event.currentTarget.open);
    }}>
      <summary className="cursor-pointer font-semibold">Messages{Boolean(unread) && <span className="ml-2 rounded-full bg-nhubx-glow-primary px-2 py-0.5 text-xs">{unread} unread</span>}</summary>
      <div className="mt-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-400">Private to this order. Use the order actions to approve quotes or delivery.</p>
          <button type="button" className="text-sm text-nhubx-glow-primary underline disabled:opacity-50" disabled={refreshing} onClick={() => load().catch((err) => setError(err.message))}>{refreshing ? 'Refreshing…' : 'Refresh messages'}</button>
        </div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {!page && !error && <p role="status" className="text-sm text-gray-400">Loading messages…</p>}
        {page && !messages.length && <p className="text-sm text-gray-400">No messages yet.</p>}
        {(older.length ? olderAvailable : page?.older) && <button type="button" disabled={busy} onClick={loadOlder} className="text-sm text-nhubx-glow-primary underline">Load older messages</button>}
        <ol ref={history} aria-label="Order messages" className="max-h-72 space-y-2 overflow-y-auto" onScroll={(event) => {
          const list = event.currentTarget;
          followLatest.current = list.scrollHeight - list.scrollTop - list.clientHeight < 48;
        }}>
          {messages.map((item) => <li key={item.id} className={item.role === (admin ? 'admin' : 'customer') ? 'ml-5 rounded-lg bg-nhubx-glow-primary/10 p-3' : 'mr-5 rounded-lg bg-white/5 p-3'}>
            <p className="text-xs font-semibold text-gray-300">{item.role === (admin ? 'admin' : 'customer') ? 'You' : item.role === 'admin' ? 'NHubX' : 'Customer'} · <time dateTime={item.createdAt}>{dateLabel.format(new Date(item.createdAt))}</time></p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{item.text}</p>
          </li>)}
        </ol>
        <form onSubmit={send} className="space-y-2">
          <label className="block text-sm font-semibold">Write a message<textarea value={draft} onChange={(event) => setDraft(event.target.value)} disabled={busy} rows={3} maxLength={2000} className={orderField + ' mt-1'} /></label>
          <button className={orderButton} disabled={busy || !draft.trim()}>Send message</button>
        </form>
      </div>
    </details>
  );
}
