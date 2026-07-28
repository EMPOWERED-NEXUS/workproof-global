import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodType } from "zod";
import { AppError } from "../lib/errors.js";
import { env } from "../config/env.js";

declare global {
  namespace Express {
    interface Request {
      /** Parsed validation results — never overwrites read-only req.query/params in Express 5. */
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

function ensureValidated(req: Request): NonNullable<Request["validated"]> {
  req.validated ??= {};
  return req.validated;
}

export function validatedBody<T>(req: Request): T {
  return req.validated?.body as T;
}

export function validatedQuery<T>(req: Request): T {
  return req.validated?.query as T;
}

export function validatedParams<T>(req: Request): T {
  return req.validated?.params as T;
}

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      ensureValidated(req).body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      ensureValidated(req).query = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams<T>(schema: ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      ensureValidated(req).params = schema.parse(req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "body";
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: fieldErrors,
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production"
        ? "An unexpected error occurred."
        : error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    void fn(req, res, next).catch(next);
  };
}
