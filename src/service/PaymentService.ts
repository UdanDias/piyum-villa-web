import type { Payment } from '../types/domain';

import { appConfig } from '../config/appConfig';
import { request, change } from './apiClient';
import { readStore, mutate, uid, record } from '../data/store';
import { requireMock } from './apiClient';
import { requireRole } from './session';
export const PaymentService = {
  async getAll() { if (!appConfig.mock) return request<Payment[]>('/web/payments'); requireMock('Payments'); requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST'); return readStore().payments; },
  async recordCash(bookingId: string, amount: number) { if (!appConfig.mock) { const signature = `${bookingId}:${amount}`; const requestKey = sessionStorage.getItem('piyum-cash-' + signature) ?? crypto.randomUUID(); sessionStorage.setItem('piyum-cash-' + signature, requestKey); await change('/web/payments', { bookingId: Number(bookingId), amount, requestKey }); sessionStorage.removeItem('piyum-cash-' + signature); return; } requireMock('Cash collection'); const user = requireRole('ADMIN', 'MANAGER', 'RECEPTIONIST');
    if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100) throw new Error('Enter a positive amount with at most two decimal places.');
    return mutate(data => { const b = data.bookings.find(b => b.id === bookingId); if (!b || !['confirmed', 'checked-in'].includes(b.status)) throw new Error('Payment requires an active booking.'); if (amount > b.quote.total - b.paid) throw new Error('Amount exceeds the outstanding balance.'); b.paid = Math.round((b.paid + amount) * 100) / 100; data.payments.unshift({ id: uid(), bookingId, amount, method: 'cash', createdAt: new Date().toISOString(), actorId: user.id }); record(data, `Recorded cash for ${b.reference}`, user.id); });
  },
};
