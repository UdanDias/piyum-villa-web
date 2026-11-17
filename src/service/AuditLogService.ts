import type { AuditEntry } from '../types/domain';
import { appConfig } from '../config/appConfig';
import { request } from './apiClient';
import { readStore } from '../data/store';
import { requireRole } from './session';
import { requireMock } from './apiClient';
export const AuditLogService = { async getAll() { if (!appConfig.mock) return request<AuditEntry[]>('/web/audit'); requireMock('Audit history'); requireRole('ADMIN', 'MANAGER'); return readStore().audit; } };
