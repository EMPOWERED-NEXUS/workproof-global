import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import {
  generateRefreshToken,
  generateTokenFamilyId,
  hashToken,
} from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { createAuditLog } from "./audit.service.js";
import type { AuthUser } from "../middleware/auth.js";

export interface SessionMeta {
  ipAddress?: string;
  userAgent?: string;
  deviceName?: string;
}

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  familyId: string;
  refreshExpiresAt: Date;
}

function refreshExpiryDate(): Date {
  return new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
}

export async function createSession(
  user: AuthUser,
  meta: SessionMeta,
  signAccessToken: (user: AuthUser) => string,
): Promise<IssuedSession> {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const familyId = generateTokenFamilyId();
  const expiresAt = refreshExpiryDate();

  const created = await prisma.refreshToken.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      familyId,
      expiresAt,
      deviceName: meta.deviceName,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  });

  await createAuditLog({
    actorId: user.id,
    action: "SESSION_CREATED",
    entityType: "RefreshToken",
    entityId: created.id,
    ipAddress: meta.ipAddress,
    metadata: { familyId },
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken,
    refreshTokenId: created.id,
    familyId,
    refreshExpiresAt: expiresAt,
  };
}

export async function rotateRefreshToken(
  presentedToken: string,
  meta: SessionMeta,
  signAccessToken: (user: AuthUser) => string,
): Promise<IssuedSession> {
  const presentedHash = hashToken(presentedToken);

  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash: presentedHash },
    include: {
      user: true,
    },
  });

  if (!existing) {
    throw AppError.unauthorized("Invalid or expired refresh token.");
  }

  if (existing.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { familyId: existing.familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await createAuditLog({
      actorId: existing.userId,
      action: "REFRESH_REPLAY_DETECTED",
      entityType: "RefreshToken",
      entityId: existing.id,
      ipAddress: meta.ipAddress,
      metadata: { familyId: existing.familyId },
    });
    throw AppError.unauthorized("Refresh token reuse detected. Session family revoked.");
  }

  if (existing.expiresAt < new Date()) {
    throw AppError.unauthorized("Invalid or expired refresh token.");
  }

  if (existing.user.status === "SUSPENDED") {
    await revokeFamily(existing.familyId);
    throw AppError.unauthorized("Invalid or suspended account.");
  }

  const nextToken = generateRefreshToken();
  const nextHash = hashToken(nextToken);
  const nextExpires = refreshExpiryDate();
  const nextId = randomUUID();
  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.refreshToken.updateMany({
        where: { id: existing.id, revokedAt: null, tokenHash: presentedHash },
        data: {
          revokedAt: now,
          lastUsedAt: now,
          replacedByTokenId: nextId,
        },
      });

      if (claimed.count !== 1) {
        throw AppError.unauthorized("Refresh token reuse detected. Session family revoked.");
      }

      await tx.refreshToken.create({
        data: {
          id: nextId,
          userId: existing.userId,
          tokenHash: nextHash,
          familyId: existing.familyId,
          expiresAt: nextExpires,
          deviceName: meta.deviceName ?? existing.deviceName,
          userAgent: meta.userAgent ?? existing.userAgent,
          ipAddress: meta.ipAddress ?? existing.ipAddress,
        },
      });
    });
  } catch (error) {
    if (error instanceof AppError) {
      await prisma.refreshToken.updateMany({
        where: { familyId: existing.familyId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      await createAuditLog({
        actorId: existing.userId,
        action: "REFRESH_REPLAY_DETECTED",
        entityType: "RefreshToken",
        entityId: existing.id,
        ipAddress: meta.ipAddress,
        metadata: { familyId: existing.familyId },
      });
      throw error;
    }
    throw error;
  }

  await createAuditLog({
    actorId: existing.userId,
    action: "SESSION_ROTATED",
    entityType: "RefreshToken",
    entityId: nextId,
    ipAddress: meta.ipAddress,
    metadata: { familyId: existing.familyId, previousTokenId: existing.id },
  });

  const authUser: AuthUser = {
    id: existing.user.id,
    email: existing.user.email,
    fullName: existing.user.fullName,
    role: existing.user.role,
    status: existing.user.status,
  };

  return {
    accessToken: signAccessToken(authUser),
    refreshToken: nextToken,
    refreshTokenId: nextId,
    familyId: existing.familyId,
    refreshExpiresAt: nextExpires,
  };
}

export async function revokeRefreshToken(
  presentedToken: string,
  actorId: string | undefined,
  meta: SessionMeta,
): Promise<void> {
  const tokenHash = hashToken(presentedToken);
  const existing = await prisma.refreshToken.findUnique({ where: { tokenHash } });
  if (!existing || existing.revokedAt) return;

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), lastUsedAt: new Date() },
  });

  await createAuditLog({
    actorId: actorId ?? existing.userId,
    action: "SESSION_REVOKED",
    entityType: "RefreshToken",
    entityId: existing.id,
    ipAddress: meta.ipAddress,
    metadata: { familyId: existing.familyId },
  });
}

export async function revokeAllUserSessions(
  userId: string,
  actorId: string,
  meta: SessionMeta,
): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  await createAuditLog({
    actorId,
    action: "SESSION_REVOKED_ALL",
    entityType: "User",
    entityId: userId,
    ipAddress: meta.ipAddress,
    metadata: { revokedCount: result.count },
  });

  return result.count;
}

export async function revokeFamily(familyId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function listUserSessions(userId: string) {
  const sessions = await prisma.refreshToken.findMany({
    where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      familyId: true,
      createdAt: true,
      lastUsedAt: true,
      expiresAt: true,
      deviceName: true,
      userAgent: true,
      ipAddress: true,
    },
  });
  return sessions;
}

export async function revokeOwnedSession(
  userId: string,
  sessionId: string,
  meta: SessionMeta,
): Promise<void> {
  const session = await prisma.refreshToken.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) throw AppError.notFound("Session not found.");
  if (session.revokedAt) return;

  await prisma.refreshToken.update({
    where: { id: session.id },
    data: { revokedAt: new Date() },
  });

  await createAuditLog({
    actorId: userId,
    action: "SESSION_REVOKED",
    entityType: "RefreshToken",
    entityId: session.id,
    ipAddress: meta.ipAddress,
    metadata: { familyId: session.familyId },
  });
}
