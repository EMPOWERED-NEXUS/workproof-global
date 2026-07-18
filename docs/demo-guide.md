# Demo Guide

## Prerequisites

1. Start PostgreSQL: `npm run db:up`
2. Migrate and seed: `npm run db:migrate && npm run db:seed`
3. Start dev servers: `npm run dev`

## Demo accounts

> **Development only** — do not use in production.

| Role | Email | Password |
|------|-------|----------|
| Worker | worker@workproof.test | Demo123! |
| Admin | admin@workproof.test | Admin123! |
| Organisation | organisation@workproof.test | Org123! |

## Suggested walkthrough

### 1. Worker portfolio

1. Sign in as `worker@workproof.test`
2. Open **Dashboard** — view stats and seeded receipts
3. Open **Receipts** — explore statuses (draft, pending, verified, disputed)
4. Open the verified receipt and click **View proof page**

### 2. Create and submit a receipt

1. **Receipts → New receipt**
2. Fill customer and work details
3. Save draft, add link evidence
4. Submit for verification — copy the customer link

### 3. Customer verification (no login)

1. Open `/verify/{token}` from submit step (or use seed token `demo-verification-token-pending` for Patrick O. receipt)
2. Confirm, request correction, or dispute

### 4. Public proof

1. After seed, note the public verification code printed in terminal
2. Visit `/proof/{code}` — no authentication required

### 5. Admin

1. Sign in as `admin@workproof.test`
2. Open **Admin** — users, receipts, disputes

## Seed data includes

- 5+ receipts across statuses
- 1 public verified receipt with integrity hash
- Evidence, confirmation, dispute, audit logs
- Complete worker, admin, and organisation profiles
