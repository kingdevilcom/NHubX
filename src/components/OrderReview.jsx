import { useId, useState } from 'react';
import { BadgeCheck, Clock3, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderButton, orderField, orderRequest } from '../orders';
import { ReviewRatingInput } from './ReviewStars';

const reviewStatuses = {
  pending: { icon: Clock3, title: 'Review awaiting moderation', description: 'We’ll check your review before it appears on the site.' },
  published: { icon: BadgeCheck, title: 'Review published', description: 'Your verified review is visible on the site.' },
  withheld: { icon: ShieldAlert, title: 'Review withheld', description: 'You can revise your review and submit it again.' },
};

export default function OrderReview({ order, onSubmitted }) {
  const [editing, setEditing] = useState(false);
  const status = order.reviewStatus;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const commentId = useId();
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const values = new FormData(event.currentTarget);
    try {
      await orderRequest('submitReview', { id: order.id, rating: Number(values.get('rating')), display: values.get('display'), comment: values.get('comment'), consent: values.get('consent') === 'on', resubmit: editing });
      onSubmitted(order.id);
      setEditing(false);
      setRating(0);
      setComment('');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (order.stage !== 'Delivered') return null;
  if (reviewStatuses[status] && !editing) {
    const { icon: Icon, title, description } = reviewStatuses[status];
    return <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm">
      <Icon size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-nhubx-glow-primary" />
      <div>
        <div role="status"><p className="font-semibold">{title}</p><p className="mt-1 text-gray-300">{description}</p></div>
        {status === 'withheld' && order.reviewModerationReason && <p className="mt-1 text-gray-400">Reason for withholding · {order.reviewModerationReason}</p>}
        {status === 'published' && <Link to="/reviews" className="mt-2 inline-block text-nhubx-glow-primary underline">See public reviews</Link>}
        {status === 'withheld' && <button type="button" className="mt-2 text-nhubx-glow-primary underline" onClick={() => setEditing(true)}>Submit a revised review</button>}
      </div>
    </div>;
  }
  return (
    <details open={editing || undefined} className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <summary className="cursor-pointer font-semibold text-nhubx-glow-primary">{editing ? 'Revise your review' : 'Leave a review'}</summary>
      <form className="mt-4 space-y-4" onSubmit={submit}>
        <ReviewRatingInput rating={rating} onChange={setRating} />
        <div>
          <label htmlFor={commentId} className="text-sm font-semibold">Your review</label>
          <textarea id={commentId} aria-describedby={commentId + '-count'} className={orderField + ' mt-1'} name="comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} rows={4} placeholder="Tell others about your experience with NHubX" required />
          <p id={commentId + '-count'} className="mt-1 text-right text-xs text-gray-400">{comment.length}/1,000 characters</p>
        </div>
        <label className="block max-w-xs text-sm font-semibold">Public display name<select className={orderField + ' mt-1'} name="display"><option value="anonymous">Verified customer</option><option value="firstName">My first name</option></select></label>
        <p className="text-sm text-gray-400">Share your experience without including email addresses, phone numbers, or other private details.</p>
        <label className="flex items-start gap-2 rounded-lg border border-white/10 p-3 text-sm"><input className="mt-1" type="checkbox" name="consent" required /> I agree to publish this review and my selected display name.</label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <button className={orderButton} disabled={busy}>{busy ? 'Submitting…' : 'Submit review'}</button>
        {editing && <button type="button" disabled={busy} className="ml-3 text-sm text-gray-300" onClick={() => { setEditing(false); setError(''); }}>Cancel</button>}
      </form>
    </details>
  );
}
