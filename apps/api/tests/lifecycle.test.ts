import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import {
  buildIntegrityPayload,
  canonicalize,
  computeIntegrityHashV1,
} from "../src/lib/integrity.js";
import { assertTransition } from "../src/lib/lifecycle.js";
import { AppError } from "../src/lib/errors.js";

async function registerWorker(email: string) {
  const agent = request.agent(app);
  await agent.post("/api/v1/auth/register").send({
    email,
    password: "SecurePass1",
    fullName: "Lifecycle Worker",
    role: "WORKER",
  });
  return agent;
}

async function createAndSubmit(
  agent: ReturnType<typeof request.agent>,
  opts: { visibility?: string; email?: string } = {},
) {
  const createRes = await agent.post("/api/v1/receipts").send({
    customerName: "Lifecycle Customer",
    customerEmail: opts.email ?? "lifecycle-customer@test.com",
    serviceTitle: "Lifecycle service",
    description: "Completed lifecycle service work for verification concurrency tests.",
    workDate: "2026-06-20",
    amount: 10000,
    visibility: opts.visibility ?? "PUBLIC",
    skillsDemonstrated: ["Testing"],
  });
  expect(createRes.status).toBe(201);
  const receiptId = createRes.body.data.id as string;
  const submitRes = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
  expect(submitRes.status).toBe(200);
  return {
    receiptId,
    token: submitRes.body.data.verificationToken as string,
    attemptNumber: submitRes.body.data.attemptNumber as number,
  };
}

