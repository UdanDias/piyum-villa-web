import type { Accommodation } from '../types/domain';
import { appConfig } from '../config/appConfig';
import { request, change } from './apiClient';
import { accommodations } from '../data/catalogue';
import { requireMock } from './apiClient';
export const AccommodationService = { async updatePrices(values: {id:string;adultSupplement:number;childSupplement:number}[]) { return change<Accommodation[]>('/web/plans',values,'PATCH'); }, async getAll() { if (!appConfig.mock) return request<Accommodation[]>('/web/public/plans'); requireMock('Meal plans'); return structuredClone(accommodations); } };
