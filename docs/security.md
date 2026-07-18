# Security

## Authentication

- Passwords hashed with bcrypt (12 rounds)
- Sessions via JWT in HTTP-only, SameSite=Lax cookies
- Generic login error messages (no email enumeration)
- Suspended users cannot authenticate

## Authorization

- Role middleware: WORKER, ORGANISATION, ADMIN
- Workers can only access their own receipts
- Admin routes require ADMIN role
- Public registration cannot create ADMIN (schema-enforced)

## Verification tokens

- 32-byte random tokens; only SHA-256 hash stored
- Single-use with expiry
- Timing-safe hash comparison

## Verified receipts

- Immutable after customer confirmation
- Integrity hash from canonical receipt + evidence metadata
- `lockedAt` timestamp set on verification

## Public endpoints

Public proof never exposes:

- Customer email or phone
- Internal UUIDs
- Token hashes
- Private audit metadata
- Income on non-PUBLIC visibility

## Infrastructure

- Helmet security headers
- CORS restricted to `FRONTEND_URL`
- Rate limiting on login and verification
- Request body size limits
- File upload MIME and size validation
- No stack traces in production error responses
- Audit logging for sensitive actions

## Secrets

- Never commit `apps/api/.env`
- Use strong `JWT_SECRET` in production
- Set `COOKIE_SECURE=true` behind HTTPS
