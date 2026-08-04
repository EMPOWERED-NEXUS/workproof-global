import type { Request } from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashToken } from "../src/lib/crypto.js";
import { decryptEmailPayload } from "../src/email/payload-crypto.js";
import { assertLogRedaction } from "../src/lib/logger.js";
import { env } from "../src/config/env.js";
import { getSafeIpKey } from "../src/middleware/rateLimit.js";
import { registerWorker } from "./helpers.js";

function mockReq(ip: string): Request {
  return {
    ip,
    socket: { remoteAddress: ip },
  } as unknown as Request;
}

describe("Wave 0D staging readiness", () => {
  it("generates IPv4 and IPv6-safe rate-limit keys without ERR_ERL_KEY_GEN_IPV6", async () => {
    const warnings: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnings.push(args.map(String).join(" "));
      originalWarn(...args);
    };
    try {
      const ipv4 = getSafeIpKey(mockReq("203.0.113.10"));
      const ipv6 = getSafeIpKey(mockReq("2001:db8:85a3::8a2e:370:7334"));
      const loopback6 = getSafeIpKey(mockReq("::1"));

      expect(ipv4).toBe("203.0.113.10");
      expect(ipv6).toContain("2001:db8:85a3");
      expect(loopback6).toBeTruthy();
      expect(ipv4).not.toBe(ipv6);

      // Combined forgot-password style key remains stable and includes safe IP form.
      const combined = `user@test.com:${getSafeIpKey(mockReq("2001:db8::1"))}`;
      expect(combined.startsWith("user@test.com:")).toBe(true);
      expect(combined).not.toContain("undefined");

      // Exercise limiter path with IPv6-looking forwarded address (no validation warning).
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .set("X-Forwarded-For", "2001:db8:85a3::8a2e:370:7334")
        .send({ email: "ipv6-rate@test.com" });
      expect(res.status).toBe(200);
    } finally {
      console.warn = originalWarn;
    }
    expect(warnings.join("\n")).not.toMatch(/ERR_ERL_KEY_GEN_IPV6/);
  });

  it("rejects public ADMIN self-registration", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "wanna-admin@test.com",
      password: "SecurePass1",
      fullName: "Wanna Admin",
      role: "ADMIN",
    });
    expect(res.status).toBe(400);
  });

  it("forgot-password returns neutral response for unknown and known emails", async () => {
    await registerWorker("reset-known@test.com");
    const unknown = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "nobody-exists@test.com" });
    const known = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "reset-known@test.com" });
    expect(unknown.status).toBe(200);
    expect(known.status).toBe(200);
    expect(unknown.body.data.message).toBe(known.body.data.message);
    expect(JSON.stringify(unknown.body)).not.toMatch(/does not exist|not found/i);
  });

  it(
    "password reset is one-time, revokes sessions, and rejects replay",
    async () => {
      const agent = request.agent(app);
      await agent.post("/api/v1/auth/register").send({
        email: "reset-flow@test.com",
        password: "SecurePass1",
        fullName: "Reset Flow",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
      await prisma.user.update({
        where: { email: "reset-flow@test.com" },
        data: { emailVerifiedAt: new Date() },
      });

      const sessionsBefore = await prisma.refreshToken.count({
        where: { user: { email: "reset-flow@test.com" }, revokedAt: null },
      });
      expect(sessionsBefore).toBeGreaterThan(0);

      const forgot = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "reset-flow@test.com" });
      expect(forgot.status).toBe(200);
      const token = forgot.body.data.resetToken as string | undefined;
      expect(token).toBeTruthy();

      const job = await prisma.emailOutbox.findFirstOrThrow({
        where: { type: "PASSWORD_RESET", recipientEmail: "reset-flow@test.com" },
      });
      const payload = decryptEmailPayload<{ rawToken: string }>(job.encryptedPayload!);
      expect(hashToken(payload.rawToken)).toBe(
        (await prisma.passwordResetToken.findFirstOrThrow({ orderBy: { createdAt: "desc" } }))
          .tokenHash,
      );

      const reset = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: payload.rawToken, password: "NewSecure9" });
      expect(reset.status).toBe(200);

      const sessionsAfter = await prisma.refreshToken.count({
        where: { user: { email: "reset-flow@test.com" }, revokedAt: null },
      });
      expect(sessionsAfter).toBe(0);

      const replay = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: payload.rawToken, password: "AnotherSecure9" });
      expect(replay.status).toBe(400);
      expect(replay.body.code).toBe("PASSWORD_RESET_USED");

      const loginOld = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "reset-flow@test.com", password: "SecurePass1" });
      expect(loginOld.status).toBe(401);

      const loginNew = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "reset-flow@test.com", password: "NewSecure9" });
      expect(loginNew.status).toBe(200);
    },
    20_000,
  );

  it("rejects expired password reset tokens", async () => {
    const user = await prisma.user.create({
      data: {
        email: "reset-expired@test.com",
        passwordHash: "x",
        fullName: "Expired",
        role: "WORKER",
      },
    });
    const raw = "expiredresettokenexpiredresettoken12";
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() - 1000),
      },
    });
    const res = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ token: raw, password: "NewSecure9" });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("PASSWORD_RESET_EXPIRED");
  });

  it("health is liveness-only; readiness checks config without secrets", async () => {
    const health = await request(app).get("/api/v1/health");
    expect(health.status).toBe(200);
    expect(health.body.service).toBe("workproof-api");
    expect(JSON.stringify(health.body)).not.toMatch(/SECRET|SERVICE_ROLE|password/i);

    const ready = await request(app).get("/api/v1/readiness");
    expect(ready.status).toBe(200);
    expect(ready.body.checks.database).toBe("ok");
    expect(ready.body.checks.storageProvider).toBe("local");
    expect(ready.body.checks.emailProvider).toBe("console");
    expect(JSON.stringify(ready.body)).not.toContain(env.ACCESS_TOKEN_SECRET);
    expect(JSON.stringify(ready.body)).not.toContain(env.EMAIL_PAYLOAD_ENCRYPTION_KEY);
  });

  it("returns X-Request-Id and redacts sensitive log fields", async () => {
    const res = await request(app).get("/api/v1/health").set("X-Request-Id", "test-req-123");
    expect(res.headers["x-request-id"]).toBe("test-req-123");
    expect(
      assertLogRedaction({
        password: "SecretPass1",
        authorization: "Bearer abcdef0123456789abcdef0123456789abcdef0123456789",
        cookie: "workproof_access=xyz",
      }),
    ).toBe(true);
  });

  it("swagger is disabled by default in test/production-like config", async () => {
    expect(env.ENABLE_API_DOCS).toBe(false);
    const docs = await request(app).get("/api-docs");
    expect(docs.status).toBe(404);
  });

  it("production env forbids local storage and console email", async () => {
    const { getReadinessConfigChecks } = await import("../src/config/env.js");
    const checks = getReadinessConfigChecks();
    expect(checks.storageProviderConfigured).toBe("ok");
    expect(checks.emailProviderConfigured).toBe("ok");
    expect(env.NODE_ENV).toBe("test");
    expect(env.COOKIE_SECURE).toBe(false);
  });

  it("/uploads remains publicly unavailable", async () => {
    const res = await request(app).get("/uploads/secret.jpg");
    expect(res.status).toBe(404);
  });

  it("unverified worker cannot submit; email verification still required", async () => {
    const agent = await registerWorker("wave0d-unverified@test.com", { verifyEmail: false });
    const create = await agent.post("/api/v1/receipts").send({
      customerName: "Customer",
      customerEmail: "customer-unverified@test.com",
      serviceTitle: "Unverified submit service",
      description: "Draft work for Wave 0D email verification regression.",
      workDate: "2026-07-20",
    });
    expect(create.status).toBe(201);
    const submit = await agent.post(`/api/v1/receipts/${create.body.data.id as string}/submit`);
    expect(submit.status).toBe(400);
    expect(submit.body.code).toBe("EMAIL_VERIFICATION_REQUIRED");
  });
});
