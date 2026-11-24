import type { RoomAllocation, RoomCategory } from '../types/domain';

const names: Record<RoomCategory, string> = { deluxe: 'Deluxe', suite: 'Suite' };

export function roomSelectionLimitMessage(
  category: RoomCategory, allocations: RoomAllocation[], assigned: (number | null)[]
): string {
  const limit = allocations.filter(room => room.category === category).length;
  const name = names[category];
  const remaining = Array.from(new Set(allocations
    .filter((room, index) => room.category !== category && assigned[index] == null)
    .map(room => room.category)));
  const opening = limit === 0
    ? `Your room preferences do not include any ${name} rooms.`
    : `You have already selected ${limit} ${name} ${limit === 1 ? 'room' : 'rooms'}.`;
  if (remaining.length === 1) {
    return `${opening} According to your room preferences, your next selection must be a ${names[remaining[0]]} room.`;
  }
  return `${opening} All requested rooms have been selected. Deselect a room to change your choice, or update your room preferences.`;
}
