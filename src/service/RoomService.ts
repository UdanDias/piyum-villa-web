import { appConfig } from '../config/appConfig';
import { request, change } from './apiClient';
import { readStore, mutate, record } from '../data/store';
import { requireMock } from './apiClient';
import { requireRole } from './session';
import type { Room } from '../types/domain';
import { today } from '../utils/format';
export const RoomService = {
  async getAll() { if (!appConfig.mock) return request<Room[]>('/web/public/rooms'); requireMock('Room inventory'); return readStore().rooms; },
  async updateCondition(id: number, input: Pick<Room, 'status' | 'housekeeping'>) {
    if (!appConfig.mock) return change<Room>(`/web/rooms/${id}`, input, 'PATCH'); requireMock('Room condition'); const actor = requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING');
    return mutate(data => { const room = data.rooms.find(r => r.id === id); if (!room) throw new Error('Room not found.');
      if (input.status === 'servicing' && data.bookings.some(b => b.roomIds.includes(id) && ['confirmed', 'checked-in'].includes(b.status) && b.draft.checkOut > today())) throw new Error('This room has an active or future reservation. Reassign it before marking servicing.');
      room.status = input.status; room.housekeeping = input.housekeeping; record(data, `Updated room ${room.number} condition`, actor.id); return room;
    });
  },
};
