# Production deployment

Staging must pass smoke tests before production cutover.

## Production hard requirements

| Setting | Requirement |
|---------|-------------|
| `NODE_ENV` | `production` |
| `STORAGE_PROVIDER` | `supabase` (local forbidden) |
| `EMAIL_PROVIDER` | `transactional` (console forbidden) |
| `COOKIE_SECURE` | `true` |
| `WEB_APP_URL` | `https://...` |
| `ACCESS_TOKEN_SECRET` | ≥ 32 chars |
| `EMAIL_PAYLOAD_ENCRYPTION_KEY` | dedicated 32-byte key (not JWT secret) |
| `ENABLE_API_DOCS` | `false` unless explicitly needed |
| `SUPABASE_*` | private bucket + service role on API only |

## Procedure

1. Backup production database; verify restore procedure (`docs/rollback.md`)
2. Create private evidence bucket; block public access
3. Configure transactional email domain / SPF / DKIM
4. Deploy migrations with a **single** release task (`prisma migrate deploy`)
5. Roll out API containers (health + readiness probes)
6. Roll out web Nginx/static assets
7. Update DNS / custom domains / TLS
8. Set CORS origins and cookie domain
9. Bootstrap first admin if not already done
10. Smoke-test with production acknowledgement only if explicitly approved
11. Configure EAS `EXPO_PUBLIC_API_URL` for mobile builds (no secrets)

## Outage behaviour

- **Email provider down:** jobs remain in outbox, retry with backoff, eventually `FAILED` + worker notice for customer verification
- **Storage provider down:** uploads fail closed; existing DB metadata retained; downloads return errors without leaking paths

## UX / legal / org notes

- Public registration creates **WORKER** accounts only, with Terms and Privacy acceptance recorded.
- Organisation programme access is invitation-based; bootstrap admins via `docs/admin-bootstrap.md`, then provision orgs administratively.
- Legal pages are pilot copy — complete external legal review before unrestricted commercial launch.
- Mobile is not part of the public production download surface; keep store / APK claims off marketing until mobile parity ships.
- Recommend enabling malware scanning on evidence uploads as an ops control (not yet built into the API).
