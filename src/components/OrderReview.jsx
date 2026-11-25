import { useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

export default function OrderReview({ order, onSubmitted }) {
  const [editing, setEditing] = useState(false);
  const status = order.reviewStatus;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const values = new FormData(event.currentTarget);
    try {
      await orderRequest('submitReview', { id: order.id, rating: Number(values.get('rating')), display: values.get('display'), comment: values.get('comment'), consent: values.get('consent') === 'on', resubmit: editing });
      onSubmitted(order.id);
      setEditing(false);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (order.stage !== 'Delivered') return null;
  if (status && !editing) return <div className="mt-4 rounded-xl border border-white/10 p-3 text-sm text-gray-300">
    <p role="status">{status === 'pending' ? 'Thanks for your review. It’s awaiting moderation.' : status === 'published' ? 'Your verified review is published.' : 'Your review was withheld.'}
      {status === 'withheld' && order.reviewModerationReason && ' Reason: ' + order.reviewModerationReason}
    </p>
    {status === 'published' && <a href="/reviews" className="mt-2 inline-block text-nhubx-glow-primary underline">See public reviews</a>}
    {status === 'withheld' && <button type="button" className="mt-2 text-nhubx-glow-primary underline" onClick={() => setEditing(true)}>Submit a revised review</button>}
  </div>;
  return (
    <details open={editing || undefined} className="mt-4 rounded-xl border border-white/10 p-4">
      <summary className="cursor-pointer font-semibold">{editing ? 'Revise your review' : 'Leave a review'}</summary>
      <form className="mt-3 space-y-3" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>Rating<select className={orderField} name="rating" defaultValue="" required><option value="" disabled>Choose a rating</option>{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? 'star' : 'stars'}</option>)}</select></label>
          <label>Display as<select className={orderField} name="display"><option value="anonymous">Verified customer</option><option value="firstName">My first name</option></select></label>
        </div>
        <label className="block">Your review<textarea className={orderField + ' mt-1'} name="comment" maxLength={1000} rows={3} required /></label>
        <p className="text-sm text-gray-400">Share your experience without including email addresses, phone numbers, or other private details.</p>
        <label className="flex gap-2 text-sm"><input type="checkbox" name="consent" required /> I agree to publish this review and my selected display name.</label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button className={orderButton} disabled={busy}>{busy ? 'Submitting…' : 'Submit review'}</button>
        {editing && <button type="button" disabled={busy} className="ml-3 text-sm text-gray-300" onClick={() => { setEditing(false); setError(''); }}>Cancel</button>}
      </form>
    </details>
  );
}
