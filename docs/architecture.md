# WorkProof Global — Architecture

## Overview

WorkProof Global is an npm workspaces monorepo delivering a worker-owned proof-of-work platform. Workers declare completed jobs, attach evidence, and send secure verification links to customers. Confirmed receipts are locked with an integrity hash and optional public verification code.

## Packages

### `apps/api`

Express 5 REST API with:

- **Prisma ORM** + PostgreSQL (via `@prisma/adapter-pg`)
- **Zod** validation (shared schemas from `@workproof/shared`)
- **JWT** in HTTP-only cookies for session auth
- **bcrypt** password hashing
- **Multer** for development file uploads
- **Swagger** at `/api-docs`
- Layered structure: routes → services → Prisma

### `apps/web`

React 19 SPA with Vite 8:

- React Router for all required routes
- Native `fetch` API client with cookie credentials
- Custom CSS design system (navy, emerald, gold, cream)
- Vite dev proxy to API on port 4000

### `packages/shared`

Shared Zod schemas and TypeScript types used by API validation.

## Data model

Core entities: `User`, `WorkerProfile`, `Organisation`, `WorkReceipt`, `Evidence`, `VerificationRequest`, `Confirmation`, `Dispute`, `AuditLog`.

Receipt lifecycle:

```
DRAFT → PENDING_VERIFICATION → VERIFIED
              ↓
   CORRECTION_REQUESTED / DISPUTED / REVOKED / ARCHIVED
```

## Security

- Helmet, CORS restricted to `FRONTEND_URL`
- Rate limits on login and verification
- Verification tokens stored as SHA-256 hashes only
- Verified receipts are immutable
- Public proof endpoints redact customer PII

## Local development

PostgreSQL runs in Docker on port **5434**. Prisma Client generates to `apps/api/generated/prisma`.
