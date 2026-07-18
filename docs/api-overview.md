# API Overview

Base URL: `http://localhost:4000/api/v1`

Interactive docs: `http://localhost:4000/api-docs`

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register worker or organisation |
| POST | `/auth/login` | Login (sets HTTP-only cookie) |
| POST | `/auth/logout` | Clear session |
| GET | `/auth/me` | Current user (auth required) |

## Worker profile

| Method | Path | Auth |
|--------|------|------|
| GET | `/profile` | WORKER |
| PATCH | `/profile` | WORKER |
| GET | `/workers/:profileSlug` | Public |

## Receipts

| Method | Path | Auth |
|--------|------|------|
| POST | `/receipts` | WORKER |
| GET | `/receipts` | WORKER |
| GET | `/receipts/:id` | WORKER (owner) |
| PATCH | `/receipts/:id` | WORKER (draft/correction only) |
| DELETE | `/receipts/:id` | WORKER (draft only) |
| POST | `/receipts/:id/evidence` | WORKER |
| POST | `/receipts/:id/submit` | WORKER |
| POST | `/receipts/:id/archive` | WORKER |

## Customer verification (public)

| Method | Path |
|--------|------|
| GET | `/verification/:token` |
| POST | `/verification/:token/respond` |

## Public proof

| Method | Path |
|--------|------|
| GET | `/public/receipts/:verificationCode` |

## Dashboards

| Method | Path | Auth |
|--------|------|------|
| GET | `/dashboard/worker` | WORKER |
| GET | `/dashboard/organisation` | ORGANISATION |

## Admin

| Method | Path | Auth |
|--------|------|------|
| GET | `/admin/users` | ADMIN |
| GET | `/admin/receipts` | ADMIN |
| GET | `/admin/disputes` | ADMIN |
| PATCH | `/admin/users/:id/status` | ADMIN |
| POST | `/admin/receipts/:id/revoke` | ADMIN |
| POST | `/admin/disputes/:id/resolve` | ADMIN |

## Error format

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": { "field": ["Validation detail"] }
}
```
