import { appConfig } from '../config/appConfig';
import { request, change, guestHeaders } from './apiClient';
import type { Availability, Booking, BookingDraft, GuestDetails, Quote, SearchCriteria } from '../types/domain';
import { readStore, mutate, uid, record, DemoStore } from '../data/store';
import { roomTypes, accommodations } from '../data/catalogue';
import { allocationErrors } from '../utils/occupancy';
import { validDate, nightsBetween, today } from '../utils/format';
import { requireMock } from './apiClient';
import { currentUser, requireUser, requireRole } from './session';
const guestKeys = new Set<string>();
function dateCheck(search: SearchCriteria) {
  if (!validDate(search.checkIn) || !validDate(search.checkOut)) throw new Error('Select valid check-in and check-out dates.');
  if (search.checkIn < today()) throw new Error('Check-in cannot be in the past.');
  const nights = nightsBetween(search.checkIn, search.checkOut);
  if (nights < 1 || nights > 90) throw new Error('Choose a stay between 1 and 90 nights.');
  if (!Number.isInteger(search.rooms) || search.rooms < 1 || search.rooms > 6) throw new Error('Choose between 1 and 6 rooms.');
}
function available(data: DemoStore, search: SearchCriteria): Availability {
  dateCheck(search);
  const blocked = new Set(data.bookings.filter(b => ['confirmed', 'checked-in'].includes(b.status) && b.draft.checkIn < search.checkOut && b.draft.checkOut > search.checkIn).flatMap(b => b.roomIds));
  const rooms = data.rooms.filter(r => r.status === 'available' && !blocked.has(r.id));
  return { rooms, suite: rooms.filter(r => r.category === 'suite').length, deluxe: rooms.filter(r => r.category === 'deluxe').length, total: rooms.length };
}
function quote(data: DemoStore, draft: BookingDraft): Quote {
  dateCheck(draft);
  if (![draft.suite, draft.deluxe, draft.adults, draft.children].every(Number.isInteger) || draft.suite < 0 || draft.deluxe < 0 || draft.suite + draft.deluxe !== draft.rooms) throw new Error('Suite and Deluxe quantities must add up to your room count.');
  if (!draft.allocations || draft.allocations.length !== draft.rooms || allocationErrors(draft.allocations).some(Boolean)) throw new Error('Each room needs 1–2 adults and allows at most 3 guests.');
  if(draft.allocations.reduce((n,r)=>n+r.adults,0)!==draft.adults || draft.allocations.reduce((n,r)=>n+r.children,0)!==draft.children || draft.allocations.filter(r=>r.category==='suite').length!==draft.suite) throw new Error('Guest counts must match each room.');
  const availability = available(data, draft);
  if (draft.suite > availability.suite || draft.deluxe > availability.deluxe) throw new Error('Some rooms are no longer available for these dates. Please update your selection.');
  if (draft.selectRooms) {
    if(draft.selectedRoomIds.some((id,i)=>availability.rooms.find(r=>r.id===id)?.category!==draft.allocations[i]?.category)) throw new Error('Assign a room of the selected category to each guest allocation.');
    if (new Set(draft.selectedRoomIds).size !== draft.rooms) throw new Error('Select exactly the requested number of rooms, or skip selection.');
    const selected = availability.rooms.filter(r => draft.selectedRoomIds.includes(r.id));
    if (selected.length !== draft.rooms || selected.filter(r => r.category === 'suite').length !== draft.suite || selected.filter(r => r.category === 'deluxe').length !== draft.deluxe) throw new Error('Selected room numbers no longer match your available room categories.');
  }
  const plan = accommodations.find(a => a.id === draft.mealPlan); if (!plan) throw new Error('Select a valid meal plan.');
  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const lines = roomTypes.filter(t => draft[t.id] > 0).map(t => ({ label: `${t.name} · ${draft[t.id]} room(s) × ${nights} night(s)`, amount: t.nightlyRate * draft[t.id] * nights }));
  if (plan.id !== 'room-only') {
    if(draft.adults) lines.push({label:`${plan.name} · ${draft.adults} adults × ${plan.adultSupplement} × ${nights} nights`,amount:plan.adultSupplement*draft.adults*nights});
    if(draft.children) lines.push({label:`${plan.name} · ${draft.children} children × ${plan.childSupplement} × ${nights} nights`,amount:plan.childSupplement*draft.children*nights});
  }
  return { nights, lines, total: lines.reduce((sum, l) => sum + l.amount, 0), currency: 'LKR', cancellationDeadline: `${draft.checkIn}T00:00:00+05:30` };
}
function canRead(booking: Booking) {
  const user = currentUser();
  return guestKeys.has(booking.id) || (!!user && (booking.userId === user.id || ['ADMIN', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT'].includes(user.role)));
}
export const ReservationService = {
  async availability(search: SearchCriteria) { if (!appConfig.mock) return request<Availability>('/web/public/availability', { method: 'POST', body: JSON.stringify({ checkIn: search.checkIn, checkOut: search.checkOut, rooms: search.rooms }) }); requireMock('Availability'); return available(readStore(), search); },
  async quote(draft: BookingDraft) { if (!appConfig.mock) return request<Quote>('/web/public/quote', { method: 'POST', body: JSON.stringify(draft) }); requireMock('Booking quote'); return quote(readStore(), draft); },
  async create(draft: BookingDraft, guest: GuestDetails, idempotencyKey: string, expectedTotal: number): Promise<Booking> {
    if (!appConfig.mock) return change<Booking>('/web/public/bookings', { draft, guest: { ...guest, documentNumber: '' }, idempotencyKey, expectedTotal }, 'POST', guestHeaders()); requireMock('Customer booking');
    if (!guest.name.trim() || !/^\S+@\S+\.\S+$/.test(guest.email.trim()) || guest.phone.trim().length < 7 || guest.documentNumber.trim().length < 5) throw new Error('Enter a name, valid email, phone and sample identity-document number.');
    if (guest.notes.length > 1000 || guest.name.length > 150) throw new Error('Name or notes are too long.');
    const user = currentUser();
    const booking = await mutate(data => {
      const previous = data.bookings.find(b => b.idempotencyKey === idempotencyKey);
      if (previous) { if (!canRead(previous)) throw new Error('This booking request cannot be reused.'); return previous; }
      const price = quote(data, draft); if (price.total !== expectedTotal) throw new Error('The price changed. Please review the updated quote.');
      const free = available(data, draft);
      const pool=[...free.rooms];
      const assigned = draft.selectRooms ? [...draft.selectedRoomIds] : draft.allocations.map(a=>{const i=pool.findIndex(r=>r.category===a.category); return pool.splice(i,1)[0].id;});
      const { documentNumber, ...details } = guest;
      const item: Booking = { id: uid(), reference: `PV-${uid().slice(0, 8).toUpperCase()}`, userId: user?.role === 'GUEST' ? user.id : null, draft: structuredClone(draft), roomIds: assigned, guest: { ...details, email: details.email.trim().toLowerCase(), documentLastFour: documentNumber.slice(-4) }, quote: price, status: 'confirmed', createdAt: new Date().toISOString(), idempotencyKey, paid: 0 };
      data.bookings.unshift(item); record(data, `Created reservation ${item.reference}`, user?.id ?? null); guestKeys.add(item.id); return item;
    });
    guestKeys.add(booking.id); return booking;
  },
  async get(id: string) { if (!appConfig.mock) return request<Booking>(`/web/public/bookings/${id}`, { headers: guestHeaders() }); requireMock('Booking details'); const booking = readStore().bookings.find(b => b.id === id); if (!booking || !canRead(booking)) throw new Error('Booking unavailable. Sign in as its owner, or keep the original guest booking tab open.'); return booking; },
  async getMine() { if (!appConfig.mock) return request<Booking[]>('/web/bookings?mine=true'); requireMock('My bookings'); const user = requireUser(); return readStore().bookings.filter(b => b.userId === user.id); },
  async getAll() { if (!appConfig.mock) return request<Booking[]>('/web/bookings?mine=false'); requireMock('Staff reservations'); requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT'); return readStore().bookings; },
  async cancel(id: string) {
    if (!appConfig.mock) return change<Booking>(`/web/public/bookings/${id}/cancel`, undefined, 'PATCH', guestHeaders()); requireMock('Cancellation'); return mutate(data => { const booking = data.bookings.find(b => b.id === id); if (!booking || !canRead(booking)) throw new Error('Booking unavailable.');
      if (booking.status !== 'confirmed') throw new Error('Only confirmed bookings can be cancelled here.');
      if (new Date(booking.quote.cancellationDeadline).getTime() <= Date.now()) throw new Error('The free cancellation deadline has passed. Contact the hotel.');
      if (booking.paid > 0) throw new Error('Contact the hotel to arrange cancellation of a paid booking.');
      booking.status = 'cancelled'; record(data, `Cancelled ${booking.reference}`, currentUser()?.id ?? null); return booking;
    });
  },
  async changeStatus(id: string, status: 'checked-in' | 'completed') {
    if (!appConfig.mock) return change<Booking>(`/web/bookings/${id}/${status}`, undefined, 'PATCH'); requireMock('Reservation status'); const actor = requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST');
    return mutate(data => { const b = data.bookings.find(item => item.id === id); if (!b) throw new Error('Booking not found.');
      if (status === 'checked-in') {
        if (b.status !== 'confirmed' || today() < b.draft.checkIn || today() >= b.draft.checkOut) throw new Error('Check-in is allowed only for a confirmed booking during its stay dates.');
        if (data.rooms.some(r => b.roomIds.includes(r.id) && (r.housekeeping !== 'clean' || r.status !== 'available'))) throw new Error('All assigned rooms must be clean and operational.');
      } else {
        if (b.status !== 'checked-in') throw new Error('Check in the guest before checking out.');
        if (b.paid < b.quote.total) throw new Error('Record the outstanding cash payment before checkout.');
        data.rooms.filter(r => b.roomIds.includes(r.id)).forEach(r => { r.housekeeping = 'dirty'; });
      }
      b.status = status; record(data, `${status}: ${b.reference}`, actor.id); return b;
    });
  },
};
