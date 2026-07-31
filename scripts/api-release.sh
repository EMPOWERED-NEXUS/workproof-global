#!/usr/bin/env sh
# Single-phase API release: validate env → migrate deploy → start API.
# Intended for platforms with one release task (not concurrent replica migrate races).
set -eu

cd "$(dirname "$0")/../apps/api"

required() {
  eval "val=\${$1:-}"
  if [ -z "$val" ]; then
    echo "Missing required environment variable: $1" >&2
    exit 1
  fi
}

required DATABASE_URL
required ACCESS_TOKEN_SECRET
required EMAIL_PAYLOAD_ENCRYPTION_KEY
required WEB_APP_URL
required STORAGE_PROVIDER
required EMAIL_PROVIDER

if [ "${NODE_ENV:-}" = "production" ]; then
  if [ "$STORAGE_PROVIDER" = "local" ]; then
    echo "STORAGE_PROVIDER=local is forbidden in production." >&2
    exit 1
  fi
  if [ "$EMAIL_PROVIDER" = "console" ]; then
    echo "EMAIL_PROVIDER=console is forbidden in production." >&2
    exit 1
  fi
fi

# Never seed production from this script.
if [ "${RUN_DB_SEED:-false}" = "true" ] && [ "${NODE_ENV:-}" = "production" ]; then
  echo "Production seeding is disabled by default. Unset RUN_DB_SEED." >&2
  exit 1
fi

echo "Generating Prisma Client..."
npx prisma generate

echo "Deploying migrations..."
npx prisma migrate deploy

echo "Starting API..."
exec node dist/server.js
