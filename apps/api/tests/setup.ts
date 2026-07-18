import { beforeAll, afterAll, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-minimum-16-chars";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgresql://workproof:workproof_dev_password@localhost:5434/workproof_test?schema=public";
process.env.TEST_DATABASE_URL = process.env.DATABASE_URL;

const apiRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

beforeAll(async () => {
  execSync("npx prisma migrate deploy", {
    cwd: apiRoot,
    stdio: "inherit",
    env: process.env,
  });
});

beforeEach(async () => {
  const { prisma } = await import("../src/lib/prisma.js");
  await prisma.auditLog.deleteMany();
  await prisma.confirmation.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.workReceipt.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.organisation.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  const { disconnectDatabase } = await import("../src/lib/prisma.js");
  await disconnectDatabase();
});
