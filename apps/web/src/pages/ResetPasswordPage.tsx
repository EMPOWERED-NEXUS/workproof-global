import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { ApiRequestError, api } from '../lib/api';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState<string | undefined>();

  const missingToken = !token;

  const requirements = useMemo(
    () => [
      { ok: password.length >= 8, label: 'At least 8 characters' },
      { ok: /[A-Z]/.test(password), label: 'One uppercase letter' },
      { ok: /[a-z]/.test(password), label: 'One lowercase letter' },
      { ok: /[0-9]/.test(password), label: 'One number' },
      { ok: password.length > 0 && password === confirm, label: 'Passwords match' },
    ],
    [password, confirm],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (requirements.some((r) => !r.ok)) {
      setError('Please meet all password requirements.');
      return;
    }
    setLoading(true);
    setError('');
    setCode(undefined);
    try {
      await api.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setCode(err.code);
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Reset failed');
      }
    } finally {
      setLoading(false);
    }
  }

  const invalidState =
    code === 'PASSWORD_RESET_INVALID' ||
    code === 'PASSWORD_RESET_USED' ||
    code === 'PASSWORD_RESET_EXPIRED' ||
    missingToken;

  return (
    <Layout>
      <div className="auth-card">
        <h1>Choose a new password</h1>
        {done ? (
          <div role="status" aria-live="polite">
            <Alert tone="success" message="Password updated. All other sessions were signed out." />
            <p className="form-footer">
              <Link to="/login">Sign in with your new password</Link>
            </p>
          </div>
        ) : invalidState && !loading ? (
          <div role="alert" aria-live="assertive">
            {missingToken && <Alert tone="error" message="This reset link is missing a token." />}
            {code === 'PASSWORD_RESET_USED' && (
              <Alert tone="error" message="This reset link has already been used." />
            )}
            {code === 'PASSWORD_RESET_EXPIRED' && (
              <Alert tone="error" message="This reset link has expired." />
            )}
            {code === 'PASSWORD_RESET_INVALID' && (
              <Alert tone="error" message="This reset link is invalid." />
            )}
            {error && !code && <Alert tone="error" message={error} />}
            <p className="form-footer">
              <Link to="/forgot-password">Request a new reset link</Link>
            </p>
          </div>
        ) : (
          <>
            {error && <Alert tone="error" message={error} />}
            <form onSubmit={(e) => void handleSubmit(e)} className="form-stack">
              <fieldset>
                <legend>Password requirements</legend>
                <ul className="password-reqs" aria-live="polite">
                  {requirements.map((r) => (
                    <li key={r.label} className={r.ok ? 'ok' : ''}>
                      {r.ok ? '✓' : '○'} {r.label}
                    </li>
                  ))}
                </ul>
              </fieldset>
              <label>
                New password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>
              <label>
                Confirm password
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
}
