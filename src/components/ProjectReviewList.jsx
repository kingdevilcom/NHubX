import ReviewCard from './ReviewCard';

export default function ProjectReviewList({ reviews = [] }) {
  if (!reviews.length) return null;
  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-semibold text-gray-200">{reviews.length === 1 ? 'Customer review' : 'Customer reviews'}</h4>
      {reviews.map((review, index) => <ReviewCard key={review.publishedAt + index} review={review} expandable />)}
    </div>
  );
}
