import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";

const REDACT_KEYS =
  /password|token|secret|authorization|cookie|apikey|api_key|service_role|encryption|refresh|bearer/i;

export interface LogFields {
  requestId?: string;
  method?: string;
  route?: string;
  statusCode?: number;
  durationMs?: number;
  userId?: string;
  code?: string;
  [key: string]: unknown;
}

function redactValue(key: string, value: unknown): unknown {
  if (REDACT_KEYS.test(key)) return "[REDACTED]";
  if (typeof value === "string" && /[a-f0-9]{48,}/i.test(value)) {
    return value.replace(/[a-f0-9]{48,}/gi, "[REDACTED_TOKEN]");
  }
  return value;
}

function sanitiseFields(fields: LogFields): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    out[key] = redactValue(key, value);
  }
  return out;
}

function write(level: "info" | "warn" | "error", message: string, fields: LogFields = {}): void {
  const line = {
    level,
    message,
    service: "workproof-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    ...sanitiseFields(fields),
  };
  const serialised = JSON.stringify(line);
  if (level === "error") console.error(serialised);
  else if (level === "warn") console.warn(serialised);
  else console.info(serialised);
}

export const logger = {
  info: (message: string, fields?: LogFields) => write("info", message, fields),
  warn: (message: string, fields?: LogFields) => write("warn", message, fields),
  error: (message: string, fields?: LogFields) => write("error", message, fields),
};

export function createRequestId(): string {
  return randomUUID();
}

/** Unit-test helper: ensure sensitive keys are never emitted. */
export function assertLogRedaction(sample: Record<string, unknown>): boolean {
  const text = JSON.stringify(sanitiseFields(sample as LogFields));
  return !/Bearer\s+\S+/i.test(text) && !/"password"\s*:\s*"[^[]/i.test(text);
}
