import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { api, type EmailVerificationStatus } from '../lib/api';
import { Alert } from './Layout';

export function EmailVerificationBanner() {
  const { user, refresh } = useAuth();
  const [status, setStatus] = useState<EmailVerificationStatus | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.emailVerified) {
      setStatus(null);
      return;
    }
    let cancelled = false;
    void api.getEmailVerificationStatus().then((s) => {
      if (!cancelled) setStatus(s);
    }).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user || user.emailVerified || !status || status.emailVerified) return null;

  async function handleResend() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await api.resendEmailVerification();
      const next = await api.getEmailVerificationStatus();
      setStatus(next);
      setMessage('Verification email sent. Check your inbox.');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="email-banner" role="status" aria-live="polite">
      <Alert
        tone="info"
        message="Verify your email to submit receipts for customer verification. You can still complete your profile and create drafts."
      />
      {message && <Alert tone="success" message={message} />}
      {error && <Alert tone="error" message={error} />}
      <div className="action-row">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={loading || status.resendAvailableInSeconds > 0}
          onClick={() => void handleResend()}
        >
          {status.resendAvailableInSeconds > 0
            ? `Resend available in ${status.resendAvailableInSeconds}s`
            : loading
              ? 'Sending…'
              : 'Resend verification email'}
        </button>
        <Link to="/profile" className="btn btn-ghost">Account status</Link>
      </div>
    </div>
  );
}
