export type Role = 'GUEST' | 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'ACCOUNTANT' | 'HOUSEKEEPING';
export type RoomCategory = 'suite' | 'deluxe';
export type MealPlan = 'room-only' | 'bb' | 'half-board' | 'full-board';
export type BookingStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
export interface User { id: number; name: string; username: string; email: string; phone: string; role: Role }
export interface AuthSession { token: string; expiresAt: number; user: User }
export interface SignUpRequest { name: string; username: string; email: string; phone: string; password: string }
export interface RoomType { databaseId?: number; id: RoomCategory; name: string; description: string; nightlyRate: number; area: number; buildingStyle: string; kitchen: boolean; images: string[]; amenities: string[] }
export interface Room { id: number; number: string; category: RoomCategory; status: 'available' | 'servicing'; housekeeping: 'clean' | 'dirty'; location: string }
export interface Accommodation { id: MealPlan; name: string; description: string; supplement: number }
export interface SearchCriteria { checkIn: string; checkOut: string; rooms: number }
export interface BookingDraft extends SearchCriteria { suite: number; deluxe: number; adults: number; children: number; mealPlan: MealPlan; selectedRoomIds: number[]; selectRooms: boolean }
export interface GuestDetails { name: string; email: string; phone: string; documentType: 'NIC' | 'PASSPORT'; documentNumber: string; notes: string }
export interface QuoteLine { label: string; amount: number }
export interface Quote { nights: number; lines: QuoteLine[]; total: number; currency: string; cancellationDeadline: string }
export interface Booking { roomNumbers?: string[]; id: string; reference: string; userId: number | null; draft: BookingDraft; roomIds: number[]; guest: Omit<GuestDetails, 'documentNumber'> & { documentLastFour: string }; quote: Quote; status: BookingStatus; createdAt: string; idempotencyKey: string; paid: number }
export interface Availability { rooms: Room[]; suite: number; deluxe: number; total: number }
export interface Review { id: string; bookingId: string; userId: number; author: string; rating: number; title: string; comment: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string }
export interface Payment { id: string; bookingId: string; amount: number; method: 'cash'; createdAt: string; actorId: number }
export interface AuditEntry { id: string; action: string; actorId: number | null; createdAt: string }
export interface HotelProfile { id?: number; name: string; phone: string; address: string; checkInWindow: string; checkOutWindow: string }
