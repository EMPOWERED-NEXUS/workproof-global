import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { useAuth } from '../hooks/use-auth';
import { api } from '../lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acceptTerms || !form.acceptPrivacy) {
      setError('Please accept the Terms of Use and Privacy Policy to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.register({
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        role: 'WORKER',
        acceptTerms: true,
        acceptPrivacy: true,
      });
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
        <p className="subtitle">
          Start building portable, customer-confirmed proof of your work. Organisation programme
          access is invitation-only and is not available through public registration.
        </p>
        {error && <Alert tone="error" message={error} />}
        <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
          <label>
            Full name
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="new-password"
            />
            <span className="hint">At least 8 characters with upper, lower, and number.</span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
            />
            <span>
              I accept the <Link to="/terms">Terms of Use</Link>
            </span>
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={form.acceptPrivacy}
              onChange={(e) => setForm({ ...form, acceptPrivacy: e.target.checked })}
            />
            <span>
              I accept the <Link to="/privacy">Privacy Policy</Link>
            </span>
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
