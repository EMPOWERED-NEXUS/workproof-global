# WorkProof Global — Architecture

## Overview

WorkProof Global is an npm workspaces monorepo delivering a worker-owned proof-of-work platform. Workers declare completed jobs, attach evidence, and send secure verification links to customers. Confirmed receipts are locked with an integrity hash and optional public verification code.

## Packages

### `apps/api`

Express 5 REST API with:

- **Prisma ORM** + PostgreSQL (via `@prisma/adapter-pg`)
- **Zod** validation (shared schemas from `@workproof/shared`)
- **Access JWT** (short-lived) + **rotating refresh tokens** (hashed at rest)
- **Browser**: HttpOnly access + refresh cookies; **Mobile**: Bearer access token via `Authorization` and `X-Client-Platform: mobile`
- **bcrypt** password hashing
- **Evidence storage abstraction** (`local` for dev/test, `supabase` private bucket for production)
- **Authorized evidence downloads** (stream local / short-lived signed URL for Supabase) — no public `/uploads`
- **Email outbox** with AES-256-GCM payloads, console or transactional HTTP provider, background dispatcher
- **Swagger** only when `ENABLE_API_DOCS=true`
- Health (`/api/v1/health`) and readiness (`/api/v1/readiness`) probes
- Layered structure: routes → services → Prisma

### `apps/web`

React 19 SPA with Vite 8:

- React Router for all required routes
- Native `fetch` API client with cookie credentials
- Custom CSS design system (navy, emerald, gold, cream)
- Vite dev proxy to API on port 4000

### `apps/mobile`

Expo Router foundation (worker MVP screens follow in a later wave). Uses `EXPO_PUBLIC_API_URL` and will store mobile tokens in SecureStore after Wave 0A auth foundation.

### `packages/shared`

Shared Zod schemas and TypeScript types used by API validation.

## Data model

Core entities: `User` (incl. `emailVerifiedAt`), `RefreshToken`, `EmailVerificationToken`, `EmailOutbox`, `WorkerProfile`, `Organisation`, `WorkReceipt`, `Evidence` (private storage keys / `externalUrl` for LINK; legacy `url` retained for migration safety only), `VerificationRequest` (1:N attempts), `Confirmation` (1:N history), `Dispute`, `ReceiptEvent`, `AuditLog`.

### Evidence storage (Wave 0C)

- Object keys: `users/{workerId}/receipts/{receiptId}/evidence/{evidenceId}/{generatedName}`
- Canonical file identity is `storageKey` (or `externalUrl` for LINK), not a public URL
- Public proof pages expose evidence **metadata** only (type, description, filename category, count); LINK URLs only when visibility allows
- Antivirus/malware scanning remains a **deployment** requirement for larger public rollout

### Email delivery (Wave 0C)

- Registration enqueues account verification; submission enqueues customer verification
- Jobs claimed with `FOR UPDATE SKIP LOCKED`; exponential backoff; stuck `PROCESSING` recovery
- Sensitive payload cleared after successful send

Receipt lifecycle (Wave 0B):

```
DRAFT → PENDING_VERIFICATION → VERIFIED | CORRECTION_REQUESTED | DISPUTED
CORRECTION_REQUESTED → PENDING_VERIFICATION (resubmit)
DISPUTED → VERIFIED | CORRECTION_REQUESTED | REVOKED (admin)
VERIFIED → REVOKED (admin)
Archival uses archivedAt (does not replace status). ARCHIVED enum value is legacy-only.
```

Verification tokens are claimed atomically (`claimedAt`) before confirmation. Receipt numbers come from PostgreSQL sequence `receipt_number_seq` (`WPG-YYYY-######`). Integrity hashes use versioned canonical payloads (`integrityVersion`).

## Security

- Helmet, CORS allow-list via `ALLOWED_ORIGINS`
- Origin checks for cookie-authenticated browser mutations
- Rate limits on login, refresh, and verification
- Verification and refresh tokens stored as SHA-256 hashes only
- Verified receipts are immutable
- Public proof endpoints redact customer PII
- Organisation dashboards do not expose unassigned platform data

## Local development

PostgreSQL runs in Docker on port **5434**. Prisma Client is **generated locally/CI** into `apps/api/generated/prisma` (gitignored — run `npm run db:generate`).
