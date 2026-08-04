# Environment matrix

| Variable | Local | CI | Staging | Production |
|----------|-------|----|---------|------------|
| `NODE_ENV` | development | test | production | production |
| `DATABASE_URL` | Docker Postgres `:5434` | service Postgres | staging DB | production DB |
| `STORAGE_PROVIDER` | local | local | supabase | supabase |
| `LOCAL_STORAGE_DIR` | uploads | uploads-ci | unused | forbidden |
| `EMAIL_PROVIDER` | console | console | transactional | transactional |
| `COOKIE_SECURE` | false | false | true | true |
| `WEB_APP_URL` | http://localhost:5173 | http://localhost:5173 | https://staging… | https://… |
| `ENABLE_API_DOCS` | true optional | false | false | false |
| `ALLOW_DEV_VERIFICATION_TOKEN` | true | true | false | false |
| `ALLOW_DEV_PASSWORD_RESET_TOKEN` | true | true | false | false |
| `VERIFICATION_TOKEN_EXPIRY_HOURS` | 72 | 72 | 72 | 72 |
| `SHARE_LINK_TOKEN_EXPIRY_HOURS` | 72 | 72 | 72 | 72 |
| `IN_PERSON_QR_TOKEN_EXPIRY_MINUTES` | 10 | 10 | 10 | 10 |
| `VITE_API_URL` | `/api/v1` proxy | build-time | staging API URL | production API URL |
| `VITE_PUBLIC_WEB_URL` | http://localhost:5173 | build-time | staging web origin | https://workproof.empowerednexus.com |
| `EXPO_PUBLIC_API_URL` | LAN API | n/a | staging API | production API |

API-only secrets: `ACCESS_TOKEN_SECRET`, `EMAIL_PAYLOAD_ENCRYPTION_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `EMAIL_API_KEY`.
