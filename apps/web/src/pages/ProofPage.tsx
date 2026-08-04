import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { Layout, StatusBadge, Alert } from '../components/Layout';
import { CopyButton, ShareButton } from '../components/ui';
import {
  api,
  buildCanonicalProofUrl,
  formatXaf,
  isNetworkError,
  type PublicProof,
  type ProofValidity,
} from '../lib/api';
import { ErrorState } from '../components/ui';

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
      return {
        tone: 'info',
        message: 'Disputed. Verification is under review and must not be treated as confirmed.',
        valid: false,
      };
    case 'CORRECTION_REQUIRED':
      return {
        tone: 'info',
        message: 'Correction requested. Proof is temporarily unavailable.',
        valid: false,
      };
    default:
      return { tone: 'error', message: 'Proof unavailable.', valid: false };
  }
}

export default function ProofPage() {
  const { verificationCode } = useParams();
  const [proof, setProof] = useState<PublicProof | null>(null);
  const [error, setError] = useState('');
  const [networkFailure, setNetworkFailure] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const proofUrl = useMemo(() => {
    if (!verificationCode) return '';
    return buildCanonicalProofUrl(verificationCode);
  }, [verificationCode]);

  function loadProof() {
    if (!verificationCode) return;
    setError('');
    setNetworkFailure(false);
    api
      .getPublicProof(verificationCode)
      .then((data) => {
        setProof(data);
      })
      .catch((e) => {
        setProof(null);
        if (isNetworkError(e)) {
          setNetworkFailure(true);
          setError(e.message);
          return;
        }
        setError(e instanceof Error ? e.message : 'Proof not found');
      });
  }

  useEffect(() => {
    loadProof();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {networkFailure && error && <ErrorState message={error} onRetry={loadProof} />}
        {!networkFailure && error && <Alert tone="error" message={error} />}
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
                {proof.confirmationAssuranceLabel && (
                  <p className="confirmation-badge" role="status">
                    {proof.confirmationAssuranceLabel}
                  </p>
                )}
                {proof.confirmationChannelNote && (
                  <p className="muted disclosure">{proof.confirmationChannelNote}</p>
                )}
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
                  {proof.durationLabel && (
                    <div>
                      <dt>Duration</dt>
                      <dd>{proof.durationLabel}</dd>
                    </div>
                  )}
                  {proof.verifiedAt && (
                    <div>
                      <dt>Customer confirmed</dt>
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

                {(proof.evidence?.length ?? 0) > 0 && (
                  <section className="proof-evidence">
                    <h3 className="form-section-title">Supporting evidence</h3>
                    <p className="muted disclosure">{proof.evidenceDisclosure}</p>
                    <ul className="evidence-list">
                      {proof.evidence.map((item, index) => (
                        <li key={`${item.type}-${index}`} className="evidence-item">
                          <div>
                            <strong>{item.linkPlatform || item.type}</strong>
                            {item.description && <p>{item.description}</p>}
                          </div>
                          {item.url && (
                            <a
                              className="btn btn-secondary btn-sm"
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open link
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <h3 className="form-section-title" style={{ marginTop: '1.5rem' }}>
                  Verification timeline
                </h3>
                <ol className="proof-timeline">
                  <li>
                    <strong>Work recorded</strong>
                    Worker created this Verified Work Receipt for completed service.
                  </li>
                  <li>
                    <strong>Customer confirmation</strong>
                    {proof.confirmationAssuranceLabel ??
                      (proof.verifiedAt
                        ? `Confirmed on ${new Date(proof.verifiedAt).toLocaleString()}.`
                        : 'Customer confirmed through a secure WorkProof link.')}
                  </li>
                  <li>
                    <strong>Proof locked</strong>
                    Integrity hash issued for portable sharing.
                  </li>
                </ol>

                <div className="proof-actions">
                  <CopyButton value={proofUrl} />
                  <ShareButton
                    title={`WorkProof: ${proof.serviceTitle}`}
                    text="Verified Work Receipt"
                    url={proofUrl}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => window.print()}
                  >
                    Print / Save as PDF
                  </button>
                </div>
                {qrDataUrl && (
                  <div className="proof-qr">
                    <img
                      src={qrDataUrl}
                      alt="QR code linking to this public proof page"
                      width={180}
                      height={180}
                    />
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
              This public view is consent-safe. Customer contact details and private audit data are
              never shown. WorkProof Global is not a lending, credit-scoring, marketplace, or payment
              service.
            </p>
          </article>
        )}
      </div>
    </Layout>
  );
}
