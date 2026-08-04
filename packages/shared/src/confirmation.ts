import { z } from "zod";

export const CONFIRMATION_METHODS = ["EMAIL", "SHARE_LINK", "IN_PERSON_QR"] as const;
export type ConfirmationMethod = (typeof CONFIRMATION_METHODS)[number];

export const EVIDENCE_VISIBILITY = ["CUSTOMER_ONLY", "PUBLIC_PROOF"] as const;
export type EvidenceVisibility = (typeof EVIDENCE_VISIBILITY)[number];

export const LINK_PLATFORMS = [
  "TikTok",
  "Instagram",
  "Facebook",
  "YouTube",
  "X",
  "LinkedIn",
  "Other website",
] as const;
export type LinkPlatform = (typeof LINK_PLATFORMS)[number];

export const confirmationMethodSchema = z.enum(CONFIRMATION_METHODS);
export const evidenceVisibilitySchema = z.enum(EVIDENCE_VISIBILITY);

/** Precise public-proof / confirmation disclosure labels. */
export function confirmationAssuranceLabel(method: ConfirmationMethod): string {
  switch (method) {
    case "EMAIL":
      return "Customer confirmed through an email link";
    case "SHARE_LINK":
      return "Customer confirmed through a secure share link";
    case "IN_PERSON_QR":
      return "Customer confirmed in person";
  }
}

export function confirmationChannelNote(method: ConfirmationMethod): string | null {
  if (method === "SHARE_LINK" || method === "IN_PERSON_QR") {
    return "WorkProof records the confirmation action but does not independently verify ownership of the customer’s phone or messaging account.";
  }
  return null;
}

/** Browser-side E.164 helper for WhatsApp deep links. Never send to the API. */
export const e164PhoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{6,14}$/, "Use international format, for example +2376xxxxxxx.");

export function digitsOnlyPhone(e164: string): string {
  return e164.replace(/\D/g, "");
}

export function buildWhatsAppShareUrl(params: {
  phoneE164?: string | null;
  message: string;
}): string {
  const text = encodeURIComponent(params.message);
  const digits = params.phoneE164 ? digitsOnlyPhone(params.phoneE164) : "";
  if (digits) return `https://wa.me/${digits}?text=${text}`;
  return `https://wa.me/?text=${text}`;
}

export function buildShareConfirmationMessage(params: {
  customerName: string;
  workerName: string;
  confirmationUrl: string;
}): string {
  return [
    `Hello ${params.customerName}, please review and confirm the work completed by ${params.workerName} using this secure WorkProof link:`,
    "",
    params.confirmationUrl,
    "",
    "No WorkProof account is required. Please confirm only if the details are accurate.",
  ].join("\n");
}

const PLATFORM_HOST_RULES: Array<{ platform: LinkPlatform; match: (host: string) => boolean }> = [
  { platform: "TikTok", match: (h) => h === "tiktok.com" || h.endsWith(".tiktok.com") || h === "vm.tiktok.com" },
  { platform: "Instagram", match: (h) => h === "instagram.com" || h.endsWith(".instagram.com") },
  { platform: "Facebook", match: (h) => h === "facebook.com" || h.endsWith(".facebook.com") || h === "fb.com" || h.endsWith(".fb.com") },
  { platform: "YouTube", match: (h) => h === "youtube.com" || h.endsWith(".youtube.com") || h === "youtu.be" },
  { platform: "X", match: (h) => h === "x.com" || h.endsWith(".x.com") || h === "twitter.com" || h.endsWith(".twitter.com") },
  { platform: "LinkedIn", match: (h) => h === "linkedin.com" || h.endsWith(".linkedin.com") },
];

export function detectLinkPlatform(url: string): LinkPlatform {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    for (const rule of PLATFORM_HOST_RULES) {
      if (rule.match(host)) return rule.platform;
    }
  } catch {
    // fall through
  }
  return "Other website";
}

/** Max length for stored evidence URLs. */
export const MAX_EVIDENCE_URL_LENGTH = 2048;
