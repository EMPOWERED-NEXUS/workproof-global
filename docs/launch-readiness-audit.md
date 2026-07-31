# WorkProof Global — Launch Readiness Audit

**Branch audited:** `release-v1-web-mobile`  
**Audit date:** 2026-07-31  
**Auditor role:** Lead production-readiness auditor  
**Scope:** Complete monorepo (API, web, mobile, shared, Prisma, CI/deploy, hygiene)  
**Product concept preserved:** Worker-owned Verified Work Receipt  

## Executive verdict

The monorepo contains a credible **web + API MVP** for the Verified Work Receipt lifecycle, but it is **not production-hosting ready**. Mobile is a branded navigation shell only. Several authorization, evidence, concurrency, and operations gaps would make public hosting unsafe or incomplete.

| Severity | Count |
|----------|------:|
| P0 | 14 |
| P1 | 30 |
| P2 | 22 |
| P3 | 12 |

---

## Phase A — Repository inventory

### Branch and working tree

| Item | Value |
|------|-------|
| Current branch | `release-v1-web-mobile` (confirmed; not changed) |
| Tracked dirty | `apps/api/generated/prisma/**` (generated client churn), `apps/web/package.json` |
| Untracked | `apps/api/generated/prisma/query_engine-windows.dll.node.tmp9624`, `package-lock.before-react-fix.json` |
| Ignored secrets present locally | `apps/api/.env`, `apps/api/.env.production.local`, `apps/mobile/.env` (not printed) |
| GitHub Actions | **None** (no `.github/workflows`) |
| EAS config | **None** (no `eas.json`) |
| Docker | `docker-compose.yml` PostgreSQL only (no API/web images) |

### Workspace dependency graph

```
workproof-global
├── @workproof/shared  (zod schemas/types) ← consumed by api + mobile
├── @workproof/api     (express + prisma)  ← depends on shared
├── @workproof/web     (vite react)        ← duplicates types locally; no shared import
└── @workproof/mobile  (expo 57)           ← depends on shared; screens are placeholders
```

Root scripts: `dev`, `dev:api`, `dev:web`, `dev:mobile`, `build`, `lint` (web only), `typecheck` (all), `typecheck:mobile`, `test`/`test:api`, `db:*`, `check`.

### Application routes (web)

| Path | Auth | Purpose |
|------|------|---------|
| `/` | public | Landing |
| `/login`, `/register` | public | Auth |
| `/verify/:token` | public | Customer verification |
| `/proof/:verificationCode` | public | Public proof |
| `/workers/:profileSlug` | public | Worker profile |
| `/privacy`, `/terms` | public | Legal stubs |
| `/dashboard` | any authed | Role dashboard |
| `/receipts`, `/receipts/new`, `/receipts/:id` | WORKER | Receipt UX |
| `/profile` | WORKER | Profile edit |
| `/organisation` | ORGANISATION | Org dashboard |
| `/admin` | ADMIN | Read-only admin lists |

### API endpoints (`/api/v1`)

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | public (liveness only) |
| POST | `/auth/register` | public |
| POST | `/auth/login` | public + login rate limit |
| POST | `/auth/logout` | public (clears cookie) |
| GET | `/auth/me` | cookie JWT |
| GET/PATCH | `/profile` | WORKER |
| GET | `/workers/:profileSlug` | public |
| CRUD-ish | `/receipts…` | WORKER |
| POST/DELETE | `/receipts/:id/evidence…` | WORKER |
| POST | `/receipts/:id/submit`, `/archive` | WORKER |
| GET/POST | `/verification/:token…` | public + rate limit |
| GET | `/public/receipts/:verificationCode` | public |
| GET | `/dashboard/worker` | WORKER |
| GET | `/dashboard/organisation` | ORGANISATION |
| GET | `/admin/users\|receipts\|disputes` | ADMIN |
| PATCH | `/admin/users/:id/status` | ADMIN |
| POST | `/admin/receipts/:id/revoke` | ADMIN |
| POST | `/admin/disputes/:id/resolve` | ADMIN |
| static | `/uploads/*` (app-level) | **public** |

Also: `/api-docs`, `/api-docs.json` always mounted.

### Database models

`User`, `WorkerProfile`, `Organisation`, `WorkReceipt`, `Evidence`, `VerificationRequest`, `Confirmation`, `Dispute`, `AuditLog`.

