import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { useAuth } from '../hooks/use-auth';
import { api, formatXaf, type WorkerDashboard } from '../lib/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState<WorkerDashboard | null>(null);
  const [error, setError] = useState('');
  const notice = (location.state as { notice?: string } | null)?.notice;

  useEffect(() => {
    if (user?.role === 'WORKER') {
      api.workerDashboard().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load dashboard'));
    }
  }, [user]);

  if (user?.role === 'ORGANISATION') {
    return (
      <Layout>
        <PageHeader title="Organisation dashboard" subtitle="Programme overview" action={<Link to="/organisation" className="btn btn-primary">View organisation</Link>} />
      </Layout>
    );
  }

  if (user?.role === 'ADMIN') {
    return (
      <Layout>
        <PageHeader title="Admin dashboard" subtitle="Platform administration" action={<Link to="/admin" className="btn btn-primary">Open admin console</Link>} />
      </Layout>
    );
  }

  return (
    <Layout>
      <EmailVerificationBanner />
      <PageHeader title={`Welcome, ${user?.fullName}`} subtitle="Your verified work portfolio at a glance" action={<Link to="/receipts/new" className="btn btn-primary">New receipt</Link>} />
      {notice && <Alert tone="success" message={notice} />}
      {error && <Alert tone="error" message={error} />}
      {!data ? (
        <p className="page-loading">Loading dashboard…</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card"><span>Total receipts</span><strong>{data.totalReceipts}</strong></div>
            <div className="stat-card"><span>Verified</span><strong>{data.verifiedReceipts}</strong></div>
            <div className="stat-card"><span>Pending</span><strong>{data.pendingReceipts}</strong></div>
            <div className="stat-card"><span>Verification rate</span><strong>{data.verificationRate}%</strong></div>
            <div className="stat-card"><span>Repeat customers</span><strong>{data.repeatCustomerCount}</strong></div>
            <div className="stat-card"><span>Verified income</span><strong>{formatXaf(data.totalVerifiedIncome)}</strong></div>
          </div>
          <section className="card section-card">
            <h2>Recent receipts</h2>
            {data.recentReceipts.length === 0 ? (
              <p>No receipts yet. Create your first Verified Work Receipt.</p>
            ) : (
              <ul className="list-rows">
                {data.recentReceipts.map((r) => (
                  <li key={r.id}>
                    <Link to={`/receipts/${r.id}`}>{r.serviceTitle}</Link>
                    <span>{r.status.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}
