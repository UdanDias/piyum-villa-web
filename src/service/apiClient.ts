
import { appConfig } from '../config/appConfig';
let accessToken: string | null = null;
export const setAccessToken = (value: string | null) => { accessToken = value; };
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController(); const timer = window.setTimeout(() => controller.abort(), 15000);
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  try {
    const response = await fetch(`${appConfig.apiUrl}${path}`, { ...options, headers, signal: controller.signal });
    if (response.status === 401) window.dispatchEvent(new Event('piyum:unauthorized'));
    const text = await response.text(); let data: unknown;
    try { data = text ? JSON.parse(text) : undefined; } catch { throw new ApiError('The server returned an unexpected response.', response.status); }
    if (!response.ok) {
      const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string' ? data.message : `Request failed (${response.status}).`;
      throw new ApiError(message, response.status);
    }
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') throw new Error('The request timed out. Please try again.');
    throw new Error('Cannot reach the server. Check that the backend is running.');
  } finally { window.clearTimeout(timer); }
}
export function requireMock(feature: string): void {
  if (!appConfig.mock) throw new Error(`${feature} needs the new backend API contract. No mock data was used. See BACKEND_INTEGRATION.md.`);
}

export async function change<T>(path: string, body?: unknown, method = 'POST', headers?: HeadersInit): Promise<T> {
 const value = await request<T>(path, { method, headers, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
 window.dispatchEvent(new Event('piyum:data')); try { localStorage.setItem('piyum-data-revision',String(Date.now())); } catch {} return value;
}
export function guestHeaders(): HeadersInit {
 const key = 'piyum-guest-access'; let value = sessionStorage.getItem(key);
 if (!value) { value = crypto.randomUUID() + crypto.randomUUID(); sessionStorage.setItem(key, value); }
 return { 'X-Booking-Token': value };
}
