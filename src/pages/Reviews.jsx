import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, MessageSquareText } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import ReviewStars from '../components/ReviewStars';

export default function Reviews() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageError, setPageError] = useState(false);

  async function loadMore() {
    setLoadingMore(true);
    setPageError(false);
    try {
      const response = await fetch('/api/reviews?before=' + encodeURIComponent(result.next));
      if (!response.ok) throw new Error('Cannot load reviews.');
      const page = await response.json();
      setResult((current) => ({ ...page, reviews: [...current.reviews, ...page.reviews] }));
    } catch {
      setPageError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    document.title = 'Verified customer reviews | NHubX';
    const controller = new AbortController();
    fetch('/api/reviews', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Cannot load reviews.');
      return response.json();
    }).then(setResult).catch((err) => { if (err.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto min-h-screen max-w-6xl px-5 pb-20 pt-28 sm:pt-32">
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Customer reviews</h1>
      <p className="mt-3 flex items-start gap-2 text-gray-300"><BadgeCheck size={19} aria-hidden="true" className="mt-0.5 shrink-0 text-nhubx-glow-primary" /> Feedback from customers who completed an order with NHubX.</p>
      {!result && !error && <p role="status" className="mt-6 text-gray-400">Loading reviews…</p>}
      {error && <p role="alert" className="mt-6 text-gray-400">Reviews are temporarily unavailable.</p>}
      {result?.count === 0 && <div className="glass mt-6 flex items-center gap-3 rounded-2xl border border-white/10 p-5 text-gray-300"><MessageSquareText size={20} aria-hidden="true" className="shrink-0 text-nhubx-glow-primary" /><p>No verified customer reviews have been published yet.</p></div>}
      {result?.count > 0 && <div className="mt-6">
        <div className="glass flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-nhubx-glow-primary/20 p-5 sm:p-6">
          <p className="text-4xl font-bold tracking-tight tabular-nums">{result.average.toFixed(1)}<span className="ml-1 text-lg font-medium text-gray-400">/5</span></p>
          <div>
            <ReviewStars rating={Number(result.average.toFixed(1))} size={19} />
            <p className="mt-1 text-sm text-gray-300">Based on {result.count} verified {result.count === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
        <div className="mt-5 grid items-start gap-3 sm:grid-cols-2 lg:grid-cols-3">{result.reviews.map((review, index) =>
          <ReviewCard key={review.publishedAt + index} review={review} expandable />
        )}</div>
        {result.next && <div className="mt-5 flex justify-center"><button type="button" onClick={loadMore} disabled={loadingMore} className="min-h-11 rounded-lg border border-white/15 px-5 text-sm font-semibold hover:bg-white/5 disabled:opacity-50">
          {loadingMore ? 'Loading more reviews…' : 'Load more reviews'}
        </button></div>}
        {pageError && <p role="alert" className="mt-2 text-sm text-red-300">Could not load more reviews. Try again.</p>}
      </div>}
      <Link to="/orders" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-nhubx-glow-primary hover:underline">Already a customer? Open My Orders <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
  );
}
