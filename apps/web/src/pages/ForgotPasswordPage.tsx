import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { api } from '../lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await api.forgotPassword(email);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="auth-shell">
        <div className="auth-card">
          <h1>Reset your password</h1>
          <p className="subtitle">
            Enter your account email. If an account exists, we will send reset instructions without
            revealing whether the email is registered.
          </p>
          {error && <Alert tone="error" message={error} />}
          {done ? (
            <div role="status" aria-live="polite">
              <Alert
                tone="success"
                message="If an account exists for that email, password reset instructions have been sent."
              />
              <p className="form-footer">
                <Link to="/login">Back to sign in</Link>
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </label>
              <button
                type="submit"
                className={`btn btn-primary ${loading ? 'is-loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}
          {!done && (
            <p className="form-footer">
              <Link to="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
