import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import type { AuthUser } from "../src/middleware/auth.js";

const repoRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "../../..");

function cookieValue(setCookie: string[] | undefined, name: string): string | undefined {
  if (!setCookie) return undefined;
  for (const entry of setCookie) {
    if (entry.startsWith(`${name}=`)) {
      return entry.split(";")[0]?.split("=").slice(1).join("=");
    }
  }
  return undefined;
}

async function registerBrowser(email: string) {
  return request.agent(app).post("/api/v1/auth/register").send({
    email,
    password: "SecurePass1",
    fullName: "Test User",
    role: "WORKER",
    acceptTerms: true,
    acceptPrivacy: true,
  });
}

async function createOrganisationAccount(email: string, fullName: string) {
  const passwordHash = await import("bcrypt").then((m) => m.hash("SecurePass1", 12));
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: "ORGANISATION",
      emailVerifiedAt: new Date(),
      organisation: {
        create: {
          name: `${fullName} Programme`,
          description: "Invitation-based organisation account for tests.",
        },
      },
    },
  });
  return user;
}

describe("Wave 0A authentication and sessions", () => {
  it("sets access and refresh cookies for browser login without JSON refresh token", async () => {
    await registerBrowser("browser@test.com");
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "browser@test.com",
      password: "SecurePass1",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("browser@test.com");
    expect(res.body.data.refreshToken).toBeUndefined();
    expect(res.body.data.accessToken).toBeUndefined();
    const cookies = res.headers["set-cookie"] as string[] | undefined;
    expect(cookieValue(cookies, "workproof_access")).toBeTruthy();
    expect(cookieValue(cookies, "workproof_refresh")).toBeTruthy();
  });

  it("returns Bearer-ready tokens for mobile client platform", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "mobile@test.com",
        password: "SecurePass1",
        fullName: "Mobile User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(res.body.data.refreshToken).toBeTruthy();
    expect(typeof res.body.data.refreshToken).toBe("string");
  });

  it("authenticates via Bearer access token", async () => {
    const reg = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "bearer@test.com",
        password: "SecurePass1",
        fullName: "Bearer User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const access = reg.body.data.accessToken as string;
    const me = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${access}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe("bearer@test.com");
  });

  it("rejects missing authentication", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.status).toBe(401);
  });

  it("rejects invalid access token", async () => {
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", "Bearer totally-invalid-token");
    expect(res.status).toBe(401);
  });

  it("rejects suspended user even with otherwise valid access token", async () => {
    const reg = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "suspend@test.com",
        password: "SecurePass1",
        fullName: "Suspend User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const userId = reg.body.data.user.id as string;
    const access = reg.body.data.accessToken as string;
    await prisma.user.update({ where: { id: userId }, data: { status: "SUSPENDED" } });
    const me = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${access}`);
    expect(me.status).toBe(401);
  });

  it("rejects expired access tokens", async () => {
    const user = await prisma.user.create({
      data: {
        email: "expired@test.com",
        passwordHash: "x",
        fullName: "Expired",
        role: "WORKER",
      },
    });
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
    };
    const previous = process.env.ACCESS_TOKEN_EXPIRES_IN;
    process.env.ACCESS_TOKEN_EXPIRES_IN = "0s";
    // Re-import signing uses module env already loaded — craft token with jwt directly
    const jwt = await import("jsonwebtoken");
    const { env } = await import("../src/config/env.js");
    const token = jwt.default.sign(
      { sub: authUser.id, email: authUser.email, role: authUser.role },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: -10, issuer: env.JWT_ISSUER, audience: env.JWT_AUDIENCE },
    );
    process.env.ACCESS_TOKEN_EXPIRES_IN = previous;
    const res = await request(app)
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("rotates refresh tokens transactionally", async () => {
    const reg = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "rotate@test.com",
        password: "SecurePass1",
        fullName: "Rotate User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const refresh1 = reg.body.data.refreshToken as string;
    const refreshRes = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh1 });
    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.data.refreshToken).toBeTruthy();
    expect(refreshRes.body.data.refreshToken).not.toBe(refresh1);
    expect(refreshRes.body.data.accessToken).toBeTruthy();
  });

  it("detects refresh-token replay and revokes the family", async () => {
    const reg = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "replay@test.com",
        password: "SecurePass1",
        fullName: "Replay User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const refresh1 = reg.body.data.refreshToken as string;
    const first = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh1 });
    expect(first.status).toBe(200);
    const refresh2 = first.body.data.refreshToken as string;

    const replay = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh1 });
    expect(replay.status).toBe(401);

    const afterReplay = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh2 });
    expect(afterReplay.status).toBe(401);
  });

  it("logout revokes current refresh token", async () => {
    const reg = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "logout@test.com",
        password: "SecurePass1",
        fullName: "Logout User",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const refresh = reg.body.data.refreshToken as string;
    const logout = await request(app)
      .post("/api/v1/auth/logout")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh });
    expect(logout.status).toBe(200);
    const refreshAgain = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refresh });
    expect(refreshAgain.status).toBe(401);
  });

  it("logout-all revokes all sessions for the user", async () => {
    const a = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "allsess@test.com",
        password: "SecurePass1",
        fullName: "All Sess",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const access = a.body.data.accessToken as string;
    const refreshA = a.body.data.refreshToken as string;
    const loginB = await request(app)
      .post("/api/v1/auth/login")
      .set("X-Client-Platform", "mobile")
      .send({ email: "allsess@test.com", password: "SecurePass1" });
    const refreshB = loginB.body.data.refreshToken as string;

    const logoutAll = await request(app)
      .post("/api/v1/auth/logout-all")
      .set("Authorization", `Bearer ${access}`);
    expect(logoutAll.status).toBe(200);

    const ra = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refreshA });
    const rb = await request(app)
      .post("/api/v1/auth/refresh")
      .set("X-Client-Platform", "mobile")
      .send({ refreshToken: refreshB });
    expect(ra.status).toBe(401);
    expect(rb.status).toBe(401);
  });

  it("users can only revoke their own sessions", async () => {
    const a = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "owner-sess@test.com",
        password: "SecurePass1",
        fullName: "Owner",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const b = await request(app)
      .post("/api/v1/auth/register")
      .set("X-Client-Platform", "mobile")
      .send({
        email: "other-sess@test.com",
        password: "SecurePass1",
        fullName: "Other",
        role: "WORKER",
        acceptTerms: true,
        acceptPrivacy: true,
      });
    const ownerAccess = a.body.data.accessToken as string;
    const otherSessions = await request(app)
      .get("/api/v1/auth/sessions")
      .set("Authorization", `Bearer ${b.body.data.accessToken}`);
    const foreignId = otherSessions.body.data[0].id as string;

    const del = await request(app)
      .delete(`/api/v1/auth/sessions/${foreignId}`)
      .set("Authorization", `Bearer ${ownerAccess}`);
    expect(del.status).toBe(404);
  });

  it("rejects untrusted browser Origin on cookie-authenticated mutations", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "csrf@test.com",
      password: "SecurePass1",
      fullName: "CSRF User",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    const res = await agent
      .post("/api/v1/receipts")
      .set("Origin", "https://evil.example")
      .send({
        customerName: "Customer",
        customerEmail: "c@test.com",
        serviceTitle: "Service",
        description: "Enough description for the receipt create schema validation.",
        workDate: "2026-06-01",
      });
    expect(res.status).toBe(403);
  });

  it("organisation dashboard never returns unrelated worker data", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "worker-leak@test.com",
      password: "SecurePass1",
      fullName: "Secret Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await createOrganisationAccount("org-a@test.com", "Org A");
    const orgAgent = request.agent(app);
    await orgAgent.post("/api/v1/auth/login").send({
      email: "org-a@test.com",
      password: "SecurePass1",
    });
    const dash = await orgAgent.get("/api/v1/dashboard/organisation");
    expect(dash.status).toBe(200);
    expect(dash.body.data.workerCount).toBe(0);
    expect(dash.body.data.assignedWorkers).toEqual([]);
    expect(JSON.stringify(dash.body.data)).not.toContain("Secret Worker");
    expect(JSON.stringify(dash.body.data)).not.toContain("worker-leak@test.com");
    expect(JSON.stringify(dash.body.data)).not.toMatch(/sample workers/i);
  });

  it("rejects public ORGANISATION self-registration", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "wanna-org@test.com",
      password: "SecurePass1",
      fullName: "Wanna Org",
      role: "ORGANISATION",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    expect(res.status).toBe(400);
  });

  it("requires terms and privacy acceptance at registration", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "no-consent@test.com",
      password: "SecurePass1",
      fullName: "No Consent",
      role: "WORKER",
      acceptTerms: false,
      acceptPrivacy: true,
    });
    expect(res.status).toBe(400);

    const ok = await request(app).post("/api/v1/auth/register").send({
      email: "with-consent@test.com",
      password: "SecurePass1",
      fullName: "With Consent",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    expect(ok.status).toBe(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email: "with-consent@test.com" } });
    expect(user.termsAcceptedAt).toBeTruthy();
    expect(user.privacyAcceptedAt).toBeTruthy();
  });

  it("readiness returns healthy when database is available", async () => {
    const res = await request(app).get("/api/v1/readiness");
    expect(res.status).toBe(200);
    expect(res.body.checks.database).toBe("ok");
  });

  it("readiness returns 503 when database check fails", async () => {
    const spy = vi.spyOn(prisma, "$queryRaw").mockRejectedValue(new Error("db down"));
    const res = await request(app).get("/api/v1/readiness");
    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
    spy.mockRestore();
  });

  it("generated Prisma output is gitignored and not required in Git", () => {
    const gitignore = fs.readFileSync(path.join(repoRoot, ".gitignore"), "utf8");
    expect(gitignore).toMatch(/apps\/api\/generated\//);
  });
});
