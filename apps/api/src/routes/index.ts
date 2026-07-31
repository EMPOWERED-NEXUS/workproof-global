import { Router } from "express";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  profileUpdateSchema,
  receiptCreateSchema,
  receiptUpdateSchema,
  receiptListQuerySchema,
  verificationRespondSchema,
  evidenceLinkSchema,
  adminUserStatusSchema,
  adminResolveDisputeSchema,
  adminRevokeSchema,
} from "@workproof/shared";
import type {
  AdminResolveDisputeInput,
  AdminRevokeInput,
  LoginInput,
  ProfileUpdateInput,
  ReceiptCreateInput,
  ReceiptListQueryInput,
  ReceiptUpdateInput,
  RegisterInput,
  VerificationRespondInput,
} from "@workproof/shared";
import {
  asyncHandler,
  validateBody,
  validateQuery,
  validatedBody,
  validatedQuery,
} from "../middleware/validate.js";
import {
  authenticate,
  authorize,
  clearSessionCookies,
  getClientPlatform,
  setSessionCookies,
  signAccessToken,
  type AuthUser,
} from "../middleware/auth.js";
import { env } from "../config/env.js";
import {
  emailVerificationRateLimiter,
  loginRateLimiter,
  refreshRateLimiter,
  verificationRateLimiter,
} from "../middleware/rateLimit.js";
import { upload } from "../middleware/upload.js";
import { registerUser, loginUser, getUserById } from "../services/auth.service.js";
import {
  createSession,
  listUserSessions,
  revokeAllUserSessions,
  revokeOwnedSession,
  revokeRefreshToken,
  rotateRefreshToken,
  type IssuedSession,
} from "../services/session.service.js";
import {
  getOwnProfile,
  updateOwnProfile,
  getPublicWorkerProfile,
} from "../services/profile.service.js";
import {
  createReceipt,
  listReceipts,
  getReceiptForWorker,
  updateReceipt,
  deleteReceipt,
  submitReceipt,
  resendCustomerVerification,
  getVerificationDeliveryStatus,
  archiveReceipt,
  unarchiveReceipt,
  getPublicProof,
} from "../services/receipt.service.js";
import {
  addFileEvidence,
  addLinkEvidence,
  removeEvidence,
  downloadEvidence,
} from "../services/evidence.service.js";
import {
  getEmailVerificationStatus,
  resendEmailVerification,
  verifyEmailWithToken,
} from "../services/email-verification.service.js";
import {
  getVerificationByToken,
  respondToVerification,
} from "../services/verification.service.js";
import { listReceiptEventsForWorker } from "../services/receipt-event.service.js";
import {
  getWorkerDashboard,
  getOrganisationDashboard,
  listAdminUsers,
  listAdminReceipts,
  listAdminDisputes,
  updateUserStatus,
  revokeReceipt,
  resolveDispute,
} from "../services/dashboard.service.js";

const verifyEmailBodySchema = z.object({
  token: z.string().min(20).max(200),
});

export const apiRouter = Router();

const refreshBodySchema = z.object({
  refreshToken: z.string().min(20).optional(),
});

