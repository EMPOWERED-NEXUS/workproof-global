import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { api, formatXaf, type VerificationView, ApiRequestError } from '../lib/api';

export default function VerifyPage() {
  const { token } = useParams();
  const [view, setView] = useState<VerificationView | null>(null);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [success, setSuccess] = useState('');
  const [decision, setDecision] = useState<'CONFIRMED' | 'CORRECTION_REQUESTED' | 'DISPUTED'>(
    'CONFIRMED',
  );
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .getVerification(token)
      .then((data) => {
        setView(data);
        setCustomerName(data.customerName);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Invalid link');
        setErrorCode(e instanceof ApiRequestError ? (e.code ?? '') : '');
      });
  }, [token]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !view || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await api.respondVerification(token, {
        decision,
        customerName,
        comment,
        description: comment,
        reason: decision === 'DISPUTED' ? 'Customer dispute' : undefined,
        acknowledgedAccuracy: decision === 'CONFIRMED' ? acknowledged : undefined,
      });
      setSuccess(
        result.status === 'VERIFIED'
          ? 'Thank you — this work receipt is now confirmed and locked as portable proof.'
          : `Response recorded: ${result.status.replace(/_/g, ' ')}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit response');
      setErrorCode(err instanceof ApiRequestError ? (err.code ?? '') : '');
    } finally {
      setSubmitting(false);
    }
  }

  const stateHint =
    errorCode === 'EXPIRED_TOKEN'
      ? 'This confirmation link has expired. Ask the worker to regenerate it.'
      : errorCode === 'USED_TOKEN'
        ? 'This confirmation link was already used.'
        : errorCode === 'REVOKED_TOKEN'
          ? 'This confirmation link was revoked. Ask the worker for a new link.'
          : errorCode === 'CORRECTION_REQUESTED'
            ? 'A correction was requested. The worker must update and resubmit the receipt.'
            : '';

  return (
    <Layout>
      <div className="verify-page">
        <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>Confirm completed work</h1>
          <p className="subtitle">
            No WorkProof account is required. Review the details and confirm only if they are accurate.
          </p>
        </div>
        {error && <Alert tone="error" message={error} />}
        {stateHint && <p className="muted" role="status">{stateHint}</p>}
        {success && <Alert tone="success" message={success} />}
        {view && !success && (
          <>
            <div className="card section-card">
              <h2>{view.serviceTitle}</h2>
              <p>
                Worker:{' '}
                <strong>
                  {view.profileSlug ? (
                    <Link to={`/workers/${view.profileSlug}`}>{view.workerName}</Link>
                  ) : (
                    view.workerName
                  )}
                </strong>
              </p>
              <p>Customer: <strong>{view.customerName}</strong></p>
              <p>{view.description}</p>
              <dl className="detail-list" style={{ marginTop: '1rem' }}>
                <div>
                  <dt>Work date</dt>
                  <dd>{new Date(view.workDate).toLocaleDateString()}</dd>
                </div>
                {view.durationLabel && (
                  <div>
                    <dt>Duration</dt>
                    <dd>{view.durationLabel}</dd>
                  </div>
                )}
                {view.amount != null && (
                  <div>
                    <dt>Amount</dt>
                    <dd>{formatXaf(view.amount)} {view.currency}</dd>
                  </div>
                )}
                <div>
                  <dt>Skills</dt>
                  <dd>{view.skillsDemonstrated.join(', ') || '—'}</dd>
                </div>
                <div>
                  <dt>Confirmation channel</dt>
                  <dd>{view.confirmationMethodLabel ?? 'Secure confirmation link'}</dd>
                </div>
                <div>
                  <dt>Link expires</dt>
                  <dd>{new Date(view.expiresAt).toLocaleString()}</dd>
                </div>
              </dl>
              {view.confirmationChannelNote && (
                <p className="muted disclosure">{view.confirmationChannelNote}</p>
              )}
              <p className="muted disclosure">{view.privacyNote}</p>
            </div>

            <section className="card section-card">
              <h2>Supporting evidence</h2>
              <p className="muted disclosure">{view.evidenceDisclosure}</p>
              {!view.evidence?.length ? (
                <p className="muted">No supporting evidence was attached.</p>
              ) : (
                <ul className="evidence-list">
                  {view.evidence.map((item) => (
                    <li key={item.id} className="evidence-item">
                      <div>
                        <strong>
                          {item.linkPlatform || item.filenameCategory || item.type}
                        </strong>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <div className="action-row">
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
                        {item.canDownload && token && (
                          <a
                            className="btn btn-secondary btn-sm"
                            href={api.customerEvidenceDownloadUrl(token, item.id)}
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <form onSubmit={(e) => void handleRespond(e)} className="card form-stack">
              <label>
                Your display name or initials
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  minLength={2}
                />
              </label>
              <label>
                Your decision
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as typeof decision)}
                >
                  <option value="CONFIRMED">Confirm — work details are accurate</option>
                  <option value="CORRECTION_REQUESTED">Request correction</option>
                  <option value="DISPUTED">Dispute this receipt</option>
                </select>
              </label>
              {decision === 'CONFIRMED' && (
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    required
                  />
                  <span>
                    I confirm that I reviewed these work details and they are accurate. Confirmation
                    locks this receipt as portable proof.
                  </span>
                </label>
              )}
              <label>
                {decision === 'CONFIRMED' ? 'Optional comment' : 'Reason (required)'}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  required={decision !== 'CONFIRMED'}
                />
              </label>
              <button
                type="submit"
                className={`btn btn-primary ${submitting ? 'is-loading' : ''}`}
                disabled={submitting}
              >
                {submitting
                  ? 'Submitting…'
                  : decision === 'CONFIRMED'
                    ? 'Confirm work'
                    : 'Request correction'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