### User roles

`WORKER` · `ORGANISATION` · `ADMIN`

### Receipt states

`DRAFT` → `PENDING_VERIFICATION` → `VERIFIED` / `CORRECTION_REQUESTED` / `DISPUTED` → `REVOKED` / `ARCHIVED`

### Mobile routes (Expo Router)

`/`, `/(auth)/login`, `/(auth)/register`, `/(app)/dashboard`, `/(app)/receipts`, `/(app)/profile`, `+not-found` — all auth/app screens are **placeholders**.

### Baseline command results (local, non-production)

| Command | Result |
|---------|--------|
| `git branch --show-current` | `release-v1-web-mobile` |
| `git status --short` | Generated Prisma dirty + web package.json + untracked tmp/backup lock |
| `git diff --check` | CRLF warnings on generated Prisma only |
| `npm run typecheck` | **PASS** (shared, api, web, mobile) |
| `npm run lint` | **PASS** (web/oxlint only) |
| `npm run lint --workspace=@workproof/mobile` | **FAIL** — Expo auto-attempted ESLint install; module resolve failed. Side-effect reverted; not retained. |
| `npm run test` | **FAIL** — Postgres unreachable at `localhost:5434` (P1001); 12 tests skipped |
| `npm run build` | **PASS** (shared, api, web) |
| `npm audit` | **22** vulnerabilities (11 high, 11 moderate, 0 critical) — no fix applied |
| `npm ls --all` | Workspaces resolve; optional unmet deps only |

---

## Findings (master list)

Each finding uses: ID · severity · platform · paths · evidence · impact · correction · dependencies · acceptance criteria.

### P0 — Block production hosting

#### SEC-P0-001 — Evidence files publicly readable
- **Severity:** P0 · **Platform:** API / privacy
- **Paths:** `apps/api/src/app.ts`, `apps/api/src/middleware/upload.ts`, `apps/api/src/routes/index.ts`
- **Evidence:** `express.static` serves `UPLOAD_DIR` at `/uploads` with no authentication; evidence URLs stored as `/uploads/<filename>`.
- **User impact:** Anyone with a filename (or via enumeration/guessing timestamps) can download private work evidence.
- **Security/privacy:** Unauthorized access to worker/customer evidence — launch blocker.
- **Correction:** Stop public static serving. Serve evidence only through authenticated, authorized endpoints (worker owner / admin) or short-lived signed URLs from private object storage.
- **Dependencies:** Cloud storage decision (DEP-01).
- **AC:** Unauthenticated GET to any evidence object returns 401/404; authorized owner can still retrieve.

#### SEC-P0-002 — Organisation dashboard leaks platform-wide data
- **Severity:** P0 · **Platform:** API / privacy
- **Paths:** `apps/api/src/services/dashboard.service.ts` (`getOrganisationDashboard`)
- **Evidence:** Queries `workerProfile.findMany` and `workReceipt.findMany` with no organisation membership filter; returns other workers’ names and receipt titles.
- **User impact:** Organisation accounts see unrelated workers’ activity.
- **Security/privacy:** Horizontal privilege / confidentiality breach.
- **Correction:** Gate org data behind membership/assignment models; until then return only the org’s own profile and empty aggregates (no platform-wide lists).
- **Dependencies:** Org membership model (DATA-P1-001).
- **AC:** Org A never receives Worker B data; tests cover isolation.

#### AUTH-P0-001 — Cookie-only authentication (no Bearer)
- **Severity:** P0 · **Platform:** API / mobile / cross-platform
- **Paths:** `apps/api/src/middleware/auth.ts`
- **Evidence:** `authenticate` reads only `req.cookies[COOKIE_NAME]`; ignores `Authorization: Bearer`. Login/register still return `token` in JSON.
- **User impact:** Mobile cannot establish a usable authenticated session against the API as designed for native clients.
- **Security/privacy:** Cross-platform auth failure; encourages insecure workarounds.
- **Correction:** Accept Bearer OR cookie; document web=cookie, mobile=Bearer; keep httpOnly cookies for browsers.
- **Dependencies:** Mobile SecureStore session work (MOBILE-P0-001).
- **AC:** API integration tests pass with Bearer-only agent and cookie-only agent.

