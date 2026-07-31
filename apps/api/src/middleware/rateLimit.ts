import type { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

/** IPv6-safe rate-limit key from the client address. */
export function getSafeIpKey(req: Request): string {
  const address = req.ip ?? req.socket.remoteAddress ?? "unknown";
  return address === "unknown" ? address : ipKeyGenerator(address);
}

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
  keyGenerator: (req) => getSafeIpKey(req),
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many refresh attempts. Try again later." },
  keyGenerator: (req) => getSafeIpKey(req),
});

export const verificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification attempts. Try again later." },
  keyGenerator: (req) => getSafeIpKey(req),
});

export const emailVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many email verification requests. Try again later." },
  keyGenerator: (req) => getSafeIpKey(req),
});

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many password reset requests. Try again later." },
  keyGenerator: (req) => {
    const email =
      typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "unknown";
    return `${email}:${getSafeIpKey(req)}`;
  },
});

export const resetPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many password reset attempts. Try again later." },
  keyGenerator: (req) => getSafeIpKey(req),
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => getSafeIpKey(req),
});