function param(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function clientIp(req: { ip?: string; socket?: { remoteAddress?: string } }): string | undefined {
  return req.ip ?? req.socket?.remoteAddress;
}

function sessionMeta(req: {
  ip?: string;
  socket?: { remoteAddress?: string };
  get: (name: string) => string | undefined;
}) {
  return {
    ipAddress: clientIp(req),
    userAgent: req.get("user-agent"),
  };
}

function deliverSession(
  req: Parameters<typeof getClientPlatform>[0],
  res: {
    status: (code: number) => { json: (body: unknown) => void };
    json: (body: unknown) => void;
  },
  user: AuthUser,
  session: IssuedSession,
  statusCode = 200,
): void {
  const platform = getClientPlatform(req);
  setSessionCookies(res as never, session);

  const payload =
    platform === "mobile"
      ? {
          user,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        }
      : { user };

  if (statusCode === 201) {
    res.status(201).json({ success: true, data: payload });
    return;
  }
  res.json({ success: true, data: payload });
}

function readRefreshToken(req: {
  cookies?: Record<string, string>;
  body?: unknown;
}): string | undefined {
  const fromCookie = req.cookies?.[env.REFRESH_COOKIE_NAME];
  const parsed = refreshBodySchema.safeParse(req.body ?? {});
  const fromBody = parsed.success ? parsed.data.refreshToken : undefined;
  return fromBody || fromCookie;
}

// Auth
apiRouter.post(
  "/auth/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const user = await registerUser(validatedBody<RegisterInput>(req), clientIp(req));
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
    const session = await createSession(authUser, sessionMeta(req), signAccessToken);
    deliverSession(req, res, authUser, session, 201);
  }),
);

apiRouter.post(
  "/auth/login",
  loginRateLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const body = validatedBody<LoginInput>(req);
    const user = await loginUser(body.email, body.password);
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
    const session = await createSession(authUser, sessionMeta(req), signAccessToken);
    deliverSession(req, res, authUser, session);
  }),
);

apiRouter.post(
  "/auth/refresh",
  refreshRateLimiter,
  asyncHandler(async (req, res) => {
    const presented = readRefreshToken(req);
    if (!presented) {
      res.status(401).json({ success: false, message: "Refresh token required." });
      return;
    }
    const session = await rotateRefreshToken(presented, sessionMeta(req), signAccessToken);
    const platform = getClientPlatform(req);
    setSessionCookies(res, session);
    if (platform === "mobile") {
      res.json({
        success: true,
        data: {
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
        },
      });
      return;
    }
    res.json({ success: true, data: { message: "Session refreshed." } });
  }),
);

apiRouter.post(
  "/auth/logout",
  asyncHandler(async (req, res) => {
    const presented = readRefreshToken(req);
    if (presented) {
      await revokeRefreshToken(presented, req.user?.id, sessionMeta(req));
    }
    clearSessionCookies(res);
    res.json({ success: true, data: { message: "Logged out." } });
  }),
);

apiRouter.post(
  "/auth/logout-all",
  authenticate,
  asyncHandler(async (req, res) => {
    const count = await revokeAllUserSessions(req.user!.id, req.user!.id, sessionMeta(req));
    clearSessionCookies(res);
    res.json({ success: true, data: { message: "All sessions revoked.", revokedCount: count } });
  }),
);

apiRouter.get(
  "/auth/me",
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await getUserById(req.user!.id);
    res.json({ success: true, data: user });
  }),
);

apiRouter.get(
  "/auth/sessions",
  authenticate,
  asyncHandler(async (req, res) => {
    const sessions = await listUserSessions(req.user!.id);
    res.json({ success: true, data: sessions });
  }),
);

apiRouter.delete(
  "/auth/sessions/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await revokeOwnedSession(req.user!.id, param(req.params.id), sessionMeta(req));
    res.json({ success: true, data: { message: "Session revoked." } });
  }),
);

apiRouter.get(
  "/auth/email-verification-status",
  authenticate,
  asyncHandler(async (req, res) => {
    const status = await getEmailVerificationStatus(req.user!.id);
    res.json({ success: true, data: status });
  }),
);

apiRouter.post(
  "/auth/resend-email-verification",
  authenticate,
  emailVerificationRateLimiter,
  asyncHandler(async (req, res) => {
    const result = await resendEmailVerification(req.user!.id, clientIp(req));
    res.json({ success: true, data: result });
  }),
);

apiRouter.post(
  "/auth/verify-email",
  emailVerificationRateLimiter,
  validateBody(verifyEmailBodySchema),
  asyncHandler(async (req, res) => {
    const body = validatedBody<{ token: string }>(req);
    const result = await verifyEmailWithToken(body.token, clientIp(req));
    res.json({ success: true, data: result });
  }),
);

