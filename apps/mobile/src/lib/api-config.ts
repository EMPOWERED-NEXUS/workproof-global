/**
 * Typed API configuration for the WorkProof Global mobile app.
 * Reads process.env.EXPO_PUBLIC_API_URL — never hardcode a local IP.
 */

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_URL =
  typeof rawApiUrl === 'string' ? rawApiUrl.trim().replace(/\/+$/, '') : '';

export const isApiConfigured = /^https?:\/\//i.test(API_URL);

if (__DEV__) {
  console.log('WorkProof API runtime', {
    rawApiUrl,
    API_URL,
    isApiConfigured,
  });
}

export { rawApiUrl };
