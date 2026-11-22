import { useResource } from '../hooks/useResource';
import { HotelService } from '../service/HotelService';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Role } from '../types/domain';
import { appConfig } from '../config/appConfig';
const links: { path: string; name: string; symbol: string; roles: Role[] }[] = [
  { path: '/staff', name: 'Overview', symbol: '◫', roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'] },
  { path: '/staff/reservations', name: 'Reservations', symbol: '▤', roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'] },
  { path: '/staff/rooms', name: 'Rooms & housekeeping', symbol: '▦', roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING'] },
  { path: '/staff/customers', name: 'Customers', symbol: '♙', roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'] },
  { path: '/staff/payments', name: 'Cash payments', symbol: '◉', roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'] },
  { path: '/staff/reviews', name: 'Guest reviews', symbol: '☆', roles: ['ADMIN', 'MANAGER'] },
  { path: '/staff/settings', name: 'Hotel details', symbol: '⚙', roles: ['ADMIN', 'MANAGER'] },
  { path: '/staff/setup', name: 'Inventory setup', symbol: '▦', roles: ['ADMIN'] },
  { path: '/staff/media', name: 'Hotel & room photos', symbol: '▧', roles: ['ADMIN', 'MANAGER'] },
  { path: '/staff/users', name: 'Users & access', symbol: '♧', roles: ['ADMIN'] },
];
export function StaffLayout() {
 const property=useResource(HotelService.getPublic);
  const { session, logout } = useAuth(); const role = session!.user.role;
  return <div className="staff-shell"><aside className="sidebar"><Link className="brand" to="/"><span>{property.data?.name ?? appConfig.hotelName}</span><small>HOTEL WORKSPACE</small></Link><div className="staff-identity"><span className="avatar">{session!.user.name[0]}</span><div><b>{session!.user.name}</b><small>{role.toLowerCase()}</small></div></div><nav aria-label="Staff navigation">{links.filter(l => l.roles.includes(role)).map(l => <NavLink end={l.path === '/staff'} to={l.path} key={l.path}><span aria-hidden="true">{l.symbol}</span>{l.name}</NavLink>)}</nav><div className="sidebar-bottom"><Link to="/">↗ View website</Link><button className="plain-button" onClick={logout}>Log out</button></div></aside><div className="staff-body"><header className="staff-topbar"><span>{appConfig.mock ? 'DEMO WORKSPACE · BROWSER-LOCAL DATA' : 'HOTEL WORKSPACE'}</span><Link className="button outline" style={{marginLeft:"auto",marginRight:12}} to="/">Home</Link><ThemeToggle/></header><main id="main" className="staff-main"><Outlet /></main></div></div>;
}