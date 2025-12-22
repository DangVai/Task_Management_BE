#!/bin/sh
set -e

echo "Waiting for Postgres..."
HOST="${DB_HOST:-postgres}"
PORT="${DB_PORT:-5432}"
USER="${DB_USERNAME:-postgres}"

until pg_isready -h "$HOST" -p "$PORT" -U "$USER" >/dev/null 2>&1; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Postgres is up - running migrations"
npx prisma migrate deploy || true

echo "Generating Prisma client"
npx prisma generate || true

echo "Starting app"
exec npm run start