#### MOBILE-P0-001 — Mobile product surface is placeholders
- **Severity:** P0 · **Platform:** mobile
- **Paths:** `apps/mobile/src/app/(auth)/*`, `apps/mobile/src/app/(app)/*`
- **Evidence:** Login/register/dashboard/receipts/profile render `PlaceholderScreen` with “later phase” copy.
- **User impact:** No worker can use WorkProof on Android/iOS.
- **Security/privacy:** N/A functional; cross-platform launch claim fails.
- **Correction:** Implement auth, receipt list/create/submit, evidence capture, profile, and session restore against API (no Expo upgrade).
- **Dependencies:** AUTH-P0-001, API URL prod config, SecureStore.
- **AC:** Worker can register/login, create draft, attach evidence, submit, view status offline-aware.

#### LIFE-P0-001 — Correction → resubmit → confirm path breaks
- **Severity:** P0 · **Platform:** API / receipt lifecycle
- **Paths:** `apps/api/src/services/receipt.service.ts`, `apps/api/prisma/schema.prisma` (`Confirmation.receiptId` unique)
- **Evidence:** `CORRECTION_REQUESTED` creates a `Confirmation` row; later `CONFIRMED` attempts another `confirmation.create` on the same `receiptId`.
- **User impact:** Customer cannot confirm after a correction cycle; worker stuck.
- **Security/privacy:** Integrity of verification workflow broken.
- **Correction:** Model confirmations as history (1:N) or upsert/replace prior confirmation; keep latest decision; cover with integration test.
- **Dependencies:** Schema migration (do not run in this audit).
- **AC:** Full correction cycle test passes: submit → correction → edit → resubmit → confirm → VERIFIED.

#### CONC-P0-001 — Verification token claim is not atomic
- **Severity:** P0 · **Platform:** API
- **Paths:** `apps/api/src/services/verification.service.ts`, `receipt.service.ts` (`confirmReceiptInternally`)
- **Evidence:** `usedAt` checked then updated in a later transaction; concurrent POSTs can both pass the check.
- **User impact:** Double confirmation / conflicting dispute+confirm outcomes.
- **Security/privacy:** Integrity failure under concurrency.
- **Correction:** Single transaction with `UPDATE … WHERE used_at IS NULL RETURNING` (or equivalent conditional update); fail if 0 rows.
- **Dependencies:** None.
- **AC:** Concurrency test with parallel respond calls yields exactly one success.

#### CONC-P0-002 — Receipt number generation race
- **Severity:** P0 · **Platform:** API / data integrity
- **Paths:** `apps/api/src/services/receipt.service.ts`, `apps/api/src/lib/crypto.ts`
- **Evidence:** `count({ status: VERIFIED }) + 1` then assign `WP-YYYY-#####` without DB sequence/advisory lock.
- **User impact:** Duplicate receipt numbers under concurrent verifications (unique constraint → hard failure / lost confirmation).
- **Security/privacy:** Integrity/availability of verification.
- **Correction:** DB sequence, serial table, or retry-on-unique inside transaction.
- **Dependencies:** Migration for sequence optional.
- **AC:** Parallel confirmations never collide; uniqueness held.

#### EVID-P0-001 — Local disk evidence only (not hostable)
- **Severity:** P0 · **Platform:** API / deployment
- **Paths:** `apps/api/src/middleware/upload.ts`, `env.UPLOAD_DIR`
- **Evidence:** Multer `diskStorage` to process-local directory; no S3/Supabase Storage abstraction.
- **User impact:** Evidence lost on redeploy/ephemeral disks; multi-instance inconsistency.
- **Security/privacy:** Data loss risk.
- **Correction:** Private object storage + storage key in DB + signed download URLs.
- **Dependencies:** DEP-01 hosting choice.
- **AC:** API restart/new instance can still authorize-download existing evidence.

#### OPS-P0-001 — No production hosting/CI scaffolding
- **Severity:** P0 · **Platform:** deployment / CI
- **Paths:** missing `.github/workflows/*`, missing API/web Dockerfiles, missing `eas.json`, no hosting manifests
- **Evidence:** Inventory found zero workflow files and no EAS project config.
- **User impact:** No repeatable, reviewable path to production.
- **Security/privacy:** Manual deploys increase misconfiguration risk.
- **Correction:** Add CI (typecheck/lint/test/build), deploy runbooks, hosting configs, EAS profiles — without deploying in this audit.
- **Dependencies:** Environment variable matrix.
- **AC:** PR CI green on typecheck+lint+api tests+web build; documented deploy steps exist.

