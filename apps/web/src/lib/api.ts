const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || !body.success) {
    throw new Error((body as ApiError).message ?? 'Request failed');
  }
  return (body as ApiSuccess<T>).data;
}

export const api = {
  register: (data: object) => request<{ user: User; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: object) => request<{ user: User; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  me: () => request<UserProfile>('/auth/me'),
  getProfile: () => request<WorkerProfile>('/profile'),
  updateProfile: (data: object) => request<WorkerProfile>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  getPublicWorker: (slug: string) => request<PublicWorker>(`/workers/${slug}`),
  listReceipts: (query = '') => request<Paginated<Receipt>>(`/receipts${query}`),
  getReceipt: (id: string) => request<Receipt>(`/receipts/${id}`),
  createReceipt: (data: object) => request<Receipt>('/receipts', { method: 'POST', body: JSON.stringify(data) }),
  updateReceipt: (id: string, data: object) => request<Receipt>(`/receipts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteReceipt: (id: string) => request<{ message: string }>(`/receipts/${id}`, { method: 'DELETE' }),
  submitReceipt: (id: string) => request<{ verificationToken: string; expiresAt: string; attemptNumber: number }>(`/receipts/${id}/submit`, { method: 'POST' }),
  archiveReceipt: (id: string) => request<Receipt>(`/receipts/${id}/archive`, { method: 'POST' }),
  unarchiveReceipt: (id: string) => request<Receipt>(`/receipts/${id}/unarchive`, { method: 'POST' }),
  getReceiptEvents: (id: string) => request<ReceiptEvent[]>(`/receipts/${id}/events`),
  addEvidenceLink: (id: string, data: object) => request<Evidence>(`/receipts/${id}/evidence`, { method: 'POST', body: JSON.stringify(data) }),
  workerDashboard: () => request<WorkerDashboard>('/dashboard/worker'),
  orgDashboard: () => request<OrganisationDashboard>('/dashboard/organisation'),
  getVerification: (token: string) => request<VerificationView>(`/verification/${token}`),
  respondVerification: (token: string, data: object) => request<{ status: string; verificationCode?: string }>(`/verification/${token}/respond`, { method: 'POST', body: JSON.stringify(data) }),
  getPublicProof: (code: string) => request<PublicProof>(`/public/receipts/${code}`),
  adminUsers: () => request<Paginated<AdminUser>>('/admin/users'),
  adminReceipts: () => request<Paginated<Receipt>>('/admin/receipts'),
  adminDisputes: () => request<Paginated<Dispute>>('/admin/disputes'),
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
}

export interface UserProfile extends User {
  workerProfile?: WorkerProfile | null;
  organisation?: Organisation | null;
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
  url: string;
  description?: string | null;
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
  workerCount: number;
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

export interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  receipt?: { serviceTitle: string };
}

export function formatXaf(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
}

export function statusLabel(status: ReceiptStatus): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
