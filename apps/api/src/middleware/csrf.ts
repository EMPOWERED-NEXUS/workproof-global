import type { NextFunction, Request, Response } from "express";
import { isOriginAllowed } from "../config/env.js";
import { AppError } from "../lib/errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * For cookie-authenticated browser mutations, require a trusted Origin.
 * Bearer (mobile) requests are not Origin-dependent.
 */
export function csrfOriginGuard(req: Request, _res: Response, next: NextFunction): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const hasBearer = Boolean(req.get("authorization")?.toLowerCase().startsWith("bearer "));
  if (hasBearer) {
    next();
    return;
  }

  const origin = req.get("origin");
  // Same-origin / non-browser clients may omit Origin; allow only when no Origin is sent.
  // Browser cross-site requests always send Origin — reject untrusted values.
  if (!origin) {
    next();
    return;
  }

  if (!isOriginAllowed(origin)) {
    throw AppError.forbidden("Untrusted request origin.");
  }

  next();
}
