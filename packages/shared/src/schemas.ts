import { z } from "zod";
import { durationUnitSchema, durationValueSchema } from "./duration.js";
import {
  confirmationMethodSchema,
  detectLinkPlatform,
  evidenceVisibilitySchema,
  MAX_EVIDENCE_URL_LENGTH,
} from "./confirmation.js";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a number");

export const registerSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: passwordSchema,
  fullName: z.string().min(2).max(120).trim(),
  /** Public self-registration is worker-only. Organisation accounts are invitation-based. */
  role: z.literal("WORKER").default("WORKER"),
  acceptTerms: z
    .boolean()
    .refine((v) => v === true, { message: "You must accept the Terms of Use." }),
  acceptPrivacy: z
    .boolean()
    .refine((v) => v === true, { message: "You must accept the Privacy Policy." }),
});

export const adminUserListQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  role: z.enum(["WORKER", "ORGANISATION", "ADMIN"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const adminReceiptListQuerySchema = z.object({
  search: z.string().max(200).optional(),
  status: z
    .enum([
      "DRAFT",
      "PENDING_VERIFICATION",
      "VERIFIED",
      "CORRECTION_REQUESTED",
      "DISPUTED",
      "REVOKED",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const loginSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20).max(200),
  password: passwordSchema,
});

export const profileUpdateSchema = z.object({
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  skills: z.array(z.string().min(1).max(80)).max(20).optional(),
});

const receiptFieldsSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z
    .string()
    .email("Enter a valid email address. Any working email works — Gmail is not required.")
    .nullish(),
  customerPhone: z.string().max(30).optional(),
  confirmationMethod: confirmationMethodSchema.default("EMAIL"),
  serviceTitle: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Preferred: value + unit. Null clears duration on update. */
  durationValue: durationValueSchema.nullish(),
  durationUnit: durationUnitSchema.nullish(),
  /** Legacy minutes-only input; still accepted for compatibility. */
  durationMinutes: z.number().int().positive().max(10000).nullish(),
  amount: z.number().positive().max(999999999).optional(),
  currency: z.string().length(3).default("XAF"),
  skillsDemonstrated: z.array(z.string().min(1).max(80)).max(20).default([]),
  visibility: z.enum(["PRIVATE", "UNLISTED", "PUBLIC"]).default("PRIVATE"),
});

function refineDurationPair<T extends { durationValue?: number | null; durationUnit?: string | null }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  const valuePresent = data.durationValue != null;
  const unitPresent = data.durationUnit != null;
  if (valuePresent !== unitPresent) {
    ctx.addIssue({
      code: "custom",
      message: "Duration value and unit must be provided together.",
      path: valuePresent ? ["durationUnit"] : ["durationValue"],
    });
  }
}

function refineConfirmationEmail<
  T extends {
    confirmationMethod?: string | null;
    customerEmail?: string | null;
  },
>(data: T, ctx: z.RefinementCtx) {
  const method = data.confirmationMethod ?? "EMAIL";
  if (method === "EMAIL") {
    if (!data.customerEmail || !String(data.customerEmail).trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Customer email is required for email confirmation.",
        path: ["customerEmail"],
      });
    }
  }
}

export const receiptCreateSchema = receiptFieldsSchema
  .superRefine(refineDurationPair)
  .superRefine(refineConfirmationEmail);

export const receiptUpdateSchema = receiptFieldsSchema
  .partial()
  .superRefine(refineDurationPair)
  .superRefine((data, ctx) => {
    // When method is explicitly EMAIL, or email is cleared while method stays EMAIL on server — validated in service too.
    if (data.confirmationMethod === "EMAIL" && data.customerEmail === null) {
      ctx.addIssue({
        code: "custom",
        message: "Customer email is required for email confirmation.",
        path: ["customerEmail"],
      });
    }
    if (data.confirmationMethod === "EMAIL" && data.customerEmail !== undefined) {
      refineConfirmationEmail(
        { confirmationMethod: "EMAIL", customerEmail: data.customerEmail },
        ctx,
      );
    }
  });

