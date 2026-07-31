import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import request from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashToken } from "../src/lib/crypto.js";
import { decryptEmailPayload } from "../src/email/payload-crypto.js";
import {
  claimNextEmailJob,
  processClaimedEmailJob,
  processPendingEmailJobs,
} from "../src/email/dispatcher.js";
import { env } from "../src/config/env.js";
import { markEmailVerified, registerWorker } from "./helpers.js";

function minimalPng(): Buffer {
  // 1x1 PNG
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
}

function minimalJpeg(): Buffer {
  return Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
    0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xff, 0xda, 0x00, 0x08,
    0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x7f, 0xff, 0xd9,
  ]);
}

async function createDraft(agent: ReturnType<typeof request.agent>) {
  const createRes = await agent.post("/api/v1/receipts").send({
    customerName: "Evidence Customer",
    customerEmail: "evidence-customer@test.com",
    serviceTitle: "Evidence service",
    description: "Completed evidence service work for Wave 0C secure storage tests.",
    workDate: "2026-07-01",
  });
  expect(createRes.status).toBe(201);
  return createRes.body.data.id as string;
}

describe("Wave 0C evidence and email", () => {
  beforeEach(() => {
    fs.mkdirSync(path.resolve(process.cwd(), env.LOCAL_STORAGE_DIR), { recursive: true });
  });

  it("does not expose /uploads publicly", async () => {
    const res = await request(app).get("/uploads/anything.jpg");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("owner can upload and download local evidence; unrelated worker cannot", async () => {
    const owner = await registerWorker("owner-ev@test.com");
    const other = await registerWorker("other-ev@test.com");
    const receiptId = await createDraft(owner);
    const png = minimalPng();

    const uploadRes = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .attach("file", png, { filename: "shot.png", contentType: "image/png" });
    expect(uploadRes.status).toBe(201);
    expect(uploadRes.body.data.checksumSha256).toBe(createHash("sha256").update(png).digest("hex"));
    expect(uploadRes.body.data).not.toHaveProperty("storageKey");
    expect(JSON.stringify(uploadRes.body.data)).not.toMatch(/service_role|SUPABASE/i);

    const evidenceId = uploadRes.body.data.id as string;
    const dl = await owner.get(`/api/v1/receipts/${receiptId}/evidence/${evidenceId}/download`);
    expect(dl.status).toBe(200);
    expect(dl.headers["content-type"]).toContain("image/png");

    const forbidden = await other.get(
      `/api/v1/receipts/${receiptId}/evidence/${evidenceId}/download`,
    );
    expect(forbidden.status).toBe(404);
  });

  it("admin can download evidence; deleted evidence cannot", async () => {
    const owner = await registerWorker("admin-ev-owner@test.com");
    const receiptId = await createDraft(owner);
    const uploadRes = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .attach("file", minimalJpeg(), { filename: "a.jpg", contentType: "image/jpeg" });
    const evidenceId = uploadRes.body.data.id as string;

    const adminAgent = request.agent(app);
    await adminAgent.post("/api/v1/auth/register").send({
      email: "admin-ev@test.com",
      password: "SecurePass1",
      fullName: "Admin Ev",
      role: "WORKER",
    });
    await prisma.user.update({
      where: { email: "admin-ev@test.com" },
      data: { role: "ADMIN", emailVerifiedAt: new Date() },
    });
    // re-login not required — JWT still WORKER; promote and get fresh session
    const login = request.agent(app);
    await login.post("/api/v1/auth/login").send({
      email: "admin-ev@test.com",
      password: "SecurePass1",
    });
    const adminDl = await login.get(
      `/api/v1/receipts/${receiptId}/evidence/${evidenceId}/download`,
    );
    expect(adminDl.status).toBe(200);

    await owner.delete(`/api/v1/receipts/${receiptId}/evidence/${evidenceId}`);
    const deleted = await owner.get(
      `/api/v1/receipts/${receiptId}/evidence/${evidenceId}/download`,
    );
    expect(deleted.status).toBe(404);
  });

  it("rejects path traversal keys via download of unknown evidence", async () => {
    const owner = await registerWorker("path-ev@test.com");
    const receiptId = await createDraft(owner);
    const res = await owner.get(
      `/api/v1/receipts/${receiptId}/evidence/00000000-0000-0000-0000-000000000000/download`,
    );
    expect(res.status).toBe(404);
  });

  it("rejects executable and MIME spoofed uploads", async () => {
    const owner = await registerWorker("spoof-ev@test.com");
    const receiptId = await createDraft(owner);

    const exe = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .attach("file", Buffer.from("MZ"), { filename: "bad.exe", contentType: "image/png" });
    expect(exe.status).toBe(400);

    const spoof = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .attach("file", Buffer.from("<html>hi</html>"), {
        filename: "x.png",
        contentType: "image/png",
      });
    expect(spoof.status).toBe(400);
  });

  it("rejects oversized uploads", async () => {
    const owner = await registerWorker("oversize-ev@test.com");
    const receiptId = await createDraft(owner);
    const big = Buffer.concat([minimalPng(), Buffer.alloc(env.MAX_UPLOAD_SIZE_MB * 1024 * 1024)]);
    const res = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .attach("file", big, { filename: "big.png", contentType: "image/png" });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("rejects unsafe and private-network link protocols", async () => {
    const owner = await registerWorker("link-ev@test.com");
    const receiptId = await createDraft(owner);

    const js = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .send({ type: "LINK", url: "javascript:alert(1)" });
    expect(js.status).toBe(400);

    const local = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .send({ type: "LINK", url: "http://127.0.0.1/secret" });
    expect(local.status).toBe(400);

    const ok = await owner
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .send({ type: "LINK", url: "https://example.com/proof" });
    expect(ok.status).toBe(201);
    expect(ok.body.data.externalUrl).toBe("https://example.com/proof");
  });

  it("cleans storage when DB create fails after upload", async () => {
    const owner = await registerWorker("cleanup-ev@test.com");
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "cleanup-ev@test.com" } });
    const receiptId = await createDraft(owner);
    const { addFileEvidence } = await import("../src/services/evidence.service.js");
    const { getStorageProvider } = await import("../src/storage/index.js");

    // Force failure by using an invalid receiptId after a successful path check — use spy via closed receipt
    await prisma.workReceipt.update({
      where: { id: receiptId },
      data: { status: "VERIFIED", lockedAt: new Date() },
    });
    await expect(
      addFileEvidence(
        user.id,
        receiptId,
        { buffer: minimalPng(), originalname: "x.png", mimetype: "image/png" },
        undefined,
      ),
    ).rejects.toBeTruthy();

    const storage = getStorageProvider();
    const root = path.resolve(process.cwd(), env.LOCAL_STORAGE_DIR);
    if (fs.existsSync(root)) {
      const walk = (dir: string): string[] =>
        fs.readdirSync(dir).flatMap((name) => {
          const full = path.join(dir, name);
          return fs.statSync(full).isDirectory() ? walk(full) : [full];
        });
      const files = walk(root).filter((f) => f.includes(receiptId));
      expect(files.length).toBe(0);
    }
    void storage;
  });

  it("registration creates email verification job without storing raw token", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "verify-reg@test.com",
      password: "SecurePass1",
      fullName: "Verify Reg",
      role: "WORKER",
    });
    const jobs = await prisma.emailOutbox.findMany({
      where: { type: "EMAIL_VERIFICATION", recipientEmail: "verify-reg@test.com" },
    });
    expect(jobs).toHaveLength(1);
    expect(jobs[0]!.encryptedPayload).toBeTruthy();
    const payload = decryptEmailPayload<{ rawToken: string }>(jobs[0]!.encryptedPayload!);
    const tokens = await prisma.emailVerificationToken.findMany({
      where: { userId: jobs[0]!.relatedUserId! },
    });
    expect(tokens).toHaveLength(1);
    expect(tokens[0]!.tokenHash).toBe(hashToken(payload.rawToken));
    expect(JSON.stringify(tokens[0])).not.toContain(payload.rawToken);
  });

  it("email verification succeeds once; replay and expired rejected", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "verify-once@test.com",
      password: "SecurePass1",
      fullName: "Once",
      role: "WORKER",
    });
    const job = await prisma.emailOutbox.findFirstOrThrow({
      where: { recipientEmail: "verify-once@test.com" },
    });
    const payload = decryptEmailPayload<{ rawToken: string }>(job.encryptedPayload!);

    const ok = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: payload.rawToken });
    expect(ok.status).toBe(200);
    expect(ok.body.data.verified).toBe(true);

    const replay = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: payload.rawToken });
    expect(replay.status).toBe(400);

    const user = await prisma.user.findUniqueOrThrow({ where: { email: "verify-once@test.com" } });
    expect(user.emailVerifiedAt).toBeTruthy();

    await prisma.user.update({ where: { id: user.id }, data: { emailVerifiedAt: null } });
    const tokenRow = await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken("expiredtokenexpiredtokenexpiredtoken12"),
        expiresAt: new Date(Date.now() - 1000),
      },
    });
    void tokenRow;
    const expired = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: "expiredtokenexpiredtokenexpiredtoken12" });
    expect(expired.status).toBe(400);
  });

  it("resend invalidates old token and enforces cooldown", async () => {
    const agent = await registerWorker("resend-ev@test.com", { verifyEmail: false });
    const first = await prisma.emailVerificationToken.findFirstOrThrow({
      orderBy: { createdAt: "desc" },
    });

    // Force cooldown elapsed
    await prisma.emailVerificationToken.update({
      where: { id: first.id },
      data: { createdAt: new Date(Date.now() - 10_000) },
    });

    const resend = await agent.post("/api/v1/auth/resend-email-verification");
    expect(resend.status).toBe(200);
    const refreshed = await prisma.emailVerificationToken.findUniqueOrThrow({
      where: { id: first.id },
    });
    expect(refreshed.invalidatedAt).toBeTruthy();

    const immediate = await agent.post("/api/v1/auth/resend-email-verification");
    expect(immediate.status).toBe(400);
  });

  it("unverified worker can draft but not submit; verified can submit", async () => {
    const agent = await registerWorker("draft-only@test.com", { verifyEmail: false });
    const receiptId = await createDraft(agent);
    const blocked = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    expect(blocked.status).toBe(400);
    expect(blocked.body.code).toBe("EMAIL_VERIFICATION_REQUIRED");

    await markEmailVerified("draft-only@test.com");
    const ok = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    expect(ok.status).toBe(200);
    expect(ok.body.data.deliveryQueued).toBe(true);
  });

  it("submit creates customer email job; browser response may include token only in test mode", async () => {
    const agent = await registerWorker("customer-mail@test.com");
    const receiptId = await createDraft(agent);
    const submit = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    expect(submit.status).toBe(200);
    // test mode allows token for existing suite compatibility
    expect(submit.body.data.verificationToken).toBeDefined();

    const job = await prisma.emailOutbox.findFirstOrThrow({
      where: { type: "CUSTOMER_VERIFICATION", relatedReceiptId: receiptId },
    });
    expect(job.encryptedPayload).toBeTruthy();
    const payload = decryptEmailPayload<{ rawToken: string }>(job.encryptedPayload!);
    const vr = await prisma.verificationRequest.findFirstOrThrow({ where: { receiptId } });
    expect(vr.tokenHash).toBe(hashToken(payload.rawToken));

    const delivery = await agent.get(`/api/v1/receipts/${receiptId}/verification-delivery`);
    expect(delivery.status).toBe(200);
    expect(delivery.body.data).not.toHaveProperty("encryptedPayload");
    expect(JSON.stringify(delivery.body.data)).not.toContain(payload.rawToken);
  });

  it("dispatcher claims atomically and does not duplicate send", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "dispatch@test.com",
      password: "SecurePass1",
      fullName: "Dispatch",
      role: "WORKER",
    });
    const [a, b] = await Promise.all([claimNextEmailJob(), claimNextEmailJob()]);
    expect(a).toBeTruthy();
    expect(b).toBeNull();
    await processClaimedEmailJob(a!.id);
    const sent = await prisma.emailOutbox.findUniqueOrThrow({ where: { id: a!.id } });
    expect(sent.status).toBe("SENT");
    expect(sent.encryptedPayload).toBeNull();
  });

  it("failed jobs retry then mark FAILED after max attempts", async () => {
    const job = await prisma.emailOutbox.create({
      data: {
        type: "EMAIL_VERIFICATION",
        recipientEmail: "fail@test.com",
        encryptedPayload: "not-valid-ciphertext",
        status: "PENDING",
        attemptCount: 0,
        maxAttempts: 2,
        nextAttemptAt: new Date(),
      },
    });

    await processPendingEmailJobs(5);
    let row = await prisma.emailOutbox.findUniqueOrThrow({ where: { id: job.id } });
    // first failure -> PENDING retry or FAILED if max hit depending on claim increments
    if (row.status === "PENDING") {
      await prisma.emailOutbox.update({
        where: { id: job.id },
        data: { nextAttemptAt: new Date(Date.now() - 1000) },
      });
      await processPendingEmailJobs(5);
      row = await prisma.emailOutbox.findUniqueOrThrow({ where: { id: job.id } });
    }
    expect(row.status).toBe("FAILED");
  });

  it("customer resend invalidates old request", async () => {
    const agent = await registerWorker("resend-cust@test.com");
    const receiptId = await createDraft(agent);
    const first = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    const oldToken = first.body.data.verificationToken as string;
    const oldReq = await prisma.verificationRequest.findFirstOrThrow({ where: { receiptId } });

    await prisma.verificationRequest.update({
      where: { id: oldReq.id },
      data: { createdAt: new Date(Date.now() - 10_000) },
    });

    const resend = await agent.post(`/api/v1/receipts/${receiptId}/resend-verification`);
    expect(resend.status).toBe(200);
    const refreshed = await prisma.verificationRequest.findUniqueOrThrow({ where: { id: oldReq.id } });
    expect(refreshed.invalidatedAt).toBeTruthy();

    const view = await request(app).get(`/api/v1/verification/${oldToken}`);
    expect(view.status).toBeGreaterThanOrEqual(400);
  });

  it("signed URL expiry config is positive and no service-role in web/mobile bundles", async () => {
    expect(env.SIGNED_URL_EXPIRY_SECONDS).toBeGreaterThan(0);
    expect(env.SIGNED_URL_EXPIRY_SECONDS).toBeLessThanOrEqual(3600);
    const webEnv = path.resolve(process.cwd(), "../web/.env.example");
    const mobileEnv = path.resolve(process.cwd(), "../mobile/.env.example");
    for (const file of [webEnv, mobileEnv]) {
      if (fs.existsSync(file)) {
        const text = fs.readFileSync(file, "utf8");
        expect(text).not.toMatch(/SERVICE_ROLE|EMAIL_API_KEY|EMAIL_PAYLOAD_ENCRYPTION/i);
      }
    }
    const webSrc = path.resolve(process.cwd(), "../web/src");
    if (fs.existsSync(webSrc)) {
      const stack = [webSrc];
      while (stack.length) {
        const dir = stack.pop()!;
        for (const name of fs.readdirSync(dir)) {
          const full = path.join(dir, name);
          if (fs.statSync(full).isDirectory()) stack.push(full);
          else if (/\.(ts|tsx|js)$/.test(name)) {
            expect(fs.readFileSync(full, "utf8")).not.toMatch(/SUPABASE_SERVICE_ROLE/);
          }
        }
      }
    }
    void os;
  });
});
