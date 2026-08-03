import { describe, it, expect, vi } from "vitest";
import {
  buildPgPoolConfig,
  isDatabaseSslCaRequired,
  isSupabasePoolerDatabaseUrl,
  normalizeDatabaseSslCa,
  sanitizeDatabaseUrlForExplicitSsl,
} from "../src/lib/database-ssl.js";
import { env, getDatabaseSslCa } from "../src/config/env.js";

const SAMPLE_PEM = `-----BEGIN CERTIFICATE-----
MIISampleCertificateDataForUnitTestsOnly
-----END CERTIFICATE-----`;

const SAMPLE_PEM_ESCAPED =
  "-----BEGIN CERTIFICATE-----\\nMIISampleCertificateDataForUnitTestsOnly\\n-----END CERTIFICATE-----";

describe("database TLS CA configuration", () => {
  it("treats DATABASE_SSL_CA as optional outside production", () => {
    expect(env.NODE_ENV).not.toBe("production");
    expect(isDatabaseSslCaRequired("development", env.DATABASE_URL)).toBe(false);
    expect(isDatabaseSslCaRequired("test", env.DATABASE_URL)).toBe(false);
    expect(isDatabaseSslCaRequired("test", "postgresql://user:pass@db.pooler.supabase.com:5432/postgres")).toBe(
      false,
    );
    // Current test/runtime env must not require a CA.
    expect(getDatabaseSslCa()).toBeUndefined();
  });

  it("requires DATABASE_SSL_CA only for production Supabase pooler hosts", () => {
    expect(
      isDatabaseSslCaRequired(
        "production",
        "postgresql://user:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
      ),
    ).toBe(true);
    expect(
      isDatabaseSslCaRequired("production", "postgresql://user:pass@localhost:5434/workproof"),
    ).toBe(false);
    expect(
      isDatabaseSslCaRequired(
        "production",
        "postgresql://user:pass@db.abcdefgh.supabase.co:5432/postgres",
      ),
    ).toBe(false);
    expect(isSupabasePoolerDatabaseUrl("postgresql://x@pooler.supabase.com:6543/db")).toBe(true);
  });

  it("accepts PEM text with literal newline characters", () => {
    const normalized = normalizeDatabaseSslCa(SAMPLE_PEM);
    expect(normalized).toContain("-----BEGIN CERTIFICATE-----");
    expect(normalized).toContain("\n");
    expect(normalized).not.toContain("\\n");
  });

  it("normalizes PEM text containing escaped \\n from ECS/SSM injection", () => {
    const normalized = normalizeDatabaseSslCa(SAMPLE_PEM_ESCAPED);
    expect(normalized).toBe(SAMPLE_PEM);
    expect(normalized?.includes("\n")).toBe(true);
    expect(normalized?.includes("\\n")).toBe(false);
  });

  it("sanitizes only SSL-related URL parameters and preserves others", () => {
    const original =
      "postgresql://workproof:secret-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres" +
      "?schema=public&sslmode=require&connection_limit=5&pool_timeout=10" +
      "&connect_timeout=15&sslrootcert=/tmp/ca.pem&sslaccept=strict&sslcert=x&sslkey=y";

    const sanitized = sanitizeDatabaseUrlForExplicitSsl(original);
    const url = new URL(sanitized);

    expect(url.searchParams.get("schema")).toBe("public");
    expect(url.searchParams.get("connection_limit")).toBe("5");
    expect(url.searchParams.get("pool_timeout")).toBe("10");
    expect(url.searchParams.get("connect_timeout")).toBe("15");
    expect(url.searchParams.has("sslmode")).toBe(false);
    expect(url.searchParams.has("sslrootcert")).toBe(false);
    expect(url.searchParams.has("sslaccept")).toBe(false);
    expect(url.searchParams.has("sslcert")).toBe(false);
    expect(url.searchParams.has("sslkey")).toBe(false);

    // Original secret string is not mutated.
    expect(original).toContain("sslmode=require");
    expect(original).toContain("secret-password");
  });

  it("builds pool config with rejectUnauthorized true when CA is present", () => {
    const connectionString =
      "postgresql://workproof:secret-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres" +
      "?schema=public&sslmode=require&connection_limit=3";

    const config = buildPgPoolConfig({
      connectionString,
      databaseSslCa: SAMPLE_PEM_ESCAPED,
    });

    expect(config.ssl).toEqual({
      ca: SAMPLE_PEM,
      rejectUnauthorized: true,
    });
    expect(config.connectionString).toBeDefined();
    expect(config.connectionString).not.toContain("sslmode=");
    expect(config.connectionString).toContain("schema=public");
    expect(config.connectionString).toContain("connection_limit=3");
    // Explicit SSL must never disable verification.
    expect((config.ssl as { rejectUnauthorized: boolean }).rejectUnauthorized).toBe(true);
  });

  it("keeps local/test pool behavior unchanged when DATABASE_SSL_CA is absent", () => {
    const connectionString =
      "postgresql://workproof:workproof_dev_password@localhost:5434/workproof_test?schema=public";
    const config = buildPgPoolConfig({ connectionString });
    expect(config).toEqual({ connectionString });
    expect(config.ssl).toBeUndefined();
  });

  it("does not log secret CA or database URL values", () => {
    const logs: string[] = [];
    const spyLog = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const spyInfo = vi.spyOn(console, "info").mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const spyWarn = vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });
    const spyError = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      logs.push(args.map(String).join(" "));
    });

    try {
      normalizeDatabaseSslCa(SAMPLE_PEM);
      sanitizeDatabaseUrlForExplicitSsl(
        "postgresql://workproof:super-secret@host/db?schema=public&sslmode=require",
      );
      buildPgPoolConfig({
        connectionString: "postgresql://workproof:super-secret@host/db?sslmode=require",
        databaseSslCa: SAMPLE_PEM,
      });
      void getDatabaseSslCa();
    } finally {
      spyLog.mockRestore();
      spyInfo.mockRestore();
      spyWarn.mockRestore();
      spyError.mockRestore();
    }

    const joined = logs.join("\n");
    expect(joined).not.toContain("BEGIN CERTIFICATE");
    expect(joined).not.toContain("super-secret");
    expect(joined).not.toContain(SAMPLE_PEM);
  });
});
