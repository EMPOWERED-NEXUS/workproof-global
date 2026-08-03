import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Layout, PageHeader, StatusBadge, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { ConfirmDialog, LiveRegion } from '../components/ui';
import { DurationFields } from '../components/DurationFields';
import {
  ApiRequestError,
  api,
  formatXaf,
  type DurationUnit,
  type Evidence,
  type Receipt,
  type ReceiptEvent,
  type VerificationDelivery,
} from '../lib/api';

function formatBytes(size?: number | null) {
  if (size == null) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusExplanation(status: string): string {
  switch (status) {
    case 'PENDING_VERIFICATION':
      return 'Awaiting customer confirmation through the private verification email link.';
    case 'CORRECTION_REQUESTED':
      return 'Your customer asked for changes. Update the draft fields and resubmit.';
    case 'DISPUTED':
      return 'This receipt is under dispute review and should not be presented as verified proof.';
    case 'REVOKED':
      return 'This receipt was revoked and is not valid proof.';
    case 'VERIFIED':
      return 'Customer-confirmed. Core verified fields are locked; you can still archive for portfolio organisation.';
    case 'DRAFT':
      return 'This draft is only visible to you until you submit it for customer confirmation.';
    default:
      return '';
  }
}

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [events, setEvents] = useState<ReceiptEvent[]>([]);
  const [delivery, setDelivery] = useState<VerificationDelivery | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [confirm, setConfirm] = useState<'delete' | 'archive' | 'unarchive' | 'remove-evidence' | null>(null);
  const [pendingEvidence, setPendingEvidence] = useState<Evidence | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceTitle: '',
    description: '',
    workDate: '',
    durationValue: '',
    durationUnit: 'HOUR' as DurationUnit,
    amount: '',
    skillsDemonstrated: '',
    visibility: 'PRIVATE',
  });

  async function reload() {
    if (!id) return;
    const [r, e] = await Promise.all([api.getReceipt(id), api.getReceiptEvents(id)]);
    setReceipt(r);
    setEvents(e);
    setEditForm({
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      customerPhone: r.customerPhone ?? '',
      serviceTitle: r.serviceTitle,
      description: r.description,
      workDate: r.workDate.slice(0, 10),
      durationValue:
        r.durationValue != null
          ? String(r.durationValue)
          : r.durationMinutes != null
            ? String(r.durationMinutes)
            : '',
      durationUnit: r.durationUnit ?? (r.durationMinutes != null ? 'MINUTE' : 'HOUR'),
      amount: r.amount != null ? String(r.amount) : '',
      skillsDemonstrated: r.skillsDemonstrated.join(', '),
      visibility: r.visibility,
    });
    if (r.status === 'PENDING_VERIFICATION') {
      try {
        setDelivery(await api.getVerificationDelivery(id));
      } catch {
        setDelivery(null);
      }
    } else {
      setDelivery(null);
    }
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    void (async () => {
      try {
        await reload();
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || busy) return;
    setBusy(true);
    setError('');
    try {
      await api.updateReceipt(id, {
        customerName: editForm.customerName,
        customerEmail: editForm.customerEmail,
        customerPhone: editForm.customerPhone || undefined,
        serviceTitle: editForm.serviceTitle,
        description: editForm.description,
        workDate: editForm.workDate,
        ...(editForm.durationValue
          ? {
              durationValue: Number(editForm.durationValue),
              durationUnit: editForm.durationUnit,
            }
          : { durationValue: null, durationUnit: null, durationMinutes: null }),
        amount: editForm.amount ? Number(editForm.amount) : undefined,
        skillsDemonstrated: editForm.skillsDemonstrated
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        visibility: editForm.visibility,
      });
      setInfo('Receipt updated.');
      setEditing(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit() {
    if (!id || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await api.submitReceipt(id);
      setInfo(
        `Receipt submitted (attempt ${result.attemptNumber}). A verification email was queued for your customer.`,
      );
      await reload();
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === 'EMAIL_VERIFICATION_REQUIRED') {
        setError('Verify your email before submitting a receipt for customer verification.');
      } else {
        setError(err instanceof Error ? err.message : 'Submit failed');
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleResendCustomer() {
    if (!id || busy) return;
    setBusy(true);
    try {
      const result = await api.resendCustomerVerification(id);
      setInfo(`Verification email resent (attempt ${result.attemptNumber}).`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(fileList: FileList | null) {
    if (!id || !fileList?.[0] || uploading) return;
    setUploading(true);
    setError('');
    try {
      await api.addEvidenceFile(id, fileList[0], fileDescription || undefined);
      setFileDescription('');
      setInfo('Evidence uploaded.');
      await reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Upload failed. Allowed formats: JPEG, PNG, WebP, PDF, DOCX.',
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !linkUrl || busy) return;
    setBusy(true);
    try {
      await api.addEvidenceLink(id, {
        type: 'LINK',
        url: linkUrl,
        description: linkDescription || undefined,
      });
      setLinkUrl('');
      setLinkDescription('');
      setInfo('Link evidence added.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add link');
    } finally {
      setBusy(false);
    }
  }

  async function runConfirm() {
    if (!id || busy) return;
    setBusy(true);
    setError('');
    try {
      if (confirm === 'delete') {
        await api.deleteReceipt(id);
        setInfo('Draft deleted.');
        navigate('/receipts');
        return;
      }
      if (confirm === 'archive') {
        await api.archiveReceipt(id);
        setInfo('Receipt archived. Verification status unchanged.');
      }
      if (confirm === 'unarchive') {
        await api.unarchiveReceipt(id);
        setInfo('Receipt restored from archive.');
      }
      if (confirm === 'remove-evidence' && pendingEvidence) {
        await api.removeEvidence(id, pendingEvidence.id);
        setInfo('Evidence removed.');
        setPendingEvidence(null);
      }
      setConfirm(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <p className="page-loading">Loading receipt…</p>
      </Layout>
    );
  }
  if (!receipt) {
    return (
      <Layout>
        <Alert tone="error" message={error || 'Receipt not found'} />
      </Layout>
    );
  }

  const editable = receipt.status === 'DRAFT' || receipt.status === 'CORRECTION_REQUESTED';
  const canArchive = !receipt.archivedAt && receipt.status !== 'DRAFT';
  const evidence = receipt.evidence ?? [];
  const explanation = statusExplanation(receipt.status);

  return (
    <Layout>
      <EmailVerificationBanner />
      <LiveRegion message={info || error} politeness={error ? 'assertive' : 'polite'} />
      <PageHeader
        title={receipt.serviceTitle}
        subtitle={`Receipt for ${receipt.customerName}`}
        action={<StatusBadge status={receipt.status} />}
      />
      {error && <Alert tone="error" message={error} />}
      {info && <Alert tone="success" message={info} />}
      {explanation && <p className="status-explain">{explanation}</p>}
      {receipt.archivedAt && (
        <Alert
          tone="info"
          message={`Archived on ${new Date(receipt.archivedAt).toLocaleString()}. Status remains ${receipt.status.replace(/_/g, ' ')}.`}
        />
      )}

      {editing && editable ? (
        <form onSubmit={(e) => void handleSaveEdit(e)} className="card form-stack wide-form section-card">
          <h2>Edit receipt</h2>
          <div className="form-row">
            <label>
              Service title
              <input
                value={editForm.serviceTitle}
                onChange={(e) => setEditForm({ ...editForm, serviceTitle: e.target.value })}
                required
              />
            </label>
            <label>
              Work date
              <input
                type="date"
                value={editForm.workDate}
                onChange={(e) => setEditForm({ ...editForm, workDate: e.target.value })}
                required
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              required
              rows={4}
            />
          </label>
          <div className="form-row">
            <label>
              Customer name
              <input
                value={editForm.customerName}
                onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                required
              />
            </label>
            <label>
              Customer email
              <input
                type="email"
                value={editForm.customerEmail}
                onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Customer phone
              <input
                value={editForm.customerPhone}
                onChange={(e) => setEditForm({ ...editForm, customerPhone: e.target.value })}
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                min={0}
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </label>
          </div>
          <DurationFields
            value={editForm.durationValue}
            unit={editForm.durationUnit}
            onValueChange={(durationValue) => setEditForm({ ...editForm, durationValue })}
            onUnitChange={(durationUnit) => setEditForm({ ...editForm, durationUnit })}
          />
          <label>
            Skills demonstrated (comma-separated)
            <input
              value={editForm.skillsDemonstrated}
              onChange={(e) => setEditForm({ ...editForm, skillsDemonstrated: e.target.value })}
            />
          </label>
          <label>
            Visibility
            <select
              value={editForm.visibility}
              onChange={(e) => setEditForm({ ...editForm, visibility: e.target.value })}
            >
              <option value="PRIVATE">Private</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PUBLIC">Public</option>
            </select>
          </label>
          <div className="action-row">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="card detail-grid">
          <section>
            <h2>Work details</h2>
            <p>{receipt.description}</p>
            <dl className="detail-list">
              <div>
                <dt>Work date</dt>
                <dd>{new Date(receipt.workDate).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{receipt.durationLabel || '—'}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd>{formatXaf(receipt.amount ?? null)}</dd>
              </div>
              <div>
                <dt>Skills</dt>
                <dd>{receipt.skillsDemonstrated.join(', ') || '—'}</dd>
              </div>
              <div>
                <dt>Lifecycle status</dt>
                <dd>{receipt.status.replace(/_/g, ' ')}</dd>
              </div>
              <div>
                <dt>Proof validity</dt>
                <dd>{receipt.proofValidity?.replace(/_/g, ' ') || '—'}</dd>
              </div>
              <div>
                <dt>Verification attempts</dt>
                <dd>{receipt.verificationAttemptCount ?? 0}</dd>
              </div>
              {receipt.receiptNumber && (
                <div>
                  <dt>Receipt number</dt>
                  <dd>{receipt.receiptNumber}</dd>
                </div>
              )}
              {receipt.integrityHash && (
                <div>
                  <dt>Integrity hash</dt>
                  <dd className="mono">{receipt.integrityHash}</dd>
                </div>
              )}
              {receipt.verificationCode && (
                <div>
                  <dt>Public proof</dt>
                  <dd>
                    <Link to={`/proof/${receipt.verificationCode}`}>View proof page</Link>
                  </dd>
                </div>
              )}
            </dl>
          </section>
          <section>
            <h2>Evidence</h2>
            {evidence.length === 0 ? (
              <p className="muted">No evidence attached yet. Add photos, documents, or links before submitting.</p>
            ) : (
              <ul className="evidence-list">
                {evidence.map((item) => (
                  <li key={item.id} className="evidence-item">
                    <div>
                      <strong>{item.filenameCategory || item.type}</strong>
                      <span className="muted">
                        {' '}
                        {item.originalFilename || item.externalUrl || 'Evidence'}
                        {item.size != null ? ` · ${formatBytes(item.size)}` : ''}
                      </span>
                      {item.description && <p>{item.description}</p>}
                    </div>
                    <div className="action-row">
                      {item.type !== 'LINK' && (
                        <a
                          className="btn btn-secondary btn-sm"
                          href={api.downloadEvidenceUrl(receipt.id, item.id)}
                        >
                          Download
                        </a>
                      )}
                      {item.type === 'LINK' && item.externalUrl && (
                        <a
                          className="btn btn-secondary btn-sm"
                          href={item.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open link
                        </a>
                      )}
                      {editable && (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setPendingEvidence(item);
                            setConfirm('remove-evidence');
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {editable && (
              <div className="evidence-forms">
                <label className="file-upload">
                  Choose file (JPEG, PNG, WebP, PDF, DOCX)
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.docx,image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    disabled={uploading || busy}
                    onChange={(e) => void handleUpload(e.target.files)}
                  />
                </label>
                <label>
                  File description
                  <input
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </label>
                {uploading && (
                  <p className="muted" role="status">
                    Uploading…
                  </p>
                )}

                <form onSubmit={(e) => void handleAddLink(e)} className="form-stack">
                  <label>
                    Link URL
                    <input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://…"
                      required
                    />
                  </label>
                  <label>
                    Link description
                    <input value={linkDescription} onChange={(e) => setLinkDescription(e.target.value)} />
                  </label>
                  <button type="submit" className="btn btn-secondary" disabled={busy}>
                    Add link evidence
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      )}

      {receipt.status === 'PENDING_VERIFICATION' && delivery && (
        <section className="card section-card" aria-live="polite">
          <h2>Customer verification delivery</h2>
          <dl className="detail-list">
            <div>
              <dt>Status</dt>
              <dd>{delivery.status ?? '—'}</dd>
            </div>
            <div>
              <dt>Attempt count</dt>
              <dd>{delivery.attemptCount}</dd>
            </div>
            <div>
              <dt>Last attempted</dt>
              <dd>
                {delivery.lastAttemptedAt ? new Date(delivery.lastAttemptedAt).toLocaleString() : '—'}
              </dd>
            </div>
            <div>
              <dt>Sent at</dt>
              <dd>{delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : '—'}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!delivery.resendAvailable || busy}
            onClick={() => void handleResendCustomer()}
          >
            {delivery.resendAvailableInSeconds > 0
              ? `Resend available in ${delivery.resendAvailableInSeconds}s`
              : 'Resend customer verification email'}
          </button>
        </section>
      )}

      {receipt.confirmations && receipt.confirmations.length > 0 && (
        <section className="card section-card">
          <h2>Correction / confirmation history</h2>
          <ul className="list-rows">
            {receipt.confirmations.map((c) => (
              <li key={`${c.attemptNumber}-${c.confirmedAt}`}>
                <span>
                  Attempt {c.attemptNumber}: {c.decision.replace(/_/g, ' ')}
                </span>
                <span className="muted">{new Date(c.confirmedAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card section-card">
        <h2>Timeline</h2>
        {events.length === 0 ? (
          <p className="muted">No events yet.</p>
        ) : (
          <ul className="list-rows">
            {events.map((event) => (
              <li key={event.id}>
                <span>{event.publicSummary || event.eventType.replace(/_/g, ' ')}</span>
                <span className="muted">{new Date(event.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="action-row">
        {editable && !editing && (
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setEditing(true)}>
            Edit receipt
          </button>
        )}
        {editable && (
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void handleSubmit()}>
            {busy ? 'Working…' : 'Submit for customer verification'}
          </button>
        )}
        {receipt.status === 'DRAFT' && (
          <button type="button" className="btn btn-danger" disabled={busy} onClick={() => setConfirm('delete')}>
            Delete draft
          </button>
        )}
        {canArchive && (
          <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => setConfirm('archive')}>
            Archive
          </button>
        )}
        {receipt.archivedAt && (
          <button
            type="button"
            className="btn btn-secondary"
            disabled={busy}
            onClick={() => setConfirm('unarchive')}
          >
            Unarchive
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirm === 'delete'}
        title="Delete this draft?"
        description="This permanently deletes the draft receipt and its evidence metadata. This cannot be undone."
        confirmLabel="Delete draft"
        busy={busy}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm === 'archive'}
        title="Archive this receipt?"
        description="Archiving hides it from your default portfolio list. Verification status does not change."
        confirmLabel="Archive"
        tone="primary"
        busy={busy}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm === 'unarchive'}
        title="Restore from archive?"
        description="The receipt will return to your active portfolio list."
        confirmLabel="Unarchive"
        tone="primary"
        busy={busy}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
      <ConfirmDialog
        open={confirm === 'remove-evidence'}
        title="Remove evidence?"
        description={
          pendingEvidence
            ? `Remove “${pendingEvidence.originalFilename || pendingEvidence.externalUrl || pendingEvidence.type}”?`
            : 'Remove this evidence item?'
        }
        confirmLabel="Remove"
        busy={busy}
        onClose={() => {
          setConfirm(null);
          setPendingEvidence(null);
        }}
        onConfirm={runConfirm}
      />
    </Layout>
  );
}
