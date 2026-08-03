import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { DurationFields } from '../components/DurationFields';
import { api, type DurationUnit } from '../lib/api';

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
    durationValue: '',
    durationUnit: 'HOUR' as DurationUnit,
    amount: '',
    visibility: 'PRIVATE',
    skillsDemonstrated: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const receipt = await api.createReceipt({
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        serviceTitle: form.serviceTitle,
        description: form.description,
        workDate: form.workDate,
        ...(form.durationValue
          ? {
              durationValue: Number(form.durationValue),
              durationUnit: form.durationUnit,
            }
          : {}),
        amount: form.amount ? Number(form.amount) : undefined,
        visibility: form.visibility,
        skillsDemonstrated: form.skillsDemonstrated
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
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
        <label>
          Service title
          <input
            value={form.serviceTitle}
            onChange={(e) => setForm({ ...form, serviceTitle: e.target.value })}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
          />
        </label>
        <div className="form-row">
          <label>
            Customer name
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              required
            />
          </label>
          <label>
            Customer email
            <input
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              required
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Work date
            <input
              type="date"
              value={form.workDate}
              onChange={(e) => setForm({ ...form, workDate: e.target.value })}
              required
            />
          </label>
          <label>
            Amount (XAF)
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
        </div>
        <DurationFields
          value={form.durationValue}
          unit={form.durationUnit}
          onValueChange={(durationValue) => setForm({ ...form, durationValue })}
          onUnitChange={(durationUnit) => setForm({ ...form, durationUnit })}
        />
        <label>
          Skills (comma-separated)
          <input
            value={form.skillsDemonstrated}
            onChange={(e) => setForm({ ...form, skillsDemonstrated: e.target.value })}
          />
        </label>
        <label>
          Visibility
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          >
            <option value="PRIVATE">Private</option>
            <option value="UNLISTED">Unlisted (proof link only)</option>
            <option value="PUBLIC">Public</option>
          </select>
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save draft receipt'}
        </button>
      </form>
    </Layout>
  );
}
