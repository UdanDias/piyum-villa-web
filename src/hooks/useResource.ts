import { notifyError } from '../utils/notifications';
import { useEffect, useState, useCallback } from 'react';
import { errorMessage } from '../utils/format';
export function useResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T>(); const [error, setError] = useState(''); const [loading, setLoading] = useState(true); const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision(v => v + 1), []);
  useEffect(() => { let active = true; setLoading(true); setError(''); load().then(value => { if (active) setData(value); }).catch(e => { if (active) { const message = errorMessage(e); setError(message); notifyError(message, true); } }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [load, revision]);
  useEffect(() => { window.addEventListener('piyum:data', reload); window.addEventListener('storage', reload); window.addEventListener('focus', reload); return () => { window.removeEventListener('piyum:data', reload); window.removeEventListener('storage', reload); window.removeEventListener('focus', reload); }; }, [reload]);
  return { data, error, loading, reload };
}
