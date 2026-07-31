import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, StatusBadge, Alert } from '../components/Layout';
import { api, formatXaf, type PublicProof, type ProofValidity } from '../lib/api';

function validityBanner(validity: ProofValidity): { tone: 'error' | 'success' | 'info'; message: string } {
  switch (validity) {
    case 'VALID':
      return { tone: 'success', message: 'Valid verified proof.' };
    case 'INVALID_REVOKED':
      return { tone: 'error', message: 'Revoked. Not valid proof.' };
    case 'UNDER_DISPUTE':
      return { tone: 'info', message: 'Disputed. Verification under review.' };
    case 'CORRECTION_REQUIRED':
      return { tone: 'info', message: 'Correction requested. Proof temporarily unavailable.' };
    default:
      return { tone: 'error', message: 'Proof unavailable.' };
  }
}

export default function ProofPage() {
  const { verificationCode } = useParams();
  const [proof, setProof] = useState<PublicProof | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!verificationCode) return;
    api.getPublicProof(verificationCode).then(setProof).catch((e) => setError(e instanceof Error ? e.message : 'Proof not found'));
  }, [verificationCode]);

  const banner = proof ? validityBanner(proof.proofValidity) : null;

  return (
    <Layout>
      <div className="proof-page">
        <p className="eyebrow">WorkProof · Public proof</p>
        <h1>Portable proof of completed work</h1>
        {error && <Alert tone="error" message={error} />}
        {proof && banner && <Alert tone={banner.tone} message={banner.message} />}
        {proof && (
          <article className="card proof-card">
            <div className="proof-header">
              <div>
                <h2>{proof.serviceTitle}</h2>
                <p>Worker: {proof.profileSlug ? <Link to={`/workers/${proof.profileSlug}`}>{proof.workerName}</Link> : proof.workerName}</p>
              </div>
              <StatusBadge status={proof.status} />
            </div>
            {proof.proofValidity === 'VALID' && <p>{proof.description}</p>}
            <dl className="detail-list">
              {proof.receiptNumber && <div><dt>Receipt number</dt><dd>{proof.receiptNumber}</dd></div>}
              <div><dt>Work date</dt><dd>{new Date(proof.workDate).toLocaleDateString()}</dd></div>
              <div><dt>Verification status</dt><dd>{proof.verificationStatus.replace(/_/g, ' ')}</dd></div>
              <div><dt>Proof validity</dt><dd>{proof.proofValidity.replace(/_/g, ' ')}</dd></div>
              {proof.verifiedAt && <div><dt>Verified</dt><dd>{new Date(proof.verifiedAt).toLocaleString()}</dd></div>}
              {proof.revokedAt && <div><dt>Revoked</dt><dd>{new Date(proof.revokedAt).toLocaleString()}</dd></div>}
              {proof.revocationReason && <div><dt>Revocation reason</dt><dd>{proof.revocationReason}</dd></div>}
              {proof.proofValidity === 'VALID' && (
                <div><dt>Skills demonstrated</dt><dd>{proof.skillsDemonstrated.join(', ')}</dd></div>
              )}
              {proof.amount != null && <div><dt>Amount</dt><dd>{formatXaf(proof.amount)}</dd></div>}
              {proof.integrityHash && (
                <div>
                  <dt>Integrity hash{proof.integrityVersion ? ` (v${proof.integrityVersion})` : ''}</dt>
                  <dd className="mono">{proof.integrityHash.slice(0, 16)}…</dd>
                </div>
              )}
            </dl>
            <p className="disclaimer">This public view is consent-safe. Customer contact details and private audit data are never shown.</p>
          </article>
        )}
      </div>
    </Layout>
  );
}