#### AUTH-P0-002 — No server-side session revocation
- **Severity:** P0 · **Platform:** API / auth
- **Paths:** `apps/api/src/middleware/auth.ts`, `apps/api/src/config/env.ts`
- **Evidence:** Stateless JWT (`JWT_EXPIRES_IN` default `7d`); logout only clears cookie; stolen token remains valid; no refresh-token store.
- **User impact:** Compromised sessions cannot be revoked except by suspending the whole user.
- **Security/privacy:** Unauthorized continued access.
- **Correction:** Refresh-token table with rotation + revoke-all; short-lived access tokens; logout revokes refresh.
- **Dependencies:** Data model gap (refresh tokens).
- **AC:** Logout/revoke-all invalidates subsequent Bearer/cookie use within access-token TTL design.

#### SEC-P0-003 — Swagger UI always exposed
- **Severity:** P0 · **Platform:** API / security
- **Paths:** `apps/api/src/app.ts`, `apps/api/src/swagger.ts`
- **Evidence:** `/api-docs` and `/api-docs.json` mounted unconditionally; server advertises localhost server URL.
- **User impact:** Attack surface documentation publicly available in production.
- **Security/privacy:** Aids reconnaissance.
- **Correction:** Disable in production or protect with auth/network allow-list.
- **Dependencies:** `NODE_ENV` enforcement.
- **AC:** Production config returns 404 for `/api-docs*`.

#### HYG-P0-001 — Generated Windows Prisma engines committed
- **Severity:** P0 · **Platform:** repo hygiene / deploy portability
- **Paths:** `apps/api/generated/prisma/query_engine-windows.dll.node`, `*.tmp*`, runtime wasm/js under `generated/`
- **Evidence:** `git ls-files` includes Windows query engine and a committed `.tmp35120`; working tree has another `.tmp9624` untracked.
- **User impact:** Linux/mac hosts/CI may pull wrong engines; repo bloat; dirty diffs on every generate.
- **Security/privacy:** Build reproducibility failure.
- **Correction:** Stop tracking generated client/engines; generate in CI/deploy; ignore `generated/` and `*.tmp*`; remove binaries from git history in a follow-up (product decision on force-history rewrite).
- **Dependencies:** CI `prisma generate` step.
- **AC:** Fresh clone + `prisma generate` works on Linux CI; no `.dll.node` in git.

#### EMAIL-P0-001 — No transactional email for verification
- **Severity:** P0 · **Platform:** API / product trust
- **Paths:** `apps/api/src/services/receipt.service.ts` (`submitReceipt` returns plaintext `verificationToken`), web `ReceiptDetailPage.tsx`
- **Evidence:** Token returned to worker UI for manual sharing; no mailer, no delivery log.
- **User impact:** Customers do not receive authentic verification messages; phishing/spoofing risk; pilot-only UX.
- **Security/privacy:** Trust and privacy of customer contact channel missing.
- **Correction:** Send one-time link via transactional email provider; never return raw token in production responses (or gate behind `NODE_ENV!==production` demo flag).
- **Dependencies:** Provider secrets (not committed); email log model.
- **AC:** Submit triggers email; production API response omits raw token; delivery failure surfaced to worker.

#### PROOF-P0-001 — Public proof available for revoked/disputed/correction states
- **Severity:** P0 · **Platform:** API / trust
- **Paths:** `apps/api/src/services/receipt.service.ts` (`getPublicProof`)
- **Evidence:** Only DRAFT/PENDING and PRIVATE visibility are blocked; REVOKED/DISPUTED/CORRECTION_REQUESTED with UNLISTED/PUBLIC still return proof payload including status.
- **User impact:** Revoked work may still appear as shareable “proof.”
- **Security/privacy:** Trust/integrity failure.
- **Correction:** Allow public proof only for `VERIFIED` (and optionally UNLISTED verified); revoked returns explicit revoked page or 404 per product decision.
- **Dependencies:** Product decision DEC-01.
- **AC:** Tests: VERIFIED public works; REVOKED does not present as valid proof.

---

### P1 — Required for credible first public release

#### AUTH-P1-001 — Missing password reset / forgot password
- Platform: API/web/mobile · Paths: none implemented · Correction: tokenized reset flow + pages · AC: user can reset without admin.

