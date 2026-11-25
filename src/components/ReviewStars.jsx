import { Star } from 'lucide-react';

const reviewRatings = [1, 2, 3, 4, 5];

export default function ReviewStars({ rating, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={rating + ' out of 5 stars'}>
      {reviewRatings.map((value) => (
        <span key={value} aria-hidden="true" className="relative block text-gray-500">
          <Star size={size} />
          <span className="absolute inset-y-0 left-0 overflow-hidden text-nhubx-glow-primary" style={{ width: Math.min(1, Math.max(0, rating - value + 1)) * 100 + '%' }}>
            <Star size={size} fill="currentColor" />
          </span>
        </span>
      ))}
    </span>
  );
}

export function ReviewRatingInput({ rating, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">How was your experience?</legend>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {reviewRatings.map((value) => (
          <label key={value} className="inline-flex cursor-pointer">
            <input type="radio" className="peer sr-only" name="rating" value={value} checked={rating === value} onChange={() => onChange(value)} required />
            <span className="sr-only">{value} {value === 1 ? 'star' : 'stars'}</span>
            <span aria-hidden="true" className="grid size-11 place-items-center rounded-lg border border-white/10 hover:bg-white/5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-nhubx-glow-primary">
              <Star size={22} fill={value <= rating ? 'currentColor' : 'none'} className={value <= rating ? 'text-nhubx-glow-primary' : 'text-gray-500'} />
            </span>
          </label>
        ))}
        {rating > 0 && <span aria-hidden="true" className="ml-2 text-sm font-semibold text-gray-300">{rating}/5</span>}
      </div>
    </fieldset>
  );
}
