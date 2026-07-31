import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { useAuth } from '../hooks/use-auth';
import { api } from '../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'WORKER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.register(form);
      await refresh();
      navigate('/dashboard', {
        state: {
          registered: true,
          notice:
            'We sent a verification email. You can complete your profile and create drafts now; receipt submission requires a verified email.',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h1>Create your work profile</h1>
        <p className="subtitle">Start building portable, client-confirmed proof of your work. We will email a verification link after signup.</p>
        {error && <Alert tone="error" message={error} />}
        <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
          <label>
            Full name
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </label>
          <label>
            Email
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <span className="hint">At least 8 characters with upper, lower, and number.</span>
          </label>
          <label>
            Account type
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="WORKER">Worker / freelancer</option>
              <option value="ORGANISATION">Organisation programme</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating profile…' : 'Create profile'}
          </button>
        </form>
        <p className="form-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </Layout>
  );
}
