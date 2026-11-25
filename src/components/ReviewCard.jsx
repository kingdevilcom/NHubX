const reviewDate = new Intl.DateTimeFormat('en-LK', { dateStyle: 'medium', timeZone: 'Asia/Colombo' });

export default function ReviewCard({ review, preview = false }) {
  return (
    <article className="glass min-w-0 rounded-xl p-5">
      <p className="font-semibold text-nhubx-glow-primary">{review.rating}/5 stars</p>
      <blockquote className={'mt-3 whitespace-pre-wrap break-words text-gray-300' + (preview ? ' line-clamp-4' : '')}>{review.comment}</blockquote>
      <p className="mt-4 text-sm font-semibold">{review.displayName}</p>
      {review.displayName !== 'Verified customer' && <p className="text-xs text-gray-400">Verified customer</p>}
      <time className="mt-1 block text-xs text-gray-400" dateTime={review.publishedAt}>{reviewDate.format(new Date(review.publishedAt))}</time>
    </article>
  );
}
