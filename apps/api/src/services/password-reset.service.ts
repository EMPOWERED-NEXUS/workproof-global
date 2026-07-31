import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { generateVerificationToken, hashToken } from "../lib/crypto.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { enqueueEmailJob } from "../email/outbox.service.js";
import { createAuditLog } from "./audit.service.js";
import { revokeAllUserSessions } from "./session.service.js";

const SALT_ROUNDS = 12;
const NEUTRAL_MESSAGE =
  "If an account exists for that email, password reset instructions have been sent.";

export async function requestPasswordReset(email: string, ip?: string) {
  const normalised = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalised } });

  // Always return the same shape — no account enumeration.
  if (!user || user.status === "SUSPENDED") {
    await createAuditLog({
      action: "PASSWORD_RESET_REQUESTED",
      entityType: "User",
      entityId: "unknown",
      ipAddress: ip,
      metadata: { outcome: "neutral" },
    });
    return { message: NEUTRAL_MESSAGE };
  }

  const token = generateVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.$transaction(async (tx) => {
    await tx.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null, invalidatedAt: null },
      data: { invalidatedAt: new Date() },
    });

    await tx.passwordResetToken.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        tokenHash,
        expiresAt,
        requestedIp: ip,
      },
    });

    await enqueueEmailJob(
      {
        type: "PASSWORD_RESET",
        recipientEmail: user.email,
        recipientName: user.fullName,
        relatedUserId: user.id,
        payload: {
          kind: "PASSWORD_RESET",
          rawToken: token,
          userId: user.id,
          fullName: user.fullName,
          expiresAt: expiresAt.toISOString(),
        },
      },
      tx,
    );
  });

  await createAuditLog({
    actorId: user.id,
    action: "PASSWORD_RESET_REQUESTED",
    entityType: "User",
    entityId: user.id,
    ipAddress: ip,
    metadata: { outcome: "queued" },
  });

  return {
    message: NEUTRAL_MESSAGE,
    ...(env.ALLOW_DEV_PASSWORD_RESET_TOKEN ? { resetToken: token } : {}),
  };
}

export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string,
  ip?: string,
) {
  const tokenHash = hashToken(rawToken);
  const now = new Date();

  const claimed = await prisma.$queryRaw<Array<{ id: string; user_id: string }>>`
    UPDATE password_reset_tokens
    SET claimed_at = ${now}, used_at = ${now}
    WHERE id = (
      SELECT id FROM password_reset_tokens
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
    const existing = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!existing) {
      throw AppError.badRequest("Invalid or expired reset link.", undefined, "PASSWORD_RESET_INVALID");
    }
    if (existing.usedAt) {
      throw AppError.badRequest("This reset link has already been used.", undefined, "PASSWORD_RESET_USED");
    }
    if (existing.invalidatedAt || existing.expiresAt.getTime() <= Date.now()) {
      throw AppError.badRequest("This reset link has expired.", undefined, "PASSWORD_RESET_EXPIRED");
    }
    throw AppError.badRequest("Invalid or expired reset link.", undefined, "PASSWORD_RESET_INVALID");
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({
    where: { id: claimed[0].user_id },
    data: { passwordHash },
  });

  await revokeAllUserSessions(claimed[0].user_id, claimed[0].user_id, { ipAddress: ip });

  await createAuditLog({
    actorId: claimed[0].user_id,
    action: "PASSWORD_RESET_COMPLETED",
    entityType: "User",
    entityId: claimed[0].user_id,
    ipAddress: ip,
  });

  return { reset: true };
}
