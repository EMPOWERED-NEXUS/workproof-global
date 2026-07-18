import type { ReceiptStatus, Visibility } from "../../generated/prisma/index.js";
import { AppError } from "../lib/errors.js";
import {
  computeIntegrityHash,
  generateReceiptNumber,
  generateVerificationCode,
  generateVerificationToken,
  hashToken,
} from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { createAuditLog } from "./audit.service.js";
import type { ReceiptCreateInput, ReceiptUpdateInput } from "@workproof/shared";

const EDITABLE_STATUSES: ReceiptStatus[] = ["DRAFT", "CORRECTION_REQUESTED"];

function serializeReceipt(receipt: Record<string, unknown>) {
  return {
    ...receipt,
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
    include: { evidence: true },
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
  },
) {
  const where = {
    workerId,
    ...(query.status ? { status: query.status } : {}),
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
      include: { evidence: true },
      orderBy: { [query.sortBy]: query.sortOrder },
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
    include: { evidence: true, confirmation: true, dispute: true, verificationRequest: true },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  return serializeReceipt(receipt as unknown as Record<string, unknown>);
}

export async function updateReceipt(
  workerId: string,
  receiptId: string,
  input: ReceiptUpdateInput,
  ip?: string,
) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!EDITABLE_STATUSES.includes(receipt.status)) {
    throw AppError.badRequest("Verified or locked receipts cannot be edited.");
  }
  if (receipt.lockedAt) {
    throw AppError.badRequest("This receipt is locked and cannot be edited.");
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
    include: { evidence: true },
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
  if (receipt.status !== "DRAFT") {
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

export async function addEvidence(
  workerId: string,
  receiptId: string,
  evidence: {
    type: "IMAGE" | "DOCUMENT" | "LINK";
    url: string;
    originalFilename?: string;
    mimeType?: string;
    size?: number;
    description?: string;
  },
  ip?: string,
) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!EDITABLE_STATUSES.includes(receipt.status)) {
    throw AppError.badRequest("Evidence cannot be added to a locked receipt.");
  }

  const created = await prisma.evidence.create({
    data: { receiptId, ...evidence },
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "EVIDENCE_ADDED",
    entityType: "Evidence",
    entityId: created.id,
    ipAddress: ip,
  });

  return created;
}

export async function removeEvidence(
  workerId: string,
  receiptId: string,
  evidenceId: string,
  ip?: string,
) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!EDITABLE_STATUSES.includes(receipt.status)) {
    throw AppError.badRequest("Evidence cannot be removed from a locked receipt.");
  }

  const evidence = await prisma.evidence.findFirst({ where: { id: evidenceId, receiptId } });
  if (!evidence) throw AppError.notFound("Evidence not found.");

  await prisma.evidence.delete({ where: { id: evidenceId } });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "EVIDENCE_REMOVED",
    entityType: "Evidence",
    entityId: evidenceId,
    ipAddress: ip,
  });
}

export async function submitReceipt(workerId: string, receiptId: string, ip?: string) {
  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    include: { verificationRequest: true },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.status !== "DRAFT" && receipt.status !== "CORRECTION_REQUESTED") {
    throw AppError.badRequest("Only draft or correction-requested receipts can be submitted.");
  }

  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + env.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  );

  await prisma.$transaction(async (tx) => {
    if (receipt.verificationRequest) {
      await tx.verificationRequest.delete({ where: { receiptId } });
    }
    await tx.verificationRequest.create({
      data: {
        receiptId,
        tokenHash,
        customerEmail: receipt.customerEmail,
        expiresAt,
      },
    });
    await tx.workReceipt.update({
      where: { id: receiptId },
      data: { status: "PENDING_VERIFICATION", submittedAt: new Date() },
    });
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "RECEIPT_SUBMITTED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: ip,
  });

  return { verificationToken: token, expiresAt: expiresAt.toISOString() };
}

export async function archiveReceipt(workerId: string, receiptId: string, ip?: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.status === "ARCHIVED") {
    throw AppError.badRequest("Receipt is already archived.");
  }

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: { status: "ARCHIVED" },
    include: { evidence: true },
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

