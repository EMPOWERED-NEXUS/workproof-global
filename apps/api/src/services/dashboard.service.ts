import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { generateVerificationCode } from "../lib/crypto.js";
import { assertTransition, canRevokeReceipt } from "../lib/lifecycle.js";
import { allocateReceiptNumber } from "../lib/receipt-number.js";
import {
  INTEGRITY_VERSION,
  buildIntegrityPayload,
  computeIntegrityHashV1,
} from "../lib/integrity.js";
import { createAuditLog } from "./audit.service.js";
import { recordReceiptEvent } from "./receipt-event.service.js";
import type { ReceiptStatus, UserStatus } from "../../generated/prisma/index.js";

export async function getWorkerDashboard(workerId: string) {
  const receipts = await prisma.workReceipt.findMany({
    where: { workerId },
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
  });

  const active = receipts.filter((r) => !r.archivedAt);
  const verified = active.filter((r) => r.status === "VERIFIED");
  const pending = active.filter((r) =>
    ["PENDING_VERIFICATION", "CORRECTION_REQUESTED"].includes(r.status),
  );
  const disputed = active.filter((r) => r.status === "DISPUTED");
  const revoked = active.filter((r) => r.status === "REVOKED");

  const repeatCustomers = verified.reduce((acc, r) => {
    const key = (r.customerEmail ?? r.customerName).toLowerCase();
    acc.set(key, (acc.get(key) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());
  const repeatCustomerCount = [...repeatCustomers.values()].filter((c) => c > 1).length;

  const skills = new Set<string>();
  for (const r of receipts) {
    for (const s of r.skillsDemonstrated) skills.add(s);
  }

  const monthlyMap = new Map<string, number>();
  for (const r of active) {
    const key = `${r.workDate.getFullYear()}-${String(r.workDate.getMonth() + 1).padStart(2, "0")}`;
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
  }

  const totalVerifiedIncome = verified.reduce(
    (sum, r) => sum + (r.amount ? Number(r.amount) : 0),
    0,
  );

  return {
    totalReceipts: receipts.length,
    verifiedReceipts: verified.length,
    pendingReceipts: pending.length,
    disputedReceipts: disputed.length,
    revokedReceipts: revoked.length,
    uniqueCustomers: repeatCustomers.size,
    repeatCustomerCount,
    verificationRate:
      active.length > 0 ? Math.round((verified.length / active.length) * 100) : 0,
    recentReceipts: active.slice(0, 5).map((r) => ({
      id: r.id,
      serviceTitle: r.serviceTitle,
      status: r.status,
      workDate: r.workDate,
      amount: r.amount != null ? Number(r.amount) : null,
      currency: r.currency,
      archivedAt: r.archivedAt,
    })),
    skillsDemonstrated: [...skills],
    monthlyActivity: [...monthlyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count })),
    totalVerifiedIncome,
    currency: "XAF",
  };
}

export async function getOrganisationDashboard(ownerId: string) {
  const org = await prisma.organisation.findUnique({ where: { ownerId } });
  if (!org) throw AppError.notFound("Organisation profile not found.");

  // Privacy containment: until worker assignments exist, never return platform-wide data.
  return {
    organisation: org,
    note: "No workers are assigned to this programme yet.",
    accessNote:
      "Organisation programme access is invitation-based. Worker assignment and membership management will be enabled in a post-launch wave.",
    workerCount: 0,
    assignedWorkers: [] as Array<{ fullName: string; profileSlug: string; skills: string[] }>,
    verifiedReceiptCount: 0,
  };
}

export async function listAdminUsers(
  page = 1,
  limit = 20,
  filters: { search?: string; status?: "ACTIVE" | "SUSPENDED"; role?: "WORKER" | "ORGANISATION" | "ADMIN" } = {},
) {
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.search
      ? {
          OR: [
            { email: { contains: filters.search, mode: "insensitive" as const } },
            { fullName: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);
  return { items: users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

export async function listAdminReceipts(
  page = 1,
  limit = 20,
  filters: {
    search?: string;
    status?:
      | "DRAFT"
      | "PENDING_VERIFICATION"
      | "VERIFIED"
      | "CORRECTION_REQUESTED"
      | "DISPUTED"
      | "REVOKED";
  } = {},
) {
  const where = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.search
      ? {
          OR: [
            { serviceTitle: { contains: filters.search, mode: "insensitive" as const } },
            { customerName: { contains: filters.search, mode: "insensitive" as const } },
            { receiptNumber: { contains: filters.search, mode: "insensitive" as const } },
            { worker: { fullName: { contains: filters.search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };
  const [total, items] = await Promise.all([
    prisma.workReceipt.count({ where }),
    prisma.workReceipt.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { worker: { select: { fullName: true, email: true } } },
    }),
  ]);
  return {
    items: items.map((r) => ({
      ...r,
      amount: r.amount != null ? Number(r.amount) : null,
      worker: r.worker,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function listAdminDisputes(page = 1, limit = 20) {
  const [total, items] = await Promise.all([
    prisma.dispute.count(),
    prisma.dispute.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { openedAt: "desc" },
      include: {
        receipt: {
          select: { serviceTitle: true, worker: { select: { fullName: true } } },
        },
      },
    }),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
}

export async function updateUserStatus(
  adminId: string,
  userId: string,
  status: UserStatus,
  ip?: string,
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: { id: true, email: true, fullName: true, role: true, status: true },
  });

  if (status === "SUSPENDED") {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  await createAuditLog({
    actorId: adminId,
    action: "USER_STATUS_UPDATED",
    entityType: "User",
    entityId: userId,
    metadata: { status },
    ipAddress: ip,
  });

  return user;
}

export async function revokeReceipt(adminId: string, receiptId: string, reason: string, ip?: string) {
  const receipt = await prisma.workReceipt.findUnique({ where: { id: receiptId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (receipt.status === "REVOKED") {
    throw AppError.badRequest("Receipt is already revoked.");
  }
  if (!canRevokeReceipt(receipt.status)) {
    throw AppError.badRequest("Only verified or disputed receipts can be revoked.");
  }
  assertTransition(receipt.status, "REVOKED");

  const now = new Date();
  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: {
      status: "REVOKED",
      revokedAt: now,
      revokedById: adminId,
      revocationReason: reason,
    },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: adminId,
    actorType: "ADMIN",
    eventType: "revoked",
    fromStatus: receipt.status,
    toStatus: "REVOKED",
    publicSummary: "Receipt revoked. Not valid proof.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: adminId,
    receiptId,
    action: "RECEIPT_REVOKED",
    entityType: "WorkReceipt",
    entityId: receiptId,
    metadata: { reason },
    ipAddress: ip,
  });

  return updated;
}

/**
 * Admin dispute resolution.
 * Decision: when resolving to VERIFIED, compute integrity hash only if missing
 * (dispute typically precedes first verification). Existing locked hashes are preserved.
 */
export async function resolveDispute(
  adminId: string,
  disputeId: string,
  resolution: string,
  receiptStatus?: ReceiptStatus,
  ip?: string,
) {
  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: { receipt: { include: { evidence: true, confirmations: true } } },
  });
  if (!dispute) throw AppError.notFound("Dispute not found.");
  if (dispute.status !== "OPEN") {
    throw AppError.badRequest("Dispute is already resolved.");
  }
  if (!receiptStatus) {
    throw AppError.badRequest("receiptStatus is required to resolve a dispute.");
  }

  const fromStatus = dispute.receipt.status;
  if (fromStatus !== "DISPUTED") {
    throw AppError.badRequest("Receipt is not in disputed status.");
  }
  assertTransition("DISPUTED", receiptStatus);

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const claimed = await tx.dispute.updateMany({
      where: { id: disputeId, status: "OPEN" },
      data: {
        status: "RESOLVED",
        resolution,
        resolvedAt: now,
        resolvedById: adminId,
      },
    });
    if (claimed.count !== 1) {
      throw AppError.badRequest("Dispute is already resolved.");
    }

    const data: {
      status: ReceiptStatus;
      receiptNumber?: string;
      verificationCode?: string;
      integrityHash?: string;
      integrityVersion?: number;
      verifiedAt?: Date;
      lockedAt?: Date;
      revokedAt?: Date;
      revokedById?: string;
      revocationReason?: string;
    } = { status: receiptStatus };

    if (receiptStatus === "VERIFIED") {
      const receipt = dispute.receipt;
      if (!receipt.integrityHash) {
        const receiptNumber = receipt.receiptNumber ?? (await allocateReceiptNumber(tx));
        let verificationCode = receipt.verificationCode;
        if (!verificationCode) {
          let code = generateVerificationCode();
          while (await tx.workReceipt.findUnique({ where: { verificationCode: code } })) {
            code = generateVerificationCode();
          }
          verificationCode = code;
        }
        const confirmationId = receipt.confirmations.at(-1)?.id ?? randomUUID();
        const integrityHash = computeIntegrityHashV1(
          buildIntegrityPayload({
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
            verifiedAt: now.toISOString(),
          }),
        );
        data.receiptNumber = receiptNumber;
        data.verificationCode = verificationCode;
        data.integrityHash = integrityHash;
        data.integrityVersion = INTEGRITY_VERSION;
        data.verifiedAt = now;
        data.lockedAt = now;
      }
    }

    if (receiptStatus === "REVOKED") {
      data.revokedAt = now;
      data.revokedById = adminId;
      data.revocationReason = resolution;
    }

    await tx.workReceipt.update({
      where: { id: dispute.receiptId },
      data,
    });

    await recordReceiptEvent(
      {
        receiptId: dispute.receiptId,
        actorId: adminId,
        actorType: "ADMIN",
        eventType: "dispute_resolved",
        fromStatus,
        toStatus: receiptStatus,
        publicSummary: `Dispute resolved to ${receiptStatus}.`,
        ipAddress: ip,
      },
      tx,
    );
  });

  await createAuditLog({
    actorId: adminId,
    receiptId: dispute.receiptId,
    action: "DISPUTE_RESOLVED",
    entityType: "Dispute",
    entityId: disputeId,
    metadata: { resolution, receiptStatus },
    ipAddress: ip,
  });

  return { success: true };
}
