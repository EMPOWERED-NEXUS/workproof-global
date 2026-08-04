import { env } from "../config/env.js";
import { LocalStorageProvider } from "./local.provider.js";
import { SupabaseStorageProvider } from "./supabase.provider.js";
import type { StorageProvider } from "./types.js";

let cached: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cached) return cached;
  if (env.STORAGE_PROVIDER === "supabase") {
    cached = new SupabaseStorageProvider();
  } else {
    cached = new LocalStorageProvider();
  }
  return cached;
}

export function buildEvidenceObjectKey(input: {
  workerId: string;
  receiptId: string;
  evidenceId: string;
  generatedName: string;
}): string {
  return `users/${input.workerId}/receipts/${input.receiptId}/evidence/${input.evidenceId}/${input.generatedName}`;
}

export type { StorageProvider, SignedUrlResult, StorageObjectMetadata } from "./types.js";
