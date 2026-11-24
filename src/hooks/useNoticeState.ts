import { useCallback } from 'react';
import { notifyError, notifySuccess } from '../utils/notifications';
// Event-driven: repeating the same failed action produces a fresh notification.
// Empty strings clear legacy messages without generating a toast.
export function useNoticeState(kind: 'success' | 'error'): [string, (message: string) => void] {
  const send = useCallback((message: string) => {
    if (message.trim()) (kind === 'success' ? notifySuccess : notifyError)(message);
  }, [kind]);
  return ['', send];
}
