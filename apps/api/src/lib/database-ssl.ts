import type { PoolConfig } from "pg";

const SSL_URL_PARAMS = ["sslmode", "sslcert", "sslkey", "sslrootcert", "sslaccept"] as const;

/**
 * Normalize PEM text from env/SSM injection.
 * Accepts real newlines or escaped `\n` sequences without writing to disk.
 */
export function normalizeDatabaseSslCa(raw: string | undefined | null): string | undefined {
  if (raw == null) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed.includes("\\n") ? trimmed.replace(/\\n/g, "\n") : trimmed;
}

/** True when the database host is a Supabase connection pooler. */
export function isSupabasePoolerDatabaseUrl(databaseUrl: string): boolean {
  try {
    const host = new URL(databaseUrl).hostname.toLowerCase();
    return host === "pooler.supabase.com" || host.endsWith(".pooler.supabase.com");
  } catch {
    return false;
  }
}

/**
 * Production requires an explicit trusted CA for Supabase pooler hosts.
 * Local/test environments never require it.
 */
export function isDatabaseSslCaRequired(nodeEnv: string, databaseUrl: string): boolean {
  return nodeEnv === "production" && isSupabasePoolerDatabaseUrl(databaseUrl);
}

/**
 * Remove only SSL-related query parameters from a runtime copy of the URL.
 * Does not mutate the original secret string.
 */
export function sanitizeDatabaseUrlForExplicitSsl(connectionString: string): string {
  const url = new URL(connectionString);
  for (const param of SSL_URL_PARAMS) {
    url.searchParams.delete(param);
  }
  return url.toString();
}

export type PgPoolConfigInput = {
  connectionString: string;
  databaseSslCa?: string | null;
};

/**
 * Build pg.Pool configuration. When a trusted CA is supplied, use explicit SSL
 * with rejectUnauthorized: true and strip conflicting connection-string SSL params.
 */
/**
 * Small API tasks (0.25 vCPU / 0.5 GB) should keep a tight pool.
 * Override with DATABASE_POOL_MAX when needed.
 */
export function resolvePoolMax(raw = process.env.DATABASE_POOL_MAX): number {
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 20) return parsed;
  return 3;
}

export function buildPgPoolConfig(input: PgPoolConfigInput): PoolConfig {
  const ca = normalizeDatabaseSslCa(input.databaseSslCa ?? undefined);
  const max = resolvePoolMax();
  if (!ca) {
    return { connectionString: input.connectionString, max };
  }

  return {
    connectionString: sanitizeDatabaseUrlForExplicitSsl(input.connectionString),
    max,
    ssl: {
      ca,
      rejectUnauthorized: true,
    },
  };
}
