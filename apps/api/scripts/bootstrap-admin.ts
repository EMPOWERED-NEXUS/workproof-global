#!/usr/bin/env tsx
/**
 * One-time platform admin bootstrap for WorkProof Global.
 *
 * Does NOT run during deploy. Requires explicit --confirm.
 * Production requires --i-understand-production.
 *
 * Usage:
 *   npx tsx apps/api/scripts/bootstrap-admin.ts --email admin@example.com --confirm
 *   npx tsx apps/api/scripts/bootstrap-admin.ts --email admin@example.com --create --password '...' --confirm
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma, disconnectDatabase } from "../src/lib/prisma.js";
import { createAuditLog } from "../src/services/audit.service.js";

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

async function main() {
  const email = arg("--email")?.trim().toLowerCase();
  const password = arg("--password");
  const fullName = arg("--full-name") ?? "Platform Administrator";
  const confirm = hasFlag("--confirm");
  const create = hasFlag("--create");
  const prodAck = hasFlag("--i-understand-production");

  if (!email || !confirm) {
    console.error(
      "Usage: bootstrap-admin --email <email> --confirm [--create --password <pwd>] [--full-name <name>] [--i-understand-production]",
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production" && !prodAck) {
    console.error(
      "Refusing to run against production without --i-understand-production.",
    );
    process.exit(1);
  }

  if (create && (!password || password.length < 8)) {
    console.error("Creating a new admin requires --password (min 8 chars, meeting policy).");
    process.exit(1);
  }

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user && !create) {
    console.error(`No user found for ${email}. Pass --create --password to create one.`);
    process.exit(1);
  }

  if (!user && create && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "ADMIN",
        emailVerifiedAt: new Date(),
      },
    });
    await createAuditLog({
      actorId: user.id,
      action: "ADMIN_BOOTSTRAP_CREATED",
      entityType: "User",
      entityId: user.id,
      metadata: { email },
    });
    console.info(JSON.stringify({ ok: true, action: "created", userId: user.id, email }));
    return;
  }

  if (!user) {
    console.error("Unexpected state: user missing.");
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.info(JSON.stringify({ ok: true, action: "already_admin", userId: user.id, email }));
    return;
  }

  if (!user.emailVerifiedAt) {
    console.error("Refusing to promote an unverified user. Verify email first or use --create.");
    process.exit(1);
  }

  user = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  await createAuditLog({
    actorId: user.id,
    action: "ADMIN_BOOTSTRAP_PROMOTED",
    entityType: "User",
    entityId: user.id,
    metadata: { email },
  });

  console.info(JSON.stringify({ ok: true, action: "promoted", userId: user.id, email }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "bootstrap failed");
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDatabase();
  });
