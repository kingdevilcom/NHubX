import { useEffect, useRef, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

export default function AdminEmail() {
  const [settings, setSettings] = useState(null);
  const [sender, setSender] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const attempt = useRef(null);

  useEffect(() => {
    let active = true;
    orderRequest('adminEmailConfig')
      .then((config) => {
        if (active) {
          setSettings(config);
          setSender(config.senderAddress);
        }
      })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function send(event) {
    event.preventDefault();
    if (!settings?.configured || busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const draft = Object.fromEntries(['from', 'to', 'subject', 'message'].map((field) => [field, values.get(field).trim()]));
    const fingerprint = JSON.stringify(draft);
    setError('');
    setSuccess('');
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
      setSuccess(receipt.recipientCount
        ? 'Resend accepted separate emails for ' + receipt.recipientCount + ' recipients.'
        : 'Resend accepted the email to ' + receipt.to + '.');
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
      {settings && !settings.configured && <p role="alert" className="mt-3 text-sm text-red-300">Check the Resend key and sender settings in Vercel.</p>}
      <form onSubmit={send} className="mt-5">
        <fieldset disabled={!settings?.configured || busy} className="space-y-4 disabled:opacity-60">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="admin-email-from" className="text-sm font-semibold">From</label>
              {settings?.configured && <div className="flex flex-wrap gap-3">
                {settings.founder && sender.toLowerCase() !== settings.founder.address && <button type="button" className="text-xs text-nhubx-glow-primary underline" onClick={() => setSender(settings.founder.address)}>Use Founder sender</button>}
                {sender !== settings.senderAddress && <button type="button" className="text-xs text-nhubx-glow-primary underline" onClick={() => setSender(settings.senderAddress)}>Use default</button>}
              </div>}
            </div>
            <input id="admin-email-from" type="email" name="from" value={sender} onChange={(event) => setSender(event.target.value)} maxLength={254} required aria-describedby="admin-email-domain" className={orderField + ' mt-1'} />
            {settings?.configured && <p id="admin-email-domain" className="mt-1 text-xs text-gray-400">Use any address ending in @{settings.senderDomain}.{settings.replyTo && ' Replies go to ' + settings.replyTo + '.'}</p>}
            {settings?.founder && sender.trim().toLowerCase() === settings.founder.address && <p className="mt-1 text-sm text-gray-300">Recipients see <strong>{settings.founder.name}</strong>.</p>}
          </div>
          <div>
            <label htmlFor="admin-email-to" className="text-sm font-semibold">To</label>
            <textarea id="admin-email-to" name="to" rows={3} maxLength={6500} placeholder="name@example.com" required aria-describedby="admin-email-recipients" autoCapitalize="none" spellCheck={false} className={orderField + ' mt-1'} />
            <p id="admin-email-recipients" className="mt-1 text-xs text-gray-400">Separate addresses with commas or new lines. {settings?.recipientLimit && 'Up to ' + settings.recipientLimit + ' people per send.'} Each person gets a private copy.</p>
          </div>
          <label className="block text-sm font-semibold">Subject<input name="subject" maxLength={150} required className={orderField + ' mt-1'} /></label>
          <label className="block text-sm font-semibold">Message<textarea name="message" rows={8} maxLength={10000} required className={orderField + ' mt-1'} /></label>
          <button className={orderButton}>{busy ? 'Sending…' : 'Send email'}</button>
        </fieldset>
      </form>
      {success && <p role="status" className="mt-4 break-words text-sm text-green-300">{success}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    </section>
  );
}
