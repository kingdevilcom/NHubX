import { useState } from 'react';
import { orderButton, orderField } from '../orders';

export default function AdminReviewEditor({ review, disabled, onSave }) {
  const [editing, setEditing] = useState(false);
  const [showName, setShowName] = useState(review.displayName !== 'Verified customer');

  async function submit(event) {
    event.preventDefault();
    const { displayName, rating, comment } = Object.fromEntries(new FormData(event.currentTarget));
    if (await onSave({ showName, displayName, rating: Number(rating), comment })) setEditing(false);
  }

  if (!editing) return <button type="button" disabled={disabled} onClick={() => { setShowName(review.displayName !== 'Verified customer'); setEditing(true); }} className="rounded-lg border border-white/15 px-3 py-2 text-sm disabled:opacity-50">Edit review</button>;

  return <form onSubmit={submit} className="grid gap-3 rounded-xl border border-white/15 p-4 sm:grid-cols-[1fr_8rem]">
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={showName} onChange={(event) => setShowName(event.target.checked)} disabled={disabled || !review.editableName} />
        Show customer name publicly
      </label>
      {showName ? <label className="block text-sm">Display name
        <input name="displayName" className={orderField + ' mt-1'} defaultValue={review.editableName} required maxLength={80} disabled={disabled} />
      </label> : <p className="text-sm text-gray-400">Appears as Verified customer.</p>}
    </div>
    <label className="text-sm font-semibold">Rating
      <select name="rating" className={orderField + ' mt-1'} defaultValue={review.rating} disabled={disabled}>
        {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}
      </select>
    </label>
    <label className="text-sm font-semibold sm:col-span-2">Review text
      <textarea name="comment" className={orderField + ' mt-1'} defaultValue={review.comment} required maxLength={1000} rows={4} disabled={disabled} />
    </label>
    <div className="flex gap-2 sm:col-span-2">
      <button className={orderButton} disabled={disabled}>Save review</button>
      <button type="button" onClick={() => setEditing(false)} disabled={disabled} className="rounded-lg border border-white/15 px-3 text-sm">Cancel</button>
    </div>
  </form>;
}
