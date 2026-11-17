import type { Accommodation } from '../types/domain';
import { appConfig } from '../config/appConfig';
import { request } from './apiClient';
import { accommodations } from '../data/catalogue';
import { requireMock } from './apiClient';
export const AccommodationService = { async getAll() { if (!appConfig.mock) return request<Accommodation[]>('/web/public/plans'); requireMock('Meal plans'); return structuredClone(accommodations); } };
