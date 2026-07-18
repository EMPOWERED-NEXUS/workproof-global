import { useEffect, useState } from 'react';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { api, type OrganisationDashboard } from '../lib/api';

export default function OrganisationPage() {
  const [data, setData] = useState<OrganisationDashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.orgDashboard().then(setData).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  return (
    <Layout>
      <PageHeader title="Organisation dashboard" subtitle="Programme-level visibility" />
      {error && <Alert tone="error" message={error} />}
      {data && (
        <>
          <div className="card"><h2>{data.organisation.name}</h2><p>{data.organisation.description}</p></div>
          <Alert tone="info" message={data.note} />
          <div className="stat-grid">
            <div className="stat-card"><span>Sample workers</span><strong>{data.workerCount}</strong></div>
            <div className="stat-card"><span>Verified receipts (sample)</span><strong>{data.verifiedReceiptCount}</strong></div>
          </div>
        </>
      )}
    </Layout>
  );
}
