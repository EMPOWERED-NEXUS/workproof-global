const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

/** Auth endpoints that must never trigger a session refresh attempt. */
const NO_REFRESH_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
]);

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiRequestError extends Error {
  readonly code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
}

export const SESSION_EXPIRED_MESSAGE = 'Your session expired. Please sign in again.';

type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;
let refreshInFlight: Promise<boolean> | null = null;

/** Register a callback invoked when cookie refresh fails (clears cached auth). */
export function setSessionExpiredHandler(handler: SessionExpiredHandler | null): void {
  sessionExpiredHandler = handler;
}

function normalizePath(path: string): string {
  const bare = path.split('?')[0] ?? path;
  return bare.endsWith('/') && bare.length > 1 ? bare.slice(0, -1) : bare;
}

function canAttemptRefresh(path: string): boolean {
  return !NO_REFRESH_PATHS.has(normalizePath(path));
}

function notifySessionExpired(): void {
  sessionExpiredHandler?.();
}

async function refreshAccessSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      let body: { success?: boolean } | null = null;
      try {
        body = (await res.json()) as { success?: boolean };
      } catch {
        body = null;
      }
      return res.ok && body?.success === true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  hasRetried = false,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (res.status === 401 && !hasRetried && canAttemptRefresh(path)) {
    // Drain the error body so the connection can be reused cleanly.
    try {
      await res.json();
    } catch {
      /* ignore */
    }

    const refreshed = await refreshAccessSession();
    if (refreshed) {
      return request<T>(path, options, true);
    }

    notifySessionExpired();
    throw new ApiRequestError(SESSION_EXPIRED_MESSAGE);
  }

  const body = (await res.json()) as ApiSuccess<T> | (ApiError & { code?: string });
  if (!res.ok || !body.success) {
    const err = body as ApiError & { code?: string };
    throw new ApiRequestError(err.message ?? 'Request failed', err.code);
  }
  return (body as ApiSuccess<T>).data;
}

/** Test-only helpers to reset refresh orchestration state between cases. */
export const __sessionRefreshTestUtils = {
  reset(): void {
    refreshInFlight = null;
    sessionExpiredHandler = null;
  },
  getRefreshInFlight(): Promise<boolean> | null {
    return refreshInFlight;
  },
};

