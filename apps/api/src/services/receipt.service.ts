import { randomUUID } from "node:crypto";
import type { ConfirmationDecision, ReceiptStatus, Visibility } from "../../generated/prisma/index.js";
import { AppError } from "../lib/errors.js";
import {
  generateVerificationCode,
  generateVerificationToken,
  hashToken,
} from "../lib/crypto.js";
import {
  INTEGRITY_VERSION,
  buildIntegrityPayload,
  computeIntegrityHashV1,
} from "../lib/integrity.js";
import {
  assertTransition,
  canDeleteReceipt,
  canEditReceipt,
  canRevokeReceipt,
  canSubmitReceipt,
  proofValidityForStatus,
} from "../lib/lifecycle.js";
import { allocateReceiptNumber } from "../lib/receipt-number.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { enqueueEmailJob } from "../email/outbox.service.js";
import { filenameCategory } from "../lib/file-validation.js";
import { createAuditLog } from "./audit.service.js";
import { serializeEvidenceSafe } from "./evidence.service.js";
import { recordReceiptEvent } from "./receipt-event.service.js";
import type { ReceiptCreateInput, ReceiptUpdateInput } from "@workproof/shared";

const activeEvidence = { deletedAt: null as Date | null };

function serializeReceipt(receipt: Record<string, unknown>) {
  const evidence = Array.isArray(receipt.evidence)
    ? (receipt.evidence as Array<Parameters<typeof serializeEvidenceSafe>[0]>).map(serializeEvidenceSafe)
    : receipt.evidence;
  return {
    ...receipt,
    evidence,
    amount: receipt.amount != null ? Number(receipt.amount) : null,
  };
}

export async function createReceipt(workerId: string, input: ReceiptCreateInput, ip?: string) {
  const receipt = await prisma.workReceipt.create({
    data: {
      workerId,
      customerName: input.customerName,
      customerEmail: input.customerEmail.toLowerCase(),
      customerPhone: input.customerPhone,
      serviceTitle: input.serviceTitle,
      description: input.description,
      workDate: new Date(input.workDate),
      durationMinutes: input.durationMinutes,
      amount: input.amount,
      currency: input.currency ?? "XAF",
      skillsDemonstrated: input.skillsDemonstrated ?? [],
      visibility: (input.visibility ?? "PRIVATE") as Visibility,
    },
    include: { evidence: { where: activeEvidence }, confirmations: true, verificationRequests: true },
  });

  await recordReceiptEvent({
    receiptId: receipt.id,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "created",
    toStatus: "DRAFT",
    publicSummary: "Receipt draft created.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: workerId,
    receiptId: receipt.id,
    action: "RECEIPT_CREATED",
    entityType: "WorkReceipt",
    entityId: receipt.id,
    ipAddress: ip,
  });

  return serializeReceipt(receipt as unknown as Record<string, unknown>);
}

