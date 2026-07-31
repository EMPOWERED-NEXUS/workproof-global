import bcrypt from "bcrypt";
import {
  computeIntegrityHash,
  generateReceiptNumber,
  generateVerificationCode,
  hashToken,
} from "../src/lib/crypto.js";
import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Seeding WorkProof Global demo data...");

  const passwordHash = async (pw: string) => bcrypt.hash(pw, 12);

  const worker = await prisma.user.upsert({
    where: { email: "worker@workproof.test" },
    update: {},
    create: {
      email: "worker@workproof.test",
      passwordHash: await passwordHash("Demo123!"),
      fullName: "Amina Kouassi",
      role: "WORKER",
      workerProfile: {
        create: {
          profileSlug: "amina-kouassi",
          headline: "Professional tailor & home service artisan",
          bio: "Ten years of trusted garment repair, alterations, and home visits across Douala.",
          location: "Douala, Cameroon",
          phone: "+237 600 000 001",
          skills: ["Tailoring", "Alterations", "Home visits", "Customer service"],
        },
      },
    },
    include: { workerProfile: true },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@workproof.test" },
    update: {},
    create: {
      email: "admin@workproof.test",
      passwordHash: await passwordHash("Admin123!"),
      fullName: "WorkProof Admin",
      role: "ADMIN",
    },
  });

  const organisation = await prisma.user.upsert({
    where: { email: "organisation@workproof.test" },
    update: {},
    create: {
      email: "organisation@workproof.test",
      passwordHash: await passwordHash("Org123!"),
      fullName: "EmpowerEd Programmes",
      role: "ORGANISATION",
      organisation: {
        create: {
          name: "EmpowerEd Youth Skills Programme",
          description: "Supporting informal workers with portable proof of completed work.",
          website: "https://empowered-nexus.example",
          location: "Yaoundé, Cameroon",
        },
      },
    },
  });

  const worker2 = await prisma.user.upsert({
    where: { email: "worker2@workproof.test" },
    update: {},
    create: {
      email: "worker2@workproof.test",
      passwordHash: await passwordHash("Demo123!"),
      fullName: "Jean Mbarga",
      role: "WORKER",
      workerProfile: {
        create: {
          profileSlug: "jean-mbarga",
          headline: "Motorbike courier",
          location: "Yaoundé, Cameroon",
          skills: ["Delivery", "Navigation"],
        },
      },
    },
  });

  // Clear existing demo receipts for idempotency
  await prisma.auditLog.deleteMany({});
  await prisma.receiptEvent.deleteMany({});
  await prisma.confirmation.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.verificationRequest.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.workReceipt.deleteMany({ where: { workerId: worker.id } });

  const draft = await prisma.workReceipt.create({
    data: {
      workerId: worker.id,
      customerName: "Grace N.",
      customerEmail: "grace.demo@example.com",
      serviceTitle: "School uniform alterations",
      description: "Adjusted three secondary school uniforms — hems and waist sizing.",
      workDate: new Date("2026-06-10"),
      durationMinutes: 180,
      amount: 15000,
      skillsDemonstrated: ["Alterations", "Tailoring"],
      status: "DRAFT",
      visibility: "PRIVATE",
    },
  });

  const pending = await prisma.workReceipt.create({
    data: {
      workerId: worker.id,
      customerName: "Patrick O.",
      customerEmail: "patrick.demo@example.com",
      serviceTitle: "Curtain installation support",
      description: "Measured, hemmed, and installed living room curtains for a family home.",
      workDate: new Date("2026-06-12"),
      durationMinutes: 120,
      amount: 22000,
      skillsDemonstrated: ["Home visits", "Customer service"],
      status: "PENDING_VERIFICATION",
      visibility: "UNLISTED",
      submittedAt: new Date(),
      evidence: {
        create: [{ type: "LINK", url: "https://example.com/photo-curtains", description: "Before/after photos" }],
      },
      verificationRequests: {
        create: {
          tokenHash: hashToken("demo-verification-token-pending"),
          attemptNumber: 1,
          customerEmail: "patrick.demo@example.com",
          expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        },
      },
    },
  });

  const verificationCode = generateVerificationCode();
  const verified = await prisma.workReceipt.create({
    data: {
      workerId: worker.id,
      receiptNumber: generateReceiptNumber(1),
      customerName: "Marie T.",
      customerEmail: "marie.demo@example.com",
      serviceTitle: "Emergency dress repair before wedding",
      description: "Repaired torn seam and replaced zipper on wedding guest dress — same-day service.",
      workDate: new Date("2026-05-28"),
      durationMinutes: 90,
      amount: 18000,
      skillsDemonstrated: ["Tailoring", "Alterations"],
      status: "VERIFIED",
      visibility: "PUBLIC",
      verificationCode,
      integrityHash: computeIntegrityHash({
        receiptNumber: generateReceiptNumber(1),
        serviceTitle: "Emergency dress repair before wedding",
        workDate: "2026-05-28",
      }),
      submittedAt: new Date("2026-05-28"),
      verifiedAt: new Date("2026-05-29"),
      lockedAt: new Date("2026-05-29"),
      evidence: {
        create: [
          { type: "IMAGE", url: "/uploads/demo-dress-repair.jpg", mimeType: "image/jpeg", size: 102400, description: "Completed repair" },
        ],
      },
      confirmations: {
        create: {
          decision: "CONFIRMED",
          attemptNumber: 1,
          customerName: "Marie T.",
          customerEmail: "marie.demo@example.com",
          comment: "Excellent work — dress was ready on time.",
        },
      },
    },
  });

  const correction = await prisma.workReceipt.create({
    data: {
      workerId: worker.id,
      customerName: "Samuel K.",
      customerEmail: "samuel.demo@example.com",
      serviceTitle: "Office shirt tailoring batch",
      description: "Tailored five office shirts — customer requested sleeve length adjustment.",
      workDate: new Date("2026-06-01"),
      amount: 35000,
      skillsDemonstrated: ["Tailoring"],
      status: "CORRECTION_REQUESTED",
      visibility: "PRIVATE",
      submittedAt: new Date("2026-06-02"),
      confirmations: {
        create: {
          decision: "CORRECTION_REQUESTED",
          attemptNumber: 1,
          customerName: "Samuel K.",
          customerEmail: "samuel.demo@example.com",
          comment: "Two shirts need slightly shorter sleeves.",
        },
      },
    },
  });

  const disputed = await prisma.workReceipt.create({
    data: {
      workerId: worker.id,
      customerName: "Helen D.",
      customerEmail: "helen.demo@example.com",
      serviceTitle: "Traditional outfit adjustment",
      description: "Adjusted traditional outfit fit before community event.",
      workDate: new Date("2026-05-15"),
      amount: 12000,
      skillsDemonstrated: ["Alterations"],
      status: "DISPUTED",
      visibility: "UNLISTED",
      submittedAt: new Date("2026-05-16"),
      confirmations: {
        create: {
          decision: "DISPUTED",
          attemptNumber: 1,
          customerName: "Helen D.",
          customerEmail: "helen.demo@example.com",
          comment: "Fit was not as agreed.",
        },
      },
      dispute: {
        create: {
          reason: "Quality disagreement",
          description: "Customer believes the side seam adjustment was uneven.",
          status: "OPEN",
        },
      },
    },
  });

  await prisma.auditLog.createMany({
    data: [
      { actorId: worker.id, receiptId: draft.id, action: "RECEIPT_CREATED", entityType: "WorkReceipt", entityId: draft.id },
      { actorId: worker.id, receiptId: verified.id, action: "RECEIPT_VERIFIED", entityType: "WorkReceipt", entityId: verified.id },
      { actorId: admin.id, action: "SEED_COMPLETED", entityType: "System", entityId: "seed" },
    ],
  });

  console.log("Seed complete.");
  console.log("Demo worker:", worker.email, "/ Demo123!");
  console.log("Demo admin:", admin.email, "/ Admin123!");
  console.log("Demo organisation:", organisation.email, "/ Org123!");
  console.log("Second worker (access test):", worker2.email);
  console.log("Public verification code:", verificationCode);
  console.log("Pending verification token (dev): demo-verification-token-pending");
  void pending;
  void correction;
  void disputed;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
