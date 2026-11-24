import { notifyError, notifySuccess } from '../utils/notifications';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthSession, SignUpRequest } from '../types/domain';
import { AuthService } from '../service/AuthService';
import { currentUser } from '../service/session';
interface AuthContextValue { session: AuthSession | null; login: (email: string, password: string) => Promise<void>; register: (input: SignUpRequest) => Promise<void>; logout: () => void; refreshProfile: () => void }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, update] = useState<AuthSession | null>(null);
  const logout = () => { AuthService.logout(); update(null); notifySuccess('Signed out successfully.'); };
  useEffect(() => { const onExpired = () => { const wasSignedIn = !!currentUser(); AuthService.logout(); update(null); if (wasSignedIn) notifyError('Your session has expired. Please sign in again.', true); }; window.addEventListener('piyum:unauthorized', onExpired); return () => window.removeEventListener('piyum:unauthorized', onExpired); }, []);
  useEffect(() => { if (!session) return; const timer = window.setTimeout(() => { AuthService.logout(); update(null); notifyError('Your session has expired. Please sign in again.', true); }, Math.max(0, session.expiresAt - Date.now())); return () => window.clearTimeout(timer); }, [session]);
  useEffect(() => { const sync = () => { const user = currentUser(); update(previous => previous && user ? { ...previous, user } : null); }; window.addEventListener('piyum:data', sync); window.addEventListener('storage', sync); return () => { window.removeEventListener('piyum:data', sync); window.removeEventListener('storage', sync); }; }, []);
  return <AuthContext.Provider value={{ session, login: async (email, password) => update(await AuthService.signIn(email, password)), register: async input => update(await AuthService.signUp(input)), logout, refreshProfile: () => { const user = currentUser(); if (session && user) update({ ...session, user }); } }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('Missing AuthProvider'); return context; }
