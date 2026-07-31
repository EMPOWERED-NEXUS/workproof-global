import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { api } from '../lib/api';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing a token.');
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        await api.verifyEmail(token);
        if (!cancelled) {
          setStatus('success');
          setMessage('Your email is verified. You can now submit receipts for customer verification.');
        }
      } catch (err) {
        if (!cancelled) {
          setStatus('error');
          setMessage(err instanceof Error ? err.message : 'Verification failed.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Layout>
      <div className="auth-card" role="status" aria-live="polite">
        <h1>Email verification</h1>
        {status === 'loading' && <p className="subtitle">Confirming your email…</p>}
        {status === 'success' && <Alert tone="success" message={message} />}
        {status === 'error' && <Alert tone="error" message={message} />}
        <p className="form-footer">
          <Link to="/dashboard">Go to dashboard</Link>
          {' · '}
          <Link to="/profile">Account settings</Link>
        </p>
      </div>
    </Layout>
  );
}
