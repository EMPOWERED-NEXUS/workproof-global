import { AppError } from "../lib/errors.js";
import { hashToken, timingSafeCompare } from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { confirmReceiptInternally } from "./receipt.service.js";
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
  if (request.usedAt) throw AppError.badRequest("This verification link has already been used.");
  if (request.expiresAt < new Date()) {
    throw AppError.badRequest("This verification link has expired.");
  }

  if (!timingSafeCompare(request.tokenHash, tokenHash)) {
    throw AppError.notFound("Verification link is invalid.");
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
  };
}

export async function respondToVerification(
  token: string,
  input: VerificationRespondInput,
  meta: { ipAddress?: string; userAgent?: string },
) {
  const tokenHash = hashToken(token);
  const request = await prisma.verificationRequest.findFirst({
    where: { tokenHash },
    include: { receipt: true },
  });

  if (!request) throw AppError.notFound("Verification link is invalid or expired.");
  if (request.usedAt) throw AppError.badRequest("This verification link has already been used.");
  if (request.expiresAt < new Date()) {
    throw AppError.badRequest("This verification link has expired.");
  }

  if (input.decision === "DISPUTED" && !input.description && !input.comment) {
    throw AppError.badRequest("Please provide a dispute description.");
  }

  return confirmReceiptInternally(request.receiptId, {
    decision: input.decision,
    customerName: input.customerName,
    comment: input.comment,
    reason: input.reason,
    description: input.description,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });
}
