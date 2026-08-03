import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, PageHeader, Alert, StatusBadge } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { OnboardingChecklist, Skeleton, type ChecklistItem } from '../components/ui';
import { useAuth } from '../hooks/use-auth';
import { api, formatXaf, type WorkerDashboard, type WorkerProfile } from '../lib/api';

function nextStepFor(checklist: ChecklistItem[]): ChecklistItem | undefined {
  return checklist.find((item) => !item.done);
}

export default function DashboardPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState<WorkerDashboard | null>(null);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [hasEvidence, setHasEvidence] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const notice = (location.state as { notice?: string } | null)?.notice;

  useEffect(() => {
    if (user?.role !== 'WORKER') {
      setLoading(false);
      return;
    }
    Promise.all([api.workerDashboard(), api.getProfile(), api.listReceipts('?limit=50&archived=all')])
      .then(([dash, prof, receipts]) => {
        setData(dash);
        setProfile(prof);
        setHasEvidence(receipts.items.some((r) => (r.evidence?.length ?? 0) > 0));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role === 'ORGANISATION') {
    return (
      <Layout>
        <PageHeader
          title="Organisation dashboard"
          subtitle="Invitation-based programme overview"
          action={
            <Link to="/organisation" className="btn btn-primary">
              View organisation
            </Link>
          }
        />
        <Alert
          tone="info"
          message="Organisation accounts are provisioned through a controlled administrative process. Worker assignments are not available through public self-registration."
        />
      </Layout>
    );
  }

  if (user?.role === 'ADMIN') {
    return (
      <Layout>
        <PageHeader
          title="Admin dashboard"
          subtitle="Platform administration"
          action={
            <Link to="/admin" className="btn btn-primary">
              Open admin console
            </Link>
          }
        />
      </Layout>
    );
  }

  const profileComplete = Boolean(
    profile?.headline?.trim() && profile?.bio?.trim() && (profile?.skills?.length ?? 0) > 0,
  );
  const emailVerified = Boolean(user?.emailVerified || user?.emailVerifiedAt);
  const hasReceipt = (data?.totalReceipts ?? 0) > 0;
  const submitted =
    (data?.pendingReceipts ?? 0) + (data?.verifiedReceipts ?? 0) + (data?.disputedReceipts ?? 0) > 0;

  const checklist: ChecklistItem[] = [
    { id: 'profile', label: 'Complete your public profile', done: profileComplete, href: '/profile' },
    { id: 'email', label: 'Verify your email address', done: emailVerified, href: '/profile' },
    { id: 'receipt', label: 'Create your first receipt', done: hasReceipt, href: '/receipts/new' },
    { id: 'evidence', label: 'Attach evidence to a receipt', done: hasEvidence, href: '/receipts' },
    {
      id: 'submit',
      label: 'Submit a receipt for customer confirmation',
      done: submitted,
      href: '/receipts',
    },
  ];
  const showOnboarding = checklist.some((c) => !c.done);
  const nextStep = nextStepFor(checklist);

  return (
    <Layout>
      {/* 1. Account / verification alert */}
      <EmailVerificationBanner />

      {/* 2. Welcome and primary action */}
      <PageHeader
        title={`Welcome, ${user?.fullName}`}
        subtitle="Your verified work portfolio at a glance"
        action={
          <Link to="/receipts/new" className="btn btn-primary">
            New receipt
          </Link>
        }
      />
      {notice && <Alert tone="success" message={notice} />}
      {error && <Alert tone="error" message={error} />}
      {loading && <Skeleton rows={4} />}
      {!loading && data && (
        <>
          {/* 3. Onboarding progress */}
          {showOnboarding && <OnboardingChecklist items={checklist} />}

          {/* 4. Portfolio metrics */}
          <section aria-labelledby="metrics-title">
            <div className="section-header">
              <h2 id="metrics-title">Portfolio</h2>
            </div>
            <div className="stat-grid">
              <div className="stat-card">
                <span>Total receipts</span>
                <strong>{data.totalReceipts}</strong>
              </div>
              <div className="stat-card">
                <span>Verified</span>
                <strong>{data.verifiedReceipts}</strong>
              </div>
              <div className="stat-card">
                <span>Pending</span>
                <strong>{data.pendingReceipts}</strong>
              </div>
              <div className="stat-card">
                <span>Verification rate</span>
                <strong>{data.verificationRate}%</strong>
              </div>
              <div className="stat-card">
                <span>Repeat customers</span>
                <strong>{data.repeatCustomerCount}</strong>
              </div>
              <div className="stat-card">
                <span>Verified income</span>
                <strong>{formatXaf(data.totalVerifiedIncome)}</strong>
              </div>
            </div>
          </section>

          {/* 5. Recent activity */}
          <section className="card section-card" aria-labelledby="recent-title">
            <div className="section-header">
              <h2 id="recent-title">Recent activity</h2>
              <Link to="/receipts" className="btn btn-quiet btn-sm">
                View all
              </Link>
            </div>
            {data.recentReceipts.length === 0 ? (
              <p className="muted">
                No receipts yet.{' '}
                <Link to="/receipts/new">Create your first Verified Work Receipt</Link>.
              </p>
            ) : (
              <ul className="list-rows">
                {data.recentReceipts.map((r) => (
                  <li key={r.id}>
                    <Link to={`/receipts/${r.id}`}>{r.serviceTitle}</Link>
                    <StatusBadge status={r.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* 6. Helpful next step */}
          {nextStep && (
            <aside className="next-step" aria-labelledby="next-step-title">
              <div>
                <h2 id="next-step-title">Next step</h2>
                <p>{nextStep.label}</p>
              </div>
              {nextStep.href && (
                <Link to={nextStep.href} className="btn btn-secondary">
                  Continue
                </Link>
              )}
            </aside>
          )}
        </>
      )}
    </Layout>
  );
}
