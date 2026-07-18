import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, PageHeader, StatusBadge, Alert } from '../components/Layout';
import { api, formatXaf, type Receipt } from '../lib/api';

export default function ReceiptDetailPage() {
  const { id } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifyLink, setVerifyLink] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.getReceipt(id).then(setReceipt).catch((e) => setError(e instanceof Error ? e.message : 'Not found')).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    if (!id) return;
    try {
      const result = await api.submitReceipt(id);
      const link = `${window.location.origin}/verify/${result.verificationToken}`;
      setVerifyLink(link);
      setInfo('Receipt submitted. Share this verification link with your customer.');
      setReceipt(await api.getReceipt(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed');
    }
  }

  async function handleAddLink() {
    if (!id) return;
    const url = window.prompt('Evidence URL');
    if (!url) return;
    await api.addEvidenceLink(id, { type: 'LINK', url });
    setReceipt(await api.getReceipt(id));
  }

  if (loading) return <Layout><p className="page-loading">Loading receipt…</p></Layout>;
  if (!receipt) return <Layout><Alert tone="error" message={error || 'Receipt not found'} /></Layout>;

  const editable = receipt.status === 'DRAFT' || receipt.status === 'CORRECTION_REQUESTED';

  return (
    <Layout>
      <PageHeader title={receipt.serviceTitle} subtitle={`Receipt for ${receipt.customerName}`} action={<StatusBadge status={receipt.status} />} />
      {error && <Alert tone="error" message={error} />}
      {info && <Alert tone="success" message={info} />}
      <div className="card detail-grid">
        <section>
          <h2>Work details</h2>
          <p>{receipt.description}</p>
          <dl className="detail-list">
            <div><dt>Work date</dt><dd>{new Date(receipt.workDate).toLocaleDateString()}</dd></div>
            <div><dt>Amount</dt><dd>{formatXaf(receipt.amount ?? null)}</dd></div>
            <div><dt>Skills</dt><dd>{receipt.skillsDemonstrated.join(', ') || '—'}</dd></div>
            {receipt.receiptNumber && <div><dt>Receipt number</dt><dd>{receipt.receiptNumber}</dd></div>}
            {receipt.verificationCode && <div><dt>Public proof</dt><dd><Link to={`/proof/${receipt.verificationCode}`}>View proof page</Link></dd></div>}
          </dl>
        </section>
        <section>
          <h2>Evidence</h2>
          <ul>{receipt.evidence?.map((e) => <li key={e.id}>{e.type}: {e.description || e.url}</li>) ?? <li>No evidence attached</li>}</ul>
          {editable && <button type="button" className="btn btn-secondary" onClick={() => void handleAddLink()}>Add link evidence</button>}
        </section>
      </div>
      {editable && (
        <div className="action-row">
          <button type="button" className="btn btn-primary" onClick={() => void handleSubmit()}>Submit for customer verification</button>
        </div>
      )}
      {verifyLink && (
        <div className="card">
          <h3>Customer verification link</h3>
          <code className="verify-link">{verifyLink}</code>
        </div>
      )}
    </Layout>
  );
}
