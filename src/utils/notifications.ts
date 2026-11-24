import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '../notifications.css';

type Notice = { message: string; kind: 'success' | 'error' };
const queue: Notice[] = [];
let displaying = false;
let confirming = false;
let scheduled = false;
const recent = new Map<string, number>();

// Defer until React has closed any form dialog, then use its current top layer.
function schedule() {
  if (scheduled) return;
  scheduled = true;
  window.setTimeout(() => { scheduled = false; void drain(); }, 0);
}
async function drain() {
  if (displaying || confirming || !queue.length) return;
  const notice = queue.shift()!;
  displaying = true;
  const target = document.querySelector<HTMLDialogElement>('dialog[open]') ?? document.body;
  const observer = new MutationObserver(() => {
    const container = Swal.getContainer();
    const current = document.querySelector('dialog[open]') ?? document.body;
    if (container && container.parentElement !== current && !confirming) current.appendChild(container);
  });
  try {
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'], childList: true });
    await Swal.fire({
      toast: true, position: 'top-end', target, icon: notice.kind,
      titleText: notice.message, width: '320px', showConfirmButton: false,
      showCloseButton: true, timer: notice.kind === 'success' ? 1500 : 6000,
      timerProgressBar: true, heightAuto: false,
      customClass: { popup: `pv-toast pv-toast-${notice.kind}`, title: 'pv-toast-title', container: 'pv-notice-container' },
      didOpen: popup => {
        popup.addEventListener('mouseenter', () => Swal.stopTimer());
        popup.addEventListener('mouseleave', () => Swal.resumeTimer());
        popup.addEventListener('focusin', () => Swal.stopTimer());
        popup.addEventListener('focusout', () => Swal.resumeTimer());
      },
    });
  } finally { observer.disconnect(); displaying = false; schedule(); }
}
function notify(kind: Notice['kind'], message: string, deduplicate = false) {
  if (!message.trim()) return;
  const key = `${kind}:${message}`;
  if (deduplicate && Date.now() - (recent.get(key) ?? 0) < 5000) return;
  recent.set(key, Date.now());
  if (recent.size > 100) recent.delete(recent.keys().next().value as string);
  queue.push({ kind, message }); schedule();
}
export const notifySuccess = (message: string) => notify('success', message);
export const notifyError = (message: string, deduplicate = false) => notify('error', message, deduplicate);

export async function confirmAction(options: SweetAlertOptions): Promise<SweetAlertResult> {
  if (confirming) return { isConfirmed: false, isDenied: false, isDismissed: true };
  confirming = true;
  if (displaying) Swal.close();
  try {
    return await Swal.fire({
      icon: 'warning', titleText: 'Are you sure?', showCancelButton: true,
      confirmButtonText: 'Confirm', cancelButtonText: 'Cancel', focusCancel: true,
      confirmButtonColor: '#3085d6', cancelButtonColor: '#d33',
      heightAuto: false, width: '460px',
      target: document.querySelector<HTMLDialogElement>('dialog[open]') ?? document.body,
      customClass: { popup: 'pv-confirm', validationMessage: 'pv-confirm-error' },
      ...options,
    });
  } finally { confirming = false; schedule(); }
}

export async function confirmCheckIn(reference: string) {
  const content = document.createElement('div');
  const description = document.createElement('p');
  description.textContent = `${reference}. Stay dates and room readiness will be validated.`;
  const typeLabel = document.createElement('label'); typeLabel.textContent = 'Document type';
  const select = document.createElement('select'); select.className = 'swal2-select';
  for (const type of ['PASSPORT', 'NIC']) { const option = document.createElement('option'); option.value = type; option.textContent = type; select.appendChild(option); }
  typeLabel.appendChild(select);
  const numberLabel = document.createElement('label'); numberLabel.textContent = 'Document number';
  const input = document.createElement('input'); input.className = 'swal2-input'; input.maxLength = 50; input.autocomplete = 'off';
  numberLabel.appendChild(input); content.append(description, typeLabel, numberLabel);
  const result = await confirmAction({ titleText: 'Check in this guest?', html: content, confirmButtonText: 'Check in',
    preConfirm: () => {
      if (input.value.trim().length < 3) { Swal.showValidationMessage('Enter the document number (at least 3 characters).'); return false; }
      return { documentType: select.value, documentNumber: input.value.trim() };
    },
  });
  return result.isConfirmed ? result.value as { documentType: string; documentNumber: string } : undefined;
}

// Replace native browser validation bubbles, while preserving HTML validity rules.
let invalidBatch = false;
document.addEventListener('invalid', event => {
  const field = event.target;
  if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
  if (!field.closest('#root')) return;
  event.preventDefault();
  if (invalidBatch) return;
  invalidBatch = true;
  const labelCopy = field.labels?.[0]?.cloneNode(true) as HTMLElement | undefined;
  labelCopy?.querySelectorAll('input, select, textarea, button').forEach(control => control.remove());
  const label = labelCopy?.textContent?.trim().replace(/\s+/g, ' ') || field.getAttribute('aria-label') || 'This field';
  notifyError(`${label}: ${field.validationMessage}`);
  field.focus();
  window.setTimeout(() => { invalidBatch = false; }, 0);
}, true);
