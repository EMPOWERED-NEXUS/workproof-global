import { createReadStream } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Response } from "express";
import { detectLinkPlatform, type EvidenceVisibility } from "@workproof/shared";
import { env } from "../config/env.js";
import { filenameCategory, validateEvidenceLinkUrl, validateUploadBuffer } from "../lib/file-validation.js";
import { AppError } from "../lib/errors.js";
import { canEditReceipt } from "../lib/lifecycle.js";
import { hashToken } from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { buildEvidenceObjectKey, getStorageProvider } from "../storage/index.js";
import { createAuditLog } from "./audit.service.js";
import { recordReceiptEvent } from "./receipt-event.service.js";

export function serializeEvidenceSafe(evidence: {
  id: string;
  type: string;
  externalUrl?: string | null;
  linkPlatform?: string | null;
  visibility?: string | null;
  originalFilename?: string | null;
  safeFilename?: string | null;
  mimeType?: string | null;
  size?: number | null;
  checksumSha256?: string | null;
  description?: string | null;
  uploadedAt?: Date | null;
  createdAt: Date;
  deletedAt?: Date | null;
}) {
  return {
    id: evidence.id,
    type: evidence.type,
    description: evidence.description,
    visibility: (evidence.visibility as EvidenceVisibility | undefined) ?? "CUSTOMER_ONLY",
    linkPlatform: evidence.type === "LINK" ? (evidence.linkPlatform ?? null) : null,
    originalFilename: evidence.originalFilename,
    safeFilename: evidence.safeFilename,
    mimeType: evidence.mimeType,
    size: evidence.size,
    checksumSha256: evidence.checksumSha256,
    filenameCategory: filenameCategory(evidence.mimeType, evidence.type),
    externalUrl: evidence.type === "LINK" ? evidence.externalUrl : undefined,
    uploadedAt: evidence.uploadedAt?.toISOString() ?? null,
    createdAt: evidence.createdAt.toISOString(),
  };
}

async function assertEditableOwnedReceipt(workerId: string, receiptId: string) {
  const receipt = await prisma.workReceipt.findFirst({ where: { id: receiptId, workerId } });
  if (!receipt) throw AppError.notFound("Receipt not found.");
  if (!canEditReceipt(receipt.status, receipt.lockedAt)) {
    throw AppError.badRequest("Evidence cannot be modified on a locked receipt.");
  }
  return receipt;
}

export async function addLinkEvidence(
  workerId: string,
  receiptId: string,
  input: {
    url: string;
    description?: string;
    visibility?: EvidenceVisibility;
    linkPlatform?: string;
  },
  ip?: string,
) {
  await assertEditableOwnedReceipt(workerId, receiptId);
  const externalUrl = validateEvidenceLinkUrl(input.url);
  const visibility = input.visibility ?? "CUSTOMER_ONLY";
  const linkPlatform = input.linkPlatform ?? detectLinkPlatform(externalUrl);

  const created = await prisma.evidence.create({
    data: {
      id: randomUUID(),
      receiptId,
      type: "LINK",
      externalUrl,
      linkPlatform,
      visibility,
      url: null,
      description: input.description,
      uploadedById: workerId,
      uploadedAt: new Date(),
    },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "evidence_added",
    publicSummary: "Link evidence attached.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "EVIDENCE_ADDED",
    entityType: "Evidence",
    entityId: created.id,
    ipAddress: ip,
    metadata: { type: "LINK" },
  });

  return serializeEvidenceSafe(created);
}

export async function addFileEvidence(
  workerId: string,
  receiptId: string,
  file: { buffer: Buffer; originalname: string; mimetype: string },
  description: string | undefined,
  ip?: string,
  visibility: EvidenceVisibility = "CUSTOMER_ONLY",
) {
  await assertEditableOwnedReceipt(workerId, receiptId);

  const validated = validateUploadBuffer({
    buffer: file.buffer,
    originalFilename: file.originalname,
    declaredMime: file.mimetype,
    maxBytes: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
  });

  const evidenceId = randomUUID();
  const storage = getStorageProvider();
  const storageKey = buildEvidenceObjectKey({
    workerId,
    receiptId,
    evidenceId,
    generatedName: validated.generatedName,
  });
  const storageBucket =
    storage.name === "supabase" ? env.SUPABASE_STORAGE_BUCKET : null;

  await storage.upload({
    key: storageKey,
    body: file.buffer,
    contentType: validated.mimeType,
  });

  try {
    const created = await prisma.evidence.create({
      data: {
        id: evidenceId,
        receiptId,
        type: validated.evidenceType,
        storageProvider: storage.name === "supabase" ? "SUPABASE" : "LOCAL",
        storageBucket,
        storageKey,
        url: null,
        originalFilename: validated.originalFilename,
        safeFilename: validated.safeFilename,
        mimeType: validated.mimeType,
        size: validated.size,
        checksumSha256: validated.checksumSha256,
        description,
        visibility,
        uploadedById: workerId,
        uploadedAt: new Date(),
      },
    });

    await recordReceiptEvent({
      receiptId,
      actorId: workerId,
      actorType: "WORKER",
      eventType: "evidence_added",
      publicSummary: "File evidence attached.",
      ipAddress: ip,
      metadata: { evidenceId, mimeType: validated.mimeType, size: validated.size, visibility },
    });

    await createAuditLog({
      actorId: workerId,
      receiptId,
      action: "EVIDENCE_ADDED",
      entityType: "Evidence",
      entityId: created.id,
      ipAddress: ip,
      metadata: {
        type: validated.evidenceType,
        mimeType: validated.mimeType,
        size: validated.size,
        checksumSha256: validated.checksumSha256,
      },
    });

    return serializeEvidenceSafe(created);
  } catch (error) {
    await storage.delete(storageKey).catch(() => undefined);
    throw error;
  }
}

