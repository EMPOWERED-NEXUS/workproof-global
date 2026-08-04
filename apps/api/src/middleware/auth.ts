import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import type { UserRole, UserStatus } from "../../generated/prisma/index.js";
import type { IssuedSession } from "../services/session.service.js";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
}

export type ClientPlatform = "web" | "mobile";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      clientPlatform?: ClientPlatform;
      accessTokenSource?: "bearer" | "cookie";
    }
  }
}

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  iss?: string;
  aud?: string | string[];
}

const ACCESS_COOKIE_MAX_AGE_MS = 15 * 60 * 1000;

function cookieOptions(path: string, maxAge: number) {
  return {
    httpOnly: true as const,
    secure: env.COOKIE_SECURE,
    sameSite: "lax" as const,
    maxAge,
    path,
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
}

export function getClientPlatform(req: Request): ClientPlatform {
  const header = req.get("x-client-platform")?.trim().toLowerCase();
  if (!header || header === "web") return "web";
  if (header === "mobile") return "mobile";
  throw AppError.badRequest("Invalid X-Client-Platform header. Allowed values: web, mobile.");
}

export function signAccessToken(user: AuthUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    } as jwt.SignOptions,
  );
}

export function setSessionCookies(res: Response, session: IssuedSession): void {
  res.cookie(
    env.ACCESS_COOKIE_NAME,
    session.accessToken,
    cookieOptions("/", ACCESS_COOKIE_MAX_AGE_MS),
  );
  res.cookie(
    env.REFRESH_COOKIE_NAME,
    session.refreshToken,
    cookieOptions(
      "/api/v1/auth",
      env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    ),
  );
}

export function clearSessionCookies(res: Response): void {
  const clearOpts = {
    path: "/",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
  const refreshClearOpts = {
    path: "/api/v1/auth",
    ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
  };
  res.clearCookie(env.ACCESS_COOKIE_NAME, clearOpts);
  res.clearCookie(env.REFRESH_COOKIE_NAME, refreshClearOpts);
}

function extractBearer(req: Request): string | undefined {
  const header = req.get("authorization");
  if (!header) return undefined;
  const [scheme, token] = header.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) return undefined;
  return token.trim();
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const bearer = extractBearer(req);
  const cookieToken = req.cookies?.[env.ACCESS_COOKIE_NAME] as string | undefined;
  const token = bearer ?? cookieToken;

  if (!token) {
    throw AppError.unauthorized();
  }

  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
    }) as AccessTokenPayload;

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status === "SUSPENDED") {
      throw AppError.unauthorized("Invalid or suspended account.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
    req.accessTokenSource = bearer ? "bearer" : "cookie";
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw AppError.unauthorized("Invalid or expired session.");
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const bearer = extractBearer(req);
  const cookieToken = req.cookies?.[env.ACCESS_COOKIE_NAME] as string | undefined;
  if (!bearer && !cookieToken) {
    next();
    return;
  }
  void authenticate(req, _res, next).catch(() => next());
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw AppError.unauthorized();
    if (!roles.includes(req.user.role)) throw AppError.forbidden();
    next();
  };
}

export function sanitizeUser<T extends { passwordHash?: string }>(
  user: T,
): Omit<T, "passwordHash"> {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

/** @deprecated Use signAccessToken */
export const signToken = signAccessToken;
/** @deprecated Use setSessionCookies */
export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.ACCESS_COOKIE_NAME, token, cookieOptions("/", ACCESS_COOKIE_MAX_AGE_MS));
}
/** @deprecated Use clearSessionCookies */
export function clearAuthCookie(res: Response): void {
  clearSessionCookies(res);
}
