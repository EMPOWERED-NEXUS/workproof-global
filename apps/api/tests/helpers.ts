import request from "supertest";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

export async function registerWorker(
  email: string,
  opts: { verifyEmail?: boolean; fullName?: string } = {},
) {
  const agent = request.agent(app);
  const res = await agent.post("/api/v1/auth/register").send({
    email,
    password: "SecurePass1",
    fullName: opts.fullName ?? "Test Worker",
    role: "WORKER",
    acceptTerms: true,
    acceptPrivacy: true,
  });
  if (res.status !== 201) {
    throw new Error(`register failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  if (opts.verifyEmail !== false) {
    await prisma.user.update({
      where: { email },
      data: { emailVerifiedAt: new Date() },
    });
  }
  return agent;
}

export async function markEmailVerified(email: string) {
  await prisma.user.update({
    where: { email },
    data: { emailVerifiedAt: new Date() },
  });
}
