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

  useEffect(() => {
    if (!token) return;
    api.getVerification(token).then(setView).catch((e) => setError(e instanceof Error ? e.message : 'Invalid link'));
  }, [token]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !view) return;
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
    }
  }

  return (
    <Layout>
      <div className="verify-page">
        <h1>Verify completed work</h1>
        <p className="subtitle">No account required. Review the work below and confirm your experience.</p>
        {error && <Alert tone="error" message={error} />}
        {success && <Alert tone="success" message={success} />}
        {view && !success && (
          <>
            <div className="card">
              <h2>{view.serviceTitle}</h2>
              <p>Worker: <strong>{view.workerName}</strong></p>
              <p>{view.description}</p>
              <p>Work date: {new Date(view.workDate).toLocaleDateString()}</p>
              <p>Skills: {view.skillsDemonstrated.join(', ')}</p>
              <p>Evidence items: {view.evidenceCount}</p>
            </div>
            <form onSubmit={(e) => void handleRespond(e)} className="card form-stack">
              <label>Your decision
                <select value={decision} onChange={(e) => setDecision(e.target.value as typeof decision)}>
                  <option value="CONFIRMED">Confirm — work completed satisfactorily</option>
                  <option value="CORRECTION_REQUESTED">Request correction</option>
                  <option value="DISPUTED">Dispute this receipt</option>
                </select>
              </label>
              <label>Comment{decision !== 'CONFIRMED' && ' (required)'}
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} required={decision !== 'CONFIRMED'} />
              </label>
              <button type="submit" className="btn btn-primary">Submit response</button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
