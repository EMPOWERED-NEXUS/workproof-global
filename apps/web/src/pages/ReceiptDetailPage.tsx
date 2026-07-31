import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, PageHeader, StatusBadge, Alert } from '../components/Layout';
import { api, formatXaf, type Receipt, type ReceiptEvent } from '../lib/api';

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [events, setEvents] = useState<ReceiptEvent[]>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifyLink, setVerifyLink] = useState('');
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!id) return;
    const [r, e] = await Promise.all([api.getReceipt(id), api.getReceiptEvents(id)]);
    setReceipt(r);
    setEvents(e);
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    void (async () => {
      try {
        const [r, e] = await Promise.all([api.getReceipt(id), api.getReceiptEvents(id)]);
        if (!cancelled) {
          setReceipt(r);
          setEvents(e);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit() {
    if (!id) return;
    try {
      const result = await api.submitReceipt(id);
      const link = `${window.location.origin}/verify/${result.verificationToken}`;
      setVerifyLink(link);
      setInfo(`Receipt submitted (attempt ${result.attemptNumber}). Share this verification link with your customer.`);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    }
  }

  async function handleAddLink() {
    if (!id) return;
    const url = window.prompt('Evidence URL');
    if (!url) return;
    await api.addEvidenceLink(id, { type: 'LINK', url });
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

  return (
    <Layout>
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
          <ul>{receipt.evidence?.map((e) => <li key={e.id}>{e.type}: {e.description || e.url}</li>) ?? <li>No evidence attached</li>}</ul>
          {editable && <button type="button" className="btn btn-secondary" onClick={() => void handleAddLink()}>Add link evidence</button>}
        </section>
      </div>

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

      {verifyLink && (
        <div className="card">
          <h3>Customer verification link</h3>
          <code className="verify-link">{verifyLink}</code>
        </div>
      )}
    </Layout>
  );
}
