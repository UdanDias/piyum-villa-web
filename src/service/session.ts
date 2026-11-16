import type { AuthSession, Role } from '../types/domain';
import { readStore } from '../data/store';
import { appConfig } from '../config/appConfig';
let session: AuthSession | null = null;
export function setSession(value: AuthSession | null) { session = value; }
export function currentUser() {
  if (!session || session.expiresAt <= Date.now()) return null;
  if (appConfig.mock) {
    const stored = readStore().users.find(u => u.id === session?.user.id);
    if (!stored) return null;
    const { passwordHash, ...user } = stored;
    return user;
  }
  return session.user;
}
export function requireUser() { const user = currentUser(); if (!user) throw new Error('Please sign in to continue.'); return user; }
export function requireRole(...roles: Role[]) { const user = requireUser(); if (!roles.includes(user.role)) throw new Error('You do not have permission for this action.'); return user; }
