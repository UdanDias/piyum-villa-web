import { readStore, mutate, uid, record } from '../data/store';
import { requireMock } from './apiClient';
import { requireUser, requireRole } from './session';
export const ReviewService = {
  async getApproved() { requireMock('Public reviews'); return readStore().reviews.filter(r => r.status === 'approved'); },
  async getMine() { requireMock('My reviews'); const user = requireUser(); return readStore().reviews.filter(r => r.userId === user.id); },
  async getAll() { requireMock('Review moderation'); requireRole('ADMIN', 'MANAGER'); return readStore().reviews; },
  async create(bookingId: string, rating: number, title: string, comment: string) {
    requireMock('Review submission'); const user = requireUser();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !title.trim() || !comment.trim() || title.length > 120 || comment.length > 1500) throw new Error('Enter a 1–5 rating, title and review within the shown limits.');
    return mutate(data => { const b = data.bookings.find(b => b.id === bookingId); if (!b || b.userId !== user.id || b.status !== 'completed') throw new Error('Reviews are available for your completed stays only.'); if (data.reviews.some(r => r.bookingId === bookingId)) throw new Error('You already reviewed this stay.');
      data.reviews.unshift({ id: uid(), bookingId, userId: user.id, author: user.name, rating, title: title.trim(), comment: comment.trim(), status: 'pending', createdAt: new Date().toISOString() }); record(data, `Submitted review for ${b.reference}`, user.id);
    });
  },
  async moderate(id: string, status: 'approved' | 'rejected') { requireMock('Review moderation'); const user = requireRole('ADMIN', 'MANAGER'); return mutate(data => { const r = data.reviews.find(r => r.id === id); if (!r) throw new Error('Review not found.'); r.status = status; record(data, `Review ${status}`, user.id); }); },
};
