import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeProvider';
import { AuthProvider } from './context/AuthProvider';
import { BookingProvider } from './context/BookingProvider';
import { PublicLayout } from './layouts/PublicLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { RouteGuard } from './components/RouteGuard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { DiningPage } from './pages/DiningPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AccommodationPage } from './pages/AccommodationPage';
import { RoomSelectionPage } from './pages/RoomSelectionPage';
import { BookingReviewPage } from './pages/BookingReviewPage';
import { BookingDetailsPage } from './pages/BookingDetailsPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { StaffDashboard } from './pages/StaffDashboard';
import { StaffReservationsPage } from './pages/StaffReservationsPage';
import { StaffRoomsPage } from './pages/StaffRoomsPage';
import { StaffCustomersPage } from './pages/StaffCustomersPage';
import { StaffPaymentsPage } from './pages/StaffPaymentsPage';
import { StaffReviewsPage } from './pages/StaffReviewsPage';
import { StaffSettingsPage } from './pages/StaffSettingsPage';
import { StaffUsersPage } from './pages/StaffUsersPage';
import { StaffAuditPage } from './pages/StaffAuditPage';
const ops = ['ADMIN', 'MANAGER', 'RECEPTIONIST'] as const;
function Unavailable({ forbidden = false }: { forbidden?: boolean }) { return <div className="container section empty"><h1>{forbidden ? 'This area is not available to your role.' : 'A little off the beaten path.'}</h1><p>{forbidden ? 'Contact the hotel administrator if you need access.' : 'We could not find that page.'}</p><Link className="button" to="/">Return home ↗</Link></div>; }
export default function App() {
  return <ErrorBoundary><ThemeProvider><AuthProvider><BookingProvider><BrowserRouter><Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} /><Route path="accommodation" element={<AccommodationPage />} /><Route path="dining" element={<DiningPage />} /><Route path="policies" element={<PoliciesPage />} />
      <Route path="booking/rooms" element={<RoomSelectionPage />} /><Route path="booking/review" element={<BookingReviewPage />} /><Route path="booking/confirmation/:id" element={<BookingDetailsPage confirmation />} />
      <Route path="login" element={<AuthPage />} /><Route path="register" element={<AuthPage register />} />
      <Route element={<RouteGuard roles={['GUEST']} />}><Route path="account" element={<AccountPage />} /><Route path="account/bookings/:id" element={<BookingDetailsPage />} /></Route>
      <Route path="forbidden" element={<Unavailable forbidden />} /><Route path="*" element={<Unavailable />} />
    </Route>
    <Route element={<RouteGuard roles={['ADMIN', 'MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING', 'ACCOUNTANT']} />}>
      <Route path="staff" element={<StaffLayout />}>
        <Route index element={<StaffDashboard />} />
        <Route element={<RouteGuard roles={[...ops, 'ACCOUNTANT']} />}><Route path="reservations" element={<StaffReservationsPage />} /><Route path="booking/:id" element={<BookingDetailsPage />} /><Route path="payments" element={<StaffPaymentsPage />} /></Route>
        <Route element={<RouteGuard roles={[...ops, 'HOUSEKEEPING']} />}><Route path="rooms" element={<StaffRoomsPage />} /></Route>
        <Route element={<RouteGuard roles={[...ops]} />}><Route path="customers" element={<StaffCustomersPage />} /></Route>
        <Route element={<RouteGuard roles={['ADMIN', 'MANAGER']} />}><Route path="reviews" element={<StaffReviewsPage />} /><Route path="settings" element={<StaffSettingsPage />} /><Route path="audit" element={<StaffAuditPage />} /></Route>
        <Route element={<RouteGuard roles={['ADMIN']} />}><Route path="users" element={<StaffUsersPage />} /></Route>
      </Route>
    </Route>
    <Route path="owner/*" element={<Navigate to="/staff" replace />} />
  </Routes></BrowserRouter></BookingProvider></AuthProvider></ThemeProvider></ErrorBoundary>;
}
