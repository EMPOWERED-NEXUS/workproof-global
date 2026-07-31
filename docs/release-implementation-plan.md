# WorkProof Global — Release Implementation Plan

**Branch:** `release-v1-web-mobile`  
**Date:** 2026-07-31  
**Constraint:** Audit only — **do not implement fixes in this phase**.  
**Product invariant:** Preserve worker-owned Verified Work Receipt concept.

---

## 1. Launch posture

| Track | Current | Earliest credible target |
|-------|---------|--------------------------|
| API + Web pilot (private) | MVP with P0 holes | After Wave 0–1 |
| Public web launch | Not ready | After Wave 0–2 |
| Mobile preview APK | Shell only | After Wave 3 |
| Mobile production AAB | Not ready | After Wave 3–4 |

---

## 2. Product decisions required (block design choices)

| ID | Decision | Options | Why it blocks |
|----|----------|---------|---------------|
| DEC-01 | Public proof for non-VERIFIED (esp. REVOKED) | (A) 404 always unless VERIFIED (B) Show “Revoked” page (C) Keep current | PROOF-P0-001 |
| DEC-02 | Email verification policy | (A) Required before submit (B) Required before login (C) Optional for pilot | AUTH-P1-002 |
| DEC-03 | Organisation v1 scope | (A) Single-owner read-only metrics on assigned workers only (B) Full members/invites (C) Defer org role from public launch | SEC-P0-002, DATA-GAP-004 |
| DEC-04 | Mobile in “v1” marketing | (A) Web-first launch, mobile beta later (B) Joint launch requiring Wave 3 | MOBILE-P0-001 |
| DEC-05 | Git history cleanup for Prisma binaries | (A) `git rm --cached` going forward only (B) history rewrite | HYG-P0-001 |
| DEC-06 | Account/receipt retention on delete | (A) Hard delete cascade (B) Anonymize worker keep verified receipts (C) Soft delete + grace period | Privacy + cascades |

---

## 3. Recommended implementation order

### Wave 0 — Stop the bleeding (P0 hosting/safety) — Week 1

1. **HYG-P0-001** — Untrack generated Prisma engines/tmp; ignore `generated/`; document `prisma generate` in setup/CI.  
2. **SEC-P0-001 + EVID-P0-001** — Private evidence: disable public static; add authorized download; choose Supabase Storage (or S3) abstraction.  
3. **SEC-P0-002** — Org dashboard returns only safe empty/own data until membership exists (immediate mitigation even before full org model).  
4. **SEC-P0-003** — Gate/disable Swagger when `NODE_ENV=production`.  
5. **AUTH-P0-001** — Bearer + cookie authentication.  
6. **CONC-P0-001 / CONC-P0-002** — Atomic token claim + safe receipt numbering.  
7. **LIFE-P0-001** — Confirmation history / upsert fix (schema migration on staging only).  
8. **PROOF-P0-001** — Apply DEC-01.  
9. **EMAIL-P0-001** — Transactional email for verification links; hide raw token in production.  
10. **AUTH-P0-002** — Refresh tokens + revoke on logout (minimal table).  
11. **OPS-P0-001** — Minimal GitHub Actions: `npm ci`, prisma generate, typecheck, lint, api tests (Postgres service), web build.

**Exit criteria:** No public evidence; no org leak; verify/confirm concurrency-safe; correction cycle works; CI green; docs off in prod config.

### Wave 1 — Credible public web pilot — Week 2–3

1. Password reset + forgot UI (AUTH-P1-001).  
2. Email verification per DEC-02.  
3. `COOKIE_SECURE` / env hard-fail in production.  
4. Readiness endpoint with DB check.  
5. Web file upload + evidence remove + draft delete/archive/edit/filters.  
6. Admin UI mutations with confirm dialogs.  
7. Web consumes `@workproof/shared`.  
8. Public proof QR; basic PDF export.  
9. Legal acceptance capture.  
10. npm audit triage (DEP-SEC-001).  
11. Staging deploy runbook: Supabase Postgres, hosted API, hosted web, custom domain HTTPS, migrate deploy, backups.

**Exit criteria:** External pilot workers complete full receipt lifecycle without manual DB/token hacks; admin can revoke/resolve; staging monitored.

### Wave 2 — Tenancy, privacy, ops hardening — Week 3–4

1. Org members/assignments per DEC-03 (or remove org from launch).  
2. Account deletion per DEC-06.  
3. Receipt events API for workers.  
4. Structured logs + request IDs.  
5. MIME magic-byte validation; orphan cleanup job.  
6. Extension of audit/retention docs.  
7. Secret scanning + dependency audit in CI.  
8. Monitoring/alerting (uptime, 5xx, mail failures).

