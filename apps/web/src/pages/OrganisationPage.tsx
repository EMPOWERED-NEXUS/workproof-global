import { useEffect, useState } from 'react';
import { Layout, PageHeader, Alert, EmptyState } from '../components/Layout';
import { Skeleton } from '../components/ui';
import { api, type OrganisationDashboard } from '../lib/api';

export default function OrganisationPage() {
  const [data, setData] = useState<OrganisationDashboard | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .orgDashboard()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <PageHeader
        title="Organisation programme"
        subtitle="Invitation-based pilot access — organisation-scoped visibility only"
      />
      {error && <Alert tone="error" message={error} />}
      {loading && <Skeleton rows={3} />}
      {data && (
        <>
          <div className="card section-card">
            <h2>{data.organisation.name}</h2>
            <p>{data.organisation.description}</p>
            {data.organisation.website && (
              <p>
                <a href={data.organisation.website} target="_blank" rel="noreferrer">
                  {data.organisation.website}
                </a>
              </p>
            )}
          </div>
          <Alert
            tone="info"
            message={
              data.accessNote ??
              'Organisation programme access is invitation-based. Public self-registration does not create organisation accounts.'
            }
          />
          {data.workerCount === 0 ? (
            <EmptyState
              title="No workers are assigned to this programme yet."
              description="When membership and assignment features are enabled, only workers assigned to your programme will appear here. Platform-wide worker data is never shown."
            />
          ) : (
            <section className="card section-card">
              <h2>Assigned workers ({data.workerCount})</h2>
              <ul className="list-rows">
                {(data.assignedWorkers ?? []).map((w) => (
                  <li key={w.profileSlug}>
                    <span>{w.fullName}</span>
                    <span className="muted">{w.skills.join(', ')}</span>
                  </li>
                ))}
              </ul>
              <p className="muted">Verified receipts in programme scope: {data.verifiedReceiptCount}</p>
            </section>
          )}
        </>
      )}
    </Layout>
  );
}