export async function listReceipts(
  workerId: string,
  query: {
    status?: ReceiptStatus;
    search?: string;
    skill?: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
    sortBy: "workDate" | "createdAt" | "serviceTitle";
    sortOrder: "asc" | "desc";
    archived?: "true" | "false" | "all";
  },
) {
  const archived = query.archived ?? "false";
  const where = {
    workerId,
    ...(query.status && query.status !== "ARCHIVED" ? { status: query.status } : {}),
    ...(archived === "true"
      ? { archivedAt: { not: null } }
      : archived === "false"
        ? { archivedAt: null }
        : {}),
    ...(query.search
      ? { serviceTitle: { contains: query.search, mode: "insensitive" as const } }
      : {}),
    ...(query.skill ? { skillsDemonstrated: { has: query.skill } } : {}),
    ...(query.fromDate || query.toDate
      ? {
          workDate: {
            ...(query.fromDate ? { gte: new Date(query.fromDate) } : {}),
            ...(query.toDate ? { lte: new Date(query.toDate) } : {}),
          },
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.workReceipt.count({ where }),
    prisma.workReceipt.findMany({
      where,
      include: { evidence: { where: activeEvidence } },
      orderBy: [{ [query.sortBy]: query.sortOrder }, { id: "asc" }],
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return {
    items: items.map((r) => serializeReceipt(r as unknown as Record<string, unknown>)),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

export async function getReceiptForWorker(workerId: string, receiptId: string) {
  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    include: {
      evidence: { where: activeEvidence },
      confirmations: { orderBy: { attemptNumber: "asc" } },
      dispute: true,
      verificationRequests: { orderBy: { attemptNumber: "asc" } },
    },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");

  const attemptCount = receipt.verificationRequests.length;
  return serializeReceipt({
    ...(receipt as unknown as Record<string, unknown>),
    verificationAttemptCount: attemptCount,
    proofValidity: proofValidityForStatus(receipt.status),
  });
}

export async function updateReceipt(
  workerId: string,
  receiptId: string,
  input: ReceiptUpdateInput,
  ip?: string,
) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!canEditReceipt(receipt.status, receipt.lockedAt)) {
    throw AppError.badRequest("Verified or locked receipts cannot be edited.");
  }

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: {
      ...(input.customerName !== undefined ? { customerName: input.customerName } : {}),
      ...(input.customerEmail !== undefined
        ? { customerEmail: input.customerEmail.toLowerCase() }
        : {}),
      ...(input.customerPhone !== undefined ? { customerPhone: input.customerPhone } : {}),
      ...(input.serviceTitle !== undefined ? { serviceTitle: input.serviceTitle } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.workDate !== undefined ? { workDate: new Date(input.workDate) } : {}),
      ...(input.durationMinutes !== undefined ? { durationMinutes: input.durationMinutes } : {}),
      ...(input.amount !== undefined ? { amount: input.amount } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.skillsDemonstrated !== undefined
        ? { skillsDemonstrated: input.skillsDemonstrated }
        : {}),
      ...(input.visibility !== undefined
        ? { visibility: input.visibility as Visibility }
        : {}),
    },
    include: { evidence: { where: activeEvidence } },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "edited",
    fromStatus: receipt.status,
    toStatus: receipt.status,
    publicSummary: "Receipt details updated.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "RECEIPT_UPDATED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
  });

  return serializeReceipt(updated as unknown as Record<string, unknown>);
}

export async function deleteReceipt(workerId: string, receiptId: string, ip?: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!canDeleteReceipt(receipt.status)) {
    throw AppError.badRequest("Only draft receipts can be deleted.");
  }

  await prisma.workReceipt.delete({ where: { id: receiptId } });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "RECEIPT_DELETED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
  });
}

