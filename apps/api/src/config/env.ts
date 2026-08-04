import "dotenv/config";
import { z } from "zod";
import {
  isDatabaseSslCaRequired,
  normalizeDatabaseSslCa,
} from "../lib/database-ssl.js";

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
  /** PEM text for a trusted database CA (required for Supabase pooler in production). */
  DATABASE_SSL_CA: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  WEB_APP_URL: z.string().url().optional(),
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
  /** EMAIL confirmation token lifetime (hours). SHARE_LINK uses SHARE_LINK_TOKEN_EXPIRY_HOURS. */
  VERIFICATION_TOKEN_EXPIRY_HOURS: z.coerce.number().int().positive().default(72),
  SHARE_LINK_TOKEN_EXPIRY_HOURS: z.coerce.number().int().positive().default(72),
  IN_PERSON_QR_TOKEN_EXPIRY_MINUTES: z.coerce.number().int().positive().default(10),
  /** @deprecated Prefer LOCAL_STORAGE_DIR. Kept for local compatibility. */
  UPLOAD_DIR: z.string().default("uploads"),
  LOCAL_STORAGE_DIR: z.string().optional(),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(5),
  JWT_ISSUER: z.string().default("workproof-api"),
  JWT_AUDIENCE: z.string().default("workproof-clients"),
  STORAGE_PROVIDER: z.enum(["local", "supabase"]).default("local"),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("workproof-evidence"),
  SIGNED_URL_EXPIRY_SECONDS: z.coerce.number().int().positive().default(120),
  EMAIL_PROVIDER: z.enum(["console", "transactional"]).default("console"),
  EMAIL_FROM: z.string().default("WorkProof Global <noreply@workproof.local>"),
  EMAIL_REPLY_TO: z.string().optional(),
  SUPPORT_EMAIL: z.string().email().default("support@workproof.local"),
  EMAIL_API_URL: z.string().url().optional(),
  EMAIL_API_KEY: z.string().optional(),
  EMAIL_PAYLOAD_ENCRYPTION_KEY: z.string().min(32).optional(),
  EMAIL_JOB_POLL_INTERVAL_MS: z.coerce.number().int().positive().default(5000),
  EMAIL_JOB_MAX_ATTEMPTS: z.coerce.number().int().positive().default(8),
  EMAIL_JOB_PROCESSING_TIMEOUT_MS: z.coerce.number().int().positive().default(120_000),
  EMAIL_VERIFICATION_EXPIRY_HOURS: z.coerce.number().int().positive().default(48),
  EMAIL_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(60),
  CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(120),
  PASSWORD_RESET_EXPIRY_HOURS: z.coerce.number().int().positive().default(1),
  ALLOW_DEV_VERIFICATION_TOKEN: z.string().optional(),
  ALLOW_DEV_PASSWORD_RESET_TOKEN: z.string().optional(),
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
const isTest = raw.NODE_ENV === "test";
const cookieSecure = parseBoolean(raw.COOKIE_SECURE, isProduction);
const enableApiDocs = parseBoolean(raw.ENABLE_API_DOCS, !isProduction);
const allowedOrigins = parseOrigins(raw.ALLOWED_ORIGINS, raw.FRONTEND_URL);
const webAppUrl = raw.WEB_APP_URL ?? raw.FRONTEND_URL;
const localStorageDir = raw.LOCAL_STORAGE_DIR ?? raw.UPLOAD_DIR;
const allowDevVerificationToken = parseBoolean(
  raw.ALLOW_DEV_VERIFICATION_TOKEN,
  raw.NODE_ENV === "development" || isTest,
);
const allowDevPasswordResetToken = parseBoolean(
  raw.ALLOW_DEV_PASSWORD_RESET_TOKEN,
  raw.NODE_ENV === "development" || isTest,
);

const emailPayloadKey =
  raw.EMAIL_PAYLOAD_ENCRYPTION_KEY ??
  (isTest || raw.NODE_ENV === "development"
    ? "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    : undefined);

if (!emailPayloadKey) {
  console.error("Invalid environment configuration:");
  console.error({
    EMAIL_PAYLOAD_ENCRYPTION_KEY: [
      "EMAIL_PAYLOAD_ENCRYPTION_KEY is required (64 hex chars / 32 bytes).",
    ],
  });
  process.exit(1);
}

if (emailPayloadKey === accessTokenSecret) {
  console.error("Invalid environment configuration:");
  console.error({
    EMAIL_PAYLOAD_ENCRYPTION_KEY: [
      "EMAIL_PAYLOAD_ENCRYPTION_KEY must not reuse ACCESS_TOKEN_SECRET.",
    ],
  });
  process.exit(1);
}

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
  if (raw.STORAGE_PROVIDER === "local") {
    console.error("Invalid environment configuration:");
    console.error({ STORAGE_PROVIDER: ["local storage is forbidden in production."] });
    process.exit(1);
  }
  if (raw.EMAIL_PROVIDER === "console") {
    console.error("Invalid environment configuration:");
    console.error({ EMAIL_PROVIDER: ["console email provider is forbidden in production."] });
    process.exit(1);
  }
  if (!raw.SUPABASE_URL || !raw.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Invalid environment configuration:");
    console.error({
      SUPABASE_URL: ["SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in production."],
    });
    process.exit(1);
  }
  if (!/^https:\/\//i.test(webAppUrl)) {
    console.error("Invalid environment configuration:");
    console.error({ WEB_APP_URL: ["WEB_APP_URL must use HTTPS in production."] });
    process.exit(1);
  }
  if (!raw.EMAIL_API_URL || !raw.EMAIL_API_KEY) {
    console.error("Invalid environment configuration:");
    console.error({
      EMAIL_API_URL: ["EMAIL_API_URL and EMAIL_API_KEY are required for transactional email."],
    });
    process.exit(1);
  }
  if (isDatabaseSslCaRequired(raw.NODE_ENV, raw.DATABASE_URL) && !normalizeDatabaseSslCa(raw.DATABASE_SSL_CA)) {
    console.error("Invalid environment configuration:");
    console.error({
      DATABASE_SSL_CA: [
        "DATABASE_SSL_CA (trusted database CA PEM) is required in production when using a Supabase pooler host.",
      ],
    });
    process.exit(1);
  }
}

