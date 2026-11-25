import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ReviewCard from './ReviewCard';
import ReviewStars from './ReviewStars';

export default function HomeReviews() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/reviews?limit=3', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Cannot load reviews.');
      return response.json();
    }).then(setResult).catch((err) => { if (err.name !== 'AbortError') setError(true); });
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="home-reviews" className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-8">
        <div>
          <h2 id="home-reviews" className="text-2xl font-bold tracking-tight sm:text-3xl">Customer reviews</h2>
          {result?.count > 0 && <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <ReviewStars rating={Number(result.average.toFixed(1))} />
            <p className="text-sm text-gray-300"><strong className="text-white">{result.average.toFixed(1)}/5</strong> across {result.count} verified {result.count === 1 ? 'review' : 'reviews'}</p>
          </div>}
        </div>
        <Link to="/reviews" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 text-sm font-semibold text-nhubx-glow-primary hover:bg-white/5">
          View all reviews <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      {!result && !error && <p role="status" className="mt-4 text-sm text-gray-400">Loading reviews…</p>}
      {error && <p role="status" className="mt-4 text-sm text-gray-400">Reviews are temporarily unavailable.</p>}
      {result?.count === 0 && <p className="mt-4 text-sm text-gray-400">No verified customer reviews have been published yet.</p>}
      {result?.reviews.length > 0 && <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.reviews.map((review, index) => <ReviewCard key={review.publishedAt + index} review={review} preview />)}
      </div>}
    </section>
  );
}
