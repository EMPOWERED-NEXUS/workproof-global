# WorkProof Global — Release Implementation Plan

**Branch:** `release-v1-ux-finalization`
**Updated:** 2026-07-31
**Product invariant:** Preserve worker-owned Verified Work Receipt concept.

---

## 1. Launch posture

| Track | Current | Next credible target |
|-------|---------|----------------------|
| API + Web (public pilot) | Wave 0 + UX finalization complete in codebase | **AWS staging deploy + smoke** |
| Public web readiness | Routes, consent, legal pages, admin confirms, E2E mocks | Staging validation → controlled pilot |
| Mobile | Internal Expo preview shell | Worker parity **later** (not blocking web pilot) |
| Legal | Pilot copy shipped | **External legal review** before unrestricted commercial launch |
| Evidence malware scanning | Magic-byte / type checks only | **Ops recommendation remaining** (AV pipeline) |

---

## 2. Locked product decisions

| ID | Decision |
|----|----------|
| DEC-01 | Revoked/disputed public proofs remain accessible but clearly marked invalid |
| DEC-02 | Email verification required before **receipt submission**, not before login |
| DEC-03 | Organisation v1: invitation / admin provision; members/assignments later |
| DEC-04 | Web/API staging launches before any public mobile release |
| DEC-05 | Do **not** rewrite Git history for generated Prisma binaries |
| DEC-06 | Account deletion will **pseudonymise** minimum verified-proof integrity records |
| DEC-07 | Public registration creates **WORKER** only (Terms + Privacy required) |
| DEC-08 | Inclusive confirmation: EMAIL / SHARE_LINK / IN_PERSON_QR; evidence ≠ confirmation |
| DEC-09 | Manual WhatsApp share does **not** assert verified phone or WhatsApp identity |

---

## 3. Wave status

### Wave 0A–0D — COMPLETE (codebase)

Auth sessions (cookie web + Bearer mobile), lifecycle/concurrency, private evidence storage, email verification + customer outbox, password reset, admin bootstrap CLI, Docker images, staging smoke script/docs, CI scaffolding.

### UX finalization — COMPLETE (this branch work)

Landing CTA clarity; consent; onboarding checklist; receipts filters; receipt detail lifecycle UX; admin confirm dialogs; legal/support pages; proof QR; Playwright E2E (`apps/web/e2e`).

### Next — Staging & pilot ops

1. Deploy API + web to **AWS staging** using existing runbooks
2. Run `npm run smoke:staging` against staging (not production)
3. Configure transactional email + private Supabase storage for staging
4. Bootstrap first admin; provision organisation accounts by invitation only
5. Complete **legal review** of Privacy/Terms/Evidence/Dispute policies
6. Plan **malware scanning** for evidence uploads as a deployment control
7. Production cutover only after staging smoke + monitoring

### Later — Mobile parity

SecureStore session, worker critical path, evidence capture, deep links, EAS preview — **after** web/API pilot is stable.

### Later — Tenancy & privacy hardening

Org members/assignments; self-serve deletion (DEC-06); expanded monitoring; optional PWA/i18n.

---

## 4. Deployment readiness checklist

| Item | Ready? | Notes |
|------|--------|-------|
| Supabase PostgreSQL | Partial | Compatible via `DATABASE_URL` |
| Hosted Express API | Partial | Docker image + staging runbook; AWS cutover next |
| Hosted React web | Partial | Vite/Nginx image; staging next |
| Custom domains / HTTPS | Not configured | Staging then prod |
| Production env vars | Templates | Enforce secure cookie/JWT/storage/email |
| DB migrations | Present | `migrate deploy` only; never reset prod |
| Cloud evidence storage | Code ready | Staging must use private Supabase bucket |
| Transactional email | Code ready | Staging must not use console provider |
| Password reset / email verify | Done | |
| Docker API/web | Done | Local build scripts |
| Staging smoke | Done | Script + docs |
| Playwright web E2E | Done | Mocked; no prod credentials |
| EAS public mobile | N/A for pilot | Internal preview only |
| Backups / rollback | Documented | Exercise on staging |
| Malware scanning | Remaining recommendation | |
| Legal review | Remaining | |
| Monitoring | Partial | Add mail/storage/uptime alerts on staging |

---

## 5. Test plan

| Layer | Coverage |
|-------|----------|
| API vitest | Auth, lifecycle, evidence, email, staging guards |
| Web Playwright | Public routes + mocked authenticated worker/admin |
| Staging smoke | End-to-end against staging API/web origins |

Do **not** point smoke or E2E at production without explicit acknowledgement.

---

## 6. Explicit non-actions for this phase

- No commit / push unless directed.
- No production Supabase connect/migrate/seed from this audit.
- No public mobile store claims.
- No organisation public self-registration.
