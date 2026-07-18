import { useEffect, useState } from 'react';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { api, type AdminUser, type Dispute, type Receipt } from '../lib/api';

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.adminUsers(), api.adminReceipts(), api.adminDisputes()])
      .then(([u, r, d]) => {
        setUsers(u.items);
        setReceipts(r.items);
        setDisputes(d.items);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Admin load failed'));
  }, []);

  return (
    <Layout>
      <PageHeader title="Administration" subtitle="Platform oversight — users, receipts, and disputes" />
      {error && <Alert tone="error" message={error} />}
      <section className="card section-card">
        <h2>Users ({users.length})</h2>
        <ul className="list-rows">{users.map((u) => <li key={u.id}>{u.fullName} · {u.email} · {u.role} · {u.status}</li>)}</ul>
      </section>
      <section className="card section-card">
        <h2>Receipts ({receipts.length})</h2>
        <ul className="list-rows">{receipts.slice(0, 10).map((r) => <li key={r.id}>{r.serviceTitle} · {r.status}</li>)}</ul>
      </section>
      <section className="card section-card">
        <h2>Open disputes ({disputes.filter((d) => d.status === 'OPEN').length})</h2>
        <ul className="list-rows">{disputes.map((d) => <li key={d.id}>{d.reason}: {d.description.slice(0, 80)}</li>)}</ul>
      </section>
    </Layout>
  );
}
