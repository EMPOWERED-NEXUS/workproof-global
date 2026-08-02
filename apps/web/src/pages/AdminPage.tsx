import { useCallback, useEffect, useState } from 'react';
import { Layout, PageHeader, Alert, StatusBadge } from '../components/Layout';
import { ConfirmDialog, FilterToolbar, LiveRegion, Skeleton } from '../components/ui';
import { api, type AdminReceipt, type AdminUser, type Dispute } from '../lib/api';

type PendingAction =
  | { type: 'suspend' | 'activate'; user: AdminUser }
  | { type: 'revoke'; receipt: AdminReceipt }
  | { type: 'resolve'; dispute: Dispute }
  | null;

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [receipts, setReceipts] = useState<AdminReceipt[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [receiptSearch, setReceiptSearch] = useState('');
  const [receiptStatus, setReceiptStatus] = useState('');
  const [pending, setPending] = useState<PendingAction>(null);
  const [reason, setReason] = useState('');
  const [resolution, setResolution] = useState('');
  const [resolveStatus, setResolveStatus] = useState<'VERIFIED' | 'REVOKED' | 'CORRECTION_REQUESTED'>(
    'CORRECTION_REQUESTED',
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const userQs = new URLSearchParams();
      if (userSearch.trim()) userQs.set('search', userSearch.trim());
      if (userStatus) userQs.set('status', userStatus);
      userQs.set('limit', '50');
      const receiptQs = new URLSearchParams();
      if (receiptSearch.trim()) receiptQs.set('search', receiptSearch.trim());
      if (receiptStatus) receiptQs.set('status', receiptStatus);
      receiptQs.set('limit', '50');
      const [u, r, d] = await Promise.all([
        api.adminUsers(`?${userQs}`),
        api.adminReceipts(`?${receiptQs}`),
        api.adminDisputes('?limit=50'),
      ]);
      setUsers(u.items);
      setReceipts(r.items);
      setDisputes(d.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Admin load failed');
    } finally {
      setLoading(false);
    }
  }, [userSearch, userStatus, receiptSearch, receiptStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runPending() {
    if (!pending || busy) return;
    setBusy(true);
    setError('');
    try {
      if (pending.type === 'suspend' || pending.type === 'activate') {
        await api.adminSetUserStatus(pending.user.id, pending.type === 'suspend' ? 'SUSPENDED' : 'ACTIVE');
        setInfo(`User ${pending.user.email} is now ${pending.type === 'suspend' ? 'suspended' : 'active'}.`);
      }
      if (pending.type === 'revoke') {
        if (reason.trim().length < 5) {
          setError('A revocation reason of at least 5 characters is required.');
          setBusy(false);
          return;
        }
        await api.adminRevokeReceipt(pending.receipt.id, reason.trim());
        setInfo(`Receipt revoked.`);
      }
      if (pending.type === 'resolve') {
        if (resolution.trim().length < 5) {
          setError('A resolution of at least 5 characters is required.');
          setBusy(false);
          return;
        }
        await api.adminResolveDispute(pending.dispute.id, {
          resolution: resolution.trim(),
          receiptStatus: resolveStatus,
        });
        setInfo('Dispute resolved.');
      }
      setPending(null);
      setReason('');
      setResolution('');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  }

  const openDisputes = disputes.filter((d) => d.status === 'OPEN');

  return (
    <Layout>
      <LiveRegion message={info || error} politeness={error ? 'assertive' : 'polite'} />
      <PageHeader title="Administration" subtitle="Platform oversight — users, receipts, and disputes" />
      {error && <Alert tone="error" message={error} />}
      {info && <Alert tone="success" message={info} />}

      <section className="card section-card">
        <h2>Users</h2>
        <FilterToolbar>
          <label>
            Search users
            <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)} placeholder="Name or email" />
          </label>
          <label>
            Status
            <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </label>
          <button type="button" className="btn btn-secondary" onClick={() => void load()}>
            Apply
          </button>
        </FilterToolbar>
        {loading ? (
          <Skeleton rows={3} />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td data-label="Name">{u.fullName}</td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">{u.role}</td>
                    <td data-label="Status">
                      <StatusBadge status={u.status} />
                    </td>
                    <td data-label="Actions">
                      {u.role !== 'ADMIN' && u.status === 'ACTIVE' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={busy}
                          onClick={() => setPending({ type: 'suspend', user: u })}
                        >
                          Suspend
                        </button>
                      )}
                      {u.status === 'SUSPENDED' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={busy}
                          onClick={() => setPending({ type: 'activate', user: u })}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card section-card">
        <h2>Receipts</h2>
        <FilterToolbar>
          <label>
            Search receipts
            <input
              value={receiptSearch}
              onChange={(e) => setReceiptSearch(e.target.value)}
              placeholder="Title, customer, worker, number"
            />
          </label>
          <label>
            Status
            <select value={receiptStatus} onChange={(e) => setReceiptStatus(e.target.value)}>
              <option value="">All</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_VERIFICATION">Pending verification</option>
              <option value="VERIFIED">Verified</option>
              <option value="CORRECTION_REQUESTED">Correction requested</option>
              <option value="DISPUTED">Disputed</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </label>
          <button type="button" className="btn btn-secondary" onClick={() => void load()}>
            Apply
          </button>
        </FilterToolbar>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id}>
                  <td data-label="Service">
                    {r.serviceTitle}
                    {r.receiptNumber ? ` · ${r.receiptNumber}` : ''}
                  </td>
                  <td data-label="Owner">{r.worker?.fullName ?? '—'}</td>
                  <td data-label="Status">
                    <StatusBadge status={r.status} />
                  </td>
                  <td data-label="Actions">
                    {r.status === 'VERIFIED' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={busy}
                        onClick={() => {
                          setReason('');
                          setPending({ type: 'revoke', receipt: r });
                        }}
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card section-card">
        <h2>Open disputes ({openDisputes.length})</h2>
        {openDisputes.length === 0 ? (
          <p className="muted">No open disputes.</p>
        ) : (
          <ul className="list-rows">
            {openDisputes.map((d) => (
              <li key={d.id}>
                <div>
                  <strong>{d.receipt?.serviceTitle ?? 'Receipt'}</strong>
                  <p className="muted">
                    {d.reason}: {d.description.slice(0, 120)}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={busy}
                  onClick={() => {
                    setResolution('');
                    setPending({ type: 'resolve', dispute: d });
                  }}
                >
                  Resolve
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={pending?.type === 'suspend'}
        title="Suspend this user?"
        description={
          pending?.type === 'suspend'
            ? `${pending.user.fullName} (${pending.user.email}) will be unable to sign in until restored.`
            : undefined
        }
        confirmLabel="Suspend user"
        busy={busy}
        onClose={() => setPending(null)}
        onConfirm={runPending}
      />
      <ConfirmDialog
        open={pending?.type === 'activate'}
        title="Restore this user?"
        description={
          pending?.type === 'activate'
            ? `${pending.user.fullName} will regain access if their credentials remain valid.`
            : undefined
        }
        confirmLabel="Activate user"
        tone="primary"
        busy={busy}
        onClose={() => setPending(null)}
        onConfirm={runPending}
      />
      <ConfirmDialog
        open={pending?.type === 'revoke'}
        title="Revoke verified receipt?"
        description="Revocation permanently invalidates public proof for this receipt."
        confirmLabel="Revoke receipt"
        busy={busy}
        onClose={() => setPending(null)}
        onConfirm={runPending}
      >
        <label className="form-stack">
          Reason (required)
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required minLength={5} />
        </label>
      </ConfirmDialog>
      <ConfirmDialog
        open={pending?.type === 'resolve'}
        title="Resolve dispute?"
        description="Choose the resulting receipt status and provide a resolution note."
        confirmLabel="Resolve dispute"
        tone="primary"
        busy={busy}
        onClose={() => setPending(null)}
        onConfirm={runPending}
      >
        <div className="form-stack">
          <label>
            Resulting receipt status
            <select
              value={resolveStatus}
              onChange={(e) =>
                setResolveStatus(e.target.value as 'VERIFIED' | 'REVOKED' | 'CORRECTION_REQUESTED')
              }
            >
              <option value="VERIFIED">Verified</option>
              <option value="CORRECTION_REQUESTED">Correction requested</option>
              <option value="REVOKED">Revoked</option>
            </select>
          </label>
          <label>
            Resolution (required)
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              required
              minLength={5}
            />
          </label>
        </div>
      </ConfirmDialog>
    </Layout>
  );
}
