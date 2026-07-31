import "dotenv/config";
import { z } from "zod";

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined || value === "") return defaultValue;
  return value === "true" || value === "1";
}

function parseOrigins(raw: string | undefined, fallback: string): string[] {
  const source = (raw && raw.trim().length > 0 ? raw : fallback)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return [...new Set(source)];
}

const rawSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  TEST_DATABASE_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  ALLOWED_ORIGINS: z.string().optional(),
  ACCESS_TOKEN_SECRET: z.string().min(16).optional(),
  /** @deprecated Prefer ACCESS_TOKEN_SECRET. Accepted only for local migration. */
  JWT_SECRET: z.string().min(16).optional(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),
  ACCESS_COOKIE_NAME: z.string().default("workproof_access"),
  REFRESH_COOKIE_NAME: z.string().default("workproof_refresh"),
  COOKIE_SECURE: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  ENABLE_API_DOCS: z.string().optional(),
  TRUST_PROXY: z.coerce.number().int().nonnegative().default(1),
  VERIFICATION_TOKEN_EXPIRY_HOURS: z.coerce.number().int().positive().default(72),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(5),
  JWT_ISSUER: z.string().default("workproof-api"),
  JWT_AUDIENCE: z.string().default("workproof-clients"),
});

const parsed = rawSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;
const accessTokenSecret = raw.ACCESS_TOKEN_SECRET ?? raw.JWT_SECRET;

if (!accessTokenSecret) {
  console.error("Invalid environment configuration:");
  console.error({ ACCESS_TOKEN_SECRET: ["ACCESS_TOKEN_SECRET is required (min 16 characters)."] });
  process.exit(1);
}

const isProduction = raw.NODE_ENV === "production";
const cookieSecure = parseBoolean(raw.COOKIE_SECURE, isProduction);
const enableApiDocs = parseBoolean(raw.ENABLE_API_DOCS, !isProduction);
const allowedOrigins = parseOrigins(raw.ALLOWED_ORIGINS, raw.FRONTEND_URL);

if (isProduction) {
  if (accessTokenSecret.length < 32) {
    console.error("Invalid environment configuration:");
    console.error({
      ACCESS_TOKEN_SECRET: ["ACCESS_TOKEN_SECRET must be at least 32 characters in production."],
    });
    process.exit(1);
  }
  if (!cookieSecure) {
    console.error("Invalid environment configuration:");
    console.error({ COOKIE_SECURE: ["COOKIE_SECURE must be true in production."] });
    process.exit(1);
  }
  const hasLocalhost = allowedOrigins.some((origin) => /localhost|127\.0\.0\.1/i.test(origin));
  if (hasLocalhost && process.env.ALLOW_LOCALHOST_ORIGINS_IN_PRODUCTION !== "true") {
    console.error("Invalid environment configuration:");
    console.error({
      ALLOWED_ORIGINS: [
        "Localhost origins are not permitted in production unless ALLOW_LOCALHOST_ORIGINS_IN_PRODUCTION=true.",
      ],
    });
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: raw.NODE_ENV,
  PORT: raw.PORT,
  DATABASE_URL: raw.DATABASE_URL,
  TEST_DATABASE_URL: raw.TEST_DATABASE_URL,
  FRONTEND_URL: raw.FRONTEND_URL,
  ALLOWED_ORIGINS: allowedOrigins,
  ACCESS_TOKEN_SECRET: accessTokenSecret,
  ACCESS_TOKEN_EXPIRES_IN: raw.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_DAYS: raw.REFRESH_TOKEN_EXPIRES_DAYS,
  ACCESS_COOKIE_NAME: raw.ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME: raw.REFRESH_COOKIE_NAME,
  COOKIE_SECURE: cookieSecure,
  COOKIE_DOMAIN: raw.COOKIE_DOMAIN?.trim() || undefined,
  ENABLE_API_DOCS: enableApiDocs,
  TRUST_PROXY: raw.TRUST_PROXY,
  VERIFICATION_TOKEN_EXPIRY_HOURS: raw.VERIFICATION_TOKEN_EXPIRY_HOURS,
  UPLOAD_DIR: raw.UPLOAD_DIR,
  MAX_UPLOAD_SIZE_MB: raw.MAX_UPLOAD_SIZE_MB,
  JWT_ISSUER: raw.JWT_ISSUER,
  JWT_AUDIENCE: raw.JWT_AUDIENCE,
};

export function getDatabaseUrl(): string {
  if (env.NODE_ENV === "test" && env.TEST_DATABASE_URL) {
    return env.TEST_DATABASE_URL;
  }
  return env.DATABASE_URL;
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return env.ALLOWED_ORIGINS.includes(origin);
}
