import type { Accommodation } from '../types/domain';
import { money } from '../utils/format';
export function MealPrices({ plan }: { plan: Accommodation }) { return plan.id==='room-only' ? <strong>No meal supplement</strong> : <><strong>Adult: {money(plan.adultSupplement)} / person / night</strong><strong>Child: {money(plan.childSupplement)} / person / night</strong></>; }
