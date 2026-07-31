# WorkProof Global — Security Audit

**Branch:** `release-v1-web-mobile`  
**Date:** 2026-07-31  
**Rule:** Secret values are never printed — paths and categories only.

---

## 1. Secret and repository hygiene

### 1.1 Committed vs ignored

| Category | Status | Paths / notes |
|----------|--------|---------------|
| `.env` examples | Tracked (OK) | `apps/api/.env.example`, `apps/web/.env.example`, `apps/mobile/.env.example` |
| Local `.env` files | Ignored by `.gitignore` | Present locally: `apps/api/.env`, `apps/api/.env.production.local`, `apps/mobile/.env` |
| Demo DB password in examples | Expected for local Docker | Category: **dev database credential template** in `.env.example` / README / `docker-compose.yml` |
| JWT secret template | Example only | Category: **JWT secret placeholder** in `apps/api/.env.example` |
| Seed demo passwords | Documented in README/seed | Category: **demo account passwords** — must never be used in production |
| Production env files | Local ignored | Category: **production env** at `apps/api/.env.production.local` (contents not inspected/printed) |

### 1.2 Dangerous tracked artifacts

| Category | Severity | Paths |
|----------|----------|-------|
| Windows Prisma query engine | P0 | `apps/api/generated/prisma/query_engine-windows.dll.node` |
| Temp query engine | P0 | Tracked `query_engine-windows.dll.node.tmp35120`; untracked `*.tmp9624` |
| Full generated Prisma client | P1/P0 | Entire `apps/api/generated/prisma/**` tracked |
| Lockfile backup | P2 | Untracked `package-lock.before-react-fix.json` |
| Upload directory | Check | Ensure runtime uploads never committed (local `uploads/` should stay ignored) |
| Expo caches | Ignored | `apps/mobile/.expo/**` |
| Build output | Partially ignored | `dist/` in root gitignore; verify per-app |

### 1.3 Hardcoded network targets (non-secret)

| Pattern | Paths | Risk |
|---------|-------|------|
| `localhost` defaults | `env.ts`, Vite proxy, swagger, docs, `.env.example` | Dev-only; ensure production overrides |
| LAN IP guidance | `apps/mobile/.env.example` comments | OK guidance; no hardcoded IP in source |
| Swagger server URL | `apps/api/src/swagger.ts` → localhost | Must not ship as production server entry |

### 1.4 Hygiene findings

#### HYG-SEC-001 (P0) — Generated engines in git
- **Platform:** repository / deploy
- **Paths:** `apps/api/generated/prisma/**`
- **Evidence:** `git ls-files` lists Windows `.dll.node` and `.tmp*` engine artifacts.
- **Impact:** Non-portable clones; dirty PRs; possible wrong engine on Linux hosts.
- **Correction:** Ignore + untrack generated output; generate in CI/deploy; delete tmp artifacts; never commit binaries.
- **Dependencies:** OPS-P0-001 CI generate step.
- **AC:** `git ls-files` has zero `query_engine*` binaries.

#### HYG-SEC-002 (P1) — Local production env file exists on workstation
- **Platform:** operator hygiene
- **Paths:** `apps/api/.env.production.local` (ignored)
- **Evidence:** File present on disk; not printed.
- **Impact:** Risk of accidental use against production DB from a laptop.
- **Correction:** Separate credentials vault; never point local apps at production without explicit break-glass procedure (out of scope to connect).
- **AC:** Documented policy; optional rename/quarantine local prod env.

#### HYG-SEC-003 (P2) — Backup lockfile untracked
- **Path:** `package-lock.before-react-fix.json`
- **Correction:** Delete or keep out of release branch commits.

---

## 2. Authentication security

