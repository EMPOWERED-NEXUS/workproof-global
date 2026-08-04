import { randomUUID } from "node:crypto";
import type { EmailJobType, Prisma } from "../../generated/prisma/index.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { encryptEmailPayload } from "./payload-crypto.js";
import type { EmailPayload } from "./types.js";

type Tx = Prisma.TransactionClient;

export async function enqueueEmailJob(
  input: {
    type: EmailJobType;
    recipientEmail: string;
    recipientName?: string;
    payload: EmailPayload;
    relatedUserId?: string;
    relatedReceiptId?: string;
    relatedVerificationRequestId?: string;
    maxAttempts?: number;
  },
  tx: Tx | typeof prisma = prisma,
) {
  return tx.emailOutbox.create({
    data: {
      id: randomUUID(),
      type: input.type,
      recipientEmail: input.recipientEmail.toLowerCase(),
      recipientName: input.recipientName,
      encryptedPayload: encryptEmailPayload(input.payload),
      status: "PENDING",
      attemptCount: 0,
      maxAttempts: input.maxAttempts ?? env.EMAIL_JOB_MAX_ATTEMPTS,
      nextAttemptAt: new Date(),
      relatedUserId: input.relatedUserId,
      relatedReceiptId: input.relatedReceiptId,
      relatedVerificationRequestId: input.relatedVerificationRequestId,
    },
  });
}
