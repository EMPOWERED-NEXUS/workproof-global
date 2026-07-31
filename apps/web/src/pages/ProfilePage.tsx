import { useEffect, useState } from 'react';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { useAuth } from '../hooks/use-auth';
import { api, type EmailVerificationStatus, type WorkerProfile } from '../lib/api';

export default function ProfilePage() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailVerificationStatus | null>(null);
  const [form, setForm] = useState({ headline: '', bio: '', location: '', phone: '', skills: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    void Promise.all([api.getProfile(), api.getEmailVerificationStatus()])
      .then(([p, s]) => {
        setProfile(p);
        setEmailStatus(s);
        setForm({
          headline: p.headline ?? '',
          bio: p.bio ?? '',
          location: p.location ?? '',
          phone: p.phone ?? '',
          skills: p.skills.join(', '),
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load profile'));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setProfile(updated);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    try {
      await api.resendEmailVerification();
      setEmailStatus(await api.getEmailVerificationStatus());
      setMessage('Verification email sent.');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resend failed');
    } finally {
      setResending(false);
    }
  }

  return (
    <Layout>
      <EmailVerificationBanner />
      <PageHeader title="Your work profile" subtitle={profile ? `Public slug: /workers/${profile.profileSlug}` : ''} />
      {error && <Alert tone="error" message={error} />}
      {message && <Alert tone="success" message={message} />}

      {emailStatus && (
        <section className="card section-card" aria-live="polite">
          <h2>Email verification</h2>
          <p>
            {emailStatus.emailVerified
              ? `Verified${emailStatus.emailVerifiedAt ? ` on ${new Date(emailStatus.emailVerifiedAt).toLocaleString()}` : ''}.`
              : 'Not verified yet. You can create drafts now; submitting for customer verification requires a verified email.'}
          </p>
          {!emailStatus.emailVerified && (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={resending || emailStatus.resendAvailableInSeconds > 0}
              onClick={() => void handleResend()}
            >
              {emailStatus.resendAvailableInSeconds > 0
                ? `Resend available in ${emailStatus.resendAvailableInSeconds}s`
                : resending
                  ? 'Sending…'
                  : 'Resend verification email'}
            </button>
          )}
        </section>
      )}

      <form onSubmit={(e) => void handleSave(e)} className="card form-stack wide-form">
        <label>Headline<input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></label>
        <label>Bio<textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} /></label>
        <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
        <label>Phone (private — not shown on public profile)<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label>Skills<input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></label>
        <button type="submit" className="btn btn-primary">Save profile</button>
      </form>
    </Layout>
  );
}