| Control | Status | Notes |
|---------|--------|-------|
| Password hashing | Good | bcrypt 12 rounds |
| Generic login errors | Good | Same message for missing/invalid |
| Suspended user block | Good | Login + authenticate |
| HttpOnly cookie | Good | Set on login/register |
| SameSite | Partial | `lax` — OK baseline |
| Secure cookie | Weak | Not forced in production |
| Bearer support | Missing | Mobile broken |
| Refresh rotation | Missing | |
| Session revocation | Missing | Logout clears cookie only |
| Email verification | Missing | |
| Password reset | Missing | |
| Account deletion | Missing | |
| Admin bootstrap | Seed-only | No production-safe bootstrap |
| Brute-force | Partial | Login rate limit 20/15m |
| Token hashing (verification) | Good | SHA-256 + timing-safe compare |
| CSRF | Partial | Cookie+Lax; no CSRF token |

### Findings

#### AUTH-SEC-001 (P0) — Cookie-only `authenticate`
See AUTH-P0-001 in launch audit. Stolen browser cookie still primary web path; mobile cannot use returned JWT.

#### AUTH-SEC-002 (P0) — Long-lived JWT without revocation store
See AUTH-P0-002.

#### AUTH-SEC-003 (P1) — Register issues JWT immediately without email proof
- **Paths:** `routes/index.ts` register handler
- **Correction:** Issue session only after verify, or limit privileges until verified.
- **AC:** Policy enforced in tests.

#### AUTH-SEC-004 (P1) — JWT in JSON response body
- **Paths:** register/login responses
- **Impact:** XSS becomes full token theft if any XSS exists; also tempts storing tokens in insecure mobile storage.
- **Correction:** Web relies on cookie only (omit token in browser responses); mobile uses Bearer via SecureStore after AUTH-P0-001.
- **AC:** Documented client-specific response shapes.

---

## 3. Authorization security

| Control | Status | Evidence |
|---------|--------|----------|
| Role middleware | Good | `authorize(...)` |
| Worker ownership on receipts | Good | `findFirst({ id, workerId })` → 404 |
| Public registration cannot create ADMIN | Good | Zod enum WORKER/ORGANISATION |
| Admin gates | Good | Route-level |
| Org boundary | **Fail** | Platform-wide queries |
| Evidence access control | **Fail** | Public static files |
| Role escalation | Protected | No self-role change API found |
| Horizontal receipt access | Tested | Other worker gets 404 |

### Findings

#### AUTHZ-SEC-001 (P0) — Org dashboard isolation failure
See SEC-P0-002.

#### AUTHZ-SEC-002 (P0) — Unauthenticated evidence download
See SEC-P0-001.

#### AUTHZ-SEC-003 (P2) — Admin self-harm / peer admin suspension
- **Paths:** `updateUserStatus`
- **Correction:** Prevent suspending last admin / self without confirmation path.
- **AC:** Attempt blocked with 400.

---

## 4. Verification & integrity

| Control | Status | Notes |
|---------|--------|-------|
| One-time token | Intentional | `usedAt` — race remains |
| Expiry | Good | Hours from env |
| Timing-safe compare | Present | Redundant after hash lookup but OK |
| Integrity hash | Present | On confirm |
| Lock after verify | Present | `lockedAt` |
| Correction cycle integrity | **Broken** | Unique confirmation |
| Receipt numbers | Unique constraint | Race on generation |
| Public proof privacy | Mostly good | Hides customer contact; amount gated |
| Revoked proof | Weak | Still served |

Findings: CONC-P0-001, CONC-P0-002, LIFE-P0-001, PROOF-P0-001, EMAIL-P0-001.

---

## 5. Evidence & malware risk

| Control | Status |
|---------|--------|
| MIME allow-list | Yes |
| Size limit | Yes (`MAX_UPLOAD_SIZE_MB`) |
| Magic-byte validation | No |
| Extension spoofing resistance | Weak (trusts mimetype + keeps original ext) |
| Private storage | No |
| Signed URLs | No |
| Orphan cleanup | No |
| Malware scanning | Undocumented |

#### EVID-SEC-001 (P1) — MIME spoofing
- **Paths:** `upload.ts`
- **Correction:** Validate file signatures; map to safe stored extension; ignore client MIME when mismatched.
- **AC:** Renamed `.exe` as `image/jpeg` rejected.

