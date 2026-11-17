import type { User } from '../types/domain';
import { updateSessionUser } from './session';
import { appConfig } from '../config/appConfig';
import { request, change } from './apiClient';
import { readStore, mutate, record } from '../data/store';
import { requireMock } from './apiClient';
import { requireUser, requireRole } from './session';
export const CustomerService = {
  async getProfile() { if (!appConfig.mock) return request<User>('/web/profile'); requireMock('Customer profile'); return requireUser(); },
  async updateProfile(name: string, phone: string) { if (!appConfig.mock) { const user = await change<User>('/web/profile', { name, phone }, 'PATCH'); updateSessionUser(user); return user; } requireMock('Profile editing'); const user = requireUser(); if (!name.trim() || phone.trim().length < 7) throw new Error('Enter your name and phone number.'); return mutate(data => { const stored = data.users.find(u => u.id === user.id); if (!stored) throw new Error('User not found.'); stored.name = name.trim(); stored.phone = phone.trim(); record(data, 'Updated profile', user.id); const { passwordHash, ...profile } = stored; return profile; }); },
  async getAll() { if (!appConfig.mock) return request<User[]>('/web/customers'); requireMock('Customer directory'); requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST'); return readStore().users.filter(u => u.role === 'GUEST').map(({ passwordHash, ...user }) => user); },
};
