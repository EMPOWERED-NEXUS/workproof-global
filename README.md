# WorkProof Global

**Turn every completed job into portable proof.**

WorkProof Global is a worker-owned proof-of-work platform for informal workers, freelancers, artisans, caregivers, tutors, drivers, farmers, volunteers, and small service businesses across Africa and beyond.

Its core innovation is the **Verified Work Receipt** — client-confirmed, tamper-evident proof that workers own and can carry across programmes and opportunities.

## Architecture

npm workspaces monorepo:

| Package | Description |
|---------|-------------|
| `apps/api` | Express 5 + TypeScript + Prisma + PostgreSQL — **pilot launch target** |
| `apps/web` | React + Vite 8 + React Router — **pilot launch target** |
| `apps/mobile` | Expo internal preview shell only (not a public download / store release) |
| `packages/shared` | Shared Zod schemas and types |

**Launch posture:** Public pilot focuses on **web + API**. Organisation programme access is **invitation-based** (not public self-registration). Mobile remains an internal preview shell — do not claim a public mobile download.

See [docs/architecture.md](docs/architecture.md) and [docs/ux-finalization-audit.md](docs/ux-finalization-audit.md) for details.

## Prerequisites

- Node.js 20+
- Docker Desktop (for local PostgreSQL)
- npm 10+

## Installation

```bash
git clone <repo-url>
cd workproof-global
npm install
npm run build --workspace=@workproof/shared
```

## Environment setup

Copy API environment template:

```bash
cp apps/api/.env.example apps/api/.env
```

Set a strong `ACCESS_TOKEN_SECRET` (local `.env.example` includes a placeholder). Configure `ALLOWED_ORIGINS` for browser CORS.

Default `DATABASE_URL`:

```
postgresql://workproof:workproof_dev_password@localhost:5434/workproof?schema=public
```

Web app uses Vite proxy and **cookie sessions** (HttpOnly access + refresh cookies).
Mobile clients must send `X-Client-Platform: mobile` to receive Bearer tokens in JSON for SecureStore.

Copy `apps/web/.env.example` if running web against a remote API.

## Docker PostgreSQL

```bash
npm run db:up
```

Database: `workproof` · User: `workproof` · Password: `workproof_dev_password` · Port: **5434**

## Migrations & seed

Prisma Client is generated (not committed). Always generate before typecheck/build/test:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

CI runs `prisma migrate deploy` against an ephemeral test Postgres service only — never against production.

## Development

```bash
npm run dev          # API + web concurrently
npm run dev:api      # API only — http://localhost:4000
npm run dev:web      # Web only — http://localhost:5173
```

## Demo accounts (development only)

| Role | Email | Password |
|------|-------|----------|
| Worker | worker@workproof.test | Demo123! |
| Admin | admin@workproof.test | Admin123! |
| Organisation | organisation@workproof.test | Org123! |

After seeding, check the terminal for the public verification code and pending verification token.

## API documentation

Swagger UI: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

Health check: `GET /api/v1/health`

## Receipt lifecycle

```
DRAFT → PENDING_VERIFICATION → VERIFIED | CORRECTION_REQUESTED | DISPUTED
CORRECTION_REQUESTED → PENDING_VERIFICATION (resubmit)
DISPUTED → VERIFIED | CORRECTION_REQUESTED | REVOKED (admin)
VERIFIED → REVOKED (admin)
```

Archiving uses `archivedAt` and does **not** replace verification status. Public proofs report `proofValidity` (valid / revoked / disputed / correction required).

## Tests

API tests use an isolated database `workproof_test` on the same PostgreSQL instance.

```bash
# Create test database once
docker exec workproof-postgres psql -U workproof -d workproof -c "CREATE DATABASE workproof_test;" 2>nul

npm run test
```

Web Playwright E2E (builds + previews locally; mocks API — no production credentials):

```bash
npm run test:e2e
# or: npm run test:e2e --workspace=@workproof/web
```

First time on a machine, install the browser: `npx playwright install chromium` from `apps/web`.

## Build

```bash
npm run check   # typecheck + lint + test + build
npm run build
```

## Project scope

**In scope (web/API pilot):** Verified Work Receipts, customer verification links, public proof pages, worker profiles, invitation-based organisation programme overview, admin oversight, audit logging, password reset, email verification, evidence upload/download.

**Out of scope:** Lending, credit scoring, blockchain, escrow, payment processing, public mobile app store release, AI risk scoring.

## Wave 0C — Evidence & email

- Evidence files use a storage abstraction (`STORAGE_PROVIDER=local|supabase`). Local is for development/test only; production requires a **private** Supabase Storage bucket.
- `/uploads` is **not** public. Downloads go through `GET /api/v1/receipts/:id/evidence/:evidenceId/download` after authorization (owner or admin).
- Web/mobile upload only through the API. Service-role keys never enter Vite or Expo public env vars.
- Account email verification is required before receipt **submission** (drafts allowed before verify).
- Customer verification emails use a durable encrypted outbox with retries (`EMAIL_PROVIDER=console|transactional`).

See `apps/api/.env.example`, `docs/architecture.md`, and `docs/security.md`.

## Known post-MVP improvements

- PDF export for proof pages
- Organisation cohort assignment for workers
- Antivirus/malware scanning on evidence uploads (deployment requirement)
- Multi-language support

## License

ISC
