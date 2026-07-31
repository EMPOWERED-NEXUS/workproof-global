# Security

## Authentication

- Passwords hashed with bcrypt (12 rounds)
- **Short-lived access tokens** (default 15 minutes) signed as JWTs with issuer `workproof-api` and audience `workproof-clients`
- **Rotating refresh tokens** (default 30 days): opaque random values; only SHA-256 hashes stored in `refresh_tokens`
- Refresh reuse detection revokes the entire token family
- Suspended users are rejected on access validation and have refresh sessions revoked
- Generic login error messages (no email enumeration)

### Browser (web)

- Access token in HttpOnly cookie (`ACCESS_COOKIE_NAME`, path `/`)
- Refresh token in separate HttpOnly cookie (`REFRESH_COOKIE_NAME`, path `/api/v1/auth`)
- `SameSite=Lax`; `Secure` required in production
- Refresh tokens are **not** returned in JSON to browser clients
- Cookie-authenticated state-changing requests with an `Origin` header must match `ALLOWED_ORIGINS`

### Mobile

- Send `X-Client-Platform: mobile` on auth endpoints
- Access and refresh tokens are returned in the JSON body for SecureStore (later)
- Call protected routes with `Authorization: Bearer <accessToken>`
- Refresh with `POST /api/v1/auth/refresh` and the opaque refresh token in the body

## Authorization

- Role middleware: WORKER, ORGANISATION, ADMIN
- Workers can only access their own receipts
- Admin routes require ADMIN role
- Public registration cannot create ADMIN (schema-enforced)
- Organisation dashboards must not expose unrelated platform workers or receipts (assignment model comes later)

## Session management

| Route | Purpose |
|-------|---------|
| `POST /auth/refresh` | Rotate refresh token |
| `POST /auth/logout` | Revoke current refresh session |
| `POST /auth/logout-all` | Revoke all user sessions |
| `GET /auth/sessions` | List active sessions |
| `DELETE /auth/sessions/:id` | Revoke own session |

## Verification tokens

- 32-byte random tokens; only SHA-256 hash stored
- Multiple attempts per receipt; history preserved
- Atomic claim (`claimedAt`) before decision; GET never consumes
- Resubmission invalidates outstanding unused requests
- Single-use with expiry; replay rejected

## Verified receipts

- Immutable after customer confirmation
- Versioned integrity hash (v1) from canonical receipt + evidence ids (not temporary URLs alone)
- `lockedAt` timestamp set on verification
- Archiving sets `archivedAt` without changing verification status
- Revocation stores `revokedAt`, `revokedById`, public-safe `revocationReason`

## Public endpoints

Public proof returns `proofValidity` (`VALID`, `INVALID_REVOKED`, `UNDER_DISPUTE`, `CORRECTION_REQUIRED`, `UNAVAILABLE`) and never exposes:

- Customer email or phone
- Private confirmation comments
- Private dispute descriptions
- Token hashes / verification token data
- Internal audit metadata, admin email, IP, user agent
- Income on non-PUBLIC or non-VALID proofs

## Infrastructure

- Helmet security headers
- CORS allow-list via `ALLOWED_ORIGINS` (credentials enabled; no wildcard)
- Rate limiting on login, refresh, and verification
- Request body size limits
- File upload MIME and size validation
- Swagger / `api-docs` only when `ENABLE_API_DOCS=true`
- Readiness probe checks database connectivity without leaking credentials
- No stack traces in production error responses
- Audit logging for session create/rotate/revoke/replay and other sensitive actions

## Secrets

- Never commit `apps/api/.env`
- Use a strong `ACCESS_TOKEN_SECRET` in production (min 32 characters)
- Set `COOKIE_SECURE=true` behind HTTPS
- Do not log raw access or refresh tokens