const databaseSslCa = normalizeDatabaseSslCa(raw.DATABASE_SSL_CA);

if (raw.STORAGE_PROVIDER === "supabase" && !isTest) {
  if (!raw.SUPABASE_URL || !raw.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Invalid environment configuration:");
    console.error({
      SUPABASE_URL: ["SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for supabase storage."],
    });
    process.exit(1);
  }
}

export const env = {
  NODE_ENV: raw.NODE_ENV,
  PORT: raw.PORT,
  DATABASE_URL: raw.DATABASE_URL,
  TEST_DATABASE_URL: raw.TEST_DATABASE_URL,
  DATABASE_SSL_CA: databaseSslCa,
  FRONTEND_URL: raw.FRONTEND_URL,
  WEB_APP_URL: webAppUrl,
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
  SHARE_LINK_TOKEN_EXPIRY_HOURS: raw.SHARE_LINK_TOKEN_EXPIRY_HOURS,
  IN_PERSON_QR_TOKEN_EXPIRY_MINUTES: raw.IN_PERSON_QR_TOKEN_EXPIRY_MINUTES,
  UPLOAD_DIR: localStorageDir,
  LOCAL_STORAGE_DIR: localStorageDir,
  MAX_UPLOAD_SIZE_MB: raw.MAX_UPLOAD_SIZE_MB,
  JWT_ISSUER: raw.JWT_ISSUER,
  JWT_AUDIENCE: raw.JWT_AUDIENCE,
  STORAGE_PROVIDER: raw.STORAGE_PROVIDER,
  SUPABASE_URL: raw.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: raw.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET: raw.SUPABASE_STORAGE_BUCKET,
  SIGNED_URL_EXPIRY_SECONDS: raw.SIGNED_URL_EXPIRY_SECONDS,
  EMAIL_PROVIDER: raw.EMAIL_PROVIDER,
  EMAIL_FROM: raw.EMAIL_FROM,
  EMAIL_REPLY_TO: raw.EMAIL_REPLY_TO,
  SUPPORT_EMAIL: raw.SUPPORT_EMAIL,
  EMAIL_API_URL: raw.EMAIL_API_URL,
  EMAIL_API_KEY: raw.EMAIL_API_KEY,
  EMAIL_PAYLOAD_ENCRYPTION_KEY: emailPayloadKey,
  EMAIL_JOB_POLL_INTERVAL_MS: raw.EMAIL_JOB_POLL_INTERVAL_MS,
  EMAIL_JOB_MAX_ATTEMPTS: raw.EMAIL_JOB_MAX_ATTEMPTS,
  EMAIL_JOB_PROCESSING_TIMEOUT_MS: raw.EMAIL_JOB_PROCESSING_TIMEOUT_MS,
  EMAIL_VERIFICATION_EXPIRY_HOURS: raw.EMAIL_VERIFICATION_EXPIRY_HOURS,
  EMAIL_RESEND_COOLDOWN_SECONDS: raw.EMAIL_RESEND_COOLDOWN_SECONDS,
  CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS: raw.CUSTOMER_VERIFICATION_RESEND_COOLDOWN_SECONDS,
  PASSWORD_RESET_EXPIRY_HOURS: raw.PASSWORD_RESET_EXPIRY_HOURS,
  ALLOW_DEV_VERIFICATION_TOKEN: allowDevVerificationToken,
  ALLOW_DEV_PASSWORD_RESET_TOKEN: allowDevPasswordResetToken,
};

/** Config presence checks for readiness — does not call external providers. */
export function getReadinessConfigChecks(): Record<string, "ok" | "missing"> {
  const checks: Record<string, "ok" | "missing"> = {
    accessTokenSecret: env.ACCESS_TOKEN_SECRET ? "ok" : "missing",
    emailPayloadEncryptionKey: env.EMAIL_PAYLOAD_ENCRYPTION_KEY ? "ok" : "missing",
    webAppUrl: env.WEB_APP_URL ? "ok" : "missing",
    storageProviderConfigured: env.STORAGE_PROVIDER ? "ok" : "missing",
    emailProviderConfigured: env.EMAIL_PROVIDER ? "ok" : "missing",
  };
  if (env.STORAGE_PROVIDER === "supabase") {
    checks.supabaseUrl = env.SUPABASE_URL ? "ok" : "missing";
    checks.supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY ? "ok" : "missing";
    checks.supabaseStorageBucket = env.SUPABASE_STORAGE_BUCKET ? "ok" : "missing";
  }
  if (env.EMAIL_PROVIDER === "transactional") {
    checks.emailApiUrl = env.EMAIL_API_URL ? "ok" : "missing";
    checks.emailApiKey = env.EMAIL_API_KEY ? "ok" : "missing";
  }
  return checks;
}

export function getDatabaseUrl(): string {
  if (env.NODE_ENV === "test" && env.TEST_DATABASE_URL) {
    return env.TEST_DATABASE_URL;
  }
  return env.DATABASE_URL;
}

/** Trusted database CA PEM when configured. Never log the returned value. */
export function getDatabaseSslCa(): string | undefined {
  return env.DATABASE_SSL_CA;
}

export function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return false;
  return env.ALLOWED_ORIGINS.includes(origin);
}
