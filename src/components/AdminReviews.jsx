import { useEffect, useState } from 'react';
import { CircleCheck, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { orderButton, orderField, orderRequest } from '../orders';
import ReviewStars from './ReviewStars';
import AdminPublishedReviews from './AdminPublishedReviews';

const reviewDate = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeZone: 'Asia/Colombo' });

export default function AdminReviews() {
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'published' ? 'published' : 'queue';
  return <div className="space-y-4">
    <nav aria-label="Review management" className="flex flex-wrap gap-2">
      {[['queue', 'Moderation'], ['published', 'Published']].map(([id, label]) => <button key={id} type="button" aria-pressed={view === id} onClick={() => setParams(id === 'published' ? { tab: 'reviews', view: id } : { tab: 'reviews' }, { replace: true })} className="rounded-lg border border-white/15 px-3 py-2 text-sm aria-pressed:border-nhubx-glow-primary/40 aria-pressed:text-nhubx-glow-primary">{label}</button>)}
    </nav>
    {view === 'published' ? <AdminPublishedReviews /> : <ReviewQueue />}
  </div>;
}

function ReviewQueue() {
  const [reviews, setReviews] = useState(null);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    orderRequest('reviewQueue')
      .then((items) => { if (active) setReviews(items); })
      .catch((error) => { if (active) setNotice({ message: error.message, error: true }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);

  async function moderate(event, { id, createdAt }, status) {
    event.preventDefault();
    setBusy(id);
    setNotice(null);
    const reason = new FormData(event.currentTarget).get('reason');
    try {
      await orderRequest('moderateReview', { id, createdAt, status, reason });
      setReviews((items) => items.filter((item) => item.id !== id));
      setNotice({ message: status === 'published' ? 'Review published.' : 'Review withheld.' });
    } catch (error) { setNotice({ message: error.message, error: true }); }
    finally { setBusy(null); }
  }

  return (
    <section className="max-w-4xl space-y-4" aria-labelledby="review-queue-heading">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#19191b] p-4 sm:p-5">
        <div>
          <h2 id="review-queue-heading" className="font-bold">Moderation queue</h2>
          {reviews && <p className="mt-1 text-sm text-gray-400">{reviews.length === 50 ? '50 shown' : reviews.length + ' awaiting moderation'}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/reviews" className="text-sm text-nhubx-glow-primary hover:underline">View public reviews</Link>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-50" disabled={loading || Boolean(busy)} onClick={() => {
            setLoading(true);
            setNotice(null);
            setRefresh((count) => count + 1);
          }}><RefreshCw size={15} aria-hidden="true" /> {loading ? 'Refreshing…' : 'Refresh queue'}</button>
        </div>
        <p className="basis-full text-sm text-gray-400">Publish genuine feedback at any rating. Withhold a review for spam, abuse, personal information, or material unrelated to the order.</p>
      </div>
      {notice && <p role={notice.error ? 'alert' : 'status'} className={'rounded-lg border border-white/10 p-3 text-sm ' + (notice.error ? 'text-red-300' : 'text-gray-200')}>{notice.message}</p>}
      {!reviews && !notice && <p role="status" className="text-gray-400">Loading reviews…</p>}
      {reviews?.length === 0 && <p className="flex items-center gap-2 rounded-xl border border-white/10 p-4 text-sm text-gray-300"><CircleCheck size={18} aria-hidden="true" className="text-nhubx-glow-primary" /> No reviews awaiting moderation.</p>}
      {reviews?.map((review) => (
        <article key={review.id} className="rounded-xl border border-white/10 bg-[#19191b] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words font-bold">{review.displayName}</h3>
              <p className="mt-1 text-xs text-gray-400">{review.orderNumber && review.orderNumber + ' · '}<time dateTime={review.createdAt}>{reviewDate.format(new Date(review.createdAt))}</time></p>
            </div>
            <ReviewStars rating={review.rating} />
          </div>
          <blockquote className="my-4 whitespace-pre-wrap break-words rounded-lg bg-white/[0.04] p-3 text-gray-200">{review.comment}</blockquote>
          <form onSubmit={(event) => moderate(event, review, 'published')}><button className={orderButton} disabled={loading || Boolean(busy)}>Publish review</button></form>
          <details className="mt-3"><summary className="cursor-pointer text-sm font-medium text-gray-300">Withhold review</summary>
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
