import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, PageHeader, EmptyState, StatusBadge, Alert } from '../components/Layout';
import { api, type Receipt } from '../lib/api';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listReceipts()
      .then((res) => setReceipts(res.items))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load receipts'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <PageHeader title="Work receipts" subtitle="Your Verified Work Receipt portfolio" action={<Link to="/receipts/new" className="btn btn-primary">New receipt</Link>} />
      {error && <Alert tone="error" message={error} />}
      {loading ? (
        <p className="page-loading">Loading receipts…</p>
      ) : receipts.length === 0 ? (
        <EmptyState title="No receipts yet" description="Create a draft receipt, attach evidence, and send it to your customer for verification." action={<Link to="/receipts/new" className="btn btn-primary">Create first receipt</Link>} />
      ) : (
        <div className="receipt-grid">
          {receipts.map((r) => (
            <Link key={r.id} to={`/receipts/${r.id}`} className="card receipt-card">
              <div className="receipt-card-header">
                <h3>{r.serviceTitle}</h3>
                <StatusBadge status={r.status} />
              </div>
              <p>{r.customerName}</p>
              <p className="muted">{new Date(r.workDate).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
