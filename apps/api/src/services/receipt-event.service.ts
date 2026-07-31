import type { Prisma, ReceiptEventActorType, ReceiptStatus } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../lib/errors.js";
import { randomUUID } from "node:crypto";

export async function recordReceiptEvent(
  input: {
    receiptId: string;
    actorId?: string;
    actorType: ReceiptEventActorType;
    eventType: string;
    fromStatus?: ReceiptStatus | null;
    toStatus?: ReceiptStatus | null;
    publicSummary?: string;
    metadata?: Prisma.InputJsonValue;
    ipAddress?: string;
  },
  tx: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<void> {
  await tx.receiptEvent.create({
    data: {
      id: randomUUID(),
      receiptId: input.receiptId,
      actorId: input.actorId,
      actorType: input.actorType,
      eventType: input.eventType,
      fromStatus: input.fromStatus ?? undefined,
      toStatus: input.toStatus ?? undefined,
      publicSummary: input.publicSummary,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
    },
  });
}

export async function listReceiptEventsForWorker(workerId: string, receiptId: string) {
  const receipt = await prisma.workReceipt.findFirst({
    where: { id: receiptId, workerId },
    select: { id: true },
  });
  if (!receipt) throw AppError.notFound("Receipt not found.");

  const events = await prisma.receiptEvent.findMany({
    where: { receiptId },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    select: {
      id: true,
      eventType: true,
      actorType: true,
      fromStatus: true,
      toStatus: true,
      publicSummary: true,
      createdAt: true,
    },
  });

  return events;
}
