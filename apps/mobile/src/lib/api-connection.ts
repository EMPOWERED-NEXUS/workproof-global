import { API_URL, isApiConfigured } from '@/lib/api-config';

export type ApiConnectionStatus =
  | 'unconfigured'
  | 'checking'
  | 'connected'
  | 'unreachable';

/**
 * Single API connection checker for the mobile landing screen.
 */
export async function checkApiConnection(): Promise<ApiConnectionStatus> {
  if (!isApiConfigured) {
    return 'unconfigured';
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return 'unreachable';
    }

    const body = await response.json();

    return body?.success === true && body?.service === 'workproof-api'
      ? 'connected'
      : 'unreachable';
  } catch {
    return 'unreachable';
  } finally {
    clearTimeout(timeout);
  }
}
