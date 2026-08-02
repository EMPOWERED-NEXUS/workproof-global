import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app.js";
import { markEmailVerified } from "./helpers.js";

describe("WorkProof Global API", () => {
  it("GET /api/v1/health returns running status", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.service).toBe("workproof-api");
  });

  it("registers a worker and creates profile", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "newworker@test.com",
      password: "SecurePass1",
      fullName: "New Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("newworker@test.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("rejects duplicate registration", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "dup@test.com",
      password: "SecurePass1",
      fullName: "Dup Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    const res = await request(app).post("/api/v1/auth/register").send({
      email: "dup@test.com",
      password: "SecurePass1",
      fullName: "Dup Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    expect(res.status).toBe(409);
  });

  it("logs in with valid credentials", async () => {
    await request(app).post("/api/v1/auth/register").send({
      email: "login@test.com",
      password: "SecurePass1",
      fullName: "Login Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    const res = await request(app).post("/api/v1/auth/login").send({
      email: "login@test.com",
      password: "SecurePass1",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.fullName).toBe("Login Worker");
  });

  it("rejects protected route without auth", async () => {
    const res = await request(app).get("/api/v1/receipts");
    expect(res.status).toBe(401);
  });

  it("worker creates and submits receipt; another worker cannot access it", async () => {
    const agent1 = request.agent(app);
    const agent2 = request.agent(app);

    await agent1.post("/api/v1/auth/register").send({
      email: "owner@test.com",
      password: "SecurePass1",
      fullName: "Owner Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await markEmailVerified("owner@test.com");
    await agent2.post("/api/v1/auth/register").send({
      email: "other@test.com",
      password: "SecurePass1",
      fullName: "Other Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });

    const createRes = await agent1.post("/api/v1/receipts").send({
      customerName: "Customer A",
      customerEmail: "customer@test.com",
      serviceTitle: "Test Service",
      description: "Completed test service work for customer verification flow.",
      workDate: "2026-06-01",
      skillsDemonstrated: ["Testing"],
    });
    expect(createRes.status).toBe(201);
    const receiptId = createRes.body.data.id;

    const forbidden = await agent2.get(`/api/v1/receipts/${receiptId}`);
    expect(forbidden.status).toBe(404);

    const submitRes = await agent1.post(`/api/v1/receipts/${receiptId}/submit`);
    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.verificationToken).toBeDefined();
  });

  it("customer confirmation verifies receipt and token cannot be reused", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "confirm@test.com",
      password: "SecurePass1",
      fullName: "Confirm Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await markEmailVerified("confirm@test.com");

    const createRes = await agent.post("/api/v1/receipts").send({
      customerName: "Confirm Customer",
      customerEmail: "confirm-customer@test.com",
      serviceTitle: "Garden maintenance",
      description: "Weekly garden maintenance including trimming and waste removal.",
      workDate: "2026-06-05",
      visibility: "PUBLIC",
    });
    const receiptId = createRes.body.data.id;
    const submitRes = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    const token = submitRes.body.data.verificationToken as string;

    const viewRes = await request(app).get(`/api/v1/verification/${token}`);
    expect(viewRes.status).toBe(200);

    const confirmRes = await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "CONFIRMED",
        customerName: "Confirm Customer",
        comment: "Work completed satisfactorily.",
      });
    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.status).toBe("VERIFIED");

    const reuseRes = await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "CONFIRMED",
        customerName: "Confirm Customer",
      });
    expect(reuseRes.status).toBe(400);
  });

  it("verified receipt cannot be edited", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "locked@test.com",
      password: "SecurePass1",
      fullName: "Locked Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await markEmailVerified("locked@test.com");

    const createRes = await agent.post("/api/v1/receipts").send({
      customerName: "Lock Customer",
      customerEmail: "lock@test.com",
      serviceTitle: "Painting",
      description: "Interior wall painting for two rooms in residential property.",
      workDate: "2026-06-08",
      visibility: "PUBLIC",
    });
    const receiptId = createRes.body.data.id;
    const submitRes = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    await request(app)
      .post(`/api/v1/verification/${submitRes.body.data.verificationToken}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Lock Customer" });

    const editRes = await agent.patch(`/api/v1/receipts/${receiptId}`).send({
      serviceTitle: "Changed title",
    });
    expect(editRes.status).toBe(400);
  });

  it("public proof hides private customer contact details", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "public@test.com",
      password: "SecurePass1",
      fullName: "Public Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await markEmailVerified("public@test.com");

    const createRes = await agent.post("/api/v1/receipts").send({
      customerName: "Private Customer",
      customerEmail: "private-customer@test.com",
      customerPhone: "+237600000999",
      serviceTitle: "Carpentry repair",
      description: "Repaired wooden door frame and replaced hinges.",
      workDate: "2026-06-09",
      amount: 45000,
      visibility: "PUBLIC",
    });
    const receiptId = createRes.body.data.id;
    const submitRes = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    const confirmRes = await request(app)
      .post(`/api/v1/verification/${submitRes.body.data.verificationToken}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Private Customer" });

    const code = confirmRes.body.data.verificationCode as string;
    const proofRes = await request(app).get(`/api/v1/public/receipts/${code}`);
    expect(proofRes.status).toBe(200);
    expect(JSON.stringify(proofRes.body.data)).not.toContain("private-customer@test.com");
    expect(JSON.stringify(proofRes.body.data)).not.toContain("+237600000999");
    expect(proofRes.body.data.workerName).toBe("Public Worker");
  });

  it("admin route rejects non-admin users", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "notadmin@test.com",
      password: "SecurePass1",
      fullName: "Not Admin",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    const res = await agent.get("/api/v1/admin/users");
    expect(res.status).toBe(403);
  });

  it("GET /api/v1/receipts accepts validated query parameters for authenticated worker", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "listquery@test.com",
      password: "SecurePass1",
      fullName: "List Query Worker",
      role: "WORKER",
      acceptTerms: true,
      acceptPrivacy: true,
    });
    await markEmailVerified("listquery@test.com");

    const createRes = await agent.post("/api/v1/receipts").send({
      customerName: "Filter Customer",
      customerEmail: "filter-customer@test.com",
      serviceTitle: "Verified filter test",
      description: "Work completed to test receipt listing with validated query parameters.",
      workDate: "2026-06-15",
      visibility: "PUBLIC",
    });
    expect(createRes.status).toBe(201);

    const receiptId = createRes.body.data.id as string;
    const submitRes = await agent.post(`/api/v1/receipts/${receiptId}/submit`);
    expect(submitRes.status).toBe(200);

    await request(app)
      .post(`/api/v1/verification/${submitRes.body.data.verificationToken as string}/respond`)
      .send({ decision: "CONFIRMED", customerName: "Filter Customer" });

    const listRes = await agent.get("/api/v1/receipts?status=VERIFIED&page=1&limit=10");
    expect(listRes.status).toBe(200);
    expect(listRes.body.success).toBe(true);
    expect(listRes.body.data.pagination).toMatchObject({ page: 1, limit: 10 });
    expect(listRes.body.data.items.some((item: { id: string }) => item.id === receiptId)).toBe(true);
  });
});
