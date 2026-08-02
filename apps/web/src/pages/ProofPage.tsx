import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Layout, StatusBadge, Alert } from '../components/Layout';
import { CopyButton, ShareButton } from '../components/ui';
import { api, formatXaf, type PublicProof, type ProofValidity } from '../lib/api';

function validityBanner(validity: ProofValidity): {
  tone: 'error' | 'success' | 'info';
  message: string;
  valid: boolean;
} {
  switch (validity) {
    case 'VALID':
      return { tone: 'success', message: 'Valid verified proof.', valid: true };
    case 'INVALID_REVOKED':
      return { tone: 'error', message: 'Revoked. This is not valid proof.', valid: false };
    case 'UNDER_DISPUTE':
      return { tone: 'info', message: 'Disputed. Verification is under review and must not be treated as confirmed.', valid: false };
    case 'CORRECTION_REQUIRED':
      return { tone: 'info', message: 'Correction requested. Proof is temporarily unavailable.', valid: false };
    default:
      return { tone: 'error', message: 'Proof unavailable.', valid: false };
  }
}

export default function ProofPage() {
  const { verificationCode } = useParams();
  const [proof, setProof] = useState<PublicProof | null>(null);
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  const proofUrl = useMemo(() => {
    if (!verificationCode) return '';
    return `${window.location.origin}/proof/${verificationCode}`;
  }, [verificationCode]);

  useEffect(() => {
    if (!verificationCode) return;
    api
      .getPublicProof(verificationCode)
      .then(setProof)
      .catch((e) => setError(e instanceof Error ? e.message : 'Proof not found'));
  }, [verificationCode]);

  useEffect(() => {
    if (!proofUrl || !proof || proof.proofValidity !== 'VALID') {
      setQrDataUrl('');
      return;
    }
    void QRCode.toDataURL(proofUrl, { margin: 1, width: 180 }).then(setQrDataUrl).catch(() => setQrDataUrl(''));
  }, [proofUrl, proof]);

  const banner = proof ? validityBanner(proof.proofValidity) : null;

  return (
    <Layout>
      <div className={`proof-page ${banner?.valid ? 'wide' : ''}`}>
        <p className="eyebrow">WorkProof · Public proof</p>
        <h1>Portable proof of completed work</h1>
        {error && <Alert tone="error" message={error} />}
        {proof && banner && <Alert tone={banner.tone} message={banner.message} />}
        {proof && (
          <article className="card proof-card">
            <div className={`proof-seal ${banner?.valid ? '' : 'invalid'}`}>
              {banner?.valid ? 'WorkProof verified' : 'Not valid proof'}
            </div>
            <div className="proof-header">
              <div>
                <h2>{proof.serviceTitle}</h2>
                <p>
                  Worker:{' '}
                  {proof.profileSlug ? (
                    <Link to={`/workers/${proof.profileSlug}`}>{proof.workerName}</Link>
                  ) : (
                    proof.workerName
                  )}
                </p>
              </div>
              <StatusBadge status={proof.status} />
            </div>

            {banner?.valid ? (
              <>
                <p>{proof.description}</p>
                <p className="muted">
                  This page confirms that the named worker recorded this completed work and the customer
                  confirmed it through WorkProof&apos;s private verification process.
                </p>
                <dl className="detail-list">
                  {proof.receiptNumber && (
                    <div>
                      <dt>Receipt number</dt>
                      <dd>{proof.receiptNumber}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Work date</dt>
                    <dd>{new Date(proof.workDate).toLocaleDateString()}</dd>
                  </div>
                  {proof.verifiedAt && (
                    <div>
                      <dt>Verified</dt>
                      <dd>{new Date(proof.verifiedAt).toLocaleString()}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Skills demonstrated</dt>
                    <dd>{proof.skillsDemonstrated.join(', ') || '—'}</dd>
                  </div>
                  {proof.amount != null && (
                    <div>
                      <dt>Amount</dt>
                      <dd>{formatXaf(proof.amount)}</dd>
                    </div>
                  )}
                  {proof.integrityHash && (
                    <div>
                      <dt>Integrity hash{proof.integrityVersion ? ` (v${proof.integrityVersion})` : ''}</dt>
                      <dd className="mono">{proof.integrityHash}</dd>
                    </div>
                  )}
                </dl>
                <div className="proof-actions">
                  <CopyButton value={proofUrl} />
                  <ShareButton title={`WorkProof: ${proof.serviceTitle}`} text="Verified Work Receipt" url={proofUrl} />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                    Print / Save as PDF
                  </button>
                </div>
                {qrDataUrl && (
                  <div className="proof-qr">
                    <img src={qrDataUrl} alt="QR code linking to this public proof page" width={180} height={180} />
                    <p className="muted">Scan to open the canonical proof URL</p>
                  </div>
                )}
              </>
            ) : (
              <dl className="detail-list">
                {proof.receiptNumber && (
                  <div>
                    <dt>Receipt number</dt>
                    <dd>{proof.receiptNumber}</dd>
                  </div>
                )}
                <div>
                  <dt>Verification status</dt>
                  <dd>{proof.verificationStatus.replace(/_/g, ' ')}</dd>
                </div>
                <div>
                  <dt>Proof validity</dt>
                  <dd>{proof.proofValidity.replace(/_/g, ' ')}</dd>
                </div>
                {proof.revokedAt && (
                  <div>
                    <dt>Revoked</dt>
                    <dd>{new Date(proof.revokedAt).toLocaleString()}</dd>
                  </div>
                )}
                {proof.revocationReason && (
                  <div>
                    <dt>Revocation reason</dt>
                    <dd>{proof.revocationReason}</dd>
                  </div>
                )}
              </dl>
            )}
            <p className="disclaimer">
              This public view is consent-safe. Customer contact details and private audit data are never
              shown. WorkProof Global is not a lending, credit-scoring, marketplace, or payment service.
            </p>
          </article>
        )}
      </div>
    </Layout>
  );
}
