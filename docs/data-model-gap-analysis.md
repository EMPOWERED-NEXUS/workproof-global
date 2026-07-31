# WorkProof Global — Data Model Gap Analysis

**Branch:** `release-v1-web-mobile`  
**Schema:** `apps/api/prisma/schema.prisma`  
**Migrations:** `apps/api/prisma/migrations/0_init/migration.sql` (single init)  
**Audit rule:** No migrations created or run against production.

---

## 1. Current model inventory

| Model | Purpose | Key constraints |
|-------|---------|-----------------|
| `User` | Accounts | unique email; role; status |
| `WorkerProfile` | Worker public/private profile | unique userId; unique profileSlug |
| `Organisation` | Org shell | unique ownerId (1:1 owner) |
| `WorkReceipt` | Core receipt | unique receiptNumber?; unique verificationCode?; indexes workerId/status/workDate |
| `Evidence` | Attachments/links | FK receipt cascade |
| `VerificationRequest` | Customer one-time link | unique receiptId; unique tokenHash |
| `Confirmation` | Customer decision | **unique receiptId** (1:1) |
| `Dispute` | Dispute case | unique receiptId |
| `AuditLog` | Action audit | indexes actor/receipt/createdAt |

### Enums present

`UserRole`, `UserStatus`, `ReceiptStatus`, `Visibility`, `EvidenceType`, `ConfirmationDecision`, `DisputeStatus`.

### Cascade summary

- User delete → cascades worker profile, org, receipts.  
- Receipt delete → cascades evidence, verification, confirmation, dispute.  
- AuditLog actor/receipt → `SetNull`.

**Risk:** Hard delete of user destroys receipt portfolio (may conflict with portable-proof retention). Product decision required (DEC-06).

---

## 2. Gap matrix

| Needed concept | Present? | Severity | Notes |
|----------------|----------|----------|-------|
| Refresh tokens | No | P0 | Required for revocation/mobile |
| Access/session store | No | P0 | Optional if refresh+short JWT |
| Email verification tokens | No | P1 | Register trust |
| Password reset tokens | No | P1 | Account recovery |
| Account sessions (device list) | No | P2 | UX for revoke-other-devices |
| Organisation members | No | P0/P1 | Blocks real org product; causes leak workaround |
| Organisation invitations | No | P1 | |
| Worker assignments / cohorts | No | P1 | Explicitly stubbed in API note |
| Receipt events/history | Partial | P1 | `AuditLog` exists but not worker-facing event model |
| Email delivery logs | No | P0/P1 | Needed with mailer |
| Notifications | No | P2/P3 | |
| Evidence storage keys | Partial | P0 | `url` string only; no bucket/key/provider |
| Account deletion requests | No | P1 | Privacy |
| Terms/privacy acceptance | No | P1 | |
| Revocation reason (first-class) | Partial | P1 | Only audit metadata |
| Archive timestamp | No | P1 | Status-only today |
| Verification attempt counters | No | P2 | Rate limit is IP-memory only |
| Idempotency keys | No | P2 | Submit/confirm retries |
| Receipt number sequence | No | P0 | Race on count+1 |

---

## 3. Detailed findings

### DATA-GAP-001 (P0) — `Confirmation` 1:1 blocks correction lifecycle
- **Platform:** database / API
- **Paths:** `schema.prisma` `Confirmation.receiptId @unique`; `confirmReceiptInternally`
- **Evidence:** Correction creates confirmation; later confirm tries insert again.
- **User impact:** Correction cycle fails.
- **Security/privacy:** Integrity of decisions lost or errors exposed.
- **Correction:** Change to `Confirmation[]` history **or** update-in-place with `ReceiptEvent` history table; keep `latestDecision` on receipt.
- **Dependencies:** LIFE-P0-001 code change + migration.
- **AC:** Multiple sequential customer decisions persist; latest drives status.

### DATA-GAP-002 (P0) — No refresh token / session revocation tables
- **Correction:**  
  `RefreshToken(id, userId, tokenHash, expiresAt, revokedAt, replacedBy, userAgent, ip, createdAt)`  
  unique tokenHash; index userId.
- **AC:** Logout revokes; reuse detection optional.

### DATA-GAP-003 (P0) — Evidence lacks storage provider metadata
- **Current:** `Evidence.url` local path.  
- **Correction:** `storageProvider`, `storageKey`, `bucket`, `checksum`, `scanStatus`; keep `url` nullable for LINK type only.
- **AC:** File evidence never depends on local disk path for durability.

