import type { AuthSession, SignUpRequest, Role } from '../types/domain';
import { appConfig } from '../config/appConfig';
import { readStore, mutate } from '../data/store';
import { request, setAccessToken, requireMock } from './apiClient';
import { setSession } from './session';
export const DEMO_PASSWORD = 'DemoStay123!';
async function digest(value: string) { const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)); return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, '0')).join(''); }
interface AuthResponse { token: string; tokenType: string; expiresIn: number; userId: number; username: string; role: Role }
function activate(value: AuthSession) { setSession(value); setAccessToken(appConfig.mock ? null : value.token); return value; }
async function activateRemote(value: AuthSession): Promise<AuthSession> { setAccessToken(value.token); try { const user = await request<AuthSession['user']>('/web/profile'); return activate({ ...value, user }); } catch (e) { setAccessToken(null); throw e; } }
export const AuthService = {
  async signIn(email: string, password: string): Promise<AuthSession> {
    email = email.trim().toLowerCase();
    if (!appConfig.mock) {
      const result = await request<AuthResponse>('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) });
      return activateRemote({ token: result.token, expiresAt: Date.now() + result.expiresIn * 1000, user: { id: result.userId, username: result.username, name: result.username, email, phone: '', role: result.role } });
    }
    const found = readStore().users.find(u => u.email.toLowerCase() === email);
    if (!found || (found.passwordHash ? await digest(password) !== found.passwordHash : password !== DEMO_PASSWORD)) throw new Error('Email or password is incorrect.');
    const { passwordHash, ...user } = found;
    return activate({ token: `demo-${crypto.randomUUID()}`, expiresAt: Date.now() + 15 * 60 * 1000, user });
  },
  async signUp(input: SignUpRequest) {
    if (!input.name.trim() || !input.username.trim() || !/^\S+@\S+\.\S+$/.test(input.email) || input.phone.trim().length < 7) throw new Error('Enter your name, username, valid email and phone number.');
    if (input.password.length < 12 || new TextEncoder().encode(input.password).length > 72) throw new Error('Use at least 12 characters and no more than 72 UTF-8 bytes for your password.');
    if (!appConfig.mock) {
      const result = await request<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(input) });
      return activateRemote({ token: result.token, expiresAt: Date.now() + result.expiresIn * 1000, user: { id: result.userId, username: result.username, name: input.name, email: input.email, phone: input.phone, role: result.role } });
    }
    const passwordHash = await digest(input.password);
    await mutate(data => {
      if (data.users.some(u => u.email.toLowerCase() === input.email.trim().toLowerCase() || u.username.toLowerCase() === input.username.trim().toLowerCase())) throw new Error('Email or username is already registered.');
      data.users.push({ id: Math.max(...data.users.map(u => u.id)) + 1, name: input.name.trim(), username: input.username.trim(), email: input.email.trim().toLowerCase(), phone: input.phone.trim(), role: 'GUEST', passwordHash });
    });
    return AuthService.signIn(input.email, input.password);
  },
  async getMe() { if (!appConfig.mock) return request<{ userId: number; username: string; email: string; roleId: number }>('/auth/me'); requireMock('Profile'); return null; },
  logout() { setSession(null); setAccessToken(null); },
};