export async function removeEvidence(
  workerId: string,
  receiptId: string,
  evidenceId: string,
  ip?: string,
) {
  await assertEditableOwnedReceipt(workerId, receiptId);
  const evidence = await prisma.evidence.findFirst({
    where: { id: evidenceId, receiptId, deletedAt: null },
  });
  if (!evidence) throw AppError.notFound("Evidence not found.");

  await prisma.evidence.update({
    where: { id: evidenceId },
    data: { deletedAt: new Date() },
  });

  if (evidence.storageKey) {
    const storage = getStorageProvider();
    await storage.delete(evidence.storageKey).catch(() => undefined);
  }

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "evidence_removed",
    publicSummary: "Evidence removed.",
    ipAddress: ip,
  });

  await createAuditLog({
    actorId: workerId,
    receiptId,
    action: "EVIDENCE_REMOVED",
    entityType: "Evidence",
    entityId: evidenceId,
    ipAddress: ip,
  });
}

async function authorizeEvidenceAccess(actor: {
  id: string;
  role: string;
}, receiptId: string, evidenceId: string) {
  const evidence = await prisma.evidence.findFirst({
    where: { id: evidenceId, receiptId, deletedAt: null },
    include: { receipt: true },
  });
  if (!evidence) throw AppError.notFound("Evidence not found.");

  const isOwner = evidence.receipt.workerId === actor.id;
  const isAdmin = actor.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    throw AppError.notFound("Evidence not found.");
  }
  if (evidence.type === "LINK" || !evidence.storageKey) {
    throw AppError.badRequest("Link evidence cannot be downloaded.");
  }
  return evidence;
}

export async function downloadEvidence(
  actor: { id: string; role: string },
  receiptId: string,
  evidenceId: string,
  res: Response,
) {
  const evidence = await authorizeEvidenceAccess(actor, receiptId, evidenceId);
  await streamOrRedirectEvidence(evidence, res);
}

export async function updateEvidenceVisibility(
  workerId: string,
  receiptId: string,
  evidenceId: string,
  visibility: EvidenceVisibility,
  ip?: string,
) {
  await assertEditableOwnedReceipt(workerId, receiptId);
  const evidence = await prisma.evidence.findFirst({
    where: { id: evidenceId, receiptId, deletedAt: null },
  });
  if (!evidence) throw AppError.notFound("Evidence not found.");

  const updated = await prisma.evidence.update({
    where: { id: evidenceId },
    data: { visibility },
  });

  await recordReceiptEvent({
    receiptId,
    actorId: workerId,
    actorType: "WORKER",
    eventType: "evidence_visibility_updated",
    publicSummary:
      visibility === "PUBLIC_PROOF"
        ? "Evidence marked visible on public proof."
        : "Evidence limited to customer confirmation.",
    ipAddress: ip,
    metadata: { evidenceId, visibility },
  });

  return serializeEvidenceSafe(updated);
}

/** Customer confirmation token grants access only to evidence on that receipt. */
export async function downloadEvidenceByConfirmationToken(
  token: string,
  evidenceId: string,
  res: Response,
) {
  const tokenHash = hashToken(token);
  const request = await prisma.verificationRequest.findFirst({
    where: { tokenHash },
    include: { receipt: true },
  });
  if (!request || request.invalidatedAt || request.usedAt || request.expiresAt < new Date()) {
    throw AppError.notFound("Evidence not found.");
  }
  if (request.receipt.status !== "PENDING_VERIFICATION") {
    throw AppError.notFound("Evidence not found.");
  }

  const evidence = await prisma.evidence.findFirst({
    where: {
      id: evidenceId,
      receiptId: request.receiptId,
      deletedAt: null,
    },
  });
  if (!evidence || evidence.type === "LINK" || !evidence.storageKey) {
    throw AppError.notFound("Evidence not found.");
  }

  await streamOrRedirectEvidence(evidence, res);
}

async function streamOrRedirectEvidence(
  evidence: {
    storageKey: string | null;
    mimeType: string | null;
    safeFilename: string | null;
  },
  res: Response,
) {
  const storage = getStorageProvider();

  if (storage.name === "local") {
    const absolute = storage.resolveLocalAbsolutePath?.(evidence.storageKey!);
    if (!absolute) throw AppError.notFound("Evidence not found.");
    res.setHeader("Content-Type", evidence.mimeType ?? "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${evidence.safeFilename ?? "evidence"}"`,
    );
    createReadStream(absolute).pipe(res);
    return;
  }

  const signed = await storage.createSignedDownloadUrl(
    evidence.storageKey!,
    env.SIGNED_URL_EXPIRY_SECONDS,
  );
  res.redirect(302, signed.url);
}
