import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import type { Role } from '../types/domain';
export function RouteGuard({ roles }: { roles?: Role[] }) {
  const { session } = useAuth(); const location = useLocation();
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (roles && !roles.includes(session.user.role)) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}