export async function getPublicProof(verificationCode: string) {
  const receipt = await prisma.workReceipt.findUnique({
    where: { verificationCode },
    include: {
      evidence: true,
      confirmation: true,
      worker: { include: { workerProfile: true } },
    },
  });

  if (!receipt || receipt.status === "DRAFT" || receipt.status === "PENDING_VERIFICATION") {
    throw AppError.notFound("Proof not found or not yet verified.");
  }

  if (receipt.visibility === "PRIVATE") {
    throw AppError.notFound("This proof is not publicly available.");
  }

  const showAmount = receipt.visibility === "PUBLIC";

  return {
    receiptNumber: receipt.receiptNumber,
    workerName: receipt.worker.fullName,
    profileSlug: receipt.worker.workerProfile?.profileSlug ?? null,
    serviceTitle: receipt.serviceTitle,
    description: receipt.description,
    workDate: receipt.workDate,
    skillsDemonstrated: receipt.skillsDemonstrated,
    verifiedAt: receipt.verifiedAt,
    confirmationDecision: receipt.confirmation?.decision ?? null,
    integrityHash: receipt.integrityHash,
    status: receipt.status,
    amount: showAmount && receipt.amount != null ? Number(receipt.amount) : null,
    currency: showAmount ? receipt.currency : null,
    evidence: receipt.evidence.map((e) => ({
      type: e.type,
      description: e.description,
      ...(e.type === "LINK" ? { url: e.url } : {}),
    })),
  };
}

export async function confirmReceiptInternally(
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
) {
  const receipt = await prisma.workReceipt.findUnique({
    where: { id: receiptId },
    include: { evidence: true, verificationRequest: true },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");

  const now = new Date();

  if (input.decision === "CONFIRMED") {
    const verifiedCount = await prisma.workReceipt.count({ where: { status: "VERIFIED" } });
    const receiptNumber = receipt.receiptNumber ?? generateReceiptNumber(verifiedCount + 1);
    let verificationCode = receipt.verificationCode;
    if (!verificationCode) {
      let code = generateVerificationCode();
      while (await prisma.workReceipt.findUnique({ where: { verificationCode: code } })) {
        code = generateVerificationCode();
      }
      verificationCode = code;
    }

    const integrityPayload = {
      receiptNumber,
      workerId: receipt.workerId,
      serviceTitle: receipt.serviceTitle,
      workDate: receipt.workDate.toISOString().slice(0, 10),
      customerEmail: receipt.customerEmail,
      evidence: receipt.evidence.map((e) => ({
        id: e.id,
        type: e.type,
        url: e.url,
        mimeType: e.mimeType,
        size: e.size,
      })),
    };
    const integrityHash = computeIntegrityHash(integrityPayload);

    await prisma.$transaction(async (tx) => {
      await tx.confirmation.create({
        data: {
          receiptId,
          decision: "CONFIRMED",
          customerName: input.customerName,
          customerEmail: receipt.customerEmail,
          comment: input.comment,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });
      await tx.workReceipt.update({
        where: { id: receiptId },
        data: {
          status: "VERIFIED",
          receiptNumber,
          verificationCode,
          integrityHash,
          verifiedAt: now,
          lockedAt: now,
        },
      });
      if (receipt.verificationRequest) {
        await tx.verificationRequest.update({
          where: { receiptId },
          data: { usedAt: now },
        });
      }
    });

    await createAuditLog({
      receiptId,
      action: "RECEIPT_VERIFIED",
      entityType: "WorkReceipt",
      entityId: receiptId,
      ipAddress: input.ipAddress,
    });

    return { status: "VERIFIED" as const, verificationCode, integrityHash };
  }

  if (input.decision === "CORRECTION_REQUESTED") {
    await prisma.$transaction(async (tx) => {
      await tx.confirmation.create({
        data: {
          receiptId,
          decision: "CORRECTION_REQUESTED",
          customerName: input.customerName,
          customerEmail: receipt.customerEmail,
          comment: input.comment,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });
      await tx.workReceipt.update({
        where: { id: receiptId },
        data: { status: "CORRECTION_REQUESTED" },
      });
      if (receipt.verificationRequest) {
        await tx.verificationRequest.update({
          where: { receiptId },
          data: { usedAt: now },
        });
      }
    });

    await createAuditLog({
      receiptId,
      action: "CORRECTION_REQUESTED",
      entityType: "WorkReceipt",
      entityId: receiptId,
      ipAddress: input.ipAddress,
    });

    return { status: "CORRECTION_REQUESTED" as const };
  }

  await prisma.$transaction(async (tx) => {
    await tx.confirmation.create({
      data: {
        receiptId,
        decision: "DISPUTED",
        customerName: input.customerName,
        customerEmail: receipt.customerEmail,
        comment: input.comment,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
    await tx.dispute.create({
      data: {
        receiptId,
        reason: input.reason ?? "Customer dispute",
        description: input.description ?? input.comment ?? "Customer raised a dispute.",
      },
    });
    await tx.workReceipt.update({
      where: { id: receiptId },
      data: { status: "DISPUTED" },
    });
    if (receipt.verificationRequest) {
      await tx.verificationRequest.update({
        where: { receiptId },
        data: { usedAt: now },
      });
    }
  });

  await createAuditLog({
    receiptId,
    action: "RECEIPT_DISPUTED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    ipAddress: input.ipAddress,
  });

  return { status: "DISPUTED" as const };
}
