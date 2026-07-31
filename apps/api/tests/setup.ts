import { beforeAll, afterAll, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test-access-token-secret-32chars!!";
process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_DAYS = "30";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.WEB_APP_URL = "http://localhost:5173";
process.env.ALLOWED_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173";
process.env.COOKIE_SECURE = "false";
process.env.ENABLE_API_DOCS = "false";
process.env.STORAGE_PROVIDER = "local";
process.env.LOCAL_STORAGE_DIR = "uploads-test";
process.env.EMAIL_PROVIDER = "console";
process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
process.env.ALLOW_DEV_VERIFICATION_TOKEN = "true";
process.env.EMAIL_RESEND_COOLDOWN_SECONDS = "1";
process.env.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS = "1";
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
  await prisma.receiptEvent.deleteMany();
  await prisma.emailOutbox.deleteMany();
  await prisma.emailVerificationToken.deleteMany();
  await prisma.refreshToken.deleteMany();
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
