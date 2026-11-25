import { useEffect, useState } from 'react';
import { orderRequest } from '../orders';

const button = 'rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-50';
const date = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Colombo' });
const formatDate = (value) => Number.isFinite(Date.parse(value)) ? date.format(new Date(value)) : '';

function readText(mail) {
  if (mail.text.trim()) return mail.text;
  const template = document.createElement('template');
  template.innerHTML = mail.html;
  template.content.querySelectorAll('head, script, style, template, noscript').forEach((element) => element.remove());
  template.content.querySelectorAll('p, div, li, tr, blockquote, br, h1, h2, h3').forEach((element) => element.after('\n'));
  return template.content.textContent.trim();
}

function Message({ mail }) {
  const text = readText(mail);
  return (
    <article className="min-w-0 rounded-xl border border-white/10 bg-[#19191b] p-4 sm:p-5">
      <h3 className="break-words font-bold">{mail.subject || '(No subject)'}</h3>
      <p className="mt-2 break-words text-sm text-gray-300">From {mail.from}</p>
      <p className="break-words text-sm text-gray-300">To {mail.to.join(', ')}</p>
      <time className="text-xs text-gray-400" dateTime={mail.createdAt}>{formatDate(mail.createdAt)}</time>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm">{text || 'No message text available.'}</p>
    </article>
  );
}

export default function AdminMailbox({ folder }) {
  const [page, setPage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    orderRequest('adminMailboxList', { folder })
      .then((result) => { if (active) setPage(result); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setBusy(''); });
    return () => { active = false; };
  }, [folder, refresh]);

  async function open(id) {
    setBusy('message');
    setError('');
    setSelected(null);
    setReplies(null);
    try { setSelected(await orderRequest('adminMailboxRead', { folder, id })); }
    catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }

  async function loadOlder() {
    setBusy('list');
    setError('');
    try {
      const result = await orderRequest('adminMailboxList', { folder, after: page.next });
      setPage({ ...result, items: [...page.items, ...result.items] });
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }

  async function findReplies(after) {
    setBusy('replies');
    setError('');
    try {
      const result = await orderRequest('adminMailboxReplies', { folder, id: selected.id, after });
      const items = after ? [...replies.items, ...result.items] : result.items;
      setReplies({ ...result, items });
    } catch (err) { setError(err.message); }
    finally { setBusy(''); }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold">{folder === 'inbox' ? 'Received email' : 'Sent email'}</h2>
        <button type="button" className={button} disabled={Boolean(busy) || (!page && !error)} onClick={() => {
          setError('');
          setBusy('list');
          setRefresh((count) => count + 1);
        }}>Refresh {folder === 'inbox' ? 'inbox' : 'sent mail'}</button>
      </div>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {!page && !error && <p role="status" className="text-sm text-gray-400">Loading email…</p>}
      {page?.items.length === 0 && <p className="text-sm text-gray-400">{folder === 'inbox' ? 'No email received by Resend yet.' : 'No sent email found in Resend.'}</p>}
      {page?.items.length > 0 && <div className="grid items-start gap-4 xl:grid-cols-[minmax(16rem,1fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
            {page.items.map((mail) => (
              <li key={mail.id}>
                <button type="button" aria-pressed={selected?.id === mail.id} disabled={Boolean(busy)} onClick={() => open(mail.id)} className="block w-full min-w-0 px-4 py-3 text-left hover:bg-white/5 aria-pressed:bg-white/10">
                  <span className="block truncate text-sm font-semibold">{mail.subject || '(No subject)'}</span>
                  <span className="block truncate text-xs text-gray-400">{folder === 'inbox' ? mail.from : mail.to.join(', ')}</span>
                  <time dateTime={mail.createdAt} className="text-xs text-gray-400">{formatDate(mail.createdAt)}</time>
                </button>
              </li>
            ))}
          </ul>
          {page.next && <button type="button" disabled={Boolean(busy)} onClick={loadOlder} className={button + ' mt-3'}>Load older email</button>}
        </div>
        <div className="min-w-0 space-y-4">
          {busy === 'message' && <p role="status" className="text-sm text-gray-400">Opening email…</p>}
          {selected && <Message mail={selected} />}
          {folder === 'sent' && selected && <section className="space-y-3" aria-label="Email replies">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold">Replies</h3>
              <button type="button" className={button} disabled={Boolean(busy)} onClick={() => findReplies(undefined)}>{busy === 'replies' ? 'Searching…' : replies ? 'Search again' : 'Find replies'}</button>
            </div>
            {replies?.unavailable && <p className="text-sm text-gray-400">Resend has no Message-ID for this email. You can still look for replies in Inbox.</p>}
            {replies && !replies.unavailable && replies.items.length === 0 && <p className="text-sm text-gray-400">No matching replies found{replies.next ? ' on this page' : ''}.</p>}
            {replies?.items.map((mail) => <Message key={mail.id} mail={mail} />)}
            {replies?.next && <button type="button" className={button} disabled={Boolean(busy)} onClick={() => findReplies(replies.next)}>Search older replies</button>}
          </section>}
        </div>
      </div>}
    </section>
  );
}