// Profile
apiRouter.get(
  "/profile",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const profile = await getOwnProfile(req.user!.id);
    res.json({ success: true, data: profile });
  }),
);

apiRouter.patch(
  "/profile",
  authenticate,
  authorize("WORKER"),
  validateBody(profileUpdateSchema),
  asyncHandler(async (req, res) => {
    const profile = await updateOwnProfile(req.user!.id, validatedBody<ProfileUpdateInput>(req));
    res.json({ success: true, data: profile });
  }),
);

apiRouter.get(
  "/workers/:profileSlug",
  asyncHandler(async (req, res) => {
    const profile = await getPublicWorkerProfile(param(req.params.profileSlug));
    res.json({ success: true, data: profile });
  }),
);

// Receipts
apiRouter.post(
  "/receipts",
  authenticate,
  authorize("WORKER"),
  validateBody(receiptCreateSchema),
  asyncHandler(async (req, res) => {
    const receipt = await createReceipt(
      req.user!.id,
      validatedBody<ReceiptCreateInput>(req),
      clientIp(req),
    );
    res.status(201).json({ success: true, data: receipt });
  }),
);

apiRouter.get(
  "/receipts",
  authenticate,
  authorize("WORKER"),
  validateQuery(receiptListQuerySchema),
  asyncHandler(async (req, res) => {
    const result = await listReceipts(
      req.user!.id,
      validatedQuery<ReceiptListQueryInput>(req),
    );
    res.json({ success: true, data: result });
  }),
);

apiRouter.get(
  "/receipts/:id",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const receipt = await getReceiptForWorker(req.user!.id, param(req.params.id));
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.patch(
  "/receipts/:id",
  authenticate,
  authorize("WORKER"),
  validateBody(receiptUpdateSchema),
  asyncHandler(async (req, res) => {
    const receipt = await updateReceipt(
      req.user!.id,
      param(req.params.id),
      validatedBody<ReceiptUpdateInput>(req),
      clientIp(req),
    );
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.delete(
  "/receipts/:id",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    await deleteReceipt(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: { message: "Receipt deleted." } });
  }),
);

apiRouter.post(
  "/receipts/:id/evidence",
  authenticate,
  authorize("WORKER"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const receiptId = param(req.params.id);
    if (req.file) {
      if (!req.file.buffer) {
        res.status(400).json({ success: false, message: "Upload failed." });
        return;
      }
      const evidence = await addFileEvidence(
        req.user!.id,
        receiptId,
        {
          buffer: req.file.buffer,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
        },
        typeof req.body.description === "string" ? req.body.description : undefined,
        clientIp(req),
      );
      res.status(201).json({ success: true, data: evidence });
      return;
    }

    const parsed = evidenceLinkSchema.parse(req.body);
    const evidence = await addLinkEvidence(
      req.user!.id,
      receiptId,
      { url: parsed.url, description: parsed.description },
      clientIp(req),
    );
    res.status(201).json({ success: true, data: evidence });
  }),
);

apiRouter.get(
  "/receipts/:id/evidence/:evidenceId/download",
  authenticate,
  authorize("WORKER", "ADMIN"),
  asyncHandler(async (req, res) => {
    await downloadEvidence(
      { id: req.user!.id, role: req.user!.role },
      param(req.params.id),
      param(req.params.evidenceId),
      res,
    );
  }),
);

apiRouter.delete(
  "/receipts/:id/evidence/:evidenceId",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    await removeEvidence(req.user!.id, param(req.params.id), param(req.params.evidenceId), clientIp(req));
    res.json({ success: true, data: { message: "Evidence removed." } });
  }),
);

apiRouter.post(
  "/receipts/:id/submit",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const result = await submitReceipt(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: result });
  }),
);

