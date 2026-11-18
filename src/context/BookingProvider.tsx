import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BookingDraft } from '../types/domain';
import { addDays, today } from '../utils/format';
import { emptyAllocation } from '../utils/occupancy';
export const initialDraft = (): BookingDraft => ({ checkIn: addDays(today(), 1), checkOut: addDays(today(), 3), rooms: 1, suite: 0, deluxe: 1, adults: 0, children: 0, mealPlan: 'room-only', selectedRoomIds: [], selectRooms: false, allocations: [emptyAllocation()] });
const key = 'piyum-stay-draft-v3';
function restore() { try { const d = JSON.parse(sessionStorage.getItem(key) ?? 'null'); if (d && Array.isArray(d.allocations) && d.allocations.length >= 1 && d.allocations.length <= 6 && d.allocations.every((r: any) => r && ['suite','deluxe'].includes(r.category) && Number.isInteger(r.adults) && Number.isInteger(r.children)) && d.checkIn >= today()) return d as BookingDraft; } catch {} return initialDraft(); }
interface Context { draft: BookingDraft; setDraft: (value: BookingDraft) => void; reset: () => void }
const BookingContext = createContext<Context | undefined>(undefined);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, update] = useState<BookingDraft>(restore);
  const setDraft = (value: BookingDraft) => { update(value); try { sessionStorage.setItem(key, JSON.stringify(value)); } catch {} };
  return <BookingContext.Provider value={{ draft, setDraft, reset: () => setDraft(initialDraft()) }}>{children}</BookingContext.Provider>;
}
export function useBooking() { const c = useContext(BookingContext); if (!c) throw new Error('Missing BookingProvider'); return c; }
