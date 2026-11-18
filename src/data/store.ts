import type { User, Room, Booking, Review, Payment, AuditEntry, HotelProfile } from '../types/domain';
import { initialRooms } from './catalogue';
import { appConfig } from '../config/appConfig';
import { addDays, today } from '../utils/format';
interface StoredUser extends User { passwordHash?: string }
export interface DemoStore { version: 2; users: StoredUser[]; rooms: Room[]; bookings: Booking[]; reviews: Review[]; payments: Payment[]; audit: AuditEntry[]; hotel: HotelProfile }
const key = 'piyum-villa-demo-v3';
const demoUsers: StoredUser[] = [
  { id: 1, name: 'Alex Morgan', username: 'alex', email: 'guest@demo.piyumvilla.test', phone: '0770000001', role: 'GUEST' },
  { id: 2, name: 'Hotel Owner', username: 'owner', email: 'owner@demo.piyumvilla.test', phone: '0770000002', role: 'ADMIN' },
  { id: 3, name: 'Front Desk', username: 'reception', email: 'reception@demo.piyumvilla.test', phone: '0770000003', role: 'RECEPTIONIST' },
  { id: 4, name: 'Hotel Manager', username: 'manager', email: 'manager@demo.piyumvilla.test', phone: '0770000004', role: 'MANAGER' },
  { id: 5, name: 'Housekeeping', username: 'housekeeping', email: 'housekeeping@demo.piyumvilla.test', phone: '0770000005', role: 'HOUSEKEEPING' },
  { id: 6, name: 'Accounts', username: 'accounts', email: 'accounts@demo.piyumvilla.test', phone: '0770000006', role: 'ACCOUNTANT' },
];
function seed(): DemoStore {
  const start = addDays(today(), 2); const end = addDays(start, 3);
  const common = { userId: 1, guest: { name: 'Alex Morgan', email: demoUsers[0].email, phone: demoUsers[0].phone, documentType: 'PASSPORT' as const, documentLastFour: '1234', notes: '' }, createdAt: new Date().toISOString(), paid: 0 };
  const upcoming: Booking = { ...common, id: 'sample-upcoming', reference: 'PV-DEMO-1001', idempotencyKey: 'sample-1', status: 'confirmed', roomIds: [9], draft: { checkIn: start, checkOut: end, rooms: 1, suite: 1, deluxe: 0, adults: 2, children: 0, mealPlan: 'room-only', selectedRoomIds: [9], selectRooms: true, allocations: [{category: 'suite', adults: 2, children: 0}] }, quote: { nights: 3, lines: [{ label: 'Suite Double Room · 1 room × 3 nights', amount: 54000 }], total: 54000, currency: 'LKR', cancellationDeadline: `${start}T00:00:00+05:30` } };
  const pastStart = addDays(today(), -14), pastEnd = addDays(today(), -12);
  const completed: Booking = { ...upcoming, id: 'sample-completed', reference: 'PV-DEMO-1000', idempotencyKey: 'sample-0', status: 'completed', roomIds: [3], paid: 28000, draft: { ...upcoming.draft, checkIn: pastStart, checkOut: pastEnd, suite: 0, deluxe: 1, selectedRoomIds: [3], allocations: [{category: 'deluxe', adults: 2, children: 0}] }, quote: { nights: 2, lines: [{ label: 'Deluxe Double Room · 1 room × 2 nights', amount: 28000 }], total: 28000, currency: 'LKR', cancellationDeadline: `${pastStart}T00:00:00+05:30` } };
  return { version: 2, users: demoUsers, rooms: structuredClone(initialRooms), bookings: [upcoming, completed], reviews: [], payments: [], audit: [], hotel: { name: appConfig.hotelName, phone: appConfig.phone, address: appConfig.address, checkInWindow: '12:00–18:00', checkOutWindow: '08:00–11:00' } };
}
let memory: DemoStore | undefined;
export function readStore(): DemoStore {
  try { const raw = localStorage.getItem(key); if (raw) { const data = JSON.parse(raw) as DemoStore; if (data.version === 2 && Array.isArray(data.bookings) && Array.isArray(data.rooms) && Array.isArray(data.users)) return data; } } catch { /* Local data unavailable. */ }
  if (!memory) memory = seed();
  return structuredClone(memory);
}
export function writeStore(data: DemoStore) {
  memory = structuredClone(data);
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* In-memory mode remains available. */ }
  window.dispatchEvent(new Event('piyum:data'));
}
export async function mutate<T>(operation: (data: DemoStore) => T): Promise<T> {
  const action = () => { const data = readStore(); const result = operation(data); writeStore(data); return result; };
  // Browser-local serialization only; this is not a substitute for backend transactions.
  if (navigator.locks) return navigator.locks.request(key, action);
  return action();
}
export const uid = () => crypto.randomUUID();
export function record(data: DemoStore, action: string, actorId: number | null) { data.audit.unshift({ id: uid(), action, actorId, createdAt: new Date().toISOString() }); }
