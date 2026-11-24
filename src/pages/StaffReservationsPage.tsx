import { confirmAction, confirmCheckIn, notifySuccess } from '../utils/notifications';
import { useNoticeState } from '../hooks/useNoticeState';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import { ReservationService } from '../service/ReservationService';
import { PageTitle, Alert, Loading, Status, Empty } from '../components/UI';
import { money, dateLabel, errorMessage } from '../utils/format';
import type { Booking } from '../types/domain';
export function StaffReservationsPage() {
  const data = useResource(ReservationService.getAll); const [query, setQuery] = useState(''); const [status, setStatus] = useState('all'); const [busy, setBusy] = useState(false); const [, setError] = useNoticeState('error');
  const rows = data.data?.filter(b => (status === 'all' || b.status === status) && `${b.reference} ${b.guest.name} ${b.guest.email}`.toLowerCase().includes(query.toLowerCase()));
  async function transition(booking: Booking) { if (busy) return; setBusy(true); try {
    const status = booking.status === 'confirmed' ? 'checked-in' : 'completed';
    let identity: { documentType: string; documentNumber: string } | undefined;
    if (status === 'checked-in') { identity = await confirmCheckIn(booking.reference); if (!identity) return; }
    else if (!(await confirmAction({ titleText: 'Check out this guest?', text: `${booking.reference}. The outstanding balance must be settled before checkout.`, confirmButtonText: 'Confirm checkout' })).isConfirmed) return;
    await ReservationService.changeStatus(booking.id, status, identity);
    notifySuccess(status === 'checked-in' ? 'Guest checked in successfully.' : 'Guest checked out successfully.');
  } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }

  return <><PageTitle eyebrow="FRONT DESK" title="Website reservations">Every stay, from arrival to farewell.</PageTitle><div className="reservation-toolbar"><label className="reservation-search"><span className="sr-only">Search reservations</span><input placeholder="Search reference, guest or email…" value={query} onChange={e => setQuery(e.target.value)} /></label><div className="reservation-filter-scroll"><div className="reservation-status-actions"><Link className="button reservation-add" to="/accommodation">Add Booking</Link><div className="reservation-status-filters" role="group" aria-label="Filter reservations by status">{[{value:'all',label:'All Status'}, {value:'confirmed',label:'Confirmed'}, {value:'checked-in',label:'Checked In'}, {value:'completed',label:'Completed'}, {value:'cancelled',label:'Cancelled'}].map(item=><button type="button" key={item.value} className={`reservation-status-button${status===item.value?' active':''}`} aria-pressed={status===item.value} onClick={()=>setStatus(item.value)}>{item.label}</button>)}</div></div></div></div>{data.loading ? <Loading /> : data.error ? <Alert>{data.error}</Alert> : !rows?.length ? <Empty title="No matching reservations" /> : <div className="panel table-scroll"><table><thead><tr><th>Guest</th><th>Stay</th><th>Assigned rooms</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map(b => <tr key={b.id}><td><b>{b.guest.name}</b><small style={{display: 'block', overflowWrap: 'anywhere'}}>{b.guest.email || 'No email provided'}</small><small>{b.reference}</small></td><td>{dateLabel(b.draft.checkIn)}<small>to {dateLabel(b.draft.checkOut)}</small></td><td>{b.roomNumbers?.join(', ') || 'Not assigned'}</td><td>{money(Math.max(0, b.quote.total - b.paid))}</td><td><Status value={b.status} /></td><td><div className="table-actions"><Link className="text-link" to={`/staff/booking/${b.id}`}>View</Link>{["confirmed","checked-in"].includes(b.status) && b.paid<b.quote.total && <Link className="text-link" to={`/staff/payments?bookingId=${encodeURIComponent(b.id)}`}>Payment</Link>}{['confirmed', 'checked-in'].includes(b.status) && <button className="text-link" disabled={busy} onClick={() => { void transition(b); }}>{b.status === 'confirmed' ? 'Check in' : 'Check out'}</button>}</div></td></tr>)}</tbody></table></div>}</>;
}
