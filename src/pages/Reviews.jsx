import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';

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
    <section className="mx-auto min-h-screen max-w-5xl px-5 pb-20 pt-32">
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Customer reviews</h1>
      <p className="mt-3 text-gray-400">Feedback from customers who completed an order with NHubX.</p>
      {!result && !error && <p role="status" className="mt-6 text-gray-400">Loading reviews…</p>}
      {error && <p role="alert" className="mt-6 text-gray-400">Reviews are temporarily unavailable.</p>}
      {result?.count === 0 && <p className="glass mt-6 rounded-xl p-5 text-gray-300">No verified customer reviews have been published yet.</p>}
      {result?.count > 0 && <div className="mt-6">
        <p className="text-lg font-bold">{result.average.toFixed(1)}/5 <span className="ml-2 text-sm font-normal text-gray-400">across {result.count} verified {result.count === 1 ? 'review' : 'reviews'}</span></p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{result.reviews.map((review, index) =>
          <ReviewCard key={review.publishedAt + index} review={review} />
        )}</div>
        {result.next && <button type="button" onClick={loadMore} disabled={loadingMore} className="mt-5 rounded-lg border border-white/15 px-4 py-2 text-sm">
          {loadingMore ? 'Loading more reviews…' : 'Load more reviews'}
        </button>}
        {pageError && <p role="alert" className="mt-2 text-sm text-red-300">Could not load more reviews. Try again.</p>}
      </div>}
      <Link to="/orders" className="mt-6 inline-block text-sm font-semibold text-nhubx-glow-primary hover:underline">Already a customer? Open My Orders</Link>
    </section>
  );
}
