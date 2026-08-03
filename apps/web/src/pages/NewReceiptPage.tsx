import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { DurationFields } from '../components/DurationFields';
import { api, type ConfirmationMethod, type DurationUnit } from '../lib/api';

const METHODS: Array<{
  id: ConfirmationMethod;
  title: string;
  description: string;
}> = [
  {
    id: 'EMAIL',
    title: 'Email the customer',
    description: 'Send a secure confirmation link to any working email address.',
  },
  {
    id: 'SHARE_LINK',
    title: 'Share a secure link',
    description:
      'Send the confirmation through WhatsApp or another messaging app. The customer does not need a WorkProof account.',
  },
  {
    id: 'IN_PERSON_QR',
    title: 'Confirm in person',
    description: 'Show a short-lived QR code while the customer is with you.',
  },
];

export default function NewReceiptPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    confirmationMethod: 'EMAIL' as ConfirmationMethod,
    customerName: '',
    customerEmail: '',
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
        confirmationMethod: form.confirmationMethod,
        customerName: form.customerName,
        customerEmail:
          form.confirmationMethod === 'EMAIL' ? form.customerEmail : form.customerEmail || null,
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
      <PageHeader
        title="New work receipt"
        subtitle="Declare completed work and choose how the customer will confirm"
      />
      {error && <Alert tone="error" message={error} />}
      <form onSubmit={(e) => void handleSubmit(e)} className="card form-stack wide-form">
        <fieldset className="confirmation-method-fieldset">
          <legend>How should the customer confirm?</legend>
          <div className="confirmation-method-grid" role="radiogroup" aria-label="Confirmation method">
            {METHODS.map((method) => (
              <label
                key={method.id}
                className={`confirmation-method-card ${form.confirmationMethod === method.id ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="confirmationMethod"
                  value={method.id}
                  checked={form.confirmationMethod === method.id}
                  onChange={() => setForm({ ...form, confirmationMethod: method.id })}
                />
                <span className="confirmation-method-title">{method.title}</span>
                <span className="muted">{method.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

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
          {form.confirmationMethod === 'EMAIL' ? (
            <label>
              Customer email
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                required
                placeholder="any working email"
                autoComplete="email"
              />
              <span className="field-hint">Any working email works. Gmail is not required.</span>
            </label>
          ) : (
            <p className="muted method-hint">
              {form.confirmationMethod === 'SHARE_LINK'
                ? 'No email required. After you submit, you can copy a secure link or open WhatsApp from your device. Phone numbers stay in your browser only.'
                : 'No email or phone required. After you submit, show the short-lived QR while the customer is with you.'}
            </p>
          )}
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
