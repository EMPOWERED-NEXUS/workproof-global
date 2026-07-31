# Staging deployment

## Prerequisites

- Staging PostgreSQL (Supabase project or equivalent) — **not** production
- Private Supabase Storage bucket for evidence
- Transactional email credentials
- HTTPS API and web hostnames
- Secrets stored in the host secret manager (never in git)

## Release order (single release phase)

1. Set staging environment variables (see `docs/environment-matrix.md`)
2. Build images: `npm run docker:build:api` / `npm run docker:build:web`
3. Run **one** migrate job: `npx prisma migrate deploy` (via `scripts/api-release.sh` or platform release command)
4. Start API replicas **after** migrate succeeds
5. Deploy web static/Nginx image with `VITE_API_URL` pointing at the staging API
6. Configure CORS `ALLOWED_ORIGINS` to the staging web origin
7. Bootstrap admin once: `docs/admin-bootstrap.md`
8. Run `SMOKE_BASE_URL=... npm run smoke:staging`

## Do not

- Run `prisma migrate dev` in staging/production
- Seed production or staging with demo passwords by default
- Place `SUPABASE_SERVICE_ROLE_KEY` or `EMAIL_API_KEY` in Vite/Expo public env
- Run migrate from multiple API replicas concurrently

## Staging verification

See `docs/staging-smoke-test.md`.
