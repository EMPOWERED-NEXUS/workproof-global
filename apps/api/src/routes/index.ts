import { Router } from "express";
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
import { asyncHandler, validateBody, validateQuery } from "../middleware/validate.js";
import {
  authenticate,
  authorize,
  clearAuthCookie,
  setAuthCookie,
  signToken,
} from "../middleware/auth.js";
import { loginRateLimiter, verificationRateLimiter } from "../middleware/rateLimit.js";
import { upload, evidenceTypeFromMime } from "../middleware/upload.js";
import { registerUser, loginUser, getUserById } from "../services/auth.service.js";
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
  addEvidence,
  removeEvidence,
  submitReceipt,
  archiveReceipt,
  getPublicProof,
} from "../services/receipt.service.js";
import {
  getVerificationByToken,
  respondToVerification,
} from "../services/verification.service.js";
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
import { env } from "../config/env.js";

export const apiRouter = Router();

function param(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function clientIp(req: { ip?: string; socket?: { remoteAddress?: string } }): string | undefined {
  return req.ip ?? req.socket?.remoteAddress;
}

// Auth
apiRouter.post(
  "/auth/register",
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    const user = await registerUser(req.body, clientIp(req));
    const token = signToken(user);
    setAuthCookie(res, token);
    res.status(201).json({ success: true, data: { user, token } });
  }),
);

apiRouter.post(
  "/auth/login",
  loginRateLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const user = await loginUser(req.body.email, req.body.password);
    const token = signToken(user);
    setAuthCookie(res, token);
    res.json({ success: true, data: { user, token } });
  }),
);

apiRouter.post(
  "/auth/logout",
  asyncHandler(async (_req, res) => {
    clearAuthCookie(res);
    res.json({ success: true, data: { message: "Logged out." } });
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
    const profile = await updateOwnProfile(req.user!.id, req.body);
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
    const receipt = await createReceipt(req.user!.id, req.body, clientIp(req));
    res.status(201).json({ success: true, data: receipt });
  }),
);

apiRouter.get(
  "/receipts",
  authenticate,
  authorize("WORKER"),
  validateQuery(receiptListQuerySchema),
  asyncHandler(async (req, res) => {
    const result = await listReceipts(req.user!.id, req.query as never);
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
    const receipt = await updateReceipt(req.user!.id, param(req.params.id), req.body, clientIp(req));
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
      const evidence = await addEvidence(
        req.user!.id,
        receiptId,
        {
          type: evidenceTypeFromMime(req.file.mimetype),
          url: `/uploads/${req.file.filename}`,
          originalFilename: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          description: typeof req.body.description === "string" ? req.body.description : undefined,
        },
        clientIp(req),
      );
      res.status(201).json({ success: true, data: evidence });
      return;
    }

    const parsed = evidenceLinkSchema.parse(req.body);
    const evidence = await addEvidence(
      req.user!.id,
      receiptId,
      { type: "LINK", url: parsed.url, description: parsed.description },
      clientIp(req),
    );
    res.status(201).json({ success: true, data: evidence });
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
  "/receipts/:id/archive",
  authenticate,
  authorize("WORKER"),
  asyncHandler(async (req, res) => {
    const receipt = await archiveReceipt(req.user!.id, param(req.params.id), clientIp(req));
    res.json({ success: true, data: receipt });
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
    const result = await respondToVerification(param(req.params.token), req.body, {
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
    const user = await updateUserStatus(req.user!.id, param(req.params.id), req.body.status, clientIp(req));
    res.json({ success: true, data: user });
  }),
);

apiRouter.post(
  "/admin/receipts/:id/revoke",
  authenticate,
  authorize("ADMIN"),
  validateBody(adminRevokeSchema),
  asyncHandler(async (req, res) => {
    const receipt = await revokeReceipt(req.user!.id, param(req.params.id), req.body.reason, clientIp(req));
    res.json({ success: true, data: receipt });
  }),
);

apiRouter.post(
  "/admin/disputes/:id/resolve",
  authenticate,
  authorize("ADMIN"),
  validateBody(adminResolveDisputeSchema),
  asyncHandler(async (req, res) => {
    const result = await resolveDispute(
      req.user!.id,
      param(req.params.id),
      req.body.resolution,
      req.body.receiptStatus,
      clientIp(req),
    );
    res.json({ success: true, data: result });
  }),
);

// Static uploads in development
apiRouter.use("/uploads", (_req, res, next) => next());
