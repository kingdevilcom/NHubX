import { useEffect, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    orderRequest('reviewQueue').then(setReviews).catch((error) => setNotice(error.message));
  }, []);

  async function moderate(event, id, status) {
    event.preventDefault();
    setBusy(id);
    setNotice('');
    const reason = new FormData(event.currentTarget).get('reason');
    try {
      await orderRequest('moderateReview', { id, status, reason });
      setReviews((items) => items.filter((item) => item.id !== id));
      setNotice(status === 'published' ? 'Review published.' : 'Review withheld.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(null); }
  }

  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-400">Publish genuine feedback at any rating. Withhold a review for spam, abuse, personal information, or material unrelated to the order.</p>
      {notice && <p role="status" className="text-sm text-gray-300">{notice}</p>}
      {!reviews && !notice && <p role="status" className="text-gray-400">Loading reviews…</p>}
      {reviews?.length === 0 && <p className="text-gray-400">No reviews awaiting moderation.</p>}
      {reviews?.map((review) => (
        <article key={review.id} className="rounded-xl border border-white/10 bg-[#19191b] p-5">
          <h2 className="font-bold">{review.displayName} · {review.rating}/5</h2>
          {review.orderNumber && <p className="mt-1 text-xs text-gray-400">{review.orderNumber}</p>}
          <p className="mt-3 whitespace-pre-wrap break-words text-gray-300">{review.comment}</p>
          <form onSubmit={(event) => moderate(event, review.id, 'published')} className="mt-4"><button className={orderButton} disabled={Boolean(busy)}>Publish review</button></form>
          <details className="mt-3"><summary className="cursor-pointer text-sm text-gray-400">Withhold review</summary>
            <form onSubmit={(event) => moderate(event, review.id, 'withheld')} className="mt-2 flex flex-wrap gap-2">
              <label><span className="sr-only">Moderation reason</span><select name="reason" className={orderField} defaultValue="" required><option value="" disabled>Choose a reason</option>{['Spam', 'Abuse', 'Personal information', 'Unrelated to the order'].map((reason) => <option key={reason}>{reason}</option>)}</select></label>
              <button className="rounded-lg border border-white/15 px-3 text-sm" disabled={Boolean(busy)}>Withhold review</button>
            </form>
          </details>
        </article>
      ))}
    </section>
  );
}
