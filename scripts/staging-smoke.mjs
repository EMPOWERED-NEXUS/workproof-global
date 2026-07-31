#!/usr/bin/env node
/**
 * Non-destructive staging smoke test for WorkProof Global.
 *
 * Required env:
 *   SMOKE_BASE_URL=https://staging-api.example.com/api/v1
 *   SMOKE_WEB_ORIGIN=https://staging.example.com  (optional, for Origin header)
 *
 * Optional:
 *   SMOKE_ALLOW_PRODUCTION=true  (required if URL looks like production)
 *
 * Does not embed secrets. Creates identifiable staging-* accounts.
 */
import { randomBytes, createHash } from "node:crypto";

const base = (process.env.SMOKE_BASE_URL ?? "").replace(/\/$/, "");
const origin = process.env.SMOKE_WEB_ORIGIN ?? "";
const allowProd = process.env.SMOKE_ALLOW_PRODUCTION === "true";

if (!base) {
  console.error("SMOKE_BASE_URL is required");
  process.exit(1);
}
if (/workproof\.(com|app)|prod/i.test(base) && !allowProd) {
  console.error("Refusing production-like URL without SMOKE_ALLOW_PRODUCTION=true");
  process.exit(1);
}

const stamp = Date.now();
const email = `staging-smoke-${stamp}@example.test`;
const password = `Smoke${stamp}A1`;
const jar = new Map();

function parseSetCookie(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const c of raw) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

async function api(path, options = {}) {
  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(origin ? { Origin: origin } : {}),
    ...(jar.size
      ? { Cookie: [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ") }
      : {}),
    ...options.headers,
  };
  const res = await fetch(`${base}${path}`, { ...options, headers });
  parseSetCookie(res);
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  console.log("Smoke: health");
  let { res, body } = await api("/health");
  assert(res.status === 200 && body.success, "health failed");

  console.log("Smoke: readiness");
  ({ res, body } = await api("/readiness"));
  assert(res.status === 200 && body.success, "readiness failed");

  console.log("Smoke: register", email);
  ({ res, body } = await api("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      fullName: "Staging Smoke Worker",
      role: "WORKER",
    }),
  }));
  assert(res.status === 201 && body.success, `register failed: ${res.status}`);

  // Staging mechanism: mark verified via special header only when SMOKE_VERIFY_BYPASS is set
  // Otherwise expect operator to verify out-of-band. For local console email, bypass via API helper endpoint is not exposed —
  // smoke requires SMOKE_ACCESS_TOKEN_FOR_VERIFY or uses forgot-password style staging hook.
  if (process.env.SMOKE_MARK_EMAIL_VERIFIED_SQL === "true") {
    console.log("Smoke: email verify skipped (operator must have verified via staging tooling)");
  }

  console.log("Smoke: login");
  ({ res, body } = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }));
  assert(res.status === 200 && body.success, "login failed");

  console.log("Smoke: me");
  ({ res, body } = await api("/auth/me"));
  assert(res.status === 200 && body.data?.email === email, "me failed");

  if (!body.data?.emailVerified && !body.data?.emailVerifiedAt) {
    console.warn(
      "Email not verified — draft creation will continue; submit may fail until staging verification.",
    );
  }

  console.log("Smoke: create draft");
  ({ res, body } = await api("/receipts", {
    method: "POST",
    body: JSON.stringify({
      customerName: "Smoke Customer",
      customerEmail: `customer-${stamp}@example.test`,
      serviceTitle: `Staging smoke ${stamp}`,
      description: "Staging smoke-test receipt created by scripts/staging-smoke.mjs",
      workDate: "2026-07-15",
      visibility: "PUBLIC",
    }),
  }));
  assert(res.status === 201, "create receipt failed");
  const receiptId = body.data.id;

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  console.log("Smoke: evidence upload");
  const form = new FormData();
  form.append("file", new Blob([png], { type: "image/png" }), "smoke.png");
  ({ res, body } = await api(`/receipts/${receiptId}/evidence`, { method: "POST", body: form }));
  assert(res.status === 201, `evidence upload failed: ${res.status}`);
  const evidenceId = body.data.id;

  console.log("Smoke: evidence download");
  const dl = await fetch(`${base}/receipts/${receiptId}/evidence/${evidenceId}/download`, {
    headers: {
      Cookie: [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; "),
      ...(origin ? { Origin: origin } : {}),
    },
  });
  assert(dl.status === 200 || dl.status === 302, `download failed: ${dl.status}`);

  if (body.data?.emailVerified || process.env.SMOKE_FORCE_SUBMIT === "true") {
    console.log("Smoke: submit");
    ({ res, body } = await api(`/receipts/${receiptId}/submit`, { method: "POST" }));
    assert(res.status === 200, `submit failed: ${res.status}`);
  } else {
    console.log("Smoke: submit skipped (email unverified)");
  }

  console.log("Smoke: logout");
  ({ res } = await api("/auth/logout", { method: "POST" }));
  assert(res.status === 200, "logout failed");

  console.log("Smoke OK", {
    email,
    receiptId,
    evidenceId,
    checksumHint: createHash("sha256").update(png).digest("hex").slice(0, 8),
    nonce: randomBytes(4).toString("hex"),
  });
}

main().catch((err) => {
  console.error("Smoke FAILED:", err instanceof Error ? err.message : err);
  process.exit(1);
});