#### AUTH-P1-002 — Missing email verification on register
- Platform: API · Correction: verify-before-sensitive-actions or verify-before-login · AC: unverified cannot submit receipts (policy TBD).

#### AUTH-P1-003 — Missing account deletion
- Platform: API/web · Privacy · Correction: delete/anonymize flow with evidence purge · AC: user can request deletion; data retention policy enforced.

#### AUTH-P1-004 — Cookie secure flag not production-enforced
- Paths: `env.ts` · Correction: require `COOKIE_SECURE=true` when `NODE_ENV=production` · AC: boot fails if insecure cookie config in prod.

#### AUTH-P1-005 — JWT lifetime / cookie maxAge divergence
- Paths: `auth.ts` hardcodes `maxAge: 7d` while `JWT_EXPIRES_IN` is env-driven · Correction: derive both from one config · AC: unit test alignment.

#### OPS-P1-001 — Health has no readiness/DB check
- Paths: `app.ts` · Correction: `/readyz` pings DB · AC: DB down → readiness non-200; liveness still 200.

#### OPS-P1-002 — No structured logs / request IDs
- Correction: pino/winston + `X-Request-Id` · AC: errors correlatable.

#### OPS-P1-003 — CORS single-origin only
- Paths: `app.ts` · Correction: allow-list web + optional preview URLs · AC: production web origin works; others denied.

#### OPS-P1-004 — No cloud migration/deploy runbook
- Correction: document Supabase Postgres + `prisma migrate deploy` + backup/rollback · AC: written runbook reviewed.

#### EVID-P1-001 — MIME-only upload validation
- Paths: `upload.ts` · Correction: magic-byte sniff + extension allow-list mismatch reject · AC: spoofed Content-Type rejected.

#### EVID-P1-002 — Evidence file not deleted on DB remove
- Paths: `removeEvidence` · Correction: delete object/key; orphan janitor · AC: remove clears storage.

#### WEB-P1-001 — No file evidence upload UI
- Paths: `ReceiptDetailPage.tsx` · Only link evidence via `prompt` · Correction: file input → multipart · AC: worker uploads image/PDF.

#### WEB-P1-002 — No draft delete / archive / edit form / filters in UI
- Paths: receipts pages · API exists; UI incomplete · AC: filter by status; delete draft; archive; edit draft fields.

#### WEB-P1-003 — Admin UI cannot suspend/revoke/resolve
- Paths: `AdminPage.tsx`, `api.ts` missing mutation helpers · AC: admin can perform API actions from UI with confirmation.

#### WEB-P1-004 — Web does not consume `@workproof/shared`
- Paths: `apps/web/src/lib/api.ts` duplicates types · Correction: depend on shared · AC: single schema source.

#### WEB-P1-005 — No QR / PDF export
- Missing entirely · AC: proof page has QR; PDF download of verified receipt.

#### WEB-P1-006 — No forgot-password / verify-email pages
- Related AUTH-P1-001/002 · AC: routes exist and work.

#### MOBILE-P1-001 — No SecureStore / session restore / deep links / camera / offline queue
- Paths: mobile lib/screens · AC: parity matrix rows for worker MVP marked Done.

#### MOBILE-P1-002 — No EAS profiles / production API URL strategy
- Missing `eas.json` · AC: preview APK + production AAB configs documented.

#### MOBILE-P1-003 — Mobile lint not wired / fails
- `expo lint` not productionized · AC: `npm run lint --workspace=@workproof/mobile` passes without interactive installs.

#### DATA-P1-001 — No org members / invitations / assignments
- Schema gap · AC: org sees only assigned workers.

#### DATA-P1-002 — No refresh/email/password-reset/session tables
- Schema gap · AC: models + migrations prepared (not run here).

#### DATA-P1-003 — No revocation reason / archivedAt columns
- Revoke reason only in audit metadata · AC: first-class fields.

#### DATA-P1-004 — No terms/privacy acceptance record
- Legal stubs only · AC: acceptance timestamp stored at register.

#### TEST-P1-001 — CI cannot run API tests without managed Postgres service
- Tests skipped when DB down · AC: CI service container + migrate deploy.

#### TEST-P1-002 — Missing authz, concurrency, evidence, correction tests
- `api.test.ts` covers happy path only · AC: suites for P0 defects.

