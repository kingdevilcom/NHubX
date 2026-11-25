import { useEffect, useRef, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

export default function AdminEmail() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const attempt = useRef(null);

  useEffect(() => {
    let active = true;
    orderRequest('adminEmailConfig')
      .then((config) => { if (active) setSettings(config); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function send(event) {
    event.preventDefault();
    if (!settings?.configured || busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const draft = Object.fromEntries(['to', 'subject', 'message'].map((field) => [field, values.get(field).trim()]));
    const fingerprint = JSON.stringify(draft);
    setError('');
    setSentTo('');
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { fingerprint, operation: crypto.randomUUID(), startedAt: Date.now() };
    }
    if (Date.now() - attempt.current.startedAt >= 23 * 3_600_000) {
      setError('This retry has expired. Check the Resend dashboard for the original send before composing a new email.');
      return;
    }
    setBusy(true);
    try {
      const receipt = await orderRequest('adminEmailSend', { ...draft, operation: attempt.current.operation });
      form.reset();
      attempt.current = null;
      setSentTo(receipt.to);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="max-w-2xl rounded-xl border border-white/10 bg-[#19191b] p-5 sm:p-6" aria-labelledby="compose-email">
      <h2 id="compose-email" className="text-lg font-bold">Compose email</h2>
      {loading && <p role="status" className="mt-2 text-sm text-gray-400">Loading sender…</p>}
      {settings && <dl className="mt-3 space-y-1 text-sm text-gray-300">
        <div className="flex flex-wrap gap-x-2"><dt className="font-semibold">From</dt><dd className="break-all">{settings.from}</dd></div>
        {settings.replyTo && <div className="flex flex-wrap gap-x-2"><dt className="font-semibold">Reply to</dt><dd className="break-all">{settings.replyTo}</dd></div>}
      </dl>}
      {settings && !settings.configured && <p role="alert" className="mt-3 text-sm text-red-300">Check the Resend key and sender settings in Vercel.</p>}
      <form onSubmit={send} className="mt-5">
        <fieldset disabled={!settings?.configured || busy} className="space-y-4 disabled:opacity-60">
          <label className="block text-sm font-semibold">To<input type="email" name="to" maxLength={254} placeholder="name@example.com" required className={orderField + ' mt-1'} /></label>
          <label className="block text-sm font-semibold">Subject<input name="subject" maxLength={150} required className={orderField + ' mt-1'} /></label>
          <label className="block text-sm font-semibold">Message<textarea name="message" rows={8} maxLength={10000} required className={orderField + ' mt-1'} /></label>
          <button className={orderButton}>{busy ? 'Sending…' : 'Send email'}</button>
        </fieldset>
      </form>
      {sentTo && <p role="status" className="mt-4 break-words text-sm text-green-300">Resend accepted the email to {sentTo}.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </section>
  );
}
