import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import { AppError } from "./errors.js";

export const APPROVED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const EXT_BY_MIME: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

const BLOCKED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".js",
  ".mjs",
  ".cjs",
  ".html",
  ".htm",
  ".svg",
  ".php",
  ".sh",
  ".ps1",
  ".dll",
  ".scr",
]);

export interface ValidatedUpload {
  mimeType: string;
  evidenceType: "IMAGE" | "DOCUMENT";
  originalFilename: string;
  safeFilename: string;
  generatedName: string;
  checksumSha256: string;
  size: number;
  extension: string;
}

function detectMimeFromMagic(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buffer.toString("ascii", 0, 4) === "%PDF") return "application/pdf";
  // DOCX is a ZIP archive (PK..) — extension + ZIP header required
  if (buffer[0] === 0x50 && buffer[1] === 0x4b && (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return null;
}

function sanitiseBaseName(name: string): string {
  const base = path.basename(name).replace(/[^\w.\-()+ ]+/g, "_").slice(0, 80);
  return base.length > 0 ? base : "evidence";
}

export function validateUploadBuffer(input: {
  buffer: Buffer;
  originalFilename: string;
  declaredMime?: string;
  maxBytes: number;
}): ValidatedUpload {
  const { buffer, originalFilename, maxBytes } = input;
  if (!buffer?.length) {
    throw AppError.badRequest("Empty upload rejected.");
  }
  if (buffer.length > maxBytes) {
    throw AppError.badRequest(`File exceeds maximum size of ${Math.floor(maxBytes / (1024 * 1024))}MB.`);
  }

  const ext = path.extname(originalFilename).toLowerCase();
  if (BLOCKED_EXTENSIONS.has(ext) || ext === ".svg" || ext === ".html" || ext === ".htm") {
    throw AppError.badRequest("Executable or script uploads are not allowed.");
  }

  const detected = detectMimeFromMagic(buffer);
  if (!detected || !APPROVED_MIME_TYPES.has(detected)) {
    throw AppError.badRequest(
      "Unsupported file type. Allowed: JPEG, PNG, WebP, PDF, DOCX. Antivirus scanning remains a deployment requirement for larger public rollout.",
    );
  }

  const allowedExts = EXT_BY_MIME[detected] ?? [];
  if (!allowedExts.includes(ext)) {
    throw AppError.badRequest("File extension does not match file content.");
  }

  if (
    input.declaredMime &&
    input.declaredMime !== detected &&
    !(detected === "image/jpeg" && input.declaredMime === "image/jpg")
  ) {
    // Soft mismatch: trust content, reject if declared is explicitly dangerous
    if (
      input.declaredMime.includes("svg") ||
      input.declaredMime.includes("html") ||
      input.declaredMime.includes("javascript")
    ) {
      throw AppError.badRequest("MIME type spoofing rejected.");
    }
  }

  const checksumSha256 = createHash("sha256").update(buffer).digest("hex");
  const safeBase = sanitiseBaseName(originalFilename.replace(ext, ""));
  const generatedName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const safeFilename = `${safeBase}${ext}`;

  return {
    mimeType: detected,
    evidenceType: detected.startsWith("image/") ? "IMAGE" : "DOCUMENT",
    originalFilename: path.basename(originalFilename).slice(0, 200),
    safeFilename,
    generatedName,
    checksumSha256,
    size: buffer.length,
    extension: ext,
  };
}

const PRIVATE_HOST_RE =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.|\[::1\])/i;

const MAX_EVIDENCE_URL_LENGTH = 2048;

export function validateEvidenceLinkUrl(raw: string): string {
  if (/[\u0000-\u001F\u007F]/.test(raw)) {
    throw AppError.badRequest("URL contains invalid characters.");
  }
  if (raw.length > MAX_EVIDENCE_URL_LENGTH) {
    throw AppError.badRequest("Evidence URL is too long.");
  }
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    throw AppError.badRequest("Invalid evidence URL.");
  }
  const protocol = parsed.protocol.toLowerCase();
  if (
    protocol === "javascript:" ||
    protocol === "data:" ||
    protocol === "file:" ||
    protocol === "blob:"
  ) {
    throw AppError.badRequest("Unsupported URL protocol.");
  }
  if (protocol !== "https:") {
    throw AppError.badRequest("Only HTTPS links are allowed for evidence.");
  }
  if (parsed.username || parsed.password) {
    throw AppError.badRequest("URLs must not include credentials.");
  }
  if (PRIVATE_HOST_RE.test(parsed.hostname) || parsed.hostname.endsWith(".local")) {
    throw AppError.badRequest("Private-network and localhost links are not allowed.");
  }
  parsed.hash = "";
  // Never fetch or scrape the URL — normalize and store only.
  return parsed.toString();
}

export function filenameCategory(mimeType: string | null | undefined, type: string): string {
  if (type === "LINK") return "link";
  if (mimeType?.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType?.includes("wordprocessingml")) return "document";
  return type.toLowerCase();
}
