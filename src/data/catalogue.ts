import { asset } from '../config/appConfig';
import type { RoomType, Room, Accommodation } from '../types/domain';
const amenities = ['King-size bed', 'Air conditioning', 'Hot-water shower', 'Attached bathroom', 'Workstation', 'High-speed Wi-Fi', 'Minibar', 'Clothing rail', 'Luggage ledge', 'Garden view'];
// Two editorial galleries. Photos are illustrative, never property photographs.
const gallery = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5', 'greenery', 'coast', 'surf', 'dining', 'food'].map(asset);
export const roomTypes: RoomType[] = [
  { id: 'suite', name: 'Suite Double Room', description: 'A little more room to slow down. A detached garden retreat with a private kitchen and space to settle in.', nightlyRate: 18000, area: 17, buildingStyle: 'Detached garden villa', kitchen: true, images: gallery, amenities: [...amenities, 'Kitchen & electric kettle', 'Veranda on ground floor; balcony on upper floors'] },
  { id: 'deluxe', name: 'Deluxe Double Room', description: 'An easy, comfortable base for days by the bay. Rest, recharge and make yourself at home.', nightlyRate: 14000, area: 17, buildingStyle: 'Adjoining rooms', kitchen: false, images: [gallery[2], gallery[3], gallery[0], gallery[1], ...gallery.slice(4)], amenities: [...amenities, 'Balcony'] },
];
// PDF inventory only. Rooms 19–21 are not invented; confirm before real integration.
export const initialRooms: Room[] = Array.from({ length: 18 }, (_, index) => ({ id: index + 1, number: String(index + 1).padStart(2, '0'), category: index < 6 ? 'deluxe' : 'suite', status: 'available', housekeeping: 'clean', location: index < 6 ? `Deluxe · ${index < 3 ? '1st' : '2nd'} floor · balcony` : `Villa ${Math.floor((index-6)/3)+1} · ${['Ground floor · veranda','1st floor · balcony','2nd floor · balcony'][(index-6)%3]}` }));
export const accommodations: Accommodation[] = [
  { id: 'room-only', name: 'Room Only', description: 'Your room, your own rhythm. Meals are not included.', adultSupplement: 0, childSupplement: 0 },
  { id: 'bb', name: 'Bed & Breakfast', description: 'A relaxed breakfast to start each morning.', adultSupplement: 2500, childSupplement: 1250 },
  { id: 'half-board', name: 'Half Board', description: 'Breakfast and dinner included.', adultSupplement: 5500, childSupplement: 2750 },
  { id: 'full-board', name: 'Full Board', description: 'Breakfast, lunch and dinner included.', adultSupplement: 8000, childSupplement: 4000 },
];
// All rates and meal inclusions are sample assumptions. Supplements are per person per night; provisional until confirmed.
