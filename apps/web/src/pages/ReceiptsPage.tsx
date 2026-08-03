import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, PageHeader, StatusBadge } from '../components/Layout';
import { EmptyState, ErrorState, FilterToolbar, Skeleton } from '../components/ui';
import { useQueryState } from '../hooks/useQueryState';
import { api, type Receipt, type ReceiptStatus } from '../lib/api';

type StatusFilter = 'all' | ReceiptStatus | 'ARCHIVED';

function buildQuery(params: URLSearchParams) {
  const sp = new URLSearchParams();
  const search = params.get('search')?.trim();
  const status = params.get('status') || 'all';
  const sort = params.get('sort') || 'newest';
  if (search) sp.set('search', search);
  if (status === 'ARCHIVED') {
    sp.set('archived', 'true');
  } else {
    sp.set('archived', status === 'all' ? 'all' : 'false');
    if (status !== 'all') sp.set('status', status);
  }
  if (sort === 'oldest') {
    sp.set('sortBy', 'createdAt');
    sp.set('sortOrder', 'asc');
  } else if (sort === 'workDate') {
    sp.set('sortBy', 'workDate');
    sp.set('sortOrder', 'desc');
  } else if (sort === 'status') {
    sp.set('sortBy', 'serviceTitle');
    sp.set('sortOrder', 'asc');
  } else {
    sp.set('sortBy', 'createdAt');
    sp.set('sortOrder', 'desc');
  }
  sp.set('limit', '50');
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export default function ReceiptsPage() {
  const { params, update } = useQueryState();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const search = params.get('search') ?? '';
  const status = (params.get('status') as StatusFilter) || 'all';
  const sort = params.get('sort') || 'newest';

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .listReceipts(buildQuery(params))
      .then((res) => {
        let items = res.items;
        if (sort === 'status') {
          items = [...items].sort((a, b) => a.status.localeCompare(b.status));
        }
        setReceipts(items);
        setTotal(res.pagination.total);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load receipts'))
      .finally(() => setLoading(false));
  }, [params, sort]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    update({ search: undefined, status: undefined, sort: undefined });
  }

  const hasFilters = Boolean(search || (status && status !== 'all') || (sort && sort !== 'newest'));

  return (
    <Layout>
      <PageHeader
        title="Work receipts"
        subtitle="Your Verified Work Receipt portfolio"
        action={
          <Link to="/receipts/new" className="btn btn-primary">
            New receipt
          </Link>
        }
      />

      <FilterToolbar>
        <label>
          Search
          <input
            value={search}
            onChange={(e) => update({ search: e.target.value || undefined })}
            placeholder="Service title or customer name"
            aria-label="Search by service title or customer name"
          />
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(e) => update({ status: e.target.value === 'all' ? undefined : e.target.value })}
          >
            <option value="all">All</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_VERIFICATION">Pending verification</option>
            <option value="VERIFIED">Verified</option>
            <option value="CORRECTION_REQUESTED">Correction requested</option>
            <option value="DISPUTED">Disputed</option>
            <option value="REVOKED">Revoked</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label>
          Sort
          <select value={sort} onChange={(e) => update({ sort: e.target.value === 'newest' ? undefined : e.target.value })}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="workDate">Work date</option>
            <option value="status">Status</option>
          </select>
        </label>
        <button type="button" className="btn btn-secondary" onClick={clearFilters} disabled={!hasFilters}>
          Clear filters
        </button>
      </FilterToolbar>

      <p className="result-meta" aria-live="polite">
        {loading ? 'Loading…' : `${total} result${total === 1 ? '' : 's'}`}
      </p>

      {error && <ErrorState message={error} onRetry={load} />}
      {!error && loading && <Skeleton rows={4} />}
      {!error && !loading && receipts.length === 0 && (
        <EmptyState
          title={hasFilters ? 'No receipts match these filters' : 'No receipts yet'}
          description={
            hasFilters
              ? 'Try clearing filters or adjusting your search.'
              : 'Create a draft receipt, attach evidence, and send it to your customer for verification.'
          }
          action={
            hasFilters ? (
              <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                Clear filters
              </button>
            ) : (
              <Link to="/receipts/new" className="btn btn-primary">
                Create first receipt
              </Link>
            )
          }
        />
      )}
      {!error && !loading && receipts.length > 0 && (
        <div className="receipt-grid">
          {receipts.map((r) => (
            <Link key={r.id} to={`/receipts/${r.id}`} className="card receipt-card">
              <div className="receipt-card-header">
                <h3>{r.serviceTitle}</h3>
                <StatusBadge status={r.archivedAt ? 'ARCHIVED' : r.status} />
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
