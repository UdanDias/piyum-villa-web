import { accommodations } from '../data/catalogue';
import { requireMock } from './apiClient';
export const AccommodationService = { async getAll() { requireMock('Meal plans'); return structuredClone(accommodations); } };
