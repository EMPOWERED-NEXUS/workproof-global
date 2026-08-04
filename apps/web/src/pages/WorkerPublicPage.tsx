import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Alert } from '../components/Layout';
import { Skeleton } from '../components/ui';
import { api, type PublicWorker } from '../lib/api';

export default function WorkerPublicPage() {
  const { profileSlug } = useParams();
  const [worker, setWorker] = useState<PublicWorker | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileSlug) return;
    setLoading(true);
    api
      .getPublicWorker(profileSlug)
      .then(setWorker)
      .catch((e) => setError(e instanceof Error ? e.message : 'Profile not found'))
      .finally(() => setLoading(false));
  }, [profileSlug]);

  return (
    <Layout>
      {error && <Alert tone="error" message={error} />}
      {loading && !error && <Skeleton rows={3} />}
      {worker && (
        <article className="card profile-public">
          <p className="eyebrow">Public worker profile</p>
          <h1>{worker.fullName}</h1>
          {worker.headline && <p className="subtitle">{worker.headline}</p>}
          {worker.location && <p className="muted">{worker.location}</p>}
          {worker.bio && <p>{worker.bio}</p>}
          {worker.skills.length > 0 && (
            <div className="skill-tags">
              {worker.skills.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          )}
          <p className="disclaimer">
            Contact details and income are never shown on public profiles.
          </p>
        </article>
      )}
    </Layout>
  );
}
