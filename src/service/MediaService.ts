import { appConfig } from '../config/appConfig';
import { request } from './apiClient';
export interface Media { id: number; ownerType: 'hotel' | 'room-type' | 'room'; ownerId: number; altText: string; path: string }
export const mediaUrl = (m: Media) => appConfig.apiUrl + m.path;
export const MediaService = {
 async getAll(): Promise<Media[]> { return appConfig.mock ? [] : request<Media[]>('/web/public/media'); },
 async upload(ownerType: string, ownerId: number, altText: string, file: File) { if (appConfig.mock) throw new Error('Switch to API mode to upload hotel images.'); const form = new FormData(); form.append('ownerType', ownerType); form.append('ownerId', String(ownerId)); form.append('altText', altText); form.append('file', file); await request('/web/media', { method: 'POST', body: form }); window.dispatchEvent(new Event('piyum:data')); },
 async remove(id: number) { await request(`/web/media/${id}`, { method: 'DELETE' }); window.dispatchEvent(new Event('piyum:data')); },
};
