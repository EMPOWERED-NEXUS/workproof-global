import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { createAuditLog } from "./audit.service.js";

export type ProfileUpdateInput = {
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills?: string[];
};

export async function getOwnProfile(userId: string) {
  const profile = await prisma.workerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.notFound("Worker profile not found.");
  return profile;
}

export async function updateOwnProfile(userId: string, input: ProfileUpdateInput) {
  const profile = await prisma.workerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.notFound("Worker profile not found.");

  const updated = await prisma.workerProfile.update({
    where: { userId },
    data: input,
  });

  await createAuditLog({
    actorId: userId,
    action: "PROFILE_UPDATED",
    entityType: "WorkerProfile",
    entityId: updated.id,
  });

  return updated;
}

export async function getPublicWorkerProfile(slug: string) {
  const profile = await prisma.workerProfile.findUnique({
    where: { profileSlug: slug },
    include: {
      user: {
        select: { fullName: true, status: true },
      },
    },
  });

  if (!profile || profile.user.status !== "ACTIVE") {
    throw AppError.notFound("Worker profile not found.");
  }

  return {
    fullName: profile.user.fullName,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    skills: profile.skills,
    profileSlug: profile.profileSlug,
  };
}

