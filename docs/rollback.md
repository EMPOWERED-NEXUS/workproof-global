# Rollback

## Application rollback

1. Redeploy the previous known-good API and web images/tags
2. Keep the database at the current schema unless a forward migration is unsafe
3. Revoke sessions in an emergency: administrators can use `logout-all` per user, or invalidate refresh tokens in DB

## Migration rollback limitations

Prisma `migrate deploy` is forward-only in production. Rolling back schema requires:

1. Restoring a verified database backup taken **before** the migration, **or**
2. Shipping an explicit new migration that reverses the change (preferred when data must be kept)

Never run `migrate reset` against production.

## Emergency session revocation

- Per user: `POST /api/v1/auth/logout-all` (authenticated)
- Platform incident: mark users `SUSPENDED` and revoke refresh tokens

## Evidence / email

- Storage objects are not automatically deleted on app rollback
- Pending outbox jobs resume when the API returns; failed jobs remain inspectable via DB status fields (no payloads after successful send)
