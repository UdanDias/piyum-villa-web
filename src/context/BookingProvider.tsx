import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { BookingDraft } from '../types/domain';
import { addDays, today } from '../utils/format';
export const initialDraft = (): BookingDraft => ({ checkIn: addDays(today(), 1), checkOut: addDays(today(), 3), rooms: 1, suite: 1, deluxe: 0, adults: 2, children: 0, mealPlan: 'room-only', selectedRoomIds: [], selectRooms: false });
interface Context { draft: BookingDraft; setDraft: (value: BookingDraft) => void; reset: () => void }
const BookingContext = createContext<Context | undefined>(undefined);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(initialDraft);
  return <BookingContext.Provider value={{ draft, setDraft, reset: () => setDraft(initialDraft()) }}>{children}</BookingContext.Provider>;
}
export function useBooking() { const c = useContext(BookingContext); if (!c) throw new Error('Missing BookingProvider'); return c; }