export async function submitReceipt(workerId: string, receiptId: string, ip?: string) {
  const worker = await prisma.user.findUnique({ where: { id: workerId } });
  if (!worker) throw AppError.notFound("User not found.");
  if (!worker.emailVerifiedAt) {
    throw AppError.badRequest(
      "Verify your email before submitting a receipt for customer verification.",
      undefined,
      "EMAIL_VERIFICATION_REQUIRED",
    );
  }

  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    include: { verificationRequests: { orderBy: { attemptNumber: "desc" }, take: 1 } },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!canSubmitReceipt(receipt.status)) {
    throw AppError.badRequest("Only draft or correction-requested receipts can be submitted.");
  }

  assertTransition(receipt.status, "PENDING_VERIFICATION");

  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + env.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  );
  const nextAttempt = (receipt.verificationRequests[0]?.attemptNumber ?? 0) + 1;
  const fromStatus = receipt.status;
  const eventType = fromStatus === "CORRECTION_REQUESTED" ? "resubmitted" : "submitted";
  const verificationRequestId = randomUUID();

  await prisma.$transaction(async (tx) => {
    await tx.verificationRequest.updateMany({
      where: {
        receiptId,
        usedAt: null,
        invalidatedAt: null,
      },
      data: { invalidatedAt: new Date() },
    });

    await tx.verificationRequest.create({
      data: {
        id: verificationRequestId,
        receiptId,
        tokenHash,
        attemptNumber: nextAttempt,
        customerEmail: receipt.customerEmail,
        expiresAt,
      },
    });

    await tx.workReceipt.update({
      where: { id: receiptId },
      data: { status: "PENDING_VERIFICATION", submittedAt: new Date() },
    });

    await recordReceiptEvent(
      {
        receiptId,
        actorId: workerId,
        actorType: "WORKER",
        eventType,
        fromStatus,
        toStatus: "PENDING_VERIFICATION",
        publicSummary:
          eventType === "resubmitted"
            ? `Resubmitted for verification (attempt ${nextAttempt}).`
            : `Submitted for customer verification (attempt ${nextAttempt}).`,
        ipAddress: ip,
      },
      tx,
    );

    await enqueueEmailJob(
      {
        type: "CUSTOMER_VERIFICATION",
        recipientEmail: receipt.customerEmail,
        recipientName: receipt.customerName,
        relatedUserId: workerId,
        relatedReceiptId: receiptId,
        relatedVerificationRequestId: verificationRequestId,
        payload: {
          kind: "CUSTOMER_VERIFICATION",
          rawToken: token,
          receiptId,
          workerName: worker.fullName,
          serviceTitle: receipt.serviceTitle,
          workDate: receipt.workDate.toISOString().slice(0, 10),
          customerName: receipt.customerName,
          expiresAt: expiresAt.toISOString(),
          attemptNumber: nextAttempt,
        },
      },
      tx,
    );
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "RECEIPT_SUBMITTED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
    metadata: { attemptNumber: nextAttempt },
  });

  return {
    ...(env.ALLOW_DEV_VERIFICATION_TOKEN ? { verificationToken: token } : {}),
    expiresAt: expiresAt.toISOString(),
    attemptNumber: nextAttempt,
    deliveryQueued: true,
  };
}

export async function resendCustomerVerification(workerId: string, receiptId: string, ip?: string) {
  const worker = await prisma.user.findUnique({ where: { id: workerId } });
  if (!worker) throw AppError.notFound("User not found.");

  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    include: { verificationRequests: { orderBy: { attemptNumber: "desc" }, take: 1 } },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.status !== "PENDING_VERIFICATION") {
    throw AppError.badRequest("Only pending verification receipts can resend the customer email.");
  }

  const latest = receipt.verificationRequests[0];
  if (latest) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    const cooldownMs = env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS * 1000;
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      throw AppError.badRequest(`Please wait ${remaining}s before resending verification.`, {
        cooldown: [`${remaining}`],
      });
    }
  }

  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + env.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  );
  const nextAttempt = (latest?.attemptNumber ?? 0) + 1;
  const verificationRequestId = randomUUID();

  await prisma.$transaction(async (tx) => {
    await tx.verificationRequest.updateMany({
      where: { receiptId, usedAt: null, invalidatedAt: null },
      data: { invalidatedAt: new Date() },
    });

    await tx.verificationRequest.create({
      data: {
        id: verificationRequestId,
        receiptId,
        tokenHash,
        attemptNumber: nextAttempt,
        customerEmail: receipt.customerEmail,
        expiresAt,
      },
    });

    await recordReceiptEvent(
      {
        receiptId,
        actorId: workerId,
        actorType: "WORKER",
        eventType: "verification_resent",
        fromStatus: "PENDING_VERIFICATION",
        toStatus: "PENDING_VERIFICATION",
        publicSummary: `Customer verification email resent (attempt ${nextAttempt}).`,
        ipAddress: ip,
      },
      tx,
    );

    await enqueueEmailJob(
      {
        type: "CUSTOMER_VERIFICATION_RESEND",
        recipientEmail: receipt.customerEmail,
        recipientName: receipt.customerName,
        relatedUserId: workerId,
        relatedReceiptId: receiptId,
        relatedVerificationRequestId: verificationRequestId,
        payload: {
          kind: "CUSTOMER_VERIFICATION_RESEND",
          rawToken: token,
          receiptId,
          workerName: worker.fullName,
          serviceTitle: receipt.serviceTitle,
          workDate: receipt.workDate.toISOString().slice(0, 10),
          customerName: receipt.customerName,
          expiresAt: expiresAt.toISOString(),
          attemptNumber: nextAttempt,
        },
      },
      tx,
    );
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "CUSTOMER_VERIFICATION_RESENT",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
    metadata: { attemptNumber: nextAttempt },
  });

  return {
    ...(env.ALLOW_DEV_VERIFICATION_TOKEN ? { verificationToken: token } : {}),
    expiresAt: expiresAt.toISOString(),
    attemptNumber: nextAttempt,
    deliveryQueued: true,
    resendCooldownSeconds: env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS,
  };
}

