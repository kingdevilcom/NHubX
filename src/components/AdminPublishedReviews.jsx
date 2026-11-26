import { useEffect, useState } from 'react';
import { orderButton, orderField, orderRequest } from '../orders';
import { fetchProjects } from '../firebase';
import { caseStudies } from '../projectCaseStudies';
import ReviewCard from './ReviewCard';
import AdminReviewEditor from './AdminReviewEditor';

export default function AdminPublishedReviews() {
  const [page, setPage] = useState(null);
  const [projects, setProjects] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    orderRequest('reviewPublished').then((data) => { if (active) setPage(data); })
      .catch((err) => { if (active) setNotice({ text: err.message, error: true }); });
    fetchProjects().then((data) => { if (active) setProjects(data); });
    return () => { active = false; };
  }, [refresh]);

  async function edit({ id, editVersion }, fields) {
    setBusy(true);
    setNotice(null);
    try {
      const saved = await orderRequest('editPublishedReview', { id, editVersion, ...fields });
      setPage((current) => ({ ...current, items: current.items.map((item) => item.id === id ? { ...item, ...saved } : item) }));
      setNotice({ text: 'Published review updated.' });
      return true;
    } catch (err) {
      setNotice({ text: err.message, error: true });
      return false;
    } finally { setBusy(false); }
  }

  async function save(event, review) {
    event.preventDefault();
    const projectKey = new FormData(event.currentTarget).get('project');
    setBusy(true);
    setNotice(null);
    try {
      await orderRequest('reviewLinkProject', { id: review.id, projectKey });
      setPage((current) => ({ ...current, items: current.items.map((item) => item.id === review.id ? { ...item, projectKey } : item) }));
      setNotice({ text: projectKey ? 'Project link saved.' : 'Project link removed.' });
    } catch (err) { setNotice({ text: err.message, error: true }); }
    finally { setBusy(false); }
  }

  async function loadMore() {
    setBusy(true);
    setNotice(null);
    try {
      const next = await orderRequest('reviewPublished', { after: page.next });
      setPage((current) => ({ ...next, items: [...current.items, ...next.items] }));
    } catch (err) { setNotice({ text: err.message, error: true }); }
    finally { setBusy(false); }
  }

  return (
    <section className="max-w-4xl space-y-4" aria-labelledby="published-review-heading">
      <div><div className="flex flex-wrap items-center justify-between gap-2"><h2 id="published-review-heading" className="font-bold">Published reviews</h2>
        <button type="button" disabled={busy} onClick={() => { setPage(null); setNotice(null); setRefresh((count) => count + 1); }} className="rounded-lg border border-white/15 px-3 py-2 text-sm">Refresh reviews</button></div>
        <p className="mt-1 text-sm text-gray-400">Link a review only to the project it describes. Only link a project if the customer is comfortable being associated with it.</p>
      </div>
      {notice && <p role={notice.error ? 'alert' : 'status'} className={notice.error ? 'text-sm text-red-300' : 'text-sm text-gray-300'}>{notice.text}</p>}
      {!page && !notice && <p role="status" className="text-sm text-gray-400">Loading published reviews…</p>}
      {page?.items.length === 0 && <p className="text-sm text-gray-400">No published reviews yet.</p>}
      {page?.items.map((review) => {
        const linked = caseStudies.some((item) => 'case-' + item.id === review.projectKey) || projects.some((item) => 'catalog-' + item.id === review.projectKey);
        return <div key={review.id} className="space-y-3 rounded-2xl border border-white/10 bg-[#19191b] p-4">
          <ReviewCard review={review} expandable />
          <AdminReviewEditor key={review.editVersion} review={review} disabled={busy} onSave={(fields) => edit(review, fields)} />
          <form onSubmit={(event) => save(event, review)} className="flex flex-wrap items-end gap-2">
            <label className="min-w-0 flex-1 text-sm font-semibold">Linked project
              <select name="project" key={review.projectKey} defaultValue={review.projectKey} className={orderField + ' mt-1'} disabled={busy}>
                <option value="">No project</option>
                {review.projectKey && !linked && <option value={review.projectKey} disabled>Current project unavailable</option>}
                <optgroup label="Case studies">{caseStudies.map((item) => <option key={item.id} value={'case-' + item.id}>{item.name}</option>)}</optgroup>
                {projects.length > 0 && <optgroup label="Project catalogue">{projects.map((item) => <option key={item.id} value={'catalog-' + item.id}>{item.name}</option>)}</optgroup>}
              </select>
            </label>
            <button className={orderButton} disabled={busy}>Save project link</button>
          </form>
        </div>;
      })}
      {page?.next && <button type="button" disabled={busy} onClick={loadMore} className="rounded-lg border border-white/15 px-3 py-2 text-sm">Load more published reviews</button>}
    </section>
  );
}
