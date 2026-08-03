import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { api, type VerificationView } from '../lib/api';

export default function VerifyPage() {
  const { token } = useParams();
  const [view, setView] = useState<VerificationView | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [decision, setDecision] = useState<'CONFIRMED' | 'CORRECTION_REQUESTED' | 'DISPUTED'>('CONFIRMED');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.getVerification(token).then(setView).catch((e) => setError(e instanceof Error ? e.message : 'Invalid link'));
  }, [token]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !view || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const result = await api.respondVerification(token, {
        decision,
        customerName: view.customerName,
        comment,
        description: comment,
        reason: decision === 'DISPUTED' ? 'Customer dispute' : undefined,
      });
      setSuccess(result.status === 'VERIFIED' ? 'Thank you — this work receipt is now verified and locked.' : `Response recorded: ${result.status.replace(/_/g, ' ')}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit response');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="verify-page">
        <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>Verify completed work</h1>
          <p className="subtitle">No account required. Review the work below and confirm your experience.</p>
        </div>
        {error && <Alert tone="error" message={error} />}
        {success && <Alert tone="success" message={success} />}
        {view && !success && (
          <>
            <div className="card section-card">
              <h2>{view.serviceTitle}</h2>
              <p>Worker: <strong>{view.workerName}</strong></p>
              <p>{view.description}</p>
              <dl className="detail-list" style={{ marginTop: '1rem' }}>
                <div>
                  <dt>Work date</dt>
                  <dd>{new Date(view.workDate).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt>Skills</dt>
                  <dd>{view.skillsDemonstrated.join(', ') || '—'}</dd>
                </div>
                <div>
                  <dt>Evidence items</dt>
                  <dd>{view.evidenceCount}</dd>
                </div>
              </dl>
            </div>
            <form onSubmit={(e) => void handleRespond(e)} className="card form-stack">
              <label>
                Your decision
                <select value={decision} onChange={(e) => setDecision(e.target.value as typeof decision)}>
                  <option value="CONFIRMED">Confirm — work completed satisfactorily</option>
                  <option value="CORRECTION_REQUESTED">Request correction</option>
                  <option value="DISPUTED">Dispute this receipt</option>
                </select>
              </label>
              <label>
                Comment{decision !== 'CONFIRMED' && ' (required)'}
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
                {submitting ? 'Submitting…' : 'Submit response'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