export async function getVerificationDeliveryStatus(workerId: string, receiptId: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");

  const latestJob = await prisma.emailOutbox.findFirst({
    where: {
      relatedReceiptId: receiptId,
      type: { in: ["CUSTOMER_VERIFICATION", "CUSTOMER_VERIFICATION_RESEND"] },
    },
    orderBy: { createdAt: "desc" },
  });

  const latestRequest = await prisma.verificationRequest.findFirst({
    where: { receiptId },
    orderBy: { attemptNumber: "desc" },
  });

  let resendAvailableInSeconds = 0;
  if (latestRequest && receipt.status === "PENDING_VERIFICATION") {
    const elapsed = Date.now() - latestRequest.createdAt.getTime();
    const cooldownMs = env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS * 1000;
    resendAvailableInSeconds = Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
  }

  return {
    status: latestJob?.status ?? null,
    lastAttemptedAt: latestJob?.claimedAt?.toISOString() ?? latestJob?.updatedAt.toISOString() ?? null,
    sentAt: latestJob?.sentAt?.toISOString() ?? null,
    attemptCount: latestJob?.attemptCount ?? 0,
    resendAvailable: receipt.status === "PENDING_VERIFICATION" && resendAvailableInSeconds === 0,
    resendAvailableInSeconds,
    verificationAttemptNumber: latestRequest?.attemptNumber ?? 0,
  };
}

export async function archiveReceipt(workerId: string, receiptId: string, ip?: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.archivedAt) {
    throw AppError.badRequest("Receipt is already archived.");
  }

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: { archivedAt: new Date() },
    include: { evidence: { where: activeEvidence } },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "archived",
    fromStatus: receipt.status,
    toStatus: receipt.status,
    publicSummary: "Receipt archived.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "RECEIPT_ARCHIVED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
  });

  return serializeReceipt(updated as unknown as Record<string, unknown>);
}

export async function unarchiveReceipt(workerId: string, receiptId: string, ip?: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!receipt.archivedAt) {
    throw AppError.badRequest("Receipt is not archived.");
  }

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: { archivedAt: null },
    include: { evidence: { where: activeEvidence } },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "unarchived",
    fromStatus: receipt.status,
    toStatus: receipt.status,
    publicSummary: "Receipt restored from archive.",
    ipAddress: ip,
  });

  return serializeReceipt(updated as unknown as Record<string, unknown>);
}

export async function getPublicProof(verificationCode: string) {
  const receipt = await prisma.workReceipt.findUnique({
    where: { verificationCode },
    include: {
      evidence: { where: activeEvidence },
      worker: { include: { workerProfile: true } },
    },
  });

  if (!receipt) {
    throw AppError.notFound("Proof not found.");
  }

  if (receipt.status === "DRAFT" || receipt.status === "PENDING_VERIFICATION") {
    throw AppError.notFound("Proof not found or not yet verified.");
  }

  if (receipt.visibility === "PRIVATE") {
    throw AppError.notFound("This proof is not publicly available.");
  }

  // CORRECTION_REQUESTED with a prior code: accessible but not valid proof
  const proofValidity = proofValidityForStatus(receipt.status);
  const showAmount = receipt.visibility === "PUBLIC" && receipt.status === "VERIFIED";
  const allowPublicLinks = receipt.visibility === "PUBLIC" || receipt.visibility === "UNLISTED";

  return {
    receiptNumber: receipt.receiptNumber,
    workerName: receipt.worker.fullName,
    profileSlug: receipt.worker.workerProfile?.profileSlug ?? null,
    serviceTitle: receipt.serviceTitle,
    description: receipt.description,
    workDate: receipt.workDate,
    skillsDemonstrated: receipt.skillsDemonstrated,
    verifiedAt: receipt.verifiedAt,
    verificationStatus: receipt.status,
    proofValidity,
    integrityHash: receipt.integrityHash,
    integrityVersion: receipt.integrityVersion,
    status: receipt.status,
    revokedAt: receipt.revokedAt,
    revocationReason:
      receipt.status === "REVOKED" ? (receipt.revocationReason ?? "Revoked by administrator.") : null,
    amount: showAmount && receipt.amount != null ? Number(receipt.amount) : null,
    currency: showAmount ? receipt.currency : null,
    evidence:
      receipt.status === "VERIFIED"
        ? receipt.evidence.map((e) => ({
            type: e.type,
            description: e.description,
            filenameCategory: filenameCategory(e.mimeType, e.type),
            ...(e.type === "LINK" && allowPublicLinks
              ? { url: e.externalUrl ?? e.url ?? undefined }
              : {}),
          }))
        : [],
    evidenceCount: receipt.status === "VERIFIED" ? receipt.evidence.length : 0,
  };
}

