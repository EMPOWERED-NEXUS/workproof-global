# WorkProof Global — Release Implementation Plan

**Branch:** `release-v1-web-mobile`
**Updated:** 2026-07-31 (Wave 0A implemented locally — not committed)
**Product invariant:** Preserve worker-owned Verified Work Receipt concept.

---

## 1. Launch posture

| Track | Current | Earliest credible target |
|-------|---------|--------------------------|
| API + Web staging | Wave 0A auth/hygiene/CI foundation | After Wave 0B + Wave 1 |
| Public web launch | Not ready | After Wave 0B–2 |
| Mobile preview APK | Shell only (Bearer auth ready on API) | After Wave 3 |
| Mobile production AAB | Not ready | After Wave 3–4 |

---

## 2. Locked product decisions

| ID | Decision |
|----|----------|
| DEC-01 | Revoked/disputed public proofs remain accessible but must be clearly marked invalid (implement in Wave 0B) |
| DEC-02 | Email verification required before **receipt submission**, not before login |
| DEC-03 | Organisation v1 will support members, invitations, and worker assignments (containment shipped in 0A; full model later) |
| DEC-04 | Web/API staging launches before public mobile release |
| DEC-05 | Do **not** rewrite Git history for generated Prisma binaries (`git rm --cached` only) |
| DEC-06 | Account deletion will **pseudonymise** minimum verified-proof integrity records |

---

## 3. Recommended implementation order

### Wave 0A — COMPLETE (this change set)

- Prisma generated client/engines untracked + gitignored; `db:generate` before build/test
- RefreshToken model + local migration
- Access (15m) + rotating refresh (30d); cookie web + Bearer mobile
- Org dashboard privacy containment
- CORS allow-list, CSRF Origin guard, Swagger via `ENABLE_API_DOCS`
- Readiness + graceful shutdown
- GitHub Actions CI with Postgres service
- Session/auth regression tests

### Wave 0B — Remaining P0 hosting/safety

1. **SEC-P0-001 + EVID-P0-001** — Private evidence; cloud storage abstraction; authorized/signed downloads.
2. **CONC-P0-001 / CONC-P0-002** — Atomic verification claim + safe receipt numbering.
3. **LIFE-P0-001** — Confirmation history / correction resubmit fix.
4. **PROOF-P0-001** — Apply DEC-01 marking for revoked/disputed proof pages.
5. **EMAIL-P0-001** — Transactional email for verification links; hide raw token in production.

**Exit criteria for full Wave 0:** Wave 0A + 0B complete; no public evidence; verify/confirm concurrency-safe; correction cycle works.

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
