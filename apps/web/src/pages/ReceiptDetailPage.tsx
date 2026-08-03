import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Layout, PageHeader, StatusBadge, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { ConfirmDialog, CopyButton, LiveRegion } from '../components/ui';
import { DurationFields } from '../components/DurationFields';
import { useAuth } from '../hooks/use-auth';
import { openWhatsAppShare, validateLocalWhatsAppPhone } from '../lib/whatsapp';
import {
  ApiRequestError,
  api,
  formatXaf,
  type ConfirmationMethod,
  type DurationUnit,
  type Evidence,
  type EvidenceVisibility,
  type Receipt,
  type ReceiptEvent,
  type SubmitConfirmationResult,
  type VerificationDelivery,
} from '../lib/api';

function formatBytes(size?: number | null) {
  if (size == null) return '—';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusExplanation(status: string, method?: ConfirmationMethod | null): string {
  switch (status) {
    case 'PENDING_VERIFICATION':
      if (method === 'SHARE_LINK') {
        return 'Awaiting customer confirmation through the secure share link.';
      }
      if (method === 'IN_PERSON_QR') {
        return 'Awaiting in-person confirmation. Show the short-lived QR while the customer is with you.';
      }
      return 'Awaiting customer confirmation through the secure email link.';
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
  const { user } = useAuth();
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
  const [linkPublic, setLinkPublic] = useState(false);
  const [fileDescription, setFileDescription] = useState('');
  const [filePublic, setFilePublic] = useState(false);
  const [confirm, setConfirm] = useState<'delete' | 'archive' | 'unarchive' | 'remove-evidence' | null>(null);
  const [pendingEvidence, setPendingEvidence] = useState<Evidence | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<SubmitConfirmationResult | null>(null);
  const [localWhatsAppPhone, setLocalWhatsAppPhone] = useState('');
  const [confirmQr, setConfirmQr] = useState('');
  const [nowMs, setNowMs] = useState(Date.now());
  const [editForm, setEditForm] = useState({
    customerName: '',
    customerEmail: '',
    confirmationMethod: 'EMAIL' as ConfirmationMethod,
    serviceTitle: '',
    description: '',
    workDate: '',
    durationValue: '',
    durationUnit: 'HOUR' as DurationUnit,
    amount: '',
    skillsDemonstrated: '',
    visibility: 'PRIVATE',
  });

  const secondsRemaining = useMemo(() => {
    if (!confirmationResult?.expiresAt) return null;
    return Math.max(0, Math.floor((new Date(confirmationResult.expiresAt).getTime() - nowMs) / 1000));
  }, [confirmationResult?.expiresAt, nowMs]);

  async function reload() {
    if (!id) return;
    const [r, e] = await Promise.all([api.getReceipt(id), api.getReceiptEvents(id)]);
    setReceipt(r);
    setEvents(e);
    setEditForm({
      customerName: r.customerName,
      customerEmail: r.customerEmail ?? '',
      confirmationMethod: r.confirmationMethod ?? 'EMAIL',
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
      setConfirmationResult(null);
      setConfirmQr('');
    }
  }

  useEffect(() => {
    if (!confirmationResult?.expiresAt) return;
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [confirmationResult?.expiresAt]);

  useEffect(() => {
    if (!confirmationResult?.confirmationUrl || receipt?.confirmationMethod !== 'IN_PERSON_QR') {
      setConfirmQr('');
      return;
    }
    void QRCode.toDataURL(confirmationResult.confirmationUrl, { margin: 1, width: 220 })
      .then(setConfirmQr)
      .catch(() => setConfirmQr(''));
  }, [confirmationResult?.confirmationUrl, receipt?.confirmationMethod]);

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
        confirmationMethod: editForm.confirmationMethod,
        customerEmail:
          editForm.confirmationMethod === 'EMAIL'
            ? editForm.customerEmail
            : editForm.customerEmail || null,
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
      setConfirmationResult(result);
      if (result.confirmationMethod === 'EMAIL' || result.deliveryQueued) {
        setInfo(
          `Receipt submitted (attempt ${result.attemptNumber}). A confirmation email was queued for your customer.`,
        );
      } else if (result.confirmationMethod === 'SHARE_LINK') {
        setInfo(
          `Secure share link ready (attempt ${result.attemptNumber}). Copy it or open WhatsApp from this device.`,
        );
      } else {
        setInfo(
          `In-person confirmation QR ready (attempt ${result.attemptNumber}). Show it while the customer is with you.`,
        );
      }
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
      const result =
        receipt?.confirmationMethod === 'EMAIL'
          ? await api.resendCustomerVerification(id)
          : await api.regenerateConfirmation(id);
      setConfirmationResult(result);
      setInfo(
        receipt?.confirmationMethod === 'EMAIL'
          ? `Confirmation email resent (attempt ${result.attemptNumber}).`
          : `Confirmation link regenerated (attempt ${result.attemptNumber}). Previous unused links are revoked.`,
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not regenerate confirmation link');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(fileList: FileList | null) {
    if (!id || !fileList?.[0] || uploading) return;
    setUploading(true);
    setError('');
    try {
      const visibility: EvidenceVisibility = filePublic ? 'PUBLIC_PROOF' : 'CUSTOMER_ONLY';
      await api.addEvidenceFile(id, fileList[0], fileDescription || undefined, visibility);
      setFileDescription('');
      setFilePublic(false);
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
        visibility: linkPublic ? 'PUBLIC_PROOF' : 'CUSTOMER_ONLY',
      });
      setLinkUrl('');
      setLinkDescription('');
      setLinkPublic(false);
      setInfo('Link evidence added.');
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add link');
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleEvidenceVisibility(item: Evidence) {
    if (!id || busy) return;
    setBusy(true);
    try {
      const next: EvidenceVisibility =
        item.visibility === 'PUBLIC_PROOF' ? 'CUSTOMER_ONLY' : 'PUBLIC_PROOF';
      await api.updateEvidenceVisibility(id, item.id, next);
      setInfo(
        next === 'PUBLIC_PROOF'
          ? 'Evidence will appear on public proof.'
          : 'Evidence limited to customer confirmation.',
      );
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update evidence visibility');
    } finally {
      setBusy(false);
    }
  }

  function handleOpenWhatsApp() {
    if (!confirmationResult?.confirmationUrl || !receipt || !user) return;
    try {
      const phone = localWhatsAppPhone.trim()
        ? validateLocalWhatsAppPhone(localWhatsAppPhone)
        : null;
      openWhatsAppShare({
        customerName: receipt.customerName,
        workerName: user.fullName,
        confirmationUrl: confirmationResult.confirmationUrl,
        phoneE164: phone,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid WhatsApp number');
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
  const explanation = statusExplanation(receipt.status, receipt.confirmationMethod);

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
          <label>
            Confirmation method
            <select
              value={editForm.confirmationMethod}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  confirmationMethod: e.target.value as ConfirmationMethod,
                })
              }
            >
              <option value="EMAIL">Email the customer</option>
              <option value="SHARE_LINK">Share a secure link</option>
              <option value="IN_PERSON_QR">Confirm in person</option>
            </select>
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
            {editForm.confirmationMethod === 'EMAIL' ? (
              <label>
                Customer email
                <input
                  type="email"
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm({ ...editForm, customerEmail: e.target.value })}
                  required
                />
              </label>
            ) : (
              <label>
                Amount
                <input
                  type="number"
                  min={0}
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                />
              </label>
            )}
          </div>
          {editForm.confirmationMethod === 'EMAIL' && (
            <label>
              Amount
              <input
                type="number"
                min={0}
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              />
            </label>
          )}
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
                      <strong>{item.linkPlatform || item.filenameCategory || item.type}</strong>
                      <span className="muted">
                        {' '}
                        {item.originalFilename || item.externalUrl || 'Evidence'}
                        {item.size != null ? ` · ${formatBytes(item.size)}` : ''}
                        {' · '}
                        {item.visibility === 'PUBLIC_PROOF' ? 'Public proof' : 'Customer only'}
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
                          rel="noopener noreferrer"
                        >
                          Open link
                        </a>
                      )}
                      {editable && (
                        <>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            disabled={busy}
                            onClick={() => void handleToggleEvidenceVisibility(item)}
                          >
                            {item.visibility === 'PUBLIC_PROOF'
                              ? 'Make customer-only'
                              : 'Show on public proof'}
                          </button>
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
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="muted disclosure">
              Supporting evidence supports the work record but does not replace customer confirmation.
            </p>

            {editable && (
              <div className="evidence-forms">
                <h3 className="form-section-title">Add photo or document</h3>
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
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={filePublic}
                    onChange={(e) => setFilePublic(e.target.checked)}
                  />
                  <span>Show on public proof (off by default — customer-only)</span>
                </label>
                {uploading && (
                  <p className="muted" role="status">
                    Uploading…
                  </p>
                )}

                <h3 className="form-section-title">Add social or web link</h3>
                <form onSubmit={(e) => void handleAddLink(e)} className="form-stack">
                  <label>
                    HTTPS link URL
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
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={linkPublic}
                      onChange={(e) => setLinkPublic(e.target.checked)}
                    />
                    <span>Show on public proof (off by default — customer-only)</span>
                  </label>
                  <button type="submit" className="btn btn-secondary" disabled={busy}>
                    Add social or web link
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      )}

      {receipt.status === 'PENDING_VERIFICATION' && (
        <section className="card section-card confirmation-panel" aria-live="polite">
          <h2>Customer confirmation</h2>
          <p className="muted">
            Method:{' '}
            {receipt.confirmationMethod === 'SHARE_LINK'
              ? 'Secure share link'
              : receipt.confirmationMethod === 'IN_PERSON_QR'
                ? 'In-person QR'
                : 'Email link'}
          </p>

          {receipt.confirmationMethod === 'EMAIL' && delivery && (
            <dl className="detail-list">
              <div>
                <dt>Email delivery</dt>
                <dd>{delivery.status ?? '—'}</dd>
              </div>
              <div>
                <dt>Attempt count</dt>
                <dd>{delivery.attemptCount}</dd>
              </div>
              <div>
                <dt>Sent at</dt>
                <dd>{delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : '—'}</dd>
              </div>
            </dl>
          )}

          {confirmationResult?.confirmationUrl && (
            <div className="share-confirmation">
              <label>
                Secure confirmation URL
                <input readOnly value={confirmationResult.confirmationUrl} />
              </label>
              <div className="action-row">
                <CopyButton value={confirmationResult.confirmationUrl} label="Copy secure link" />
                {receipt.confirmationMethod === 'SHARE_LINK' && (
                  <button type="button" className="btn btn-primary" onClick={handleOpenWhatsApp}>
                    Open WhatsApp
                  </button>
                )}
                {receipt.confirmationMethod === 'IN_PERSON_QR' && (
                  <a
                    className="btn btn-primary"
                    href={confirmationResult.confirmationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open confirmation on this device
                  </a>
                )}
              </div>
              {receipt.confirmationMethod === 'SHARE_LINK' && (
                <label>
                  Optional WhatsApp number (stays in this browser only)
                  <input
                    value={localWhatsAppPhone}
                    onChange={(e) => setLocalWhatsAppPhone(e.target.value)}
                    placeholder="+2376xxxxxxx"
                    inputMode="tel"
                    autoComplete="off"
                  />
                  <span className="field-hint">
                    International format. WorkProof does not store or receive this number.
                  </span>
                </label>
              )}
              {receipt.confirmationMethod === 'IN_PERSON_QR' && confirmQr && (
                <div className="proof-qr in-person-qr">
                  <img
                    src={confirmQr}
                    alt="Short-lived confirmation QR code"
                    width={220}
                    height={220}
                  />
                  <p className="muted" role="status">
                    {secondsRemaining == null
                      ? 'QR ready'
                      : secondsRemaining > 0
                        ? `Expires in ${Math.floor(secondsRemaining / 60)}m ${secondsRemaining % 60}s`
                        : 'QR expired — regenerate a new code'}
                  </p>
                </div>
              )}
            </div>
          )}

          {!confirmationResult?.confirmationUrl && receipt.confirmationMethod !== 'EMAIL' && (
            <p className="muted">
              Submit or regenerate to create a fresh confirmation link. Previous unused links are
              revoked.
            </p>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            disabled={
              busy ||
              (receipt.confirmationMethod === 'EMAIL' && delivery != null && !delivery.resendAvailable)
            }
            onClick={() => void handleResendCustomer()}
          >
            {receipt.confirmationMethod === 'EMAIL'
              ? delivery && delivery.resendAvailableInSeconds > 0
                ? `Resend available in ${delivery.resendAvailableInSeconds}s`
                : 'Resend customer confirmation email'
              : secondsRemaining === 0 || !confirmationResult?.confirmationUrl
                ? 'Regenerate confirmation link'
                : 'Regenerate confirmation link'}
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
