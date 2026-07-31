import { createHash } from "node:crypto";

export const INTEGRITY_VERSION = 1;

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortValue(record[key]);
    }
    return sorted;
  }
  return value;
}

/** Deterministic canonical JSON with recursively sorted object keys. */
export function canonicalize(payload: Record<string, unknown>): string {
  return JSON.stringify(sortValue(payload));
}

export function computeIntegrityHashV1(payload: Record<string, unknown>): string {
  const withVersion = { integrityVersion: INTEGRITY_VERSION, ...payload };
  return createHash("sha256").update(canonicalize(withVersion)).digest("hex");
}

export function buildIntegrityPayload(input: {
  receiptId: string;
  receiptNumber: string;
  workerId: string;
  serviceTitle: string;
  workDate: string;
  skillsDemonstrated: string[];
  amount: number | null;
  currency: string;
  evidence: Array<{ id: string; type: string; mimeType: string | null; size: number | null }>;
  confirmationId: string;
  verifiedAt: string;
}): Record<string, unknown> {
  return {
    receiptId: input.receiptId,
    receiptNumber: input.receiptNumber,
    workerId: input.workerId,
    serviceTitle: input.serviceTitle,
    workDate: input.workDate,
    skillsDemonstrated: [...input.skillsDemonstrated].sort(),
    amount: input.amount,
    currency: input.currency,
    evidence: input.evidence
      .map((e) => ({
        id: e.id,
        type: e.type,
        mimeType: e.mimeType,
        size: e.size,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    confirmationId: input.confirmationId,
    verifiedAt: input.verifiedAt,
  };
}
