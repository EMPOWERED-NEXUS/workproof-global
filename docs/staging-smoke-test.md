# Staging smoke test

```bash
export SMOKE_BASE_URL=https://staging-api.example.com/api/v1
export SMOKE_WEB_ORIGIN=https://staging.example.com
npm run smoke:staging
```

Creates `staging-smoke-<timestamp>@example.test` **worker** accounts (public registration is worker-only).

If the URL looks production-like, set `SMOKE_ALLOW_PRODUCTION=true` only with explicit approval.

Email verification: ensure the staging account can verify (console outbox in local; staging inbox or operator tooling). Draft + evidence steps run even if submit is skipped when email is unverified.

Inclusive confirmation checks (manual or E2E mocks):

1. Create an EMAIL receipt and confirm the customer email still queues.
2. Create a SHARE_LINK receipt without customer email; copy the secure link; confirm without signing in.
3. Create an IN_PERSON_QR receipt; regenerate after expiry; confirm the QR payload matches the confirmation URL.
4. Attach CUSTOMER_ONLY and PUBLIC_PROOF evidence; confirm public proof hides customer-only items.
5. Confirm WhatsApp phone fields never appear in API payloads or database rows.

## UX / legal / org notes for staging

- Confirm landing CTAs and legal footer links (`/privacy`, `/terms`, `/support`) render with EmpowerEd Nexus contact details.
- Organisation accounts are invitation / admin-provisioned — smoke does not self-register organisations.
- After staging UI deploy, optionally run web E2E locally (`npm run test:e2e`) against a built preview with mocked APIs; do not aim Playwright at production.
