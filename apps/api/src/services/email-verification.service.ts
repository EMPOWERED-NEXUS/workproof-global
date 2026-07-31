import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { generateVerificationToken, hashToken } from "../lib/crypto.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { enqueueEmailJob } from "../email/outbox.service.js";
import { createAuditLog } from "./audit.service.js";

export async function createEmailVerificationForUser(input: {
  userId: string;
  email: string;
  fullName: string;
  ip?: string;
  tx?: Parameters<typeof enqueueEmailJob>[1];
}) {
  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(
    Date.now() + env.EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000,
  );
  const db = input.tx ?? prisma;

  await db.emailVerificationToken.updateMany({
    where: { userId: input.userId, usedAt: null, invalidatedAt: null },
    data: { invalidatedAt: new Date() },
  });

  await db.emailVerificationToken.create({
    data: {
      id: randomUUID(),
      userId: input.userId,
      tokenHash,
      expiresAt,
      requestedIp: input.ip,
    },
  });

  await enqueueEmailJob(
    {
      type: "EMAIL_VERIFICATION",
      recipientEmail: input.email,
      recipientName: input.fullName,
      relatedUserId: input.userId,
      payload: {
        kind: "EMAIL_VERIFICATION",
        rawToken: token,
        userId: input.userId,
        fullName: input.fullName,
      },
    },
    db,
  );

  return { expiresAt };
}

export async function resendEmailVerification(userId: string, ip?: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound("User not found.");
  if (user.emailVerifiedAt) {
    throw AppError.badRequest("Email is already verified.");
  }

  const latest = await prisma.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  if (latest) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    const cooldownMs = env.EMAIL_RESEND_COOLDOWN_SECONDS * 1000;
    if (elapsed < cooldownMs) {
      const remaining = Math.ceil((cooldownMs - elapsed) / 1000);
      throw AppError.badRequest(`Please wait ${remaining}s before requesting another verification email.`, {
        cooldown: [`${remaining}`],
      });
    }
  }

  await createEmailVerificationForUser({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    ip,
  });

  await createAuditLog({
    actorId: userId,
    action: "EMAIL_VERIFICATION_RESENT",
    entityType: "User",
    entityId: userId,
    ipAddress: ip,
  });

  return {
    sent: true,
    cooldownSeconds: env.EMAIL_RESEND_COOLDOWN_SECONDS,
  };
}

export async function verifyEmailWithToken(rawToken: string, ip?: string) {
  const tokenHash = hashToken(rawToken);
  const now = new Date();

  const claimed = await prisma.$queryRaw<Array<{ id: string; user_id: string }>>`
    UPDATE email_verification_tokens
    SET used_at = ${now}
    WHERE id = (
      SELECT id FROM email_verification_tokens
      WHERE token_hash = ${tokenHash}
        AND used_at IS NULL
        AND invalidated_at IS NULL
        AND expires_at > ${now}
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING id, user_id
  `;

  if (!claimed[0]) {
    const existing = await prisma.emailVerificationToken.findUnique({ where: { tokenHash } });
    if (!existing) throw AppError.badRequest("Invalid or expired verification token.");
    if (existing.usedAt) {
      throw AppError.badRequest("This verification link has already been used.");
    }
    if (existing.invalidatedAt || existing.expiresAt.getTime() <= Date.now()) {
      throw AppError.badRequest("This verification link has expired.");
    }
    throw AppError.badRequest("Invalid or expired verification token.");
  }

  await prisma.user.update({
    where: { id: claimed[0].user_id },
    data: { emailVerifiedAt: now },
  });

  await createAuditLog({
    actorId: claimed[0].user_id,
    action: "EMAIL_VERIFIED",
    entityType: "User",
    entityId: claimed[0].user_id,
    ipAddress: ip,
  });

  return { verified: true, verifiedAt: now.toISOString() };
}

export async function getEmailVerificationStatus(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound("User not found.");

  const latest = await prisma.emailVerificationToken.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  let resendAvailableInSeconds = 0;
  if (latest && !user.emailVerifiedAt) {
    const elapsed = Date.now() - latest.createdAt.getTime();
    const cooldownMs = env.EMAIL_RESEND_COOLDOWN_SECONDS * 1000;
    resendAvailableInSeconds = Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
  }

  return {
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    resendAvailableInSeconds,
    resendCooldownSeconds: env.EMAIL_RESEND_COOLDOWN_SECONDS,
  };
}