### DATA-GAP-004 (P0) — No org membership boundary
- **Current:** `Organisation` 1:1 with owner.  
- **Correction:** `OrganisationMember(orgId, userId, role, status)` + optional `OrganisationInvitation`; receipts/workers linked via assignment.
- **AC:** Queries filtered by membership; SEC-P0-002 fixed.

### DATA-GAP-005 (P0) — Receipt numbering not sequence-backed
- **Correction:** Postgres `CREATE SEQUENCE receipt_number_seq` or table `receipt_counters(year, value)`.
- **AC:** Concurrent verifies unique.

### DATA-GAP-006 (P1) — Email verification & password reset tokens
- **Correction:** Shared `AccountToken` model: `type (EMAIL_VERIFY|PASSWORD_RESET)`, `tokenHash`, `userId`, `expiresAt`, `usedAt`.
- **AC:** Single-use; hashed at rest.

### DATA-GAP-007 (P1) — Email delivery log
- **Correction:** `EmailDelivery(id, to, template, providerId, status, relatedEntityType, relatedEntityId, createdAt, error)`.
- **AC:** Submit creates QUEUED/SENT/FAILED row.

### DATA-GAP-008 (P1) — Revocation & archive fields on `WorkReceipt`
- **Correction:** `revokedAt`, `revokedReason`, `archivedAt` (status remains).
- **AC:** Admin revoke populates fields; public proof uses them.

### DATA-GAP-009 (P1) — Legal acceptance
- **Correction:** `termsAcceptedAt`, `privacyAcceptedAt`, `termsVersion` on User (or separate table).
- **AC:** Register requires acceptance; versions recorded.

### DATA-GAP-010 (P1) — Account deletion request
- **Correction:** `AccountDeletionRequest(userId, requestedAt, scheduledFor, completedAt, status)`.
- **AC:** Soft-delete window; purge job documented.

### DATA-GAP-011 (P1) — Worker-facing receipt history
- **Correction:** Either expose filtered `AuditLog` or add `ReceiptEvent(receiptId, type, actorType, payload, createdAt)`.
- **AC:** Worker can list timeline for own receipt.

### DATA-GAP-012 (P2) — Verification attempts
- **Correction:** `VerificationAttempt` or counters on request for abuse forensics beyond express-rate-limit memory store.
- **AC:** Persisted attempts for disputed forensics.

### DATA-GAP-013 (P2) — Indexes for common admin/org queries
- **Gaps:** `disputes(status)`, `users(role,status)`, `verification_requests(expiresAt)`.
- **AC:** Explain plans acceptable on seed-scale×100.

---

## 4. Constraint & integrity review

| Topic | Assessment |
|-------|------------|
| Email unique | OK |
| profileSlug unique | OK; generation loop in register |
| receiptNumber unique nullable | OK but generation racy |
| verificationCode unique nullable | OK; generation retries |
| tokenHash unique | OK |
| Confirmation unique receipt | **Too strict for lifecycle** |
| Dispute unique receipt | OK for MVP (one open dispute); reopen needs design |
| FK cascades | Dangerous for retention on user delete |
| Soft deletes | None |
| Multi-tenant org isolation | **Absent** |

---

## 5. Production-safe migration requirements (do not run now)

1. **Expand-contract:** Add new tables/columns nullable → backfill → enforce constraints → switch code → drop obsolete.  
2. **Never** `prisma migrate reset` on shared/prod Supabase.  
3. Use `prisma migrate deploy` only in release pipeline against backups.  
4. Take DB snapshot/backup before first production migrate.  
5. Separate migration for: (a) auth tokens, (b) confirmation history, (c) evidence storage fields, (d) org members, (e) receipt admin fields.  
6. Generate Prisma client in CI for Linux; stop committing Windows engines.  
7. Validate with `workproof_test` locally before any staging apply.

---

## 6. Recommended target additions (sketch only)

```text
RefreshToken
AccountToken (email verify / password reset)
OrganisationMember
OrganisationInvitation
WorkerAssignment / Cohort (optional v1.1)
ReceiptEvent
EmailDelivery
Evidence.storageKey + scanStatus
WorkReceipt.revokedAt/revokedReason/archivedAt
User.termsAcceptedAt/privacyAcceptedAt/emailVerifiedAt
AccountDeletionRequest
ReceiptNumberSequence (or SQL sequence)
```

No Prisma migration files were added in this audit.
