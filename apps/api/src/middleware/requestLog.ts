import type { NextFunction, Request, Response } from "express";
import { createRequestId, logger } from "../lib/logger.js";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.get("x-request-id")?.trim();
  const requestId = incoming && incoming.length <= 100 ? incoming : createRequestId();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

function redactSensitivePath(path: string | undefined): string | undefined {
  if (!path) return path;
  return path
    .replace(/\/verification\/[^/]+/gi, "/verification/:token")
    .replace(/\/proof\/[^/]+/gi, "/proof/:code")
    .replace(/([?&](?:token|email|password|phone)=)[^&]*/gi, "$1[REDACTED]");
}

export function requestLogMiddleware(req: Request, res: Response, next: NextFunction): void {
  const started = Date.now();
  res.on("finish", () => {
    const route =
      (req.route?.path ? `${req.baseUrl}${req.route.path}` : undefined) ??
      redactSensitivePath(req.originalUrl?.split("?")[0]);
    logger.info("http_request", {
      requestId: req.requestId,
      method: req.method,
      route: redactSensitivePath(route),
      statusCode: res.statusCode,
      durationMs: Date.now() - started,
      userId: req.user?.id,
    });
  });
  next();
}
