import { useState } from 'react';
import { CustomerService } from '../service/CustomerService';
import { useResource } from '../hooks/useResource';
import { PageTitle, Alert, Loading, Empty } from '../components/UI';
export function StaffCustomersPage() {
  const resource = useResource(CustomerService.getAll); const [query, setQuery] = useState(''); const rows = resource.data?.filter(u => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageTitle eyebrow="PEOPLE, NOT JUST BOOKINGS" title="Guest accounts">Registered demo customers. Accountless guest contact details are shown on their reservations.</PageTitle><label className="search-field"><span className="sr-only">Search customers</span><input placeholder="Search name, email or phone…" value={query} onChange={e => setQuery(e.target.value)} /></label>{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : !rows?.length ? <Empty title="No matching customers" /> : <div className="panel table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Username</th></tr></thead><tbody>{rows.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td><td>{u.username}</td></tr>)}</tbody></table></div>}</>;
}
