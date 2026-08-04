import { randomUUID } from "node:crypto";
import type {
  ConfirmationDecision,
  ConfirmationMethod,
  DurationUnit,
  ReceiptStatus,
  Visibility,
} from "../../generated/prisma/index.js";
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
import {
  buildShareConfirmationMessage,
  confirmationAssuranceLabel,
  confirmationChannelNote,
  formatDuration,
  resolveDurationInput,
  type ConfirmationMethod as SharedConfirmationMethod,
  type DurationUnit as SharedDurationUnit,
  type ReceiptCreateInput,
  type ReceiptUpdateInput,
} from "@workproof/shared";

function tokenExpiryForMethod(method: ConfirmationMethod): Date {
  if (method === "IN_PERSON_QR") {
    return new Date(Date.now() + env.IN_PERSON_QR_TOKEN_EXPIRY_MINUTES * 60 * 1000);
  }
  if (method === "SHARE_LINK") {
    return new Date(Date.now() + env.SHARE_LINK_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  }
  return new Date(Date.now() + env.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
}

function buildConfirmationUrl(rawToken: string): string {
  const base = env.WEB_APP_URL.replace(/\/+$/, "");
  return `${base}/verify/${rawToken}`;
}

function normalizeCustomerEmail(
  method: ConfirmationMethod,
  email: string | null | undefined,
): string | null {
  if (method === "EMAIL") {
    if (!email?.trim()) {
      throw AppError.badRequest("Customer email is required for email confirmation.");
    }
    return email.trim().toLowerCase();
  }
  if (email?.trim()) return email.trim().toLowerCase();
  return null;
}

const activeEvidence = { deletedAt: null as Date | null };

function mapDurationFields(input: {
  durationValue?: number | null;
  durationUnit?: SharedDurationUnit | null;
  durationMinutes?: number | null;
}) {
  try {
    const resolved = resolveDurationInput(input);
    return {
      durationValue: resolved.durationValue,
      durationUnit: resolved.durationUnit as DurationUnit | null,
      durationMinutes: resolved.durationMinutes,
    };
  } catch (error) {
    throw AppError.badRequest(error instanceof Error ? error.message : "Invalid duration.");
  }
}

function serializeReceipt(receipt: Record<string, unknown>) {
  const evidence = Array.isArray(receipt.evidence)
    ? (receipt.evidence as Array<Parameters<typeof serializeEvidenceSafe>[0]>).map(serializeEvidenceSafe)
    : receipt.evidence;
  const durationValue =
    receipt.durationValue != null ? Number(receipt.durationValue) : null;
  const durationUnit = (receipt.durationUnit as SharedDurationUnit | null | undefined) ?? null;
  const durationLabel =
    durationValue != null && durationUnit != null
      ? formatDuration(durationValue, durationUnit)
      : receipt.durationMinutes != null
        ? formatDuration(Number(receipt.durationMinutes), "MINUTE")
        : null;
  return {
    ...receipt,
    evidence,
    amount: receipt.amount != null ? Number(receipt.amount) : null,
    durationValue,
    durationUnit,
    durationLabel,
  };
}

export async function createReceipt(workerId: string, input: ReceiptCreateInput, ip?: string) {
  const duration = mapDurationFields(input);
  const confirmationMethod = (input.confirmationMethod ?? "EMAIL") as ConfirmationMethod;
  const customerEmail = normalizeCustomerEmail(confirmationMethod, input.customerEmail);
  const receipt = await prisma.workReceipt.create({
    data: {
      workerId,
      customerName: input.customerName,
      customerEmail,
      customerPhone: input.customerPhone,
      confirmationMethod,
      serviceTitle: input.serviceTitle,
      description: input.description,
      workDate: new Date(input.workDate),
      durationMinutes: duration.durationMinutes,
      durationValue: duration.durationValue,
      durationUnit: duration.durationUnit,
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
      ? {
          OR: [
            { serviceTitle: { contains: query.search, mode: "insensitive" as const } },
            { customerName: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
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

  const durationTouched =
    input.durationValue !== undefined ||
    input.durationUnit !== undefined ||
    input.durationMinutes !== undefined;
  const duration = durationTouched
    ? mapDurationFields({
        durationValue: input.durationValue,
        durationUnit: input.durationUnit,
        durationMinutes: input.durationMinutes,
      })
    : null;

  const nextMethod = (input.confirmationMethod ??
    receipt.confirmationMethod) as ConfirmationMethod;
  let nextEmail: string | null | undefined;
  if (input.customerEmail !== undefined || input.confirmationMethod !== undefined) {
    nextEmail = normalizeCustomerEmail(
      nextMethod,
      input.customerEmail !== undefined ? input.customerEmail : receipt.customerEmail,
    );
  }

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: {
      ...(input.customerName !== undefined ? { customerName: input.customerName } : {}),
      ...(nextEmail !== undefined ? { customerEmail: nextEmail } : {}),
      ...(input.customerPhone !== undefined ? { customerPhone: input.customerPhone } : {}),
      ...(input.confirmationMethod !== undefined
        ? { confirmationMethod: input.confirmationMethod as ConfirmationMethod }
        : {}),
      ...(input.serviceTitle !== undefined ? { serviceTitle: input.serviceTitle } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.workDate !== undefined ? { workDate: new Date(input.workDate) } : {}),
      ...(duration
        ? {
            durationMinutes: duration.durationMinutes,
            durationValue: duration.durationValue,
            durationUnit: duration.durationUnit,
          }
        : {}),
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

  const method = receipt.confirmationMethod;
  normalizeCustomerEmail(method, receipt.customerEmail);
  assertTransition(receipt.status, "PENDING_VERIFICATION");

  return issueConfirmationAttempt({
    worker,
    receipt,
    nextAttempt: (receipt.verificationRequests[0]?.attemptNumber ?? 0) + 1,
    fromStatus: receipt.status,
    eventType: receipt.status === "CORRECTION_REQUESTED" ? "resubmitted" : "submitted",
    emailJobType: "CUSTOMER_VERIFICATION",
    auditAction: "RECEIPT_SUBMITTED",
    ip,
    transitionToPending: true,
  });
}

async function issueConfirmationAttempt(input: {
  worker: { id: string; fullName: string };
  receipt: {
    id: string;
    customerName: string;
    customerEmail: string | null;
    confirmationMethod: ConfirmationMethod;
    serviceTitle: string;
    workDate: Date;
    status: ReceiptStatus;
  };
  nextAttempt: number;
  fromStatus: ReceiptStatus;
  eventType: string;
  emailJobType: "CUSTOMER_VERIFICATION" | "CUSTOMER_VERIFICATION_RESEND";
  auditAction: string;
  ip?: string;
  transitionToPending: boolean;
}) {
  const { worker, receipt } = input;
  const method = receipt.confirmationMethod;
  const customerEmail = normalizeCustomerEmail(method, receipt.customerEmail);
  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = tokenExpiryForMethod(method);
  const verificationRequestId = randomUUID();
  const confirmationUrl = buildConfirmationUrl(token);
  const shareMessage = buildShareConfirmationMessage({
    customerName: receipt.customerName,
    workerName: worker.fullName,
    confirmationUrl,
  });

  await prisma.$transaction(async (tx) => {
    await tx.verificationRequest.updateMany({
      where: { receiptId: receipt.id, usedAt: null, invalidatedAt: null },
      data: { invalidatedAt: new Date() },
    });

    await tx.verificationRequest.create({
      data: {
        id: verificationRequestId,
        receiptId: receipt.id,
        tokenHash,
        attemptNumber: input.nextAttempt,
        method,
        customerEmail,
        expiresAt,
      },
    });

    if (input.transitionToPending) {
      await tx.workReceipt.update({
        where: { id: receipt.id },
        data: { status: "PENDING_VERIFICATION", submittedAt: new Date() },
      });
    }

    const methodLabel =
      method === "EMAIL"
        ? "email"
        : method === "SHARE_LINK"
          ? "secure share link"
          : "in-person QR";

    await recordReceiptEvent(
      {
        receiptId: receipt.id,
        actorId: worker.id,
        actorType: "WORKER",
        eventType: input.eventType,
        fromStatus: input.fromStatus,
        toStatus: "PENDING_VERIFICATION",
        publicSummary:
          input.eventType === "resubmitted" || input.eventType === "verification_resent"
            ? `Confirmation link issued via ${methodLabel} (attempt ${input.nextAttempt}).`
            : `Submitted for customer confirmation via ${methodLabel} (attempt ${input.nextAttempt}).`,
        ipAddress: input.ip,
        metadata: { confirmationMethod: method, attemptNumber: input.nextAttempt },
      },
      tx,
    );

    if (method === "EMAIL" && customerEmail) {
      await enqueueEmailJob(
        {
          type: input.emailJobType,
          recipientEmail: customerEmail,
          recipientName: receipt.customerName,
          relatedUserId: worker.id,
          relatedReceiptId: receipt.id,
          relatedVerificationRequestId: verificationRequestId,
          payload: {
            kind: input.emailJobType,
            rawToken: token,
            receiptId: receipt.id,
            workerName: worker.fullName,
            serviceTitle: receipt.serviceTitle,
            workDate: receipt.workDate.toISOString().slice(0, 10),
            customerName: receipt.customerName,
            expiresAt: expiresAt.toISOString(),
            attemptNumber: input.nextAttempt,
          },
        },
        tx,
      );
    }
  });

  await createAuditLog({
    actorId: worker.id,
    receiptId: receipt.id,
    action: input.auditAction,
    entityType: "WorkReceipt",
    entityId: receipt.id,
    ipAddress: input.ip,
    metadata: { attemptNumber: input.nextAttempt, confirmationMethod: method },
  });

  const includeUrl = method !== "EMAIL" || env.ALLOW_DEV_VERIFICATION_TOKEN;
  return {
    confirmationMethod: method as SharedConfirmationMethod,
    expiresAt: expiresAt.toISOString(),
    attemptNumber: input.nextAttempt,
    deliveryQueued: method === "EMAIL",
    ...(includeUrl
      ? {
          confirmationUrl,
          shareMessage,
          ...(env.ALLOW_DEV_VERIFICATION_TOKEN ? { verificationToken: token } : {}),
        }
      : {}),
  };
}

/** Resend email or regenerate share/QR confirmation link. Revokes prior unused tokens. */
export async function resendCustomerVerification(workerId: string, receiptId: string, ip?: string) {
  const worker = await prisma.user.findUnique({ where: { id: workerId } });
  if (!worker) throw AppError.notFound("User not found.");

  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    include: { verificationRequests: { orderBy: { attemptNumber: "desc" }, take: 1 } },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.status !== "PENDING_VERIFICATION") {
    throw AppError.badRequest("Only pending confirmation receipts can regenerate a confirmation link.");
  }

  const latest = receipt.verificationRequests[0];
  if (latest) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    const cooldownMs = env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS * 1000;
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      throw AppError.badRequest(`Please wait ${remaining}s before regenerating the confirmation link.`, {
        cooldown: [`${remaining}`],
      });
    }
  }

  const result = await issueConfirmationAttempt({
    worker,
    receipt,
    nextAttempt: (latest?.attemptNumber ?? 0) + 1,
    fromStatus: "PENDING_VERIFICATION",
    eventType: "verification_resent",
    emailJobType: "CUSTOMER_VERIFICATION_RESEND",
    auditAction: "CUSTOMER_VERIFICATION_RESENT",
    ip,
    transitionToPending: false,
  });

  return {
    ...result,
    resendCooldownSeconds: env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS,
  };
}

/** Alias used by in-person QR / share-link UI. */
export const regenerateConfirmationLink = resendCustomerVerification;

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

  const durationValue = receipt.durationValue != null ? Number(receipt.durationValue) : null;
  const durationUnit = (receipt.durationUnit as SharedDurationUnit | null) ?? null;
  const durationLabel =
    durationValue != null && durationUnit != null
      ? formatDuration(durationValue, durationUnit)
      : receipt.durationMinutes != null
        ? formatDuration(receipt.durationMinutes, "MINUTE")
        : null;

  const confirmedMethod =
    (receipt.confirmedMethod as SharedConfirmationMethod | null) ??
    (receipt.status === "VERIFIED" ? ("EMAIL" as SharedConfirmationMethod) : null);
  const publicEvidence =
    receipt.status === "VERIFIED"
      ? receipt.evidence.filter((e) => e.visibility === "PUBLIC_PROOF")
      : [];

  return {
    receiptNumber: receipt.receiptNumber,
    workerName: receipt.worker.fullName,
    profileSlug: receipt.worker.workerProfile?.profileSlug ?? null,
    serviceTitle: receipt.serviceTitle,
    description: receipt.description,
    workDate: receipt.workDate,
    durationValue,
    durationUnit,
    durationLabel,
    skillsDemonstrated: receipt.skillsDemonstrated,
    verifiedAt: receipt.verifiedAt,
    verificationStatus: receipt.status,
    proofValidity,
    integrityHash: receipt.integrityHash,
    integrityVersion: receipt.integrityVersion,
    status: receipt.status,
    confirmedMethod,
    confirmationAssuranceLabel: confirmedMethod
      ? confirmationAssuranceLabel(confirmedMethod)
      : null,
    confirmationChannelNote: confirmedMethod ? confirmationChannelNote(confirmedMethod) : null,
    evidenceDisclosure:
      "Supporting evidence was supplied with this receipt. Evidence supports the work record but does not replace customer confirmation.",
    revokedAt: receipt.revokedAt,
    revocationReason:
      receipt.status === "REVOKED" ? (receipt.revocationReason ?? "Revoked by administrator.") : null,
    amount: showAmount && receipt.amount != null ? Number(receipt.amount) : null,
    currency: showAmount ? receipt.currency : null,
    evidence: publicEvidence.map((e) => ({
      type: e.type,
      description: e.description,
      linkPlatform: e.linkPlatform,
      filenameCategory: filenameCategory(e.mimeType, e.type),
      ...(e.type === "LINK" && allowPublicLinks
        ? { url: e.externalUrl ?? e.url ?? undefined }
        : {}),
    })),
    evidenceCount: publicEvidence.length,
  };
}

export async function applyVerificationDecision(input: {
  verificationRequestId: string;
  receiptId: string;
  attemptNumber: number;
  method: ConfirmationMethod;
  decision: ConfirmationDecision;
  customerName: string;
  customerEmail: string | null;
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
          method: input.method,
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
          confirmedMethod: input.method,
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
          publicSummary: confirmationAssuranceLabel(
            input.method as SharedConfirmationMethod,
          ),
          ipAddress: input.ipAddress,
          metadata: { confirmationMethod: input.method },
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
          method: input.method,
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
        method: input.method,
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
    method: latest.method,
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
