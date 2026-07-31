import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { createAuditLog } from "./audit.service.js";
import type { ReceiptStatus, UserStatus } from "../../generated/prisma/index.js";

export async function getWorkerDashboard(workerId: string) {
  const receipts = await prisma.workReceipt.findMany({
    where: { workerId },
    orderBy: { createdAt: "desc" },
  });

  const verified = receipts.filter((r) => r.status === "VERIFIED");
  const pending = receipts.filter((r) =>
    ["PENDING_VERIFICATION", "CORRECTION_REQUESTED"].includes(r.status),
  );
  const disputed = receipts.filter((r) => r.status === "DISPUTED");

  const customerEmails = new Set(
    verified.map((r) => r.customerEmail.toLowerCase()),
  );
  const repeatCustomers = verified.reduce((acc, r) => {
    const email = r.customerEmail.toLowerCase();
    acc.set(email, (acc.get(email) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());
  const repeatCustomerCount = [...repeatCustomers.values()].filter((c) => c > 1).length;

  const skills = new Set<string>();
  for (const r of receipts) {
    for (const s of r.skillsDemonstrated) skills.add(s);
  }

  const monthlyMap = new Map<string, number>();
  for (const r of receipts) {
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
    uniqueCustomers: customerEmails.size,
    repeatCustomerCount,
    verificationRate:
      receipts.length > 0 ? Math.round((verified.length / receipts.length) * 100) : 0,
    recentReceipts: receipts.slice(0, 5).map((r) => ({
      id: r.id,
      serviceTitle: r.serviceTitle,
      status: r.status,
      workDate: r.workDate,
      amount: r.amount != null ? Number(r.amount) : null,
      currency: r.currency,
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
    note: "No workers have been assigned to this organisation yet.",
    workerCount: 0,
    sampleWorkers: [] as Array<{ fullName: string; profileSlug: string; skills: string[] }>,
    recentPlatformReceipts: [] as Array<{
      serviceTitle: string;
      status: string;
      workerName: string;
      workDate: Date;
    }>,
    verifiedReceiptCount: 0,
  };
}

export async function listAdminUsers(page = 1, limit = 20) {
  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
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

export async function listAdminReceipts(page = 1, limit = 20) {
  const [total, items] = await Promise.all([
    prisma.workReceipt.count(),
    prisma.workReceipt.findMany({
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

  const updated = await prisma.workReceipt.update({
    where: { id: receiptId },
    data: { status: "REVOKED" },
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

export async function resolveDispute(
  adminId: string,
  disputeId: string,
  resolution: string,
  receiptStatus?: ReceiptStatus,
  ip?: string,
) {
  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) throw AppError.notFound("Dispute not found.");

  await prisma.$transaction(async (tx) => {
    await tx.dispute.update({
      where: { id: disputeId },
      data: { status: "RESOLVED", resolution, resolvedAt: new Date() },
    });
    if (receiptStatus) {
      await tx.workReceipt.update({
        where: { id: dispute.receiptId },
        data: { status: receiptStatus },
      });
    }
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
