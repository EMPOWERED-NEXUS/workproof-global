import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { useAuth } from '../hooks/use-auth';
import { api } from '../lib/api';

function passwordChecks(password: string) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  };
}

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
  const checks = useMemo(() => passwordChecks(form.password), [form.password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!form.acceptTerms || !form.acceptPrivacy) {
      setError('Please accept the Terms of Use and Privacy Policy to continue.');
      return;
    }
    if (!checks.length || !checks.upper || !checks.lower || !checks.number) {
      setError('Password must be at least 8 characters and include upper, lower, and a number.');
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
      <div className="auth-shell">
        <div className="auth-card">
          <h1>Create your work profile</h1>
          <p className="subtitle">
            Build portable, customer-confirmed proof of your work. Organisation access is
            invitation-only.
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
                aria-describedby="password-requirements"
              />
              <ul id="password-requirements" className="password-reqs">
                <li className={checks.length ? 'ok' : undefined}>At least 8 characters</li>
                <li className={checks.upper ? 'ok' : undefined}>One uppercase letter</li>
                <li className={checks.lower ? 'ok' : undefined}>One lowercase letter</li>
                <li className={checks.number ? 'ok' : undefined}>One number</li>
              </ul>
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
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'is-loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating profile…' : 'Create profile'}
            </button>
          </form>
          <p className="form-footer">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
