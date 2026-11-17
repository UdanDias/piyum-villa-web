import { MediaService, mediaUrl } from './MediaService';
import type { RoomType } from '../types/domain';
import { appConfig } from '../config/appConfig';
import { request } from './apiClient';
import { roomTypes } from '../data/catalogue';
import { requireMock } from './apiClient';
export const RoomTypeService = { async getAll() { if (!appConfig.mock) { const values = await request<RoomType[]>('/web/public/room-types'); const photos = await MediaService.getAll(); return values.map(t => ({ ...t, images: photos.some(m => m.ownerType === 'room-type' && m.ownerId === t.databaseId) ? photos.filter(m => m.ownerType === 'room-type' && m.ownerId === t.databaseId).map(mediaUrl) : roomTypes.find(v => v.id === t.id)?.images ?? [] })); } requireMock('Public room types'); return structuredClone(roomTypes); } };