apiRouter.post(
  "/receipts/:id/resend-verification",
  authenticate,
  authorize("WORKER"),
  emailVerificationRateLimiter,
  asyncHandler(async (req, res) => {
    const result = await resendCustomerVerification(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: result });
  }),
);

apiRouter.get(
  "/receipts/:id/verification-delivery",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const result = await getVerificationDeliveryStatus(req.user!.id, param(req.params.id));
    res.json({ success: true, data: result });
  }),
);

apiRouter.post(
  "/receipts/:id/archive",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const receipt = await archiveReceipt(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.post(
  "/receipts/:id/unarchive",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const receipt = await unarchiveReceipt(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.get(
  "/receipts/:id/events",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const events = await listReceiptEventsForWorker(req.user!.id, param(req.params.id));
    res.json({ success: true, data: events });
  }),
);

// Customer verification (public)
apiRouter.get(
  "/verification/:token",
  verificationRateLimiter,
  asyncHandler(async (req, res) => {
    const data = await getVerificationByToken(param(req.params.token));
    res.json({ success: true, data });
  }),
);

apiRouter.post(
  "/verification/:token/respond",
  verificationRateLimiter,
  validateBody(verificationRespondSchema),
  asyncHandler(async (req, res) => {
    const result = await respondToVerification(
      param(req.params.token),
      validatedBody<VerificationRespondInput>(req),
      {
      ipAddress: clientIp(req),
      userAgent: req.get("user-agent"),
    });
    res.json({ success: true, data: result });
  }),
);

// Public proof
apiRouter.get(
  "/public/receipts/:verificationCode",
  asyncHandler(async (req, res) => {
    const proof = await getPublicProof(param(req.params.verificationCode));
    res.json({ success: true, data: proof });
  }),
);

// Dashboards
apiRouter.get(
  "/dashboard/worker",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const data = await getWorkerDashboard(req.user!.id);
    res.json({ success: true, data });
  }),
);

apiRouter.get(
  "/dashboard/organisation",
  authenticate,
  authorize("ORGANISATION"),
  asyncHandler(async (req, res) => {
    const data = await getOrganisationDashboard(req.user!.id);
    res.json({ success: true, data });
  }),
);

// Admin
apiRouter.get(
  "/admin/users",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const data = await listAdminUsers();
    res.json({ success: true, data });
  }),
);

apiRouter.get(
  "/admin/receipts",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const data = await listAdminReceipts();
    res.json({ success: true, data });
  }),
);

apiRouter.get(
  "/admin/disputes",
  authenticate,
  authorize("ADMIN"),
  asyncHandler(async (_req, res) => {
    const data = await listAdminDisputes();
    res.json({ success: true, data });
  }),
);

apiRouter.patch(
  "/admin/users/:id/status",
  authenticate,
  authorize("ADMIN"),
  validateBody(adminUserStatusSchema),
  asyncHandler(async (req, res) => {
    const body = validatedBody<{ status: "ACTIVE" | "SUSPENDED" }>(req);
    const user = await updateUserStatus(req.user!.id, param(req.params.id), body.status, clientIp(req));
    res.json({ success: true, data: user });
  }),
);

apiRouter.post(
  "/admin/receipts/:id/revoke",
  authenticate,
  authorize("ADMIN"),
  validateBody(adminRevokeSchema),
  asyncHandler(async (req, res) => {
    const body = validatedBody<AdminRevokeInput>(req);
    const receipt = await revokeReceipt(req.user!.id, param(req.params.id), body.reason, clientIp(req));
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.post(
  "/admin/disputes/:id/resolve",
  authenticate,
  authorize("ADMIN"),
  validateBody(adminResolveDisputeSchema),
  asyncHandler(async (req, res) => {
    const body = validatedBody<AdminResolveDisputeInput>(req);
    const result = await resolveDispute(
      req.user!.id,
      param(req.params.id),
      body.resolution,
      body.receiptStatus,
      clientIp(req),
    );
    res.json({ success: true, data: result });
  }),
);
