import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, StatusBadge, Alert } from '../components/Layout';
import { api, formatXaf, type PublicProof } from '../lib/api';

export default function ProofPage() {
  const { verificationCode } = useParams();
  const [proof, setProof] = useState<PublicProof | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!verificationCode) return;
    api.getPublicProof(verificationCode).then(setProof).catch((e) => setError(e instanceof Error ? e.message : 'Proof not found'));
  }, [verificationCode]);

  return (
    <Layout>
      <div className="proof-page">
        <p className="eyebrow">Verified Work Receipt · Public proof</p>
        <h1>Portable proof of completed work</h1>
        {error && <Alert tone="error" message={error} />}
        {proof && (
          <article className="card proof-card">
            <div className="proof-header">
              <div>
                <h2>{proof.serviceTitle}</h2>
                <p>Worker: {proof.profileSlug ? <Link to={`/workers/${proof.profileSlug}`}>{proof.workerName}</Link> : proof.workerName}</p>
              </div>
              <StatusBadge status={proof.status} />
            </div>
            <p>{proof.description}</p>
            <dl className="detail-list">
              {proof.receiptNumber && <div><dt>Receipt number</dt><dd>{proof.receiptNumber}</dd></div>}
              <div><dt>Work date</dt><dd>{new Date(proof.workDate).toLocaleDateString()}</dd></div>
              <div><dt>Verified</dt><dd>{proof.verifiedAt ? new Date(proof.verifiedAt).toLocaleString() : '—'}</dd></div>
              <div><dt>Skills demonstrated</dt><dd>{proof.skillsDemonstrated.join(', ')}</dd></div>
              {proof.amount != null && <div><dt>Amount</dt><dd>{formatXaf(proof.amount)}</dd></div>}
              {proof.integrityHash && <div><dt>Integrity hash</dt><dd className="mono">{proof.integrityHash.slice(0, 16)}…</dd></div>}
            </dl>
            <p className="disclaimer">This public view is consent-safe. Customer contact details and private audit data are never shown.</p>
          </article>
        )}
      </div>
    </Layout>
  );
}
