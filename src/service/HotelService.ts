import { appConfig } from '../config/appConfig';
import { request, change } from './apiClient';
import { readStore, mutate, record } from '../data/store';
import { requireRole } from './session';
import { requireMock } from './apiClient';
import type { HotelProfile } from '../types/domain';
export const HotelService = {
  async getPublic() { if (!appConfig.mock) return request<HotelProfile>('/web/public/hotel'); requireMock('Public hotel information'); return readStore().hotel; },
  async update(input: HotelProfile) { if (!appConfig.mock) return change<HotelProfile>('/web/hotel', { name: input.name, phone: input.phone, address: input.address, checkInWindow: input.checkInWindow, checkOutWindow: input.checkOutWindow }, 'PATCH'); requireMock('Hotel settings'); const actor = requireRole('ADMIN', 'MANAGER'); if (!input.name.trim() || !input.phone.trim() || !input.address.trim()) throw new Error('Name, phone and address are required.'); return mutate(data => { data.hotel = { ...input }; record(data, 'Updated hotel details', actor.id); return data.hotel; }); },
};
