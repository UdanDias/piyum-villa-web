import { confirmAction, notifySuccess } from '../utils/notifications';
import { useNoticeState } from '../hooks/useNoticeState';
import { useState } from 'react';
import { UserService } from '../service/UserService';
import { useResource } from '../hooks/useResource';
import { useAuth } from '../context/AuthProvider';
import { PageTitle, Alert, Loading } from '../components/UI';
import type { Role, User } from '../types/domain';
import { errorMessage } from '../utils/format';
export function StaffUsersPage() {
  const resource = useResource(UserService.getAll); const { session } = useAuth(); const [busy, setBusy] = useState(false); const [, setError] = useNoticeState('error');
  async function save(user: User, role: Role) { if (busy || role === user.role) return; setBusy(true); try { if (!(await confirmAction({ titleText: "Change this user's access?", text: `${user.name}: ${user.role} → ${role}. ADMIN grants owner-level access.`, confirmButtonText: 'Confirm role change' })).isConfirmed) return; await UserService.updateRole(user.id, role); notifySuccess('Account permissions updated.'); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); } }
  return <><PageTitle eyebrow="OWNER ACCESS" title="People & permissions">Assign only the access each person needs.</PageTitle>{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : <div className="panel table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{resource.data?.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><label><span className="sr-only">Role for {u.name}</span><select disabled={u.id === session?.user.id || busy} value={u.role} onChange={e => { void save(u, e.target.value as Role); }}>{['GUEST', 'RECEPTIONIST', 'MANAGER', 'HOUSEKEEPING', 'ADMIN'].map(r => <option key={r}>{r}</option>)}</select></label></td></tr>)}</tbody></table></div>}</>;
}
