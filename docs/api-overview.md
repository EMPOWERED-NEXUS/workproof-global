# API Overview

Base URL: `http://localhost:4000/api/v1`

Interactive docs: mounted only when `ENABLE_API_DOCS=true` (see `/api-docs`).

## Authentication (Wave 0A)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register; browser cookies / mobile tokens with `X-Client-Platform: mobile` |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Rotate refresh token |
| POST | `/auth/logout` | Revoke current refresh session |
| POST | `/auth/logout-all` | Revoke all sessions |
| GET | `/auth/me` | Current user (includes `emailVerified`) |
| GET | `/auth/sessions` | List active sessions |
| DELETE | `/auth/sessions/:id` | Revoke own session |
| GET | `/auth/email-verification-status` | Authenticated verification status |
| POST | `/auth/resend-email-verification` | Resend account verification email |
| POST | `/auth/verify-email` | Consume one-time email verification token |
| POST | `/auth/forgot-password` | Neutral acknowledgement; queues reset email if account exists |
| POST | `/auth/reset-password` | One-time token + new password; revokes all sessions |

## Worker profile

| Method | Path | Auth |
|--------|------|------|
| GET | `/profile` | WORKER |
| PATCH | `/profile` | WORKER |
| GET | `/workers/:profileSlug` | Public |

## Receipts (Wave 0B lifecycle)

| Method | Path | Auth |
|--------|------|------|
| POST | `/receipts` | WORKER |
| GET | `/receipts` | WORKER — supports `archived=true\|false\|all` (default false) |
| GET | `/receipts/:id` | WORKER (owner) |
| PATCH | `/receipts/:id` | WORKER (draft/correction only) |
| DELETE | `/receipts/:id` | WORKER (draft only) |
| POST | `/receipts/:id/evidence` | WORKER — multipart file or LINK JSON |
| GET | `/receipts/:id/evidence/:evidenceId/download` | WORKER (owner) or ADMIN |
| DELETE | `/receipts/:id/evidence/:evidenceId` | WORKER — soft-delete |
| POST | `/receipts/:id/submit` | WORKER — requires verified email; queues customer email; raw token only in test/dev |
| POST | `/receipts/:id/resend-verification` | WORKER — pending only; cooldown; invalidates prior request |
| GET | `/receipts/:id/verification-delivery` | WORKER — safe delivery status (no tokens/payloads) |
| POST | `/receipts/:id/archive` | WORKER — sets `archivedAt`, does **not** change status |
| POST | `/receipts/:id/unarchive` | WORKER |
| GET | `/receipts/:id/events` | WORKER (owner) — safe timeline |

### Lifecycle transitions

```
DRAFT → PENDING_VERIFICATION
PENDING_VERIFICATION → VERIFIED | CORRECTION_REQUESTED | DISPUTED
CORRECTION_REQUESTED → PENDING_VERIFICATION
DISPUTED → VERIFIED | CORRECTION_REQUESTED | REVOKED (admin)
VERIFIED → REVOKED (admin)
```

Verification responses **atomically claim** the hashed token (`claimedAt`) before applying the decision. GET `/verification/:token` never claims.

Receipt numbers use PostgreSQL sequence `receipt_number_seq` → `WPG-YYYY-000001`.

## Customer verification (public)

| Method | Path |
|--------|------|
| GET | `/verification/:token` |
| POST | `/verification/:token/respond` |

## Public proof

| Method | Path |
|--------|------|
| GET | `/public/receipts/:verificationCode` |

Returns `proofValidity`: `VALID` | `INVALID_REVOKED` | `UNDER_DISPUTE` | `CORRECTION_REQUIRED` | `UNAVAILABLE`.

Never exposes customer contact, private comments, IPs, or admin notes.

## Dashboards

| Method | Path | Auth |
|--------|------|------|
| GET | `/dashboard/worker` | WORKER — verified income excludes revoked |
| GET | `/dashboard/organisation` | ORGANISATION — no unassigned platform data |

## Admin

| Method | Path | Auth |
|--------|------|------|
| GET | `/admin/users` | ADMIN |
| GET | `/admin/receipts` | ADMIN |
| GET | `/admin/disputes` | ADMIN |
| PATCH | `/admin/users/:id/status` | ADMIN |
| POST | `/admin/receipts/:id/revoke` | ADMIN |
| POST | `/admin/disputes/:id/resolve` | ADMIN — requires `receiptStatus` |

## Health

| Method | Path |
|--------|------|
| GET | `/health` |
| GET | `/readiness` |

## Error format

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": { "field": ["Validation detail"] }
}
```
