import { useEffect, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';

const reviewDate = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeZone: 'Asia/Colombo' });

export default function AdminReviews() {
  const [reviews, setReviews] = useState(null);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    orderRequest('reviewQueue')
      .then((items) => { if (active) setReviews(items); })
      .catch((error) => { if (active) setNotice(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);

  async function moderate(event, { id, createdAt }, status) {
    event.preventDefault();
    setBusy(id);
    setNotice('');
    const reason = new FormData(event.currentTarget).get('reason');
    try {
      await orderRequest('moderateReview', { id, createdAt, status, reason });
      setReviews((items) => items.filter((item) => item.id !== id));
      setNotice(status === 'published' ? 'Review published.' : 'Review withheld.');
    } catch (error) { setNotice(error.message); }
    finally { setBusy(null); }
  }

  return (
    <section className="space-y-4">
      <p className="text-sm text-gray-400">Publish genuine feedback at any rating. Withhold a review for spam, abuse, personal information, or material unrelated to the order.</p>
      <button type="button" className="rounded-lg border border-white/15 px-3 py-2 text-sm" disabled={loading || Boolean(busy)} onClick={() => {
        setLoading(true);
        setNotice('');
        setRefresh((count) => count + 1);
      }}>{loading ? 'Refreshing…' : 'Refresh queue'}</button>
      {notice && <p role="status" className="text-sm text-gray-300">{notice}</p>}
      {!reviews && !notice && <p role="status" className="text-gray-400">Loading reviews…</p>}
      {reviews?.length === 0 && <p className="text-gray-400">No reviews awaiting moderation.</p>}
      {reviews?.map((review) => (
        <article key={review.id} className="rounded-xl border border-white/10 bg-[#19191b] p-5">
          <h2 className="font-bold">{review.displayName} · {review.rating}/5</h2>
          <p className="mt-1 text-xs text-gray-400">{review.orderNumber && review.orderNumber + ' · '}<time dateTime={review.createdAt}>{reviewDate.format(new Date(review.createdAt))}</time></p>
          <p className="mt-3 whitespace-pre-wrap break-words text-gray-300">{review.comment}</p>
          <form onSubmit={(event) => moderate(event, review, 'published')} className="mt-4"><button className={orderButton} disabled={loading || Boolean(busy)}>Publish review</button></form>
          <details className="mt-3"><summary className="cursor-pointer text-sm text-gray-400">Withhold review</summary>
            <form onSubmit={(event) => moderate(event, review, 'withheld')} className="mt-2 flex flex-wrap gap-2">
              <label><span className="sr-only">Moderation reason</span><select name="reason" className={orderField} defaultValue="" required><option value="" disabled>Choose a reason</option>{['Spam', 'Abuse', 'Personal information', 'Unrelated to the order'].map((reason) => <option key={reason}>{reason}</option>)}</select></label>
              <button className="rounded-lg border border-white/15 px-3 text-sm" disabled={loading || Boolean(busy)}>Withhold review</button>
            </form>
          </details>
        </article>
      ))}
    </section>
  );
}
