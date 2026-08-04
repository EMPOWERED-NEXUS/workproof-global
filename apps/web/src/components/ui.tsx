import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  busy = false,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'primary';
  busy?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  children?: ReactNode;
}) {
  const titleId = useId();
  const descId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const focusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={() => !busy && onClose()}>
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        {description && <p id={descId}>{description}</p>}
        {children}
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${tone === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            disabled={busy}
            onClick={() => void onConfirm()}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LiveRegion({ message, politeness = 'polite' }: { message: string; politeness?: 'polite' | 'assertive' }) {
  return (
    <div className="sr-only" aria-live={politeness} aria-atomic="true">
      {message}
    </div>
  );
}

export function ToastRegion({ message, tone }: { message: string; tone?: 'success' | 'error' | 'info' }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${tone ?? 'info'}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-stack" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton-row" />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="error-state" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function CopyButton({ value, label = 'Copy link' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" className="btn btn-secondary btn-sm" onClick={() => void copy()}>
      {copied ? 'Copied' : label}
    </button>
  );
}

export function ShareButton({
  title,
  text,
  url,
}: {
  title: string;
  text?: string;
  url: string;
}) {
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  if (!canShare) return null;
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={() => void navigator.share({ title, text, url }).catch(() => undefined)}
    >
      Share
    </button>
  );
}

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
  href?: string;
};

export function OnboardingChecklist({ items }: { items: ChecklistItem[] }) {
  const doneCount = items.filter((i) => i.done).length;
  return (
    <section className="card section-card onboarding-checklist" aria-labelledby="onboarding-title">
      <h2 id="onboarding-title">Getting started</h2>
      <p className="muted">
        {doneCount} of {items.length} complete
      </p>
      <ol className="checklist">
        {items.map((item) => (
          <li key={item.id} className={item.done ? 'done' : undefined}>
            <span className="check-mark" aria-hidden="true">
              {item.done ? '✓' : '○'}
            </span>
            {item.href && !item.done ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            <span className="sr-only">{item.done ? 'Completed' : 'Not completed'}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function FilterToolbar({ children }: { children: ReactNode }) {
  return <div className="filter-toolbar">{children}</div>;
}
