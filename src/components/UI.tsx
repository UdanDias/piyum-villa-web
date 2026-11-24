import { notifyError, notifySuccess } from '../utils/notifications';
import { useEffect, useRef } from 'react';
import type { ReactNode, ImgHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { fallbackImage } from '../config/appConfig';
export function Photo(props: ImgHTMLAttributes<HTMLImageElement>) { return <img loading="lazy" {...props} alt={props.alt ?? ""} onError={event => { if (event.currentTarget.dataset.fallback !== 'yes') { event.currentTarget.dataset.fallback = 'yes'; event.currentTarget.src = fallbackImage; } }} />; }
export function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) { return <div className="page-heading"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{children && <p className="lede">{children}</p>}</div>; }
export function Alert({ children, success = false }: { children: ReactNode; success?: boolean }) {
  const message = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  const last = useRef('');
  useEffect(() => { if (message && last.current !== message) { last.current = message; if (success) notifySuccess(message); else notifyError(message, true); } }, [message, success]);
  return <div className="sr-only">{children}</div>;
}
export function Loading() { return <div className="loading" role="status"><span className="spinner" /> Bringing everything together…</div>; }
export function Empty({ title, children }: { title: string; children?: ReactNode }) { return <div className="empty"><span aria-hidden="true">✧</span><h3>{title}</h3>{children}</div>; }
export function Status({ value }: { value: string }) { return <span className={`status status-${value}`}>{value.replace(/-/g, ' ')}</span>; }
export function BackLink({ to, children }: { to: string; children: ReactNode }) { return <Link className="text-link" to={to}>← {children}</Link>; }
export function Dialog({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (open && !ref.current?.open) ref.current?.showModal(); if (!open && ref.current?.open) ref.current?.close(); }, [open]);
  return <dialog ref={ref} onCancel={onClose} onClose={onClose} aria-label={title} className="dialog"><div className="row-between"><h2>{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}>×</button></div>{children}</dialog>;
}