export const api = {
  register: (data: object) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: object) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    request<{ reset: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
  me: () => request<UserProfile>('/auth/me'),
  getProfile: () => request<WorkerProfile>('/profile'),
  updateProfile: (data: object) => request<WorkerProfile>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  getPublicWorker: (slug: string) => request<PublicWorker>(`/workers/${slug}`),
  listReceipts: (query = '') => request<Paginated<Receipt>>(`/receipts${query}`),
  getReceipt: (id: string) => request<Receipt>(`/receipts/${id}`),
  createReceipt: (data: object) => request<Receipt>('/receipts', { method: 'POST', body: JSON.stringify(data) }),
  updateReceipt: (id: string, data: object) => request<Receipt>(`/receipts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReceipt: (id: string) => request<{ message: string }>(`/receipts/${id}`, { method: 'DELETE' }),
  submitReceipt: (id: string) => request<{ verificationToken?: string; expiresAt: string; attemptNumber: number; deliveryQueued?: boolean }>(`/receipts/${id}/submit`, { method: 'POST' }),
  resendCustomerVerification: (id: string) => request<{ expiresAt: string; attemptNumber: number; deliveryQueued?: boolean; resendCooldownSeconds?: number }>(`/receipts/${id}/resend-verification`, { method: 'POST' }),
  getVerificationDelivery: (id: string) => request<VerificationDelivery>(`/receipts/${id}/verification-delivery`),
  archiveReceipt: (id: string) => request<Receipt>(`/receipts/${id}/archive`, { method: 'POST' }),
  unarchiveReceipt: (id: string) => request<Receipt>(`/receipts/${id}/unarchive`, { method: 'POST' }),
  getReceiptEvents: (id: string) => request<ReceiptEvent[]>(`/receipts/${id}/events`),
  addEvidenceLink: (id: string, data: object) => request<Evidence>(`/receipts/${id}/evidence`, { method: 'POST', body: JSON.stringify(data) }),
  addEvidenceFile: async (id: string, file: File, description?: string) => {
    const form = new FormData();
    form.append('file', file);
    if (description) form.append('description', description);
    return request<Evidence>(`/receipts/${id}/evidence`, { method: 'POST', body: form });
  },
  removeEvidence: (id: string, evidenceId: string) => request<{ message: string }>(`/receipts/${id}/evidence/${evidenceId}`, { method: 'DELETE' }),
  downloadEvidenceUrl: (id: string, evidenceId: string) => `${API_BASE}/receipts/${id}/evidence/${evidenceId}/download`,
  getEmailVerificationStatus: () => request<EmailVerificationStatus>('/auth/email-verification-status'),
  resendEmailVerification: () => request<{ sent: boolean; cooldownSeconds: number }>('/auth/resend-email-verification', { method: 'POST' }),
  verifyEmail: (token: string) => request<{ verified: boolean; verifiedAt: string }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  workerDashboard: () => request<WorkerDashboard>('/dashboard/worker'),
  orgDashboard: () => request<OrganisationDashboard>('/dashboard/organisation'),
  getVerification: (token: string) => request<VerificationView>(`/verification/${token}`),
  respondVerification: (token: string, data: object) => request<{ status: string; verificationCode?: string }>(`/verification/${token}/respond`, { method: 'POST', body: JSON.stringify(data) }),
  getPublicProof: (code: string) => request<PublicProof>(`/public/receipts/${code}`),
  adminUsers: (query = '') => request<Paginated<AdminUser>>(`/admin/users${query}`),
  adminReceipts: (query = '') => request<Paginated<AdminReceipt>>(`/admin/receipts${query}`),
  adminDisputes: (query = '') => request<Paginated<Dispute>>(`/admin/disputes${query}`),
  adminSetUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') =>
    request<AdminUser>(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  adminRevokeReceipt: (id: string, reason: string) =>
    request<Receipt>(`/admin/receipts/${id}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  adminResolveDispute: (
    id: string,
    data: { resolution: string; receiptStatus: 'VERIFIED' | 'REVOKED' | 'CORRECTION_REQUESTED' },
  ) =>
    request<Dispute>(`/admin/disputes/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export type UserRole = 'WORKER' | 'ORGANISATION' | 'ADMIN';
export type ReceiptStatus = 'DRAFT' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'CORRECTION_REQUESTED' | 'DISPUTED' | 'REVOKED' | 'ARCHIVED';
export type ProofValidity = 'VALID' | 'INVALID_REVOKED' | 'UNDER_DISPUTE' | 'CORRECTION_REQUIRED' | 'UNAVAILABLE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
  emailVerified?: boolean;
  emailVerifiedAt?: string | null;
}

export interface UserProfile extends User {
  workerProfile?: WorkerProfile | null;
  organisation?: Organisation | null;
}

export interface EmailVerificationStatus {
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  resendAvailableInSeconds: number;
  resendCooldownSeconds: number;
}

export interface VerificationDelivery {
  status: string | null;
  lastAttemptedAt: string | null;
  sentAt: string | null;
  attemptCount: number;
  resendAvailable: boolean;
  resendAvailableInSeconds: number;
  verificationAttemptNumber: number;
}

export interface WorkerProfile {
  id: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  phone?: string | null;
  skills: string[];
  profileSlug: string;
}

export interface PublicWorker {
  fullName: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  skills: string[];
  profileSlug: string;
}

export interface Organisation {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  location?: string | null;
}

export interface Evidence {
  id: string;
  type: string;
  description?: string | null;
  originalFilename?: string | null;
  safeFilename?: string | null;
  mimeType?: string | null;
  size?: number | null;
  checksumSha256?: string | null;
  filenameCategory?: string;
  externalUrl?: string | null;
  url?: string | null;
}

export interface Receipt {
  id: string;
  receiptNumber?: string | null;
  serviceTitle: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  workDate: string;
  durationMinutes?: number | null;
  amount?: number | null;
  currency: string;
  skillsDemonstrated: string[];
  status: ReceiptStatus;
  visibility: string;
  verificationCode?: string | null;
  integrityHash?: string | null;
  integrityVersion?: number | null;
  archivedAt?: string | null;
  revokedAt?: string | null;
  revocationReason?: string | null;
  verificationAttemptCount?: number;
  proofValidity?: ProofValidity;
  evidence?: Evidence[];
  confirmations?: Array<{ attemptNumber: number; decision: string; confirmedAt: string; comment?: string | null }>;
  dispute?: { reason: string; status: string } | null;
}

export interface ReceiptEvent {
  id: string;
  eventType: string;
  actorType: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  publicSummary?: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface WorkerDashboard {
  totalReceipts: number;
  verifiedReceipts: number;
  pendingReceipts: number;
  disputedReceipts: number;
  verificationRate: number;
  repeatCustomerCount: number;
  recentReceipts: Receipt[];
  skillsDemonstrated: string[];
  monthlyActivity: { month: string; count: number }[];
  totalVerifiedIncome: number;
  currency: string;
}

export interface OrganisationDashboard {
  organisation: Organisation;
  note: string;
  accessNote?: string;
  workerCount: number;
  assignedWorkers?: Array<{ fullName: string; profileSlug: string; skills: string[] }>;
  verifiedReceiptCount: number;
}

export interface VerificationView {
  serviceTitle: string;
  description: string;
  workDate: string;
  workerName: string;
  customerName: string;
  skillsDemonstrated: string[];
  evidenceCount: number;
  status: ReceiptStatus;
  expiresAt: string;
}

export interface PublicProof {
  receiptNumber?: string | null;
  workerName: string;
  profileSlug?: string | null;
  serviceTitle: string;
  description: string;
  workDate: string;
  skillsDemonstrated: string[];
  verifiedAt?: string | null;
  verificationStatus: ReceiptStatus;
  proofValidity: ProofValidity;
  integrityHash?: string | null;
  integrityVersion?: number | null;
  status: ReceiptStatus;
  revokedAt?: string | null;
  revocationReason?: string | null;
  amount?: number | null;
  currency?: string | null;
  evidence: { type: string; description?: string | null; url?: string }[];
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: string;
}

export interface AdminReceipt extends Receipt {
  worker?: { fullName: string; email: string };
}

export interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  receipt?: { serviceTitle: string; worker?: { fullName: string } };
}

export function formatXaf(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
}

export function statusLabel(status: ReceiptStatus): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
