import { useResource } from '../hooks/useResource';
import { AuditLogService } from '../service/AuditLogService';
import { PageTitle, Alert, Loading, Empty } from '../components/UI';
export function StaffAuditPage() {
  const resource = useResource(AuditLogService.getAll);
  return <><PageTitle eyebrow="A CLEAR RECORD" title="Activity log">Read-only activity from this browser's demo store.</PageTitle>{resource.loading ? <Loading /> : resource.error ? <Alert>{resource.error}</Alert> : !resource.data?.length ? <Empty title="No recorded activity yet" /> : <div className="panel table-scroll"><table><thead><tr><th>Time</th><th>Action</th><th>Actor</th></tr></thead><tbody>{resource.data.map(entry => <tr key={entry.id}><td>{new Date(entry.createdAt).toLocaleString()}</td><td>{entry.action}</td><td>{entry.actorId === null ? 'Guest checkout' : `User ${entry.actorId}`}</td></tr>)}</tbody></table></div>}</>;
}
