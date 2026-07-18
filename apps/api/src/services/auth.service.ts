import bcrypt from "bcrypt";
import { AppError } from "../lib/errors.js";
import { slugify } from "../lib/crypto.js";
import { prisma } from "../lib/prisma.js";
import { createAuditLog } from "./audit.service.js";
import type { RegisterInput } from "@workproof/shared";

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput, ipAddress?: string) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw AppError.conflict("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        role: input.role,
      },
    });

    if (input.role === "WORKER") {
      let baseSlug = slugify(input.fullName) || "worker";
      let slug = baseSlug;
      let counter = 1;
      while (await tx.workerProfile.findUnique({ where: { profileSlug: slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      await tx.workerProfile.create({
        data: {
          userId: created.id,
          profileSlug: slug,
          headline: `${input.fullName} — informal worker`,
        },
      });
    }

    if (input.role === "ORGANISATION") {
      await tx.organisation.create({
        data: {
          ownerId: created.id,
          name: `${input.fullName}'s Organisation`,
          description: "Organisation profile on WorkProof Global.",
        },
      });
    }

    return created;
  });

  await createAuditLog({
    actorId: user.id,
    action: "USER_REGISTERED",
    entityType: "User",
    entityId: user.id,
    ipAddress,
    metadata: { role: user.role },
  });

  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw AppError.unauthorized("Invalid email or password.");
  }
  if (user.status === "SUSPENDED") {
    throw AppError.unauthorized("This account has been suspended.");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized("Invalid email or password.");
  }

  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { workerProfile: true, organisation: true },
  });
  if (!user) throw AppError.notFound("User not found.");
  const { passwordHash: _, ...safe } = user;
  return safe;
}