### Wave 3 — Mobile worker MVP — Week 4–6 (or parallel after Wave 0 auth)

1. SecureStore session; login/register; restore.  
2. Dashboard, receipts, create/edit, submit.  
3. Camera/gallery/document evidence.  
4. Deep links for verify/proof (open web or in-app).  
5. Offline draft queue + retry.  
6. EAS preview APK + production AAB profiles; production API URL.  
7. Replace Expo tutorial assets; align WP logo mark.  
8. Mobile typecheck + lint stable in CI; optional Detox/Maestro smoke later.

**Exit criteria:** Parity matrix worker rows Done for mobile critical path.

### Wave 4 — Polish & scale — post-launch

- Accessibility pass; PWA optional; i18n; notifications; malware scanning pipeline; EAS Update; advanced org programmes; CSRF tokens if needed; performance indexes.

---

## 4. Deployment readiness checklist (assess only)

| Item | Ready? | Notes |
|------|--------|-------|
| Supabase PostgreSQL | Partial | Compatible via `DATABASE_URL`; no prod migrate runbook yet |
| Hosted Express API | Partial | Builds; needs Dockerfile/platform config, secrets, uploads→object storage |
| Hosted React web | Partial | Vite build succeeds; needs static host + API CORS/env |
| Custom domains / HTTPS | Not configured | |
| Production env vars | Templates only | Enforce secure cookie/JWT |
| DB migrations | Init exists | Need expand-contract plan; never reset prod |
| Cloud evidence storage | Missing | P0 |
| Transactional email | Missing | P0 |
| EAS preview APK | Missing | No eas.json |
| EAS production AAB | Missing | |
| EAS Update | Missing | |
| Backups / rollback | Undocumented | |
| Monitoring | Missing | |

**Do not deploy until Wave 0 exit criteria met.**

---

## 5. Test plan expansion (map to waves)

| Wave | Add tests |
|------|-----------|
| 0 | Concurrent verify; correction cycle; evidence 401; org isolation; Bearer auth; swagger prod off |
| 1 | Password reset; upload MIME spoof; admin mutations; web smoke E2E |
| 2 | Deletion anonymization; member tenancy; readiness failure |
| 3 | Mobile unit for api-config/session; contract tests shared schemas |

Baseline today: API vitest suite exists but **failed here** because local Postgres was down — CI must provide the service.

---

## 6. Design language recommendation (do not replace logo now)

Adopt one shared WorkProof language already partially present:

| Token | Value | Usage |
|-------|-------|-------|
| Deep navy | `#0f2744` | Headers, trust surfaces |
| Emerald | `#0d9488` / `#0f766e` | Primary CTA, success path |
| Warm gold | `#c9a227` | Focus rings, accents, verified highlights |
| Cream | `#faf7f0` | Page background |
| WP mark | Existing gradient “WP” / mobile `LogoMark` | Keep current mark; retire Expo/React tutorial assets later |

Principles: worker ownership, trustworthy verification, accessible type (move web off pure system stack in Wave 1/4), consistent status badges across web/mobile.

---

## 7. Top 10 launch blockers

1. Public unauthenticated evidence files (`/uploads`).  
2. Local-disk evidence unsuitable for hosted multi-instance.  
3. Organisation dashboard leaks other workers’ data.  
4. No Bearer auth — mobile/API session model broken.  
5. Mobile app is placeholders only (if joint launch).  
6. Correction → reconfirm lifecycle broken (`Confirmation` unique).  
7. Non-atomic verification claiming under concurrency.  
8. Receipt number race under concurrency.  
9. No transactional email for customer verification.  
10. No CI/deploy scaffolding + Prisma Windows binaries committed.

---

## 8. Finding severity totals

| Severity | Count |
|----------|------:|
| P0 | 14 |
| P1 | 30 |
| P2 | 22 |
| P3 | 12 |

(Counts align with [`launch-readiness-audit.md`](./launch-readiness-audit.md).)

---

## 9. Explicit non-actions for this audit phase

- No branch switch / commit / push.  
- No production Supabase connect/migrate/seed.  
- No dependency major upgrades (Expo/RN/Prisma/Express/React/TS).  
- No mobile deletion or greenfield rewrite.  
- No logo replacement.  
- No `npm audit fix`.  
- No implementation of Wave 0+ fixes until directed.
