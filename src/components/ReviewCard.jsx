import { BadgeCheck } from 'lucide-react';
import { useId, useState } from 'react';
import ReviewStars from './ReviewStars';

const reviewDate = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeZone: 'Asia/Colombo' });

export default function ReviewCard({ review, preview = false, expandable = false }) {
  const [expanded, setExpanded] = useState(false);
  const commentId = useId();
  const compactText = expandable ? review.comment.replace(/\s+/g, ' ').trim() : '';
  const hasMore = expandable && compactText.length > 120;
  const comment = expandable && !expanded
    ? hasMore ? compactText.slice(0, 120).trimEnd() + '…' : compactText
    : review.comment;
  return (
    <article className={'glass flex min-w-0 flex-col rounded-2xl border border-white/10 ' + (expandable ? 'p-4' : 'p-5 sm:p-6')}>
      <div className="flex flex-wrap items-center gap-2.5">
        <ReviewStars rating={review.rating} />
        <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-gray-400">{review.rating}/5</span>
      </div>
      <blockquote id={commentId} className={'whitespace-pre-wrap break-words leading-relaxed text-gray-200 ' + (expandable ? 'my-3 text-sm' : 'mb-5 mt-4') + (preview ? ' line-clamp-4' : '')}>{comment}</blockquote>
      {hasMore && <button type="button" aria-expanded={expanded} aria-controls={commentId} onClick={() => setExpanded((value) => !value)} className="mb-3 w-fit text-sm font-semibold text-nhubx-glow-primary hover:underline">
        {expanded ? 'Read less' : 'Read more'}
      </button>}
      <footer className={'mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-white/10 ' + (expandable ? 'pt-3' : 'pt-4')}>
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
