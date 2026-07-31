import { z } from "zod";

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
  role: z.enum(["WORKER", "ORGANISATION"]).default("WORKER"),
});

export const loginSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  headline: z.string().max(200).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  skills: z.array(z.string().min(1).max(80)).max(20).optional(),
});

export const receiptCreateSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().max(30).optional(),
  serviceTitle: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  durationMinutes: z.number().int().positive().max(10000).optional(),
  amount: z.number().positive().max(999999999).optional(),
  currency: z.string().length(3).default("XAF"),
  skillsDemonstrated: z.array(z.string().min(1).max(80)).max(20).default([]),
  visibility: z.enum(["PRIVATE", "UNLISTED", "PUBLIC"]).default("PRIVATE"),
});

export const receiptUpdateSchema = receiptCreateSchema.partial();

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

export const verificationRespondSchema = z.object({
  decision: z.enum(["CONFIRMED", "CORRECTION_REQUESTED", "DISPUTED"]),
  customerName: z.string().min(2).max(120),
  comment: z.string().max(2000).optional(),
  reason: z.string().max(500).optional(),
  description: z.string().max(5000).optional(),
});

export const evidenceLinkSchema = z.object({
  type: z.enum(["LINK"]),
  url: z.string().url(),
  description: z.string().max(500).optional(),
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
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ReceiptCreateInput = z.infer<typeof receiptCreateSchema>;
export type ReceiptUpdateInput = z.infer<typeof receiptUpdateSchema>;
export type ReceiptListQueryInput = z.infer<typeof receiptListQuerySchema>;
export type VerificationRespondInput = z.infer<typeof verificationRespondSchema>;
export type AdminResolveDisputeInput = z.infer<typeof adminResolveDisputeSchema>;
export type AdminRevokeInput = z.infer<typeof adminRevokeSchema>;
