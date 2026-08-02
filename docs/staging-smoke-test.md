# Staging smoke test

```bash
export SMOKE_BASE_URL=https://staging-api.example.com/api/v1
export SMOKE_WEB_ORIGIN=https://staging.example.com
npm run smoke:staging
```

Creates `staging-smoke-<timestamp>@example.test` **worker** accounts (public registration is worker-only).

If the URL looks production-like, set `SMOKE_ALLOW_PRODUCTION=true` only with explicit approval.

Email verification: ensure the staging account can verify (console outbox in local; staging inbox or operator tooling). Draft + evidence steps run even if submit is skipped when email is unverified.

## UX / legal / org notes for staging

- Confirm landing CTAs and legal footer links (`/privacy`, `/terms`, `/support`) render with EmpowerEd Nexus contact details.
- Organisation accounts are invitation / admin-provisioned — smoke does not self-register organisations.
- After staging UI deploy, optionally run web E2E locally (`npm run test:e2e`) against a built preview with mocked APIs; do not aim Playwright at production.
