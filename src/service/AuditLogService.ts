import { readStore } from '../data/store';
import { requireRole } from './session';
import { requireMock } from './apiClient';
export const AuditLogService = { async getAll() { requireMock('Audit history'); requireRole('ADMIN', 'MANAGER'); return readStore().audit; } };
