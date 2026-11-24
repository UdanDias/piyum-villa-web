import { notifySuccess } from '../utils/notifications';
import { useNoticeState } from '../hooks/useNoticeState';
import { useState } from 'react';
import { RoomService } from '../service/RoomService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Loading, Status } from '../components/UI';
import { errorMessage } from '../utils/format';
import type { Room } from '../types/domain';
export function StaffRoomsPage() {
  const resource = useResource(RoomService.getAll); const [error, setError] = useNoticeState('error'); const [busy, setBusy] = useState<number>();
  async function update(room: Room, patch: Partial<Pick<Room, 'status' | 'housekeeping'>>) { setBusy(room.id); setError(''); try { await RoomService.updateCondition(room.id, { status: room.status, housekeeping: room.housekeeping, ...patch }); notifySuccess('Room status updated.'); } catch (e) { setError(errorMessage(e)); } finally { setBusy(undefined); } }
  return <><PageTitle eyebrow="ROOM READINESS" title="A fresh start, every stay.">Operational condition and housekeeping. These are separate from date-based booking availability.</PageTitle>{error && <Alert>{error}</Alert>}{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : <div className="three-grid">{resource.data?.map(room => <article className="panel operational-room" key={room.id}><div className="row-between"><h2>{room.number}</h2><Status value={room.status} /></div><p>{room.category === 'suite' ? 'Suite Double' : 'Deluxe Double'} · {room.location}</p><div className="form-grid"><label>Housekeeping<select disabled={busy !== undefined} value={room.housekeeping} onChange={e => update(room, { housekeeping: e.target.value as Room['housekeeping'] })}><option value="clean">Clean</option><option value="dirty">Dirty</option></select></label><label>Operational status<select disabled={busy !== undefined} value={room.status} onChange={e => update(room, { status: e.target.value as Room['status'] })}><option value="available">Operational</option><option value="servicing">Servicing</option></select></label></div></article>)}</div>}</>;
}
