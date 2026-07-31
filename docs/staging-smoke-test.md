# Staging smoke test

```bash
export SMOKE_BASE_URL=https://staging-api.example.com/api/v1
export SMOKE_WEB_ORIGIN=https://staging.example.com
npm run smoke:staging
```

Creates `staging-smoke-<timestamp>@example.test` accounts.

If the URL looks production-like, set `SMOKE_ALLOW_PRODUCTION=true` only with explicit approval.

Email verification: ensure the staging account can verify (console outbox in local; staging inbox or operator tooling). Draft + evidence steps run even if submit is skipped when email is unverified.