describe("Wave 0B receipt lifecycle", () => {
  it("rejects invalid state transitions", () => {
    expect(() => assertTransition("DRAFT", "VERIFIED")).toThrow(AppError);
    expect(() => assertTransition("REVOKED", "VERIFIED")).toThrow(AppError);
    expect(() => assertTransition("PENDING_VERIFICATION", "ARCHIVED")).toThrow(AppError);
  });

  it("produces a deterministic integrity hash", () => {
    const payload = buildIntegrityPayload({
      receiptId: "r1",
      receiptNumber: "WPG-2026-000001",
      workerId: "w1",
      serviceTitle: "Service",
      workDate: "2026-06-01",
      skillsDemonstrated: ["B", "A"],
      amount: 10,
      currency: "XAF",
      evidence: [
        { id: "e2", type: "IMAGE", mimeType: "image/png", size: 1 },
        { id: "e1", type: "LINK", mimeType: null, size: null },
      ],
      confirmationId: "c1",
      verifiedAt: "2026-06-02T00:00:00.000Z",
    });
    const a = computeIntegrityHashV1(payload);
    const b = computeIntegrityHashV1({ ...payload, skillsDemonstrated: ["A", "B"] });
    expect(a).toBe(b);
    expect(canonicalize({ z: 1, a: 2 })).toBe('{"a":2,"z":1}');
  });

  it("allows only one concurrent verification response to succeed", async () => {
    const agent = await registerWorker("concurrent-verify@test.com");
    const { token } = await createAndSubmit(agent);

    const [a, b] = await Promise.all([
      request(app)
        .post(`/api/v1/verification/${token}/respond`)
        .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" }),
      request(app)
        .post(`/api/v1/verification/${token}/respond`)
        .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" }),
    ]);

    const statuses = [a.status, b.status].sort();
    expect(statuses).toEqual([200, 400]);
    const success = a.status === 200 ? a : b;
    expect(success.body.data.status).toBe("VERIFIED");
  });

  it("produces unique receipt numbers under concurrent verification", async () => {
    const submitted = [];
    for (let i = 0; i < 5; i++) {
      const agent = await registerWorker(`rn-${i}@test.com`);
      submitted.push(await createAndSubmit(agent, { email: `rn-customer-${i}@test.com` }));
    }

    const results = await Promise.all(
      submitted.map((s) =>
        request(app)
          .post(`/api/v1/verification/${s.token}/respond`)
          .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" }),
      ),
    );

    expect(results.every((r) => r.status === 200)).toBe(true);
    const codes = results.map((r) => r.body.data.verificationCode as string);
    const receipts = await prisma.workReceipt.findMany({
      where: { verificationCode: { in: codes } },
      select: { receiptNumber: true },
    });
    const receiptNumbers = receipts.map((r) => r.receiptNumber).filter(Boolean);
    expect(new Set(receiptNumbers).size).toBe(receiptNumbers.length);
    expect(receiptNumbers.every((n) => /^WPG-\d{4}-\d{6}$/.test(n!))).toBe(true);
  });

  it("supports correction then resubmission then confirmation with history", async () => {
    const agent = await registerWorker("correction-cycle@test.com");
    const first = await createAndSubmit(agent, { email: "corr@test.com" });

    const corr = await request(app)
      .post(`/api/v1/verification/${first.token}/respond`)
      .send({
        decision: "CORRECTION_REQUESTED",
        customerName: "Lifecycle Customer",
        comment: "Please fix description.",
      });
    expect(corr.status).toBe(200);
    expect(corr.body.data.status).toBe("CORRECTION_REQUESTED");

    await agent.patch(`/api/v1/receipts/${first.receiptId}`).send({
      description: "Updated lifecycle service work after customer correction request.",
    });

    const resubmit = await agent.post(`/api/v1/receipts/${first.receiptId}/submit`);
    expect(resubmit.status).toBe(200);
    expect(resubmit.body.data.attemptNumber).toBe(2);
    const token2 = resubmit.body.data.verificationToken as string;

    const reuseOld = await request(app)
      .post(`/api/v1/verification/${first.token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });
    expect(reuseOld.status).toBe(400);

    const confirm = await request(app)
      .post(`/api/v1/verification/${token2}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });
    expect(confirm.status).toBe(200);
    expect(confirm.body.data.status).toBe("VERIFIED");

    const detail = await agent.get(`/api/v1/receipts/${first.receiptId}`);
    expect(detail.body.data.confirmations.length).toBe(2);
    expect(detail.body.data.verificationRequests.length).toBe(2);
    expect(detail.body.data.verificationAttemptCount).toBe(2);
  });

  it("invalidates outstanding tokens on resubmission", async () => {
    const agent = await registerWorker("invalidate@test.com");
    const first = await createAndSubmit(agent, { email: "inv@test.com" });
    await request(app)
      .post(`/api/v1/verification/${first.token}/respond`)
      .send({
        decision: "CORRECTION_REQUESTED",
        customerName: "Lifecycle Customer",
        comment: "Fix",
      });
    const second = await agent.post(`/api/v1/receipts/${first.receiptId}/submit`);
    const oldReq = await prisma.verificationRequest.findFirst({
      where: { receiptId: first.receiptId, attemptNumber: 1 },
    });
    expect(oldReq?.usedAt || oldReq?.invalidatedAt).toBeTruthy();
    expect(second.body.data.attemptNumber).toBe(2);
  });

  it("archive preserves VERIFIED status and supports unarchive + filter", async () => {
    const agent = await registerWorker("archive@test.com");
    const { receiptId, token } = await createAndSubmit(agent, { email: "arch@test.com" });
    await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });

    const archived = await agent.post(`/api/v1/receipts/${receiptId}/archive`);
    expect(archived.status).toBe(200);
    expect(archived.body.data.status).toBe("VERIFIED");
    expect(archived.body.data.archivedAt).toBeTruthy();

    const activeList = await agent.get("/api/v1/receipts?archived=false");
    expect(activeList.body.data.items.some((r: { id: string }) => r.id === receiptId)).toBe(false);

    const archivedList = await agent.get("/api/v1/receipts?archived=true");
    expect(archivedList.body.data.items.some((r: { id: string }) => r.id === receiptId)).toBe(true);

    const unarchived = await agent.post(`/api/v1/receipts/${receiptId}/unarchive`);
    expect(unarchived.status).toBe(200);
    expect(unarchived.body.data.archivedAt).toBeNull();
    expect(unarchived.body.data.status).toBe("VERIFIED");
  });

  it("marks revoked/disputed/correction proofs with correct validity and hides private fields", async () => {
    const agent = await registerWorker("proof-states@test.com");

    // VERIFIED then revoke
    const v = await createAndSubmit(agent, { email: "proof-v@test.com", visibility: "PUBLIC" });
    const confirmed = await request(app)
      .post(`/api/v1/verification/${v.token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });
    const code = confirmed.body.data.verificationCode as string;

    const admin = await request(app).post("/api/v1/auth/register").send({
      email: "admin-lifecycle@test.com",
      password: "SecurePass1",
      fullName: "Admin",
      role: "WORKER",
    });
    // Elevate to admin in DB for revoke test
    await prisma.user.update({
      where: { id: admin.body.data.user.id },
      data: { role: "ADMIN" },
    });
    const adminLogin = request.agent(app);
    await adminLogin.post("/api/v1/auth/login").send({
      email: "admin-lifecycle@test.com",
      password: "SecurePass1",
    });

    const revoke = await adminLogin
      .post(`/api/v1/admin/receipts/${v.receiptId}/revoke`)
      .send({ reason: "Fraudulent evidence submitted." });
    expect(revoke.status).toBe(200);

    const revokedProof = await request(app).get(`/api/v1/public/receipts/${code}`);
    expect(revokedProof.status).toBe(200);
    expect(revokedProof.body.data.proofValidity).toBe("INVALID_REVOKED");
    expect(JSON.stringify(revokedProof.body.data)).not.toContain("proof-v@test.com");
    expect(JSON.stringify(revokedProof.body.data)).not.toContain("admin-lifecycle");

    const dupRevoke = await adminLogin
      .post(`/api/v1/admin/receipts/${v.receiptId}/revoke`)
      .send({ reason: "Second revoke attempt should fail." });
    expect(dupRevoke.status).toBe(400);

    // DISPUTED
    const d = await createAndSubmit(agent, { email: "proof-d@test.com", visibility: "UNLISTED" });
    const disputed = await request(app)
      .post(`/api/v1/verification/${d.token}/respond`)
      .send({
        decision: "DISPUTED",
        customerName: "Lifecycle Customer",
        description: "Private dispute detail must not appear publicly.",
      });
    expect(disputed.status).toBe(200);
    const disputedReceipt = await prisma.workReceipt.findUnique({ where: { id: d.receiptId } });
    // No verification code until verified — disputed before verify has no public code
    expect(disputedReceipt?.verificationCode).toBeNull();

    // CORRECTION with prior verified code path: create verified, then force status for proof check
    // Correction without prior code is unavailable via public endpoint (no code).
    const c = await createAndSubmit(agent, { email: "proof-c@test.com", visibility: "PUBLIC" });
    await request(app)
      .post(`/api/v1/verification/${c.token}/respond`)
      .send({
        decision: "CORRECTION_REQUESTED",
        customerName: "Lifecycle Customer",
        comment: "Secret correction note",
      });
    // Assign a code as if it had been verified earlier then reopened — simulate via DB for product rule
    await prisma.workReceipt.update({
      where: { id: c.receiptId },
      data: { verificationCode: "WPG-CORRTEST1", status: "CORRECTION_REQUESTED" },
    });
    const corrProof = await request(app).get("/api/v1/public/receipts/WPG-CORRTEST1");
    expect(corrProof.status).toBe(200);
    expect(corrProof.body.data.proofValidity).toBe("CORRECTION_REQUIRED");
    expect(JSON.stringify(corrProof.body.data)).not.toContain("Secret correction");

    // PRIVATE inaccessible
    const p = await createAndSubmit(agent, { email: "proof-p@test.com", visibility: "PRIVATE" });
    const privConfirm = await request(app)
      .post(`/api/v1/verification/${p.token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });
    const privCode = privConfirm.body.data.verificationCode as string;
    const privProof = await request(app).get(`/api/v1/public/receipts/${privCode}`);
    expect(privProof.status).toBe(404);
  });

  it("protects receipt event history ownership and hides private metadata", async () => {
    const owner = await registerWorker("events-owner@test.com");
    const other = await registerWorker("events-other@test.com");
    const { receiptId, token } = await createAndSubmit(owner, { email: "ev@test.com" });
    await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });

    const events = await owner.get(`/api/v1/receipts/${receiptId}/events`);
    expect(events.status).toBe(200);
    expect(events.body.data.length).toBeGreaterThan(0);
    expect(JSON.stringify(events.body.data)).not.toMatch(/ipAddress|metadata/);

    const forbidden = await other.get(`/api/v1/receipts/${receiptId}/events`);
    expect(forbidden.status).toBe(404);
  });

  it("dashboard excludes revoked income and counts", async () => {
    const agent = await registerWorker("dash-revoked@test.com");
    const { receiptId, token } = await createAndSubmit(agent, { email: "dash@test.com" });
    await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lifecycle Customer" });

    await prisma.user.create({
      data: {
        email: "dash-admin@test.com",
        passwordHash: "x",
        fullName: "Dash Admin",
        role: "ADMIN",
      },
    });
    // Use service-level revoke via admin agent
    const adminAgent = request.agent(app);
    // Register admin properly
    await request(app).post("/api/v1/auth/register").send({
      email: "dash-admin2@test.com",
      password: "SecurePass1",
      fullName: "Dash Admin2",
      role: "WORKER",
    });
    const adminUser = await prisma.user.findUnique({ where: { email: "dash-admin2@test.com" } });
    await prisma.user.update({ where: { id: adminUser!.id }, data: { role: "ADMIN" } });
    await adminAgent.post("/api/v1/auth/login").send({
      email: "dash-admin2@test.com",
      password: "SecurePass1",
    });
    await adminAgent
      .post(`/api/v1/admin/receipts/${receiptId}/revoke`)
      .send({ reason: "Revoke for dashboard income test." });

    const dash = await agent.get("/api/v1/dashboard/worker");
    expect(dash.status).toBe(200);
    expect(dash.body.data.verifiedReceipts).toBe(0);
    expect(dash.body.data.totalVerifiedIncome).toBe(0);
    expect(dash.body.data.revokedReceipts).toBe(1);
  });

  it("rejects duplicate dispute resolution", async () => {
    const agent = await registerWorker("dup-dispute@test.com");
    const { receiptId, token } = await createAndSubmit(agent, { email: "dd@test.com" });
    await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "DISPUTED",
        customerName: "Lifecycle Customer",
        description: "Quality issue",
      });
    const dispute = await prisma.dispute.findUnique({ where: { receiptId } });

    await request(app).post("/api/v1/auth/register").send({
      email: "dup-admin@test.com",
      password: "SecurePass1",
      fullName: "Dup Admin",
      role: "WORKER",
    });
    const adminUser = await prisma.user.findUnique({ where: { email: "dup-admin@test.com" } });
    await prisma.user.update({ where: { id: adminUser!.id }, data: { role: "ADMIN" } });
    const adminAgent = request.agent(app);
    await adminAgent.post("/api/v1/auth/login").send({
      email: "dup-admin@test.com",
      password: "SecurePass1",
    });

    const first = await adminAgent.post(`/api/v1/admin/disputes/${dispute!.id}/resolve`).send({
      resolution: "Resolved in favour of worker after review.",
      receiptStatus: "VERIFIED",
    });
    expect(first.status).toBe(200);
    const second = await adminAgent.post(`/api/v1/admin/disputes/${dispute!.id}/resolve`).send({
      resolution: "Second resolution attempt.",
      receiptStatus: "REVOKED",
    });
    expect(second.status).toBe(400);
  });
});
