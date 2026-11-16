import { useState } from 'react';
import { ReviewService } from '../service/ReviewService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Loading, Empty, Status } from '../components/UI';
import { errorMessage } from '../utils/format';
export function StaffReviewsPage() {
  const resource = useResource(ReviewService.getAll); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function moderate(id: string, status: 'approved' | 'rejected') { setBusy(true); setError(''); try { await ReviewService.moderate(id, status); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  return <><PageTitle eyebrow="LISTEN & LEARN" title="Guest reviews">Only approved reviews appear on the public homepage.</PageTitle>{error && <Alert>{error}</Alert>}{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : !resource.data?.length ? <Empty title="No reviews to moderate yet"><p>Guests can review their completed stays from their account.</p></Empty> : <div className="two-grid">{resource.data.map(r => <article className="panel" key={r.id}><div className="row-between"><p aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}</p><Status value={r.status} /></div><h2>{r.title}</h2><p>{r.comment}</p><small>{r.author}</small><div className="action-row"><button disabled={busy || r.status === 'approved'} className="button small-button" onClick={() => moderate(r.id, 'approved')}>Approve</button><button disabled={busy || r.status === 'rejected'} className="button outline small-button" onClick={() => moderate(r.id, 'rejected')}>Reject</button></div></article>)}</div>}</>;
}
