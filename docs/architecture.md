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
- **Multer** for development file uploads
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

Core entities: `User`, `RefreshToken`, `WorkerProfile`, `Organisation`, `WorkReceipt`, `Evidence`, `VerificationRequest` (1:N attempts), `Confirmation` (1:N history), `Dispute`, `ReceiptEvent`, `AuditLog`.

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
