import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import ReviewCard from './ReviewCard';
import ReviewStars from './ReviewStars';

export default function HomeReviews() {
  const [result, setResult] = useState(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/reviews?limit=3', { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error('Cannot load reviews.');
      return response.json();
    }).then(setResult).catch(() => {});
    return () => controller.abort();
  }, []);

  if (!result?.reviews.length) return null;

  const score = Number(result.average.toFixed(1));
  const moving = result.reviews.length > 1;
  const cards = result.reviews.map((review, index) => (
    <ReviewCard key={review.publishedAt + index} review={review} preview />
  ));

  return (
    <div role="region" aria-label="Customer reviews" className="mx-auto mt-8 max-w-3xl text-left">
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-4 text-sm sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-2 text-gray-300">
          <ReviewStars rating={score} />
          <span><strong className="text-white">{score}/5</strong> from {result.count} verified {result.count === 1 ? 'review' : 'reviews'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/reviews" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-nhubx-glow-primary hover:underline">
            View all reviews <ArrowRight size={14} aria-hidden="true" />
          </Link>
          {moving && <button type="button" aria-controls="home-review-track" aria-label={paused ? 'Resume scrolling' : 'Pause scrolling'} onClick={() => setPaused((value) => !value)} className="grid h-11 w-11 place-items-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white motion-reduce:hidden">
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>}
        </div>
      </div>
      {moving ? (
        <div className="review-marquee" role="group" aria-label="Review cards" tabIndex={0} data-two-reviews={cards.length === 2}>
          <div id="home-review-track" className="review-marquee-track" data-paused={paused}>
            <div className="review-marquee-group">{cards}</div>
            <div className="review-marquee-group motion-reduce:hidden" aria-hidden="true">{cards}</div>
          </div>
        </div>
      ) : <div className="mx-auto max-w-sm">{cards}</div>}
    </div>
  );
}
