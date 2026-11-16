import { roomTypes } from '../data/catalogue';
import { requireMock } from './apiClient';
export const RoomTypeService = { async getAll() { requireMock('Public room types'); return structuredClone(roomTypes); } };
