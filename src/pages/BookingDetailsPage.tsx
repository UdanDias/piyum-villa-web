import { confirmAction, notifySuccess } from '../utils/notifications';
import { useNoticeState } from '../hooks/useNoticeState';
import { useAuth } from '../context/AuthProvider';
import { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ReservationService } from '../service/ReservationService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Loading, Status } from '../components/UI';
import { BookingSummary } from '../components/BookingSummary';
import { appConfig } from '../config/appConfig';
import { errorMessage, money } from '../utils/format';
export function BookingDetailsPage({ confirmation = false }: { confirmation?: boolean }) {
  const {session}=useAuth(); const staff=!!session&&session.user.role!=='GUEST';
  const { id = '' } = useParams(); const resource = useResource(useCallback(() => ReservationService.get(id), [id])); const [busy, setBusy] = useState(false); const [, setError] = useNoticeState('error');
  async function cancel() { if (busy) return; setBusy(true); try { if (!(await confirmAction({ titleText: 'Cancel this stay?', text: 'This releases your reserved rooms. The cancellation policy and payment balance will be checked before proceeding.', confirmButtonText: 'Yes, cancel booking' })).isConfirmed) return; await ReservationService.cancel(id); notifySuccess('Booking cancelled.'); resource.reload(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  if (resource.loading) return <div className="container section"><Loading /></div>;
  if (resource.error || !resource.data) return <div className="container section"><Alert>{resource.error || 'Booking not found.'}</Alert><Link className="button" to="/login">Sign in</Link></div>;
  const b = resource.data;
  return <div className="container section"><PageTitle eyebrow={confirmation ? 'YOUR NEXT CHAPTER' : b.reference} title={confirmation ? 'Your stay is reserved.' : 'Your booking.'}>{appConfig.mock ? 'Demo confirmation only. No real reservation or email has been sent.' : 'Keep your booking reference for your arrival.'}</PageTitle><div className="booking-grid"><section className="panel"><div className="row-between"><h2>{b.reference}</h2><Status value={b.status} /></div><p>We look forward to welcoming you, {b.guest.name}.</p><dl className="detail-list"><div><dt>Email</dt><dd>{b.guest.email}</dd></div><div><dt>Phone</dt><dd>{b.guest.phone}</dd></div><div><dt>Payment</dt><dd>Cash at the property</dd></div><div><dt>Paid</dt><dd>{money(b.paid)}</dd></div><div><dt>Balance</dt><dd>{money(Math.max(0, b.quote.total - b.paid))}</dd></div>{b.draft.selectRooms && <div><dt>Selected room numbers</dt><dd>{(b.roomNumbers ?? b.roomIds.map(n => String(n).padStart(2, '0'))).join(', ')}</dd></div>}<div><dt>Free cancellation deadline</dt><dd>{b.draft.checkIn} at 00:00 · Sri Lanka time</dd></div>{staff && b.checkInIdentity && <><div><dt>Document type</dt><dd>{b.checkInIdentity.documentType}</dd></div><div><dt>Document number</dt><dd>{b.checkInIdentity.documentNumber}</dd></div></>}</dl>{!b.draft.selectRooms && <p className="inline-note">Your rooms are assigned within your selected categories. You chose to skip room-number selection.</p>}{b.guest.notes && <p><b>Your request:</b> {b.guest.notes}</p>}<div className="action-row no-print"><button className="button outline" onClick={() => window.print()}>Print confirmation</button><Link className="button outline" to={staff?"/staff/reservations":"/account"}>{staff?"All reservations":"My stays"}</Link>{b.status === 'confirmed' && <button className="text-link danger-text" disabled={busy} onClick={cancel}>Cancel booking</button>}</div><p className="small muted">This is a booking confirmation, not a tax invoice. Contact the hotel for an official invoice.</p></section><BookingSummary draft={b.draft} quote={b.quote} /></div></div>;
}
