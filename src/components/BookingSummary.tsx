import { useResource } from '../hooks/useResource';
import { RoomService } from '../service/RoomService';
import type { BookingDraft, Quote } from '../types/domain';
import { accommodations } from '../data/catalogue';
import { money, dateLabel } from '../utils/format';

export function BookingSummary({ draft, quote }: { draft: BookingDraft; quote?: Quote }) {
  const inventory = useResource(RoomService.getAll);
  return <aside className="booking-summary"><p className="eyebrow">YOUR LITTLE ESCAPE</p><h3>Your stay, at a glance</h3><div className="summary-dates"><div><small>CHECK IN</small><b>{dateLabel(draft.checkIn)}</b><span>12:00–18:00</span></div><span>→</span><div><small>CHECK OUT</small><b>{dateLabel(draft.checkOut)}</b><span>08:00–11:00</span></div></div><dl><div><dt>Rooms</dt><dd>{draft.rooms}</dd></div>{draft.suite > 0 && <div><dt>Suite Double</dt><dd>{draft.suite}</dd></div>}{draft.deluxe > 0 && <div><dt>Deluxe Double</dt><dd>{draft.deluxe}</dd></div>}<div><dt>Guests</dt><dd>{draft.adults} adults · {draft.children} children</dd></div>{draft.allocations?.map((r,i)=><div key={i}><dt>Your Room {i+1} · {r.category}</dt><dd>{r.adults} adults · {r.children} children</dd></div>)}<div><dt>Meals</dt><dd>{accommodations.find(a => a.id === draft.mealPlan)?.name}</dd></div>{draft.selectRooms && <div><dt>Chosen rooms</dt><dd>{draft.selectedRoomIds.map(n => inventory.data?.find(r => r.id === n)?.number ?? '…').join(', ') || 'Not selected'}</dd></div>}</dl>{quote && <><div className="price-lines">{quote.lines.map(l => <div key={l.label}><span>{l.label}</span><b>{money(l.amount)}</b></div>)}</div><div className="summary-total"><span>Total · {quote.nights} nights</span><strong>{money(quote.total)}</strong></div><p className="small muted">Your total includes the room charges and selected meal supplements.</p></>}<p className="summary-assurance">✓ Cash at the property<br/>✓ No card details required</p></aside>;
}
