import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { decryptEmailPayload } from "./payload-crypto.js";
import { getEmailProvider } from "./providers/index.js";
import {
  buildCustomerVerificationMessage,
  buildDeliveryFailureMessage,
  buildEmailVerificationMessage,
  buildPasswordResetMessage,
} from "./templates/index.js";
import type { EmailPayload } from "./types.js";
import { enqueueEmailJob } from "./outbox.service.js";
import { logger } from "../lib/logger.js";

let timer: NodeJS.Timeout | null = null;
let running = false;
let stopping = false;

function backoffMs(attemptCount: number): number {
  const base = Math.min(60_000 * 2 ** Math.max(0, attemptCount - 1), 60 * 60 * 1000);
  const jitter = Math.floor(Math.random() * 1000);
  return base + jitter;
}

function sanitiseError(error: unknown): { code: string; message: string } {
  const message = error instanceof Error ? error.message : "unknown_error";
  const code = message.startsWith("EMAIL_PROVIDER_") ? message : "EMAIL_SEND_FAILED";
  return {
    code,
    message: message.replace(/[a-f0-9]{32,}/gi, "[redacted]").slice(0, 240),
  };
}

async function recoverStuckJobs(): Promise<void> {
  const cutoff = new Date(Date.now() - env.EMAIL_JOB_PROCESSING_TIMEOUT_MS);
  await prisma.emailOutbox.updateMany({
    where: {
      status: "PROCESSING",
      claimedAt: { lt: cutoff },
    },
    data: {
      status: "PENDING",
      claimedAt: null,
      nextAttemptAt: new Date(),
    },
  });
}

/** Atomically claim one pending job (SKIP LOCKED). */
export async function claimNextEmailJob() {
  await recoverStuckJobs();
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    UPDATE email_outbox
    SET
      status = 'PROCESSING',
      claimed_at = NOW(),
      attempt_count = attempt_count + 1,
      updated_at = NOW()
    WHERE id = (
      SELECT id FROM email_outbox
      WHERE status = 'PENDING'
        AND next_attempt_at <= NOW()
      ORDER BY next_attempt_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING id
  `;
  if (!rows[0]) return null;
  return prisma.emailOutbox.findUnique({ where: { id: rows[0].id } });
}

function renderMessage(payload: EmailPayload) {
  if (payload.kind === "EMAIL_VERIFICATION") {
    return buildEmailVerificationMessage(payload);
  }
  if (payload.kind === "PASSWORD_RESET") {
    return buildPasswordResetMessage(payload);
  }
  if (payload.kind === "DELIVERY_FAILURE_NOTICE") {
    return buildDeliveryFailureMessage(payload);
  }
  return buildCustomerVerificationMessage(payload);
}

export async function processClaimedEmailJob(jobId: string): Promise<"SENT" | "FAILED" | "RETRY"> {
  const job = await prisma.emailOutbox.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "PROCESSING" || !job.encryptedPayload) {
    return "FAILED";
  }

  try {
    const payload = decryptEmailPayload<EmailPayload>(job.encryptedPayload);
    const message = renderMessage(payload);
    const provider = getEmailProvider();
    const result = await provider.sendEmail({
      to: job.recipientEmail,
      toName: job.recipientName ?? undefined,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: env.EMAIL_REPLY_TO,
    });

    await prisma.emailOutbox.update({
      where: { id: job.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        claimedAt: null,
        providerMessageId: result.messageId,
        encryptedPayload: null,
        lastErrorCode: null,
        lastErrorMessageSanitised: null,
      },
    });

    logger.info("email_delivery", {
      deliveryId: job.id,
      type: job.type,
      status: "SENT",
    });
    return "SENT";
  } catch (error) {
    const { code, message } = sanitiseError(error);
    const permanentlyFailed = job.attemptCount >= job.maxAttempts;

    if (permanentlyFailed) {
      await prisma.emailOutbox.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
          claimedAt: null,
          lastErrorCode: code,
          lastErrorMessageSanitised: message,
        },
      });

      if (
        (job.type === "CUSTOMER_VERIFICATION" || job.type === "CUSTOMER_VERIFICATION_RESEND") &&
        job.relatedReceiptId
      ) {
        const receipt = await prisma.workReceipt.findUnique({
          where: { id: job.relatedReceiptId },
          include: { worker: true },
        });
        if (receipt) {
          await enqueueEmailJob({
            type: "DELIVERY_FAILURE_NOTICE",
            recipientEmail: receipt.worker.email,
            recipientName: receipt.worker.fullName,
            relatedUserId: receipt.workerId,
            relatedReceiptId: receipt.id,
            payload: {
              kind: "DELIVERY_FAILURE_NOTICE",
              receiptId: receipt.id,
              serviceTitle: receipt.serviceTitle,
              customerEmail: job.recipientEmail,
            },
          });
        }
      }

      logger.warn("email_delivery", {
        deliveryId: job.id,
        type: job.type,
        status: "FAILED",
        code,
      });
      return "FAILED";
    }

    await prisma.emailOutbox.update({
      where: { id: job.id },
      data: {
        status: "PENDING",
        claimedAt: null,
        nextAttemptAt: new Date(Date.now() + backoffMs(job.attemptCount)),
        lastErrorCode: code,
        lastErrorMessageSanitised: message,
      },
    });
    logger.info("email_delivery", {
      deliveryId: job.id,
      type: job.type,
      status: "RETRY",
      code,
    });
    return "RETRY";
  }
}
export async function processNextEmailJob(): Promise<boolean> {
  const job = await claimNextEmailJob();
  if (!job) return false;
  await processClaimedEmailJob(job.id);
  return true;
}

/** Drain pending jobs — used by tests and optional sync helpers. */
export async function processPendingEmailJobs(max = 50): Promise<number> {
  let processed = 0;
  while (processed < max) {
    const worked = await processNextEmailJob();
    if (!worked) break;
    processed += 1;
  }
  return processed;
}

async function tick(): Promise<void> {
  if (running || stopping) return;
  running = true;
  try {
    await processPendingEmailJobs(10);
  } catch (error) {
    console.error(
      "[email:dispatcher] tick failed",
      error instanceof Error ? error.message : "unknown",
    );
  } finally {
    running = false;
  }
}

export function startEmailDispatcher(): void {
  if (timer || env.NODE_ENV === "test") return;
  timer = setInterval(() => {
    void tick();
  }, env.EMAIL_JOB_POLL_INTERVAL_MS);
  timer.unref();
  void tick();
}

export async function stopEmailDispatcher(): Promise<void> {
  stopping = true;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  const waitStart = Date.now();
  while (running && Date.now() - waitStart < 5000) {
    await new Promise((r) => setTimeout(r, 50));
  }
  stopping = false;
}
