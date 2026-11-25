import { BadgeCheck } from 'lucide-react';
import ReviewStars from './ReviewStars';

const reviewDate = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeZone: 'Asia/Colombo' });

export default function ReviewCard({ review, preview = false }) {
  return (
    <article className="glass flex min-w-0 flex-col rounded-2xl border border-white/10 p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2.5">
        <ReviewStars rating={review.rating} />
        <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-gray-400">{review.rating}/5</span>
      </div>
      <blockquote className={'mb-5 mt-4 whitespace-pre-wrap break-words leading-relaxed text-gray-200' + (preview ? ' line-clamp-4' : '')}>{review.comment}</blockquote>
      <footer className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-white/10 pt-4">
        <div className="min-w-0">
          {review.displayName !== 'Verified customer' && <p className="break-words text-sm font-semibold text-white">{review.displayName}</p>}
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-300">
            <BadgeCheck size={15} aria-hidden="true" className="shrink-0 text-nhubx-glow-primary" />
            Verified customer
          </span>
        </div>
        <time className="text-xs text-gray-400" dateTime={review.publishedAt}>{reviewDate.format(new Date(review.publishedAt))}</time>
      </footer>
    </article>
  );
}
