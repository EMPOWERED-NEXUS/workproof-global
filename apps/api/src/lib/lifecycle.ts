import type { ReceiptStatus } from "../../generated/prisma/index.js";
import { AppError } from "./errors.js";

/**
 * Wave 0B receipt lifecycle transition graph.
 *
 * ARCHIVED is never a target status. Use archivedAt for archival.
 *
 * Current (pre-0B) graph for reference:
 *   DRAFT -> PENDING_VERIFICATION | delete
 *   PENDING_VERIFICATION -> VERIFIED | CORRECTION_REQUESTED | DISPUTED
 *   CORRECTION_REQUESTED -> PENDING_VERIFICATION
 *   DISPUTED -> VERIFIED | CORRECTION_REQUESTED | REVOKED (admin)
 *   VERIFIED -> REVOKED (admin); any -> ARCHIVED (removed)
 */

const ALLOWED: Record<ReceiptStatus, ReceiptStatus[]> = {
  DRAFT: ["PENDING_VERIFICATION"],
  PENDING_VERIFICATION: ["VERIFIED", "CORRECTION_REQUESTED", "DISPUTED"],
  CORRECTION_REQUESTED: ["PENDING_VERIFICATION"],
  DISPUTED: ["VERIFIED", "CORRECTION_REQUESTED", "REVOKED"],
  VERIFIED: ["REVOKED", "DISPUTED"],
  REVOKED: [],
  ARCHIVED: [], // legacy only — no transitions from ARCHIVED in new code
};

export function assertTransition(from: ReceiptStatus, to: ReceiptStatus): void {
  if (to === "ARCHIVED") {
    throw AppError.badRequest("ARCHIVED is not a valid lifecycle status. Use archive instead.");
  }
  const allowed = ALLOWED[from] ?? [];
  if (!allowed.includes(to)) {
    throw AppError.badRequest(`Invalid receipt transition from ${from} to ${to}.`);
  }
}

export function canEditReceipt(status: ReceiptStatus, lockedAt: Date | null): boolean {
  if (lockedAt) return false;
  return status === "DRAFT" || status === "CORRECTION_REQUESTED";
}

export function canDeleteReceipt(status: ReceiptStatus): boolean {
  return status === "DRAFT";
}

export function canSubmitReceipt(status: ReceiptStatus): boolean {
  return status === "DRAFT" || status === "CORRECTION_REQUESTED";
}

export function canRevokeReceipt(status: ReceiptStatus): boolean {
  return status === "VERIFIED" || status === "DISPUTED";
}

export type ProofValidity =
  | "VALID"
  | "INVALID_REVOKED"
  | "UNDER_DISPUTE"
  | "CORRECTION_REQUIRED"
  | "UNAVAILABLE";

export function proofValidityForStatus(status: ReceiptStatus): ProofValidity {
  switch (status) {
    case "VERIFIED":
      return "VALID";
    case "REVOKED":
      return "INVALID_REVOKED";
    case "DISPUTED":
      return "UNDER_DISPUTE";
    case "CORRECTION_REQUESTED":
      return "CORRECTION_REQUIRED";
    default:
      return "UNAVAILABLE";
  }
}
