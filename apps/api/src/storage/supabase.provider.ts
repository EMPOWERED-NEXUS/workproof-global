import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import type { StorageObjectMetadata, StorageProvider, SignedUrlResult } from "./types.js";

/**
 * Supabase Storage REST adapter (server-side only).
 * Uses the service-role key — never expose to web/mobile clients.
 */
export class SupabaseStorageProvider implements StorageProvider {
  readonly name = "supabase" as const;

  private get baseUrl(): string {
    if (!env.SUPABASE_URL) throw AppError.badRequest("Supabase storage is not configured.");
    return env.SUPABASE_URL.replace(/\/$/, "");
  }

  private get headers(): Record<string, string> {
    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      throw AppError.badRequest("Supabase storage is not configured.");
    }
    return {
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    };
  }

  private objectUrl(key: string): string {
    const encoded = key
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    return `${this.baseUrl}/storage/v1/object/${env.SUPABASE_STORAGE_BUCKET}/${encoded}`;
  }

  async upload(input: { key: string; body: Buffer; contentType: string }): Promise<void> {
    if (await this.exists(input.key)) {
      throw AppError.conflict("Storage object already exists.");
    }
    const response = await fetch(this.objectUrl(input.key), {
      method: "POST",
      headers: {
        ...this.headers,
        "Content-Type": input.contentType,
        "x-upsert": "false",
      },
      body: new Uint8Array(input.body),
    });
    if (!response.ok) {
      throw AppError.badRequest("Failed to upload evidence to storage.");
    }
  }

  async delete(key: string): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/storage/v1/object/${env.SUPABASE_STORAGE_BUCKET}`,
      {
        method: "DELETE",
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: [key] }),
      },
    );
    if (!response.ok && response.status !== 404) {
      throw AppError.badRequest("Failed to delete evidence from storage.");
    }
  }

  async createSignedDownloadUrl(key: string, expiresInSeconds: number): Promise<SignedUrlResult> {
    const encoded = key
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
    const response = await fetch(
      `${this.baseUrl}/storage/v1/object/sign/${env.SUPABASE_STORAGE_BUCKET}/${encoded}`,
      {
        method: "POST",
        headers: {
          ...this.headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expiresIn: expiresInSeconds }),
      },
    );
    if (!response.ok) {
      throw AppError.notFound("Evidence not found.");
    }
    const data = (await response.json()) as { signedURL?: string; signedUrl?: string };
    const path = data.signedURL ?? data.signedUrl;
    if (!path) throw AppError.notFound("Evidence not found.");
    const url = path.startsWith("http") ? path : `${this.baseUrl}/storage/v1${path}`;
    return { url, expiresInSeconds };
  }

  async exists(key: string): Promise<boolean> {
    const response = await fetch(this.objectUrl(key), {
      method: "HEAD",
      headers: this.headers,
    });
    return response.ok;
  }

  async getMetadata(key: string): Promise<StorageObjectMetadata | null> {
    const response = await fetch(this.objectUrl(key), {
      method: "HEAD",
      headers: this.headers,
    });
    if (!response.ok) return null;
    const sizeHeader = response.headers.get("content-length");
    return {
      key,
      size: sizeHeader ? Number(sizeHeader) : undefined,
      contentType: response.headers.get("content-type") ?? undefined,
    };
  }

  resolveLocalAbsolutePath(): null {
    return null;
  }
}
