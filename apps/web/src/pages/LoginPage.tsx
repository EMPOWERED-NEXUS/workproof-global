import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { useAuth } from '../hooks/use-auth';
import { api } from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const locationState = location.state as { reason?: string; from?: string } | null;
  const sessionExpired = locationState?.reason === 'session';
  const returnTo =
    locationState?.from && locationState.from.startsWith('/') && !locationState.from.startsWith('//')
      ? locationState.from
      : '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.login({ email, password });
      await refresh();
      navigate(returnTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="subtitle">Access your WorkProof dashboard and receipts.</p>
        {sessionExpired && (
          <Alert tone="info" message="Your session expired. Please sign in again." />
        )}
        {error && <Alert tone="error" message={error} />}
        <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="form-footer">
          <Link to="/forgot-password">Forgot password?</Link>
          {' · '}
          New to WorkProof? <Link to="/register">Create your profile</Link>
        </p>
      </div>
    </Layout>
  );
}
