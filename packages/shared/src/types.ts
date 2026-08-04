export const USER_ROLES = ["WORKER", "ORGANISATION", "ADMIN"] as const;
export const RECEIPT_STATUSES = [
  "DRAFT",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "CORRECTION_REQUESTED",
  "DISPUTED",
  "REVOKED",
  "ARCHIVED", // legacy compatibility only — use archivedAt
] as const;

export const PROOF_VALIDITIES = [
  "VALID",
  "INVALID_REVOKED",
  "UNDER_DISPUTE",
  "CORRECTION_REQUIRED",
  "UNAVAILABLE",
] as const;
export const VISIBILITY_OPTIONS = ["PRIVATE", "UNLISTED", "PUBLIC"] as const;
export const EVIDENCE_TYPES = ["IMAGE", "DOCUMENT", "LINK"] as const;
export const CONFIRMATION_DECISIONS = ["CONFIRMED", "CORRECTION_REQUESTED", "DISPUTED"] as const;
export { DURATION_UNITS, type DurationUnit } from "./duration.js";
export {
  CONFIRMATION_METHODS,
  EVIDENCE_VISIBILITY,
  LINK_PLATFORMS,
  type ConfirmationMethod,
  type EvidenceVisibility,
  type LinkPlatform,
} from "./confirmation.js";

export type UserRole = (typeof USER_ROLES)[number];
export type ReceiptStatus = (typeof RECEIPT_STATUSES)[number];
export type Visibility = (typeof VISIBILITY_OPTIONS)[number];
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];
export type ConfirmationDecision = (typeof CONFIRMATION_DECISIONS)[number];

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}