export const receiptListQuerySchema = z.object({
  status: z
    .enum([
      "DRAFT",
      "PENDING_VERIFICATION",
      "VERIFIED",
      "CORRECTION_REQUESTED",
      "DISPUTED",
      "REVOKED",
    ])
    .optional(),
  archived: z.enum(["true", "false", "all"]).default("false"),
  search: z.string().max(200).optional(),
  skill: z.string().max(80).optional(),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["workDate", "createdAt", "serviceTitle"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const verificationRespondSchema = z
  .object({
    decision: z.enum(["CONFIRMED", "CORRECTION_REQUESTED", "DISPUTED"]),
    customerName: z.string().min(2).max(120),
    comment: z.string().max(2000).optional(),
    reason: z.string().max(500).optional(),
    description: z.string().max(5000).optional(),
    /** Required when confirming — locks the receipt as portable proof. */
    acknowledgedAccuracy: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "CONFIRMED" && data.acknowledgedAccuracy !== true) {
      ctx.addIssue({
        code: "custom",
        message: "Confirm that you reviewed these work details and they are accurate.",
        path: ["acknowledgedAccuracy"],
      });
    }
    if (data.decision === "CORRECTION_REQUESTED") {
      const reason = (data.reason ?? data.comment ?? data.description ?? "").trim();
      if (reason.length < 5) {
        ctx.addIssue({
          code: "custom",
          message: "Please describe the correction needed.",
          path: ["comment"],
        });
      }
    }
  });

const dangerousUrlPattern = /[\u0000-\u001F\u007F]/;

export const evidenceLinkSchema = z
  .object({
    type: z.enum(["LINK"]),
    url: z.string().min(8).max(MAX_EVIDENCE_URL_LENGTH),
    description: z.string().max(500).optional(),
    visibility: evidenceVisibilitySchema.default("CUSTOMER_ONLY"),
    linkPlatform: z.string().max(40).optional(),
  })
  .superRefine((data, ctx) => {
    if (dangerousUrlPattern.test(data.url)) {
      ctx.addIssue({ code: "custom", message: "URL contains invalid characters.", path: ["url"] });
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(data.url.trim());
    } catch {
      ctx.addIssue({ code: "custom", message: "Invalid evidence URL.", path: ["url"] });
      return;
    }
    if (parsed.protocol !== "https:") {
      ctx.addIssue({
        code: "custom",
        message: "Only HTTPS links are allowed for evidence.",
        path: ["url"],
      });
    }
    if (parsed.username || parsed.password) {
      ctx.addIssue({
        code: "custom",
        message: "URLs must not include credentials.",
        path: ["url"],
      });
    }
    const lower = parsed.protocol.toLowerCase();
    if (
      lower.startsWith("javascript:") ||
      lower.startsWith("data:") ||
      lower.startsWith("file:") ||
      lower.startsWith("blob:")
    ) {
      ctx.addIssue({ code: "custom", message: "Unsupported URL protocol.", path: ["url"] });
    }
  })
  .transform((data) => {
    const normalized = new URL(data.url.trim());
    normalized.hash = "";
    const externalUrl = normalized.toString();
    return {
      ...data,
      url: externalUrl,
      linkPlatform: data.linkPlatform ?? detectLinkPlatform(externalUrl),
    };
  });

export const evidenceFileMetaSchema = z.object({
  description: z.string().max(500).optional(),
  visibility: evidenceVisibilitySchema.default("CUSTOMER_ONLY"),
});

export const evidenceVisibilityUpdateSchema = z.object({
  visibility: evidenceVisibilitySchema,
});

export const adminUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export const adminResolveDisputeSchema = z.object({
  resolution: z.string().min(5).max(2000),
  receiptStatus: z.enum(["VERIFIED", "REVOKED", "CORRECTION_REQUESTED"]),
});

export const adminRevokeSchema = z.object({
  reason: z.string().min(5).max(1000),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ReceiptCreateInput = z.infer<typeof receiptCreateSchema>;
export type ReceiptUpdateInput = z.infer<typeof receiptUpdateSchema>;
export type ReceiptListQueryInput = z.infer<typeof receiptListQuerySchema>;
export type VerificationRespondInput = z.infer<typeof verificationRespondSchema>;
export type EvidenceLinkInput = z.infer<typeof evidenceLinkSchema>;
export type AdminResolveDisputeInput = z.infer<typeof adminResolveDisputeSchema>;
export type AdminRevokeInput = z.infer<typeof adminRevokeSchema>;
export type AdminUserListQueryInput = z.infer<typeof adminUserListQuerySchema>;
export type AdminReceiptListQueryInput = z.infer<typeof adminReceiptListQuerySchema>;
