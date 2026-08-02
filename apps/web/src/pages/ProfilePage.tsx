import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { EmailVerificationBanner } from '../components/EmailVerificationBanner';
import { CopyButton, LiveRegion } from '../components/ui';
import { useAuth } from '../hooks/use-auth';
import { api, type EmailVerificationStatus, type WorkerProfile } from '../lib/api';

export default function ProfilePage() {
  const { refresh } = useAuth();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailVerificationStatus | null>(null);
  const [form, setForm] = useState({ headline: '', bio: '', location: '', phone: '', skillInput: '' });
  const [skills, setSkills] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);

  const publicUrl = useMemo(() => {
    if (!profile) return '';
    return `${window.location.origin}/workers/${profile.profileSlug}`;
  }, [profile]);

  useEffect(() => {
    void Promise.all([api.getProfile(), api.getEmailVerificationStatus()])
      .then(([p, s]) => {
        setProfile(p);
        setEmailStatus(s);
        setSkills(p.skills);
        setForm({
          headline: p.headline ?? '',
          bio: p.bio ?? '',
          location: p.location ?? '',
          phone: p.phone ?? '',
          skillInput: '',
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load profile'));
  }, []);

  function addSkill() {
    const next = form.skillInput.trim();
    if (!next) return;
    if (skills.some((s) => s.toLowerCase() === next.toLowerCase())) {
      setForm({ ...form, skillInput: '' });
      return;
    }
    setSkills([...skills, next]);
    setForm({ ...form, skillInput: '' });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const updated = await api.updateProfile({
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        phone: form.phone,
        skills,
      });
      setProfile(updated);
      setSkills(updated.skills);
      setMessage('Profile saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSaving(false);
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
      <LiveRegion message={message || error} politeness={error ? 'assertive' : 'polite'} />
      <PageHeader title="Your work profile" subtitle="Control what others can see about your work" />
      {error && (
        <Alert tone="error" message={error} />
      )}
      {message && <Alert tone="success" message={message} />}
      {error && (
        <div className="action-row">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setError('');
              void api
                .getProfile()
                .then((p) => {
                  setProfile(p);
                  setSkills(p.skills);
                })
                .catch((e) => setError(e instanceof Error ? e.message : 'Retry failed'));
            }}
          >
            Retry load
          </button>
        </div>
      )}

      {profile && (
        <section className="card section-card">
          <h2>Public profile link</h2>
          <p className="verify-link">{publicUrl}</p>
          <div className="action-row">
            <CopyButton value={publicUrl} label="Copy public profile link" />
            <Link to={`/workers/${profile.profileSlug}`} className="btn btn-secondary btn-sm">
              View public profile
            </Link>
          </div>
        </section>
      )}

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
        <label>
          Headline
          <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </label>
        <label>
          Bio
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} />
        </label>
        <label>
          Location
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <span className="hint">
            Private by default — phone numbers are not shown on your public profile page.
          </span>
        </label>
        <div>
          <span className="hint" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Skills
          </span>
          <div className="skill-chip-row" aria-live="polite">
            {skills.map((skill) => (
              <span key={skill} className="skill-chip">
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => setSkills(skills.filter((s) => s !== skill))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <label>
              Add skill
              <input
                value={form.skillInput}
                onChange={(e) => setForm({ ...form, skillInput: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
            </label>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={addSkill}>
                Add skill
              </button>
            </div>
          </div>
        </div>
        <p className="hint">
          Income and receipt amounts appear on public proof only when you choose visibility settings that
          allow them. They are never used for lending or credit scoring.
        </p>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save profile'}
        </button>
      </form>

      <section className="card section-card">
        <h2>Account deletion</h2>
        <p>
          Automated account deletion is not available in this release. To request deletion or
          pseudonymisation of your account, email{' '}
          <a href="mailto:support@empowerednexus.com">support@empowerednexus.com</a> from your registered
          address and describe the request. We will confirm the consequences before proceeding.
        </p>
        <Link to="/support" className="btn btn-secondary">
          Request account deletion via Support
        </Link>
      </section>
    </Layout>
  );
}
