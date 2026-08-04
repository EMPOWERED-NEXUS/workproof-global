import fs from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import type { StorageObjectMetadata, StorageProvider, SignedUrlResult } from "./types.js";

function rootDir(): string {
  return path.resolve(process.cwd(), env.LOCAL_STORAGE_DIR);
}

function assertSafeKey(key: string): string {
  if (!key || key.includes("\0") || key.includes("..") || path.isAbsolute(key)) {
    throw AppError.badRequest("Invalid storage key.");
  }
  const normalised = key.replace(/\\/g, "/").replace(/^\/+/, "");
  if (normalised !== key.replace(/\\/g, "/").replace(/^\/+/, "")) {
    throw AppError.badRequest("Invalid storage key.");
  }
  const absolute = path.resolve(rootDir(), normalised);
  const root = rootDir();
  if (!absolute.startsWith(root + path.sep) && absolute !== root) {
    throw AppError.badRequest("Invalid storage key.");
  }
  return absolute;
}

export class LocalStorageProvider implements StorageProvider {
  readonly name = "local" as const;

  async upload(input: { key: string; body: Buffer; contentType: string }): Promise<void> {
    const absolute = assertSafeKey(input.key);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    try {
      await fs.writeFile(absolute, input.body, { flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") {
        throw AppError.conflict("Storage object already exists.");
      }
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    const absolute = assertSafeKey(key);
    try {
      await fs.unlink(absolute);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  async createSignedDownloadUrl(key: string, expiresInSeconds: number): Promise<SignedUrlResult> {
    // Local provider streams via authenticated API; signed URL is not used.
    void assertSafeKey(key);
    return { url: "", expiresInSeconds };
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(assertSafeKey(key));
      return true;
    } catch {
      return false;
    }
  }

  async getMetadata(key: string): Promise<StorageObjectMetadata | null> {
    try {
      const absolute = assertSafeKey(key);
      const stats = await fs.stat(absolute);
      return { key, size: stats.size };
    } catch {
      return null;
    }
  }

  resolveLocalAbsolutePath(key: string): string {
    return assertSafeKey(key);
  }
}
