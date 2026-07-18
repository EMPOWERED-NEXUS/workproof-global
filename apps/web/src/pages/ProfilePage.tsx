import { useEffect, useState } from 'react';
import { Layout, PageHeader, Alert } from '../components/Layout';
import { api, type WorkerProfile } from '../lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [form, setForm] = useState({ headline: '', bio: '', location: '', phone: '', skills: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getProfile().then((p) => {
      setProfile(p);
      setForm({
        headline: p.headline ?? '',
        bio: p.bio ?? '',
        location: p.location ?? '',
        phone: p.phone ?? '',
        skills: p.skills.join(', '),
      });
    }).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load profile'));
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

  return (
    <Layout>
      <PageHeader title="Your work profile" subtitle={profile ? `Public slug: /workers/${profile.profileSlug}` : ''} />
      {error && <Alert tone="error" message={error} />}
      {message && <Alert tone="success" message={message} />}
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
