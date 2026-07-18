import "dotenv/config";
import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  TEST_DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_NAME: z.string().default("workproof_token"),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  VERIFICATION_TOKEN_EXPIRY_HOURS: z.coerce.number().int().positive().default(72),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(5),
});

const result = environmentSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = result.data;

export function getDatabaseUrl(): string {
  if (env.NODE_ENV === "test" && env.TEST_DATABASE_URL) {
    return env.TEST_DATABASE_URL;
  }
  return env.DATABASE_URL;
}
