import { AppError } from "../lib/errors.js";
import { hashToken } from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { applyVerificationDecision } from "./receipt.service.js";
import { createAuditLog } from "./audit.service.js";
import type { VerificationRespondInput } from "@workproof/shared";

export async function getVerificationByToken(token: string) {
  const tokenHash = hashToken(token);
  const request = await prisma.verificationRequest.findFirst({
    where: { tokenHash },
    include: {
      receipt: {
        include: { evidence: true, worker: { select: { fullName: true } } },
      },
    },
  });

  if (!request) throw AppError.notFound("Verification link is invalid or expired.");
  if (request.invalidatedAt) {
    throw AppError.badRequest("This verification link is no longer valid.");
  }
  if (request.usedAt) throw AppError.badRequest("This verification link has already been used.");
  if (request.expiresAt < new Date()) {
    throw AppError.badRequest("This verification link has expired.");
  }
  // GET must not claim or consume the token.
  if (request.receipt.status !== "PENDING_VERIFICATION") {
    throw AppError.badRequest("This receipt is not awaiting verification.");
  }

  const { receipt } = request;
  return {
    serviceTitle: receipt.serviceTitle,
    description: receipt.description,
    workDate: receipt.workDate,
    workerName: receipt.worker.fullName,
    customerName: receipt.customerName,
    skillsDemonstrated: receipt.skillsDemonstrated,
    evidenceCount: receipt.evidence.length,
    status: receipt.status,
    expiresAt: request.expiresAt,
    attemptNumber: request.attemptNumber,
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
      throw AppError.notFound("Verification link is invalid or expired.");
    }
    if (existing.invalidatedAt) {
      throw AppError.badRequest("This verification link is no longer valid.");
    }
    if (existing.usedAt) {
      throw AppError.badRequest("This verification link has already been used.");
    }
    if (existing.expiresAt < now) {
      throw AppError.badRequest("This verification link has expired.");
    }
    if (existing.claimedAt) {
      throw AppError.badRequest("This verification link is already being processed.");
    }
    if (existing.receipt.status !== "PENDING_VERIFICATION") {
      throw AppError.badRequest("This receipt is not awaiting verification.");
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
      throw AppError.badRequest("This verification link could not be claimed.");
    }

    return existing;
  });

  try {
    const result = await applyVerificationDecision({
      verificationRequestId: claimed.id,
      receiptId: claimed.receiptId,
      attemptNumber: claimed.attemptNumber,
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
      metadata: { attemptNumber: claimed.attemptNumber, decision: input.decision },
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
