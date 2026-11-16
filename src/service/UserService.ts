import { readStore, mutate, record } from '../data/store';
import { requireRole } from './session';
import { requireMock } from './apiClient';
import type { Role } from '../types/domain';
export const UserService = {
  async getAll() { requireMock('User administration'); requireRole('ADMIN'); return readStore().users.map(({ passwordHash, ...user }) => user); },
  async updateRole(id: number, role: Role) { requireMock('Role changes'); const user = requireRole('ADMIN'); if (id === user.id) throw new Error('You cannot change your own role here.'); if (!['ADMIN', 'MANAGER', 'RECEPTIONIST', 'ACCOUNTANT', 'HOUSEKEEPING', 'GUEST'].includes(role)) throw new Error('Invalid role.'); return mutate(data => { const target = data.users.find(u => u.id === id); if (!target) throw new Error('User not found.'); if (target.role === 'ADMIN' && role !== 'ADMIN' && data.users.filter(u => u.role === 'ADMIN').length <= 1) throw new Error('Keep at least one administrator.'); target.role = role; record(data, `Changed user ${id} role to ${role}`, user.id); }); },
};
