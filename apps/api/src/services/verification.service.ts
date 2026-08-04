import { AppError } from "../lib/errors.js";
import { hashToken } from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { applyVerificationDecision } from "./receipt.service.js";
import { createAuditLog } from "./audit.service.js";
import { serializeEvidenceSafe } from "./evidence.service.js";
import {
  confirmationAssuranceLabel,
  confirmationChannelNote,
  formatDuration,
  type DurationUnit,
  type VerificationRespondInput,
} from "@workproof/shared";

function tokenStateError(request: {
  invalidatedAt: Date | null;
  usedAt: Date | null;
  expiresAt: Date;
  receipt: { status: string; archivedAt: Date | null };
}): never {
  if (request.receipt.archivedAt) {
    throw AppError.badRequest("This receipt is archived and can no longer be confirmed.", undefined, "ARCHIVED");
  }
  if (request.invalidatedAt) {
    throw AppError.badRequest("This confirmation link has been revoked.", undefined, "REVOKED_TOKEN");
  }
  if (request.usedAt) {
    throw AppError.badRequest("This confirmation link has already been used.", undefined, "USED_TOKEN");
  }
  if (request.expiresAt < new Date()) {
    throw AppError.badRequest("This confirmation link has expired.", undefined, "EXPIRED_TOKEN");
  }
  if (request.receipt.status === "DISPUTED") {
    throw AppError.badRequest("This receipt is under dispute.", undefined, "DISPUTED");
  }
  if (request.receipt.status === "CORRECTION_REQUESTED") {
    throw AppError.badRequest(
      "A correction was requested. The worker must resubmit before confirmation can continue.",
      undefined,
      "CORRECTION_REQUESTED",
    );
  }
  if (request.receipt.status !== "PENDING_VERIFICATION") {
    throw AppError.badRequest("This receipt is not awaiting confirmation.", undefined, "INVALID_STATE");
  }
  throw AppError.badRequest("This confirmation link is no longer valid.", undefined, "INVALID_TOKEN");
}

export async function getVerificationByToken(token: string) {
  const tokenHash = hashToken(token);
  const request = await prisma.verificationRequest.findFirst({
    where: { tokenHash },
    include: {
      receipt: {
        include: {
          evidence: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
          worker: {
            select: {
              fullName: true,
              workerProfile: { select: { profileSlug: true } },
            },
          },
        },
      },
    },
  });

  if (!request) throw AppError.notFound("Confirmation link is invalid or expired.");

  // GET must not claim or consume the token — but surface distinct professional states.
  if (
    request.invalidatedAt ||
    request.usedAt ||
    request.expiresAt < new Date() ||
    request.receipt.status !== "PENDING_VERIFICATION" ||
    request.receipt.archivedAt
  ) {
    tokenStateError(request);
  }

  const { receipt } = request;
  const durationValue = receipt.durationValue != null ? Number(receipt.durationValue) : null;
  const durationUnit = (receipt.durationUnit as DurationUnit | null) ?? null;
  const durationLabel =
    durationValue != null && durationUnit != null
      ? formatDuration(durationValue, durationUnit)
      : receipt.durationMinutes != null
        ? formatDuration(receipt.durationMinutes, "MINUTE")
        : null;

  const method = request.method;
  const evidence = receipt.evidence.map((item) => ({
    ...serializeEvidenceSafe(item),
    // Customer may download file evidence for this receipt using the same confirmation token.
    canDownload: item.type !== "LINK",
  }));

  return {
    serviceTitle: receipt.serviceTitle,
    description: receipt.description,
    workDate: receipt.workDate,
    workerName: receipt.worker.fullName,
    profileSlug: receipt.worker.workerProfile?.profileSlug ?? null,
    customerName: receipt.customerName,
    amount: receipt.amount != null ? Number(receipt.amount) : null,
    currency: receipt.currency,
    skillsDemonstrated: receipt.skillsDemonstrated,
    evidenceCount: evidence.length,
    evidence,
    evidenceDisclosure:
      "Supporting evidence was supplied with this receipt. Evidence supports the work record but does not replace customer confirmation.",
    status: receipt.status,
    expiresAt: request.expiresAt,
    attemptNumber: request.attemptNumber,
    durationLabel,
    confirmationMethod: method,
    confirmationMethodLabel:
      method === "EMAIL"
        ? "Confirmed through email link"
        : method === "SHARE_LINK"
          ? "Confirmed through secure share link"
          : "Confirmed in person",
    confirmationAssurancePreview: confirmationAssuranceLabel(method),
    confirmationChannelNote: confirmationChannelNote(method),
    privacyNote:
      "Your confirmation becomes portable proof for this work. Customer contact details are not shown on the public proof page.",
  };
}

export async function respondToVerification(
  token: string,
  input: VerificationRespondInput,
  meta: { ipAddress?: string; userAgent?: string },
) {
  if (input.decision === "DISPUTED" && !input.description && !input.comment) {
    throw AppError.badRequest("Please provide a dispute description.");
  }

  const tokenHash = hashToken(token);
  const now = new Date();

  const claimed = await prisma.$transaction(async (tx) => {
    const existing = await tx.verificationRequest.findFirst({
      where: { tokenHash },
      include: { receipt: true },
    });

    if (!existing) {
      throw AppError.notFound("Confirmation link is invalid or expired.");
    }
    if (
      existing.invalidatedAt ||
      existing.usedAt ||
      existing.expiresAt < now ||
      existing.receipt.status !== "PENDING_VERIFICATION" ||
      existing.receipt.archivedAt
    ) {
      tokenStateError(existing);
    }
    if (existing.claimedAt) {
      throw AppError.badRequest("This confirmation link is already being processed.", undefined, "CLAIMED");
    }

    const claimResult = await tx.verificationRequest.updateMany({
      where: {
        id: existing.id,
        tokenHash,
        claimedAt: null,
        usedAt: null,
        invalidatedAt: null,
        expiresAt: { gt: now },
      },
      data: { claimedAt: now },
    });

    if (claimResult.count !== 1) {
      throw AppError.badRequest("This confirmation link could not be claimed.", undefined, "CLAIM_CONFLICT");
    }

    return existing;
  });

  try {
    const result = await applyVerificationDecision({
      verificationRequestId: claimed.id,
      receiptId: claimed.receiptId,
      attemptNumber: claimed.attemptNumber,
      method: claimed.method,
      decision: input.decision,
      customerName: input.customerName,
      customerEmail: claimed.customerEmail,
      comment: input.comment,
      reason: input.reason,
      description: input.description,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });

    await createAuditLog({
      receiptId: claimed.receiptId,
      action: `RECEIPT_${result.status}`,
      entityType: "WorkReceipt",
      entityId: claimed.receiptId,
      ipAddress: meta.ipAddress,
      metadata: {
        attemptNumber: claimed.attemptNumber,
        decision: input.decision,
        confirmationMethod: claimed.method,
      },
    });

    return result;
  } catch (error) {
    // Roll back claim so a failed transaction can be retried with a fresh request path.
    await prisma.verificationRequest.updateMany({
      where: { id: claimed.id, usedAt: null },
      data: { claimedAt: null },
    });
    throw error;
  }
}
