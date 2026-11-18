import type { BookingDraft, RoomAllocation, RoomType } from '../types/domain';
export const emptyAllocation = (): RoomAllocation => ({ category: 'deluxe', adults: 0, children: 0 });
export const occupancyMessage = 'Each room accommodates up to 3 guests, including at least 1 adult and no more than 2 adults.';
export function roomError(room: RoomAllocation, index: number, types?: RoomType[]) {
  if (!Number.isInteger(room.adults) || !Number.isInteger(room.children) || room.adults < 0 || room.children < 0) return 'Choose whole, non-negative guest counts.';
  if (room.adults < 1) return `Add at least 1 adult to Room ${index + 1} to continue.`;
  if (room.adults > 2) return 'This room allows at most 2 adults; use another room for additional guests.';
  if (room.children > 2 || room.adults + room.children > 3) return 'This room allows at most 3 guests; use another room for additional guests.';
  const type = types?.find(t => t.id === room.category);
  if (type && (room.adults > (type.maxAdults ?? 2) || room.children > (type.maxChildren ?? 2) || room.adults + room.children > (type.maxOccupancy ?? 3))) return 'Choose another room type or adjust the guests.';
  return '';
}
export function allocationErrors(rooms: RoomAllocation[], types?: RoomType[]) { return rooms.map((room, i) => roomError(room, i, types)); }
export function withAllocations(draft: BookingDraft, allocations: RoomAllocation[]): BookingDraft {
  return { ...draft, allocations, rooms: allocations.length, adults: allocations.reduce((n, r) => n + r.adults, 0), children: allocations.reduce((n, r) => n + r.children, 0), suite: allocations.filter(r => r.category === 'suite').length, deluxe: allocations.filter(r => r.category === 'deluxe').length, selectedRoomIds: [], selectRooms: false };
}