export async function applyVerificationDecision(input: {
  verificationRequestId: string;
  receiptId: string;
  attemptNumber: number;
  decision: ConfirmationDecision;
  customerName: string;
  customerEmail: string;
  comment?: string;
  reason?: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const receipt = await tx.workReceipt.findUnique({
      where: { id: input.receiptId },
      include: { evidence: { where: activeEvidence } },
    });
    if (!receipt) throw AppError.notFound("Receipt not found.");
    if (receipt.status !== "PENDING_VERIFICATION") {
      throw AppError.badRequest("Receipt is not awaiting verification.");
    }

    const confirmationId = randomUUID();

    if (input.decision === "CONFIRMED") {
      assertTransition("PENDING_VERIFICATION", "VERIFIED");
      const receiptNumber =
        receipt.receiptNumber ?? (await allocateReceiptNumber(tx));
      let verificationCode = receipt.verificationCode;
      if (!verificationCode) {
        let code = generateVerificationCode();
        while (await tx.workReceipt.findUnique({ where: { verificationCode: code } })) {
          code = generateVerificationCode();
        }
        verificationCode = code;
      }

      const verifiedAtIso = now.toISOString();
      const integrityPayload = buildIntegrityPayload({
        receiptId: receipt.id,
        receiptNumber,
        workerId: receipt.workerId,
        serviceTitle: receipt.serviceTitle,
        workDate: receipt.workDate.toISOString().slice(0, 10),
        skillsDemonstrated: receipt.skillsDemonstrated,
        amount: receipt.amount != null ? Number(receipt.amount) : null,
        currency: receipt.currency,
        evidence: receipt.evidence.map((e) => ({
          id: e.id,
          type: e.type,
          mimeType: e.mimeType,
          size: e.size,
        })),
        confirmationId,
        verifiedAt: verifiedAtIso,
      });
      const integrityHash = computeIntegrityHashV1(integrityPayload);

      await tx.confirmation.create({
        data: {
          id: confirmationId,
          receiptId: input.receiptId,
          verificationRequestId: input.verificationRequestId,
          attemptNumber: input.attemptNumber,
          decision: "CONFIRMED",
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          comment: input.comment,
          confirmedAt: now,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });

      await tx.verificationRequest.update({
        where: { id: input.verificationRequestId },
        data: { usedAt: now, result: "CONFIRMED" },
      });

      await tx.workReceipt.update({
        where: { id: input.receiptId },
        data: {
          status: "VERIFIED",
          receiptNumber,
          verificationCode,
          integrityHash,
          integrityVersion: INTEGRITY_VERSION,
          verifiedAt: now,
          lockedAt: now,
        },
      });

      await recordReceiptEvent(
        {
          receiptId: input.receiptId,
          actorType: "CUSTOMER",
          eventType: "verified",
          fromStatus: "PENDING_VERIFICATION",
          toStatus: "VERIFIED",
          publicSummary: "Customer confirmed the work. Receipt verified.",
          ipAddress: input.ipAddress,
        },
        tx,
      );

      return { status: "VERIFIED" as const, verificationCode, integrityHash };
    }

    if (input.decision === "CORRECTION_REQUESTED") {
      assertTransition("PENDING_VERIFICATION", "CORRECTION_REQUESTED");
      await tx.confirmation.create({
        data: {
          id: confirmationId,
          receiptId: input.receiptId,
          verificationRequestId: input.verificationRequestId,
          attemptNumber: input.attemptNumber,
          decision: "CORRECTION_REQUESTED",
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          comment: input.comment,
          confirmedAt: now,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });
      await tx.verificationRequest.update({
        where: { id: input.verificationRequestId },
        data: { usedAt: now, result: "CORRECTION_REQUESTED" },
      });
      await tx.workReceipt.update({
        where: { id: input.receiptId },
        data: { status: "CORRECTION_REQUESTED" },
      });
      await recordReceiptEvent(
        {
          receiptId: input.receiptId,
          actorType: "CUSTOMER",
          eventType: "correction_requested",
          fromStatus: "PENDING_VERIFICATION",
          toStatus: "CORRECTION_REQUESTED",
          publicSummary: "Customer requested a correction.",
          ipAddress: input.ipAddress,
        },
        tx,
      );
      return { status: "CORRECTION_REQUESTED" as const };
    }

    assertTransition("PENDING_VERIFICATION", "DISPUTED");
    await tx.confirmation.create({
      data: {
        id: confirmationId,
        receiptId: input.receiptId,
        verificationRequestId: input.verificationRequestId,
        attemptNumber: input.attemptNumber,
        decision: "DISPUTED",
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        comment: input.comment,
        confirmedAt: now,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
    await tx.verificationRequest.update({
      where: { id: input.verificationRequestId },
      data: { usedAt: now, result: "DISPUTED" },
    });

    const existingDispute = await tx.dispute.findUnique({ where: { receiptId: input.receiptId } });
    if (existingDispute) {
      await tx.dispute.update({
        where: { id: existingDispute.id },
        data: {
          reason: input.reason ?? "Customer dispute",
          description: input.description ?? input.comment ?? "Customer raised a dispute.",
          status: "OPEN",
          resolution: null,
          resolvedAt: null,
          resolvedById: null,
          openedAt: now,
        },
      });
    } else {
      await tx.dispute.create({
        data: {
          receiptId: input.receiptId,
          reason: input.reason ?? "Customer dispute",
          description: input.description ?? input.comment ?? "Customer raised a dispute.",
        },
      });
    }

    await tx.workReceipt.update({
      where: { id: input.receiptId },
      data: { status: "DISPUTED" },
    });
    await recordReceiptEvent(
      {
        receiptId: input.receiptId,
        actorType: "CUSTOMER",
        eventType: "disputed",
        fromStatus: "PENDING_VERIFICATION",
        toStatus: "DISPUTED",
        publicSummary: "Customer disputed the work receipt.",
        ipAddress: input.ipAddress,
      },
      tx,
    );
    return { status: "DISPUTED" as const };
  });
}

/** @deprecated Use applyVerificationDecision via verification.service */
export const confirmReceiptInternally = async (
  receiptId: string,
  input: {
    decision: "CONFIRMED" | "CORRECTION_REQUESTED" | "DISPUTED";
    customerName: string;
    comment?: string;
    reason?: string;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
  },
) => {
  // Fallback path kept for compatibility — prefer atomic claim flow.
  const latest = await prisma.verificationRequest.findFirst({
    where: { receiptId, invalidatedAt: null },
    orderBy: { attemptNumber: "desc" },
  });
  if (!latest) throw AppError.notFound("Verification request not found.");
  return applyVerificationDecision({
    verificationRequestId: latest.id,
    receiptId,
    attemptNumber: latest.attemptNumber,
    decision: input.decision,
    customerName: input.customerName,
    customerEmail: latest.customerEmail,
    comment: input.comment,
    reason: input.reason,
    description: input.description,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  });
};

export { canRevokeReceipt };
