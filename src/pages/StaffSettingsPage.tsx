import { useEffect, useState } from 'react';
import { HotelService } from '../service/HotelService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Loading } from '../components/UI';
import type { HotelProfile } from '../types/domain';
import { errorMessage } from '../utils/format';
export function StaffSettingsPage() {
  const resource = useResource(HotelService.getPublic); const [form, setForm] = useState<HotelProfile>(); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [busy, setBusy] = useState(false);
  useEffect(() => { if (resource.data) setForm(resource.data); }, [resource.data]);
  async function save(e: React.FormEvent) { e.preventDefault(); if (!form) return; setBusy(true); setError(''); setSuccess(''); try { await HotelService.update(form); setSuccess('Hotel record saved. Public editorial content remains configured in src/config/appConfig.ts for this batch.'); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  return <><PageTitle eyebrow="PROPERTY RECORD" title="Hotel details">Manage the demo property record. Website content and policy editing follow in the next batch.</PageTitle>{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : form && <form className="panel narrow form-panel" onSubmit={save}><label>Hotel name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Phone<input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Address<textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></label><div className="form-grid"><label>Check-in window<input value={form.checkInWindow} readOnly /></label><label>Check-out window<input value={form.checkOutWindow} readOnly /></label></div>{error && <Alert>{error}</Alert>}{success && <Alert success>{success}</Alert>}<button className="button" disabled={busy}>{busy ? 'Saving…' : 'Save record'}</button></form>}</>;
}