#### TEST-P1-003 — No web E2E / component tests; no mobile tests
- AC: smoke E2E for register→submit→verify→proof.

#### SEC-P1-001 — Dependency vulnerabilities (22)
- `npm audit` high includes `react-router` CSRF advisory and eslint/minimatch chain · AC: reviewed/patched without `--force` unless approved.

#### SEC-P1-002 — Demo seed credentials documented (acceptable for local) but bootstrap admin path unclear for prod
- Paths: `prisma/seed.ts`, README · AC: production admin bootstrap procedure (one-time) without seed passwords.

#### BRAND-P1-001 — Web typography uses system stack; mobile assets still include Expo/React tutorial imagery
- Paths: `apps/web/src/index.css`, `apps/mobile/assets/images/*` · AC: shared WP mark + brand fonts applied; tutorial assets removed from release binary.

---

### P2 — Important soon after launch

| ID | Summary |
|----|---------|
| LIFE-P2-001 | Archive allowed from any non-archived status without policy guards |
| LIFE-P2-002 | No receipt event/history API beyond audit logs |
| LIFE-P2-003 | Resend verification not distinct from submit |
| AUTH-P2-001 | No CSRF token for cookie-auth state-changing requests (SameSite=Lax helps) |
| AUTH-P2-002 | Login rate limit 20/15m may be high for production; no IP+email combo lockout |
| AUTH-P2-003 | Admin can suspend self / other admins without guardrails |
| OPS-P2-001 | Error handler logs unstructured `console.error` |
| OPS-P2-002 | Graceful shutdown lacks in-flight request drain timeout |
| OPS-P2-003 | Trust proxy fixed to `1` — document for platform |
| EVID-P2-001 | No malware scanning documentation/process |
| EVID-P2-002 | Original filename stored; ensure Content-Disposition safe |
| WEB-P2-001 | Landing CTA “Verify a receipt” points to `/login` (confusing) |
| WEB-P2-002 | Accessibility: limited `aria-*`, no skip link, status badges may lack text alternatives |
| WEB-P2-003 | No PWA/offline support |
| WEB-P2-004 | Responsive nav has no mobile menu pattern |
| MOBILE-P2-001 | `userInterfaceStyle: automatic` vs cream/navy brand — dark mode inconsistency |
| MOBILE-P2-002 | Scheme `workproof` defined but no deep-link screens for verify/proof |
| TEST-P2-001 | No contract tests shared↔api↔web↔mobile |
| TEST-P2-002 | No secret scanning in CI |
| HYG-P2-001 | `package-lock.before-react-fix.json` untracked backup should not ship |
| HYG-P2-002 | `.gitignore` does not ignore `apps/api/generated`, `uploads/`, Expo caches explicitly enough for all cases |
| BRAND-P2-001 | Cards heavily used on marketing landing contrary to “worker-first composition” polish goals |

---

### P3 — Optional enhancements

| ID | Summary |
|----|---------|
| FEAT-P3-001 | Notifications centre |
| FEAT-P3-002 | Multi-currency beyond XAF default |
| FEAT-P3-003 | Cohorts/programmes analytics |
| FEAT-P3-004 | Biometric unlock on mobile |
| FEAT-P3-005 | Web i18n (EN/FR) for Cameroon/Africa focus |
| FEAT-P3-006 | Customer accounts (currently link-only) |
| A11Y-P3-001 | Full WCAG 2.2 AA audit with tooling |
| OPS-P3-001 | OpenTelemetry tracing |
| OPS-P3-002 | Feature flags |
| BRAND-P3-001 | Motion system (2–3 intentional motions) on landing |
| BRAND-P3-002 | Illustrated empty states |
| DOCS-P3-001 | Public status page |

---

## Cross-references

- Feature parity: [`feature-parity-matrix.md`](./feature-parity-matrix.md)
- Security detail: [`security-audit.md`](./security-audit.md)
- Data model gaps: [`data-model-gap-analysis.md`](./data-model-gap-analysis.md)
- Implementation order: [`release-implementation-plan.md`](./release-implementation-plan.md)

## Product decisions required

See DEC-01 … DEC-06 in the implementation plan (public proof of revoked receipts, email-verification policy, org multi-member model, history rewrite for Prisma binaries, mobile launch scope for v1, GDPR deletion retention).
