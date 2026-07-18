import type { Prisma } from "../../generated/prisma/index.js";
import { prisma } from "../lib/prisma.js";

export async function createAuditLog(input: {
  actorId?: string;
  receiptId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: input.actorId,
      receiptId: input.receiptId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
      ipAddress: input.ipAddress,
    },
  });
}
