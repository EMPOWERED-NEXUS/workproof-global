import { describe, expect, it } from "vitest";
import request from "supertest";
import { createHash } from "node:crypto";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { hashToken } from "../src/lib/crypto.js";
import {
  buildWhatsAppShareUrl,
  confirmationAssuranceLabel,
  digitsOnlyPhone,
  e164PhoneSchema,
  evidenceLinkSchema,
  receiptCreateSchema,
} from "@workproof/shared";

async function registerWorker(email: string) {
  const password = "Password1!";
  await request(app).post("/api/v1/auth/register").send({
    email,
    password,
    fullName: "Inclusive Worker",
    acceptTerms: true,
    acceptPrivacy: true,
  });
  await prisma.user.update({
    where: { email },
    data: { emailVerifiedAt: new Date() },
  });
  const login = await request(app).post("/api/v1/auth/login").send({ email, password });
  return login.headers["set-cookie"] as string[];
}

function auth(cookies: string[]) {
  return { Cookie: cookies };
}

describe("inclusive multichannel confirmation", () => {
  it("keeps EMAIL confirmation compatible and rejects missing email", async () => {
    expect(
      receiptCreateSchema.safeParse({
        customerName: "Ada",
        serviceTitle: "Fence",
        description: "Built a wooden fence with posts",
        workDate: "2026-08-01",
        confirmationMethod: "EMAIL",
      }).success,
    ).toBe(false);

    const cookies = await registerWorker("inclusive-email@test.com");
    const created = await request(app)
      .post("/api/v1/receipts")
      .set(auth(cookies))
      .send({
        customerName: "Ada Customer",
        customerEmail: "ada@example.test",
        confirmationMethod: "EMAIL",
        serviceTitle: "Cupboard repair",
        description: "Repaired cupboard hinges and doors",
        workDate: "2026-08-01",
        visibility: "UNLISTED",
      });
    expect(created.status).toBe(201);

    const submit = await request(app)
      .post(`/api/v1/receipts/${created.body.data.id}/submit`)
      .set(auth(cookies));
    expect(submit.status).toBe(200);
    expect(submit.body.data.deliveryQueued).toBe(true);
    expect(submit.body.data.confirmationMethod).toBe("EMAIL");
    const token = submit.body.data.verificationToken as string;
    expect(token).toBeTruthy();

    const stored = await prisma.verificationRequest.findFirst({
      where: { receiptId: created.body.data.id },
      orderBy: { attemptNumber: "desc" },
    });
    expect(stored?.tokenHash).toBe(hashToken(token));
    expect(stored?.tokenHash).not.toBe(token);
    expect(JSON.stringify(stored)).not.toContain(token);

    const confirm = await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "CONFIRMED",
        acknowledgedAccuracy: true,
        customerName: "Ada Customer",
      });
    expect(confirm.status).toBe(200);
    expect(confirm.body.data.status).toBe("VERIFIED");
  });

  it("supports SHARE_LINK without email and does not persist WhatsApp numbers", async () => {
    expect(e164PhoneSchema.safeParse("+237612345678").success).toBe(true);
    expect(e164PhoneSchema.safeParse("237612345678").success).toBe(false);
    expect(digitsOnlyPhone("+237 612 345 678")).toBe("237612345678");
    const wa = buildWhatsAppShareUrl({
      phoneE164: "+237612345678",
      message: "Hello Ada\nhttps://example.test/verify/abc",
    });
    expect(wa).toBe(
      `https://wa.me/237612345678?text=${encodeURIComponent("Hello Ada\nhttps://example.test/verify/abc")}`,
    );

    const cookies = await registerWorker("inclusive-share@test.com");
    const created = await request(app)
      .post("/api/v1/receipts")
      .set(auth(cookies))
      .send({
        customerName: "Share Customer",
        confirmationMethod: "SHARE_LINK",
        serviceTitle: "Garden clean",
        description: "Cleared garden waste and trimmed hedges carefully",
        workDate: "2026-08-01",
        visibility: "UNLISTED",
      });
    expect(created.status).toBe(201);
    expect(created.body.data.customerEmail).toBeNull();

    const submit = await request(app)
      .post(`/api/v1/receipts/${created.body.data.id}/submit`)
      .set(auth(cookies));
    expect(submit.status).toBe(200);
    expect(submit.body.data.deliveryQueued).toBe(false);
    expect(submit.body.data.confirmationUrl).toMatch(/\/verify\//);
    expect(submit.body.data.shareMessage).toContain(submit.body.data.confirmationUrl);

    const receipt = await prisma.workReceipt.findUnique({
      where: { id: created.body.data.id },
    });
    expect(JSON.stringify(receipt)).not.toMatch(/\+237/);
    expect(receipt?.customerPhone).toBeNull();

    const token = new URL(submit.body.data.confirmationUrl as string).pathname.split("/").pop()!;
    const view = await request(app).get(`/api/v1/verification/${token}`);
    expect(view.status).toBe(200);
    expect(view.body.data.confirmationMethod).toBe("SHARE_LINK");

    const confirmed = await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "CONFIRMED",
        acknowledgedAccuracy: true,
        customerName: "S C",
      });
    expect(confirmed.status).toBe(200);

    const proofCode = (
      await prisma.workReceipt.findUnique({ where: { id: created.body.data.id } })
    )?.verificationCode;
    const proof = await request(app).get(`/api/v1/public/receipts/${proofCode}`);
    expect(proof.status).toBe(200);
    expect(proof.body.data.confirmationAssuranceLabel).toBe(
      confirmationAssuranceLabel("SHARE_LINK"),
    );
    expect(proof.body.data.confirmationChannelNote).toMatch(/does not independently verify/i);
    expect(proof.body.data).not.toHaveProperty("customerEmail");
    expect(proof.body.data).not.toHaveProperty("customerPhone");
    expect(JSON.stringify(proof.body.data)).not.toMatch(/\+237|@example\.test/i);
  });

  it("supports IN_PERSON_QR without email or phone and regenerates safely", async () => {
    const cookies = await registerWorker("inclusive-qr@test.com");
    const created = await request(app)
      .post("/api/v1/receipts")
      .set(auth(cookies))
      .send({
        customerName: "QR Customer",
        confirmationMethod: "IN_PERSON_QR",
        serviceTitle: "Pipe fix",
        description: "Fixed leaking pipe under kitchen sink area",
        workDate: "2026-08-01",
        visibility: "PUBLIC",
      });
    expect(created.status).toBe(201);

    const submit = await request(app)
      .post(`/api/v1/receipts/${created.body.data.id}/submit`)
      .set(auth(cookies));
    expect(submit.status).toBe(200);
    expect(submit.body.data.confirmationUrl).toBeTruthy();
    const firstToken = new URL(submit.body.data.confirmationUrl as string).pathname
      .split("/")
      .pop()!;

    // Force cooldown bypass by adjusting createdAt of latest request
    await prisma.verificationRequest.updateMany({
      where: { receiptId: created.body.data.id },
      data: { createdAt: new Date(Date.now() - 180_000) },
    });

    const regen = await request(app)
      .post(`/api/v1/receipts/${created.body.data.id}/regenerate-confirmation`)
      .set(auth(cookies));
    expect(regen.status).toBe(200);
    const secondToken = new URL(regen.body.data.confirmationUrl as string).pathname
      .split("/")
      .pop()!;
    expect(secondToken).not.toBe(firstToken);

    const oldView = await request(app).get(`/api/v1/verification/${firstToken}`);
    expect(oldView.status).toBe(400);
    expect(oldView.body.code).toBe("REVOKED_TOKEN");

    const confirm = await request(app)
      .post(`/api/v1/verification/${secondToken}/respond`)
      .send({
        decision: "CONFIRMED",
        acknowledgedAccuracy: true,
        customerName: "QR Customer",
      });
    expect(confirm.status).toBe(200);

    const replay = await request(app)
      .post(`/api/v1/verification/${secondToken}/respond`)
      .send({
        decision: "CONFIRMED",
        acknowledgedAccuracy: true,
        customerName: "QR Customer",
      });
    expect(replay.status).toBe(400);
    expect(replay.body.code).toBe("USED_TOKEN");
  });

  it("rejects expired tokens and dangerous evidence URLs; public proof hides CUSTOMER_ONLY", async () => {
    expect(evidenceLinkSchema.safeParse({ type: "LINK", url: "javascript:alert(1)" }).success).toBe(
      false,
    );
    expect(evidenceLinkSchema.safeParse({ type: "LINK", url: "http://example.com/a" }).success).toBe(
      false,
    );
    expect(
      evidenceLinkSchema.safeParse({
        type: "LINK",
        url: "https://user:pass@example.com/a",
      }).success,
    ).toBe(false);
    const okLink = evidenceLinkSchema.parse({
      type: "LINK",
      url: "https://www.tiktok.com/@demo/video/1",
      visibility: "PUBLIC_PROOF",
    });
    expect(okLink.linkPlatform).toBe("TikTok");

    const cookies = await registerWorker("inclusive-evidence@test.com");
    const created = await request(app)
      .post("/api/v1/receipts")
      .set(auth(cookies))
      .send({
        customerName: "Evidence Customer",
        confirmationMethod: "SHARE_LINK",
        serviceTitle: "Paint wall",
        description: "Painted living room walls with primer and finish",
        workDate: "2026-08-01",
        visibility: "PUBLIC",
      });
    const receiptId = created.body.data.id as string;

    const privateLink = await request(app)
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .set(auth(cookies))
      .send({
        type: "LINK",
        url: "https://instagram.com/p/private-demo",
        visibility: "CUSTOMER_ONLY",
      });
    expect(privateLink.status).toBe(201);

    const publicLink = await request(app)
      .post(`/api/v1/receipts/${receiptId}/evidence`)
      .set(auth(cookies))
      .send({
        type: "LINK",
        url: "https://www.tiktok.com/@demo/video/99",
        visibility: "PUBLIC_PROOF",
      });
    expect(publicLink.status).toBe(201);

    const submit = await request(app)
      .post(`/api/v1/receipts/${receiptId}/submit`)
      .set(auth(cookies));
    const token = new URL(submit.body.data.confirmationUrl as string).pathname.split("/").pop()!;

    const customerView = await request(app).get(`/api/v1/verification/${token}`);
    expect(customerView.status).toBe(200);
    expect(customerView.body.data.evidence).toHaveLength(2);

    await prisma.verificationRequest.updateMany({
      where: { receiptId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    const expired = await request(app).get(`/api/v1/verification/${token}`);
    expect(expired.status).toBe(400);
    expect(expired.body.code).toBe("EXPIRED_TOKEN");

    // Fresh token for confirmation
    await prisma.verificationRequest.updateMany({
      where: { receiptId },
      data: { createdAt: new Date(Date.now() - 180_000) },
    });
    const regen = await request(app)
      .post(`/api/v1/receipts/${receiptId}/regenerate-confirmation`)
      .set(auth(cookies));
    const freshToken = new URL(regen.body.data.confirmationUrl as string).pathname
      .split("/")
      .pop()!;
    await request(app)
      .post(`/api/v1/verification/${freshToken}/respond`)
      .send({
        decision: "CONFIRMED",
        acknowledgedAccuracy: true,
        customerName: "Evidence Customer",
      });

    const code = (await prisma.workReceipt.findUnique({ where: { id: receiptId } }))
      ?.verificationCode;
    const proof = await request(app).get(`/api/v1/public/receipts/${code}`);
    expect(proof.status).toBe(200);
    expect(proof.body.data.evidence).toHaveLength(1);
    expect(proof.body.data.evidence[0].linkPlatform).toBe("TikTok");
    expect(JSON.stringify(proof.body.data.evidence)).not.toContain("instagram.com/p/private-demo");
  });

  it("preserves correction requests and ownership isolation", async () => {
    const cookiesA = await registerWorker("inclusive-a@test.com");
    const cookiesB = await registerWorker("inclusive-b@test.com");
    const created = await request(app)
      .post("/api/v1/receipts")
      .set(auth(cookiesA))
      .send({
        customerName: "Correction Customer",
        confirmationMethod: "SHARE_LINK",
        serviceTitle: "Door install",
        description: "Installed interior door with frame and hardware",
        workDate: "2026-08-01",
        visibility: "UNLISTED",
      });
    const submit = await request(app)
      .post(`/api/v1/receipts/${created.body.data.id}/submit`)
      .set(auth(cookiesA));
    const token = new URL(submit.body.data.confirmationUrl as string).pathname.split("/").pop()!;

    const correction = await request(app)
      .post(`/api/v1/verification/${token}/respond`)
      .send({
        decision: "CORRECTION_REQUESTED",
        customerName: "Correction Customer",
        comment: "Please fix the work date on the receipt.",
      });
    expect(correction.status).toBe(200);
    expect(correction.body.data.status).toBe("CORRECTION_REQUESTED");

    const foreign = await request(app)
      .get(`/api/v1/receipts/${created.body.data.id}`)
      .set(auth(cookiesB));
    expect(foreign.status).toBe(404);

    // Hash lookup remains indexed; raw token never stored
    const digest = createHash("sha256").update(token).digest("hex");
    const row = await prisma.verificationRequest.findFirst({ where: { tokenHash: digest } });
    expect(row).toBeTruthy();
  });
});
