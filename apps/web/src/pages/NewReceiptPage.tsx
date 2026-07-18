import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { api } from '../lib/api';

export default function NewReceiptPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceTitle: '',
    description: '',
    workDate: new Date().toISOString().slice(0, 10),
    durationMinutes: '',
    amount: '',
    visibility: 'PRIVATE',
    skillsDemonstrated: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const receipt = await api.createReceipt({
        ...form,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : undefined,
        amount: form.amount ? Number(form.amount) : undefined,
        skillsDemonstrated: form.skillsDemonstrated.split(',').map((s) => s.trim()).filter(Boolean),
      });
      navigate(`/receipts/${receipt.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create receipt');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <PageHeader title="New work receipt" subtitle="Declare completed work and prepare customer verification" />
      {error && <Alert tone="error" message={error} />}
      <form onSubmit={(e) => void handleSubmit(e)} className="card form-stack wide-form">
        <label>Service title<input value={form.serviceTitle} onChange={(e) => setForm({ ...form, serviceTitle: e.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} /></label>
        <div className="form-row">
          <label>Customer name<input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required /></label>
          <label>Customer email<input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} required /></label>
        </div>
        <div className="form-row">
          <label>Work date<input type="date" value={form.workDate} onChange={(e) => setForm({ ...form, workDate: e.target.value })} required /></label>
          <label>Duration (minutes)<input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} /></label>
          <label>Amount (XAF)<input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></label>
        </div>
        <label>Skills (comma-separated)<input value={form.skillsDemonstrated} onChange={(e) => setForm({ ...form, skillsDemonstrated: e.target.value })} /></label>
        <label>Visibility
          <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value })}>
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted (proof link only)</option>
            <option value="PUBLIC">Public</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : 'Save draft receipt'}</button>
      </form>
    </Layout>
  );
}
