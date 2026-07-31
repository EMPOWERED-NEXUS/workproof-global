import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, PageHeader, StatusBadge, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import {
  ApiRequestError,
  api,
  formatXaf,
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

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [events, setEvents] = useState<ReceiptEvent[]>([]);
  const [delivery, setDelivery] = useState<VerificationDelivery | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [fileDescription, setFileDescription] = useState('');

  async function reload() {
    if (!id) return;
    const [r, e] = await Promise.all([api.getReceipt(id), api.getReceiptEvents(id)]);
    setReceipt(r);
    setEvents(e);
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

  async function handleSubmit() {
    if (!id) return;
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
    }
  }

  async function handleResendCustomer() {
    if (!id) return;
    try {
      const result = await api.resendCustomerVerification(id);
      setInfo(`Verification email resent (attempt ${result.attemptNumber}).`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    }
  }

  async function handleUpload(fileList: FileList | null) {
    if (!id || !fileList?.[0]) return;
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
    if (!id || !linkUrl) return;
    try {
      await api.addEvidenceLink(id, { type: 'LINK', url: linkUrl, description: linkDescription || undefined });
      setLinkUrl('');
      setLinkDescription('');
      setInfo('Link evidence added.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add link');
    }
  }

  async function handleRemove(evidence: Evidence) {
    if (!id) return;
    if (!window.confirm(`Remove evidence “${evidence.originalFilename || evidence.externalUrl || evidence.type}”?`)) {
      return;
    }
    await api.removeEvidence(id, evidence.id);
    setInfo('Evidence removed.');
    await reload();
  }

  async function handleArchive() {
    if (!id) return;
    await api.archiveReceipt(id);
    setInfo('Receipt archived. Verification status unchanged.');
    await reload();
  }

  async function handleUnarchive() {
    if (!id) return;
    await api.unarchiveReceipt(id);
    setInfo('Receipt restored from archive.');
    await reload();
  }

  if (loading) return <Layout><p className="page-loading">Loading receipt…</p></Layout>;
  if (!receipt) return <Layout><Alert tone="error" message={error || 'Receipt not found'} /></Layout>;

  const editable = receipt.status === 'DRAFT' || receipt.status === 'CORRECTION_REQUESTED';
  const canArchive = !receipt.archivedAt && receipt.status !== 'DRAFT';
  const evidence = receipt.evidence ?? [];

  return (
    <Layout>
      <EmailVerificationBanner />
      <PageHeader
        title={receipt.serviceTitle}
        subtitle={`Receipt for ${receipt.customerName}`}
        action={<StatusBadge status={receipt.status} />}
      />
      {error && <Alert tone="error" message={error} />}
      {info && <Alert tone="success" message={info} />}
      {receipt.status === 'REVOKED' && (
        <Alert tone="error" message={`Revoked. Not valid proof.${receipt.revocationReason ? ` Reason: ${receipt.revocationReason}` : ''}`} />
      )}
      {receipt.status === 'DISPUTED' && (
        <Alert tone="info" message="Disputed. Verification under review." />
      )}
      {receipt.status === 'CORRECTION_REQUESTED' && (
        <Alert tone="info" message="Correction requested. Update the receipt and resubmit." />
      )}
      {receipt.archivedAt && (
        <Alert tone="info" message={`Archived on ${new Date(receipt.archivedAt).toLocaleString()}. Status remains ${receipt.status.replace(/_/g, ' ')}.`} />
      )}

      <div className="card detail-grid">
        <section>
          <h2>Work details</h2>
          <p>{receipt.description}</p>
          <dl className="detail-list">
            <div><dt>Work date</dt><dd>{new Date(receipt.workDate).toLocaleDateString()}</dd></div>
            <div><dt>Amount</dt><dd>{formatXaf(receipt.amount ?? null)}</dd></div>
            <div><dt>Skills</dt><dd>{receipt.skillsDemonstrated.join(', ') || '—'}</dd></div>
            <div><dt>Lifecycle status</dt><dd>{receipt.status.replace(/_/g, ' ')}</dd></div>
            <div><dt>Proof validity</dt><dd>{receipt.proofValidity?.replace(/_/g, ' ') || '—'}</dd></div>
            <div><dt>Verification attempts</dt><dd>{receipt.verificationAttemptCount ?? 0}</dd></div>
            {receipt.receiptNumber && <div><dt>Receipt number</dt><dd>{receipt.receiptNumber}</dd></div>}
            {receipt.verificationCode && (
              <div>
                <dt>Public proof</dt>
                <dd><Link to={`/proof/${receipt.verificationCode}`}>View proof page</Link></dd>
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
                      <a className="btn btn-secondary btn-sm" href={item.externalUrl} target="_blank" rel="noreferrer">
                        Open link
                      </a>
                    )}
                    {editable && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => void handleRemove(item)}>
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
                  disabled={uploading}
                  onChange={(e) => void handleUpload(e.target.files)}
                />
              </label>
              <label>
                File description
                <input value={fileDescription} onChange={(e) => setFileDescription(e.target.value)} placeholder="Optional description" />
              </label>
              {uploading && <p className="muted" role="status">Uploading…</p>}

              <form onSubmit={(e) => void handleAddLink(e)} className="form-stack">
                <label>
                  Link URL
                  <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" required />
                </label>
                <label>
                  Link description
                  <input value={linkDescription} onChange={(e) => setLinkDescription(e.target.value)} />
                </label>
                <button type="submit" className="btn btn-secondary">Add link evidence</button>
              </form>
            </div>
          )}
        </section>
      </div>

      {receipt.status === 'PENDING_VERIFICATION' && delivery && (
        <section className="card section-card" aria-live="polite">
          <h2>Customer verification delivery</h2>
          <dl className="detail-list">
            <div><dt>Status</dt><dd>{delivery.status ?? '—'}</dd></div>
            <div><dt>Attempt count</dt><dd>{delivery.attemptCount}</dd></div>
            <div><dt>Last attempted</dt><dd>{delivery.lastAttemptedAt ? new Date(delivery.lastAttemptedAt).toLocaleString() : '—'}</dd></div>
            <div><dt>Sent at</dt><dd>{delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : '—'}</dd></div>
          </dl>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={!delivery.resendAvailable}
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
                <span>Attempt {c.attemptNumber}: {c.decision.replace(/_/g, ' ')}</span>
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
        {editable && (
          <button type="button" className="btn btn-primary" onClick={() => void handleSubmit()}>
            Submit for customer verification
          </button>
        )}
        {canArchive && (
          <button type="button" className="btn btn-secondary" onClick={() => void handleArchive()}>
            Archive
          </button>
        )}
        {receipt.archivedAt && (
          <button type="button" className="btn btn-secondary" onClick={() => void handleUnarchive()}>
            Unarchive
          </button>
        )}
      </div>
    </Layout>
  );
}
