import { buildCanonicalProofUrl, getCanonicalWebOrigin } from './api';

export { buildCanonicalProofUrl, getCanonicalWebOrigin };

export function buildCanonicalWorkerUrl(profileSlug: string): string {
  const slug = profileSlug.replace(/^\/+|\/+$/g, '');
  return `${getCanonicalWebOrigin()}/workers/${slug}`;
}