#### EVID-SEC-002 (P2) — Malware-risk documentation missing
- **Correction:** Document that uploads are untrusted; plan AV/async scan for production.
- **AC:** Security doc section approved.

---

## 6. Production operations security

| Control | Status |
|---------|--------|
| Helmet | Yes |
| Rate limits | Yes (global 500/15m, login, verification) |
| Body size limit | 1mb JSON |
| Trust proxy | `1` |
| Error redaction in prod | Yes |
| Graceful shutdown | Basic |
| Swagger exposure | Always on — P0 |
| Env validation | Zod on boot |
| Request IDs | No |
| Readiness | No |

#### OPS-SEC-001 (P0) — Swagger in production
See SEC-P0-003.

#### OPS-SEC-002 (P1) — Missing readiness / dependency checks
See OPS-P1-001.

---

## 7. Dependency advisories (`npm audit`)

**Result:** 22 total — 11 high, 11 moderate, 0 critical.  
**Action taken during audit:** none (`audit fix` not run).

Notable high categories (names only):

- `react-router` / `react-router-dom` — CSRF-related advisory in RSC mode (evaluate applicability to this Vite SPA).
- `minimatch` / `brace-expansion` / eslint toolchain — mostly lint-time; reduce by locking/updating carefully.
- Transitive chains via eslint-config-expo if/when mobile lint is introduced intentionally.

#### DEP-SEC-001 (P1) — Unreviewed high vulnerabilities
- **Correction:** Triage each high; patch non-breaking updates; document accept-risk for unused RSC paths if confirmed N/A.
- **AC:** Zero unreviewed highs before public launch.

---

## 8. Privacy

| Topic | Status |
|-------|--------|
| Public proof redacts customer contact | Good (tested) |
| Worker phone on public profile | Hidden (good) |
| Org sees others’ receipts | Fail |
| Evidence confidentiality | Fail (public uploads) |
| Legal acceptance records | Missing |
| Account deletion / retention | Missing |
| Email delivery logs | Missing |
| IP/UA on confirmations | Stored — document retention |

---

## 9. Security finding index (severity)

| ID | Sev | Title |
|----|-----|-------|
| SEC-P0-001 | P0 | Public `/uploads` |
| SEC-P0-002 | P0 | Org data leak |
| AUTH-P0-001 | P0 | No Bearer auth |
| AUTH-P0-002 | P0 | No session revocation |
| SEC-P0-003 | P0 | Swagger always on |
| HYG-P0-001 | P0 | Prisma Windows binaries in git |
| EMAIL-P0-001 | P0 | No transactional email |
| PROOF-P0-001 | P0 | Revoked proof still public |
| CONC-P0-001 | P0 | Token claim race |
| CONC-P0-002 | P0 | Receipt number race |
| LIFE-P0-001 | P0 | Correction confirm unique break |
| EVID-P0-001 | P0 | Local disk storage |
| AUTH-P1-004 | P1 | Cookie secure not enforced |
| EVID-P1-001 | P1 | MIME spoofing |
| DEP-SEC-001 | P1 | npm audit highs |
| AUTHZ-SEC-003 | P2 | Admin suspension guardrails |
| EVID-SEC-002 | P2 | Malware process docs |
| AUTH-P2-001 | P2 | CSRF hardening |

---

## 10. Recommended security gates before DNS cutover

1. Private evidence + authz downloads/signed URLs.  
2. Org tenancy isolation.  
3. Bearer + refresh/revoke.  
4. Disable docs in production.  
5. Transactional verification email.  
6. Atomic verification + receipt numbering.  
7. Correction lifecycle fix.  
8. Secret scanning + CI audits.  
9. Production env validation (`COOKIE_SECURE`, strong `JWT_SECRET`, HTTPS).  
10. Penetration-style check of public endpoints (`/verification`, `/public/receipts`, `/workers`).
