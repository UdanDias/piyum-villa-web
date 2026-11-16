import { useState } from 'react';
import { UserService } from '../service/UserService';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../context/AuthProvider';
import { PageTitle, Alert, Loading, Dialog } from '../components/UI';
import type { Role, User } from '../types/domain';
import { errorMessage } from '../utils/format';
export function StaffUsersPage() {
  const resource = useResource(UserService.getAll); const { session } = useAuth(); const [change, setChange] = useState<{ user: User; role: Role }>(); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function save() { if (!change) return; setBusy(true); setError(''); try { await UserService.updateRole(change.user.id, change.role); setChange(undefined); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  return <><PageTitle eyebrow="OWNER ACCESS" title="People & permissions">Assign only the access each person needs.</PageTitle>{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : <div className="panel table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{resource.data?.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><label><span className="sr-only">Role for {u.name}</span><select disabled={u.id === session?.user.id || busy} value={u.role} onChange={e => { setError(''); setChange({ user: u, role: e.target.value as Role }); }}>{['GUEST', 'RECEPTIONIST', 'MANAGER', 'HOUSEKEEPING', 'ACCOUNTANT', 'ADMIN'].map(r => <option key={r}>{r}</option>)}</select></label></td></tr>)}</tbody></table></div>}<Dialog open={!!change} title="Change this user's access?" onClose={() => { if (!busy) setChange(undefined); }}><p>{change?.user.name}: {change?.user.role} → {change?.role}</p><p>ADMIN grants owner-level access to the workspace.</p>{error && <Alert>{error}</Alert>}<button className="button" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Confirm role change'}</button></Dialog></>;
}
