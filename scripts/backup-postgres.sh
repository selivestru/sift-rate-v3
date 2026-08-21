#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT/backups/postgres"
STAMP="$(date +%Y-%m-%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

PG_CONTAINER="${PG_CONTAINER:-siftrate_db_1}"
PG_DB="${POSTGRES_DB:-siftrate}"
PG_USER="${POSTGRES_USER:-postgres}"

echo "[postgres $STAMP]"
podman exec "$PG_CONTAINER" pg_dump -U "$PG_USER" -Fc "$PG_DB" > "$BACKUP_DIR/postgres_$STAMP.dump"
ls -lh "$BACKUP_DIR/postgres_$STAMP.dump"

ls -1t "$BACKUP_DIR"/postgres_*.dump | tail -n +2 | xargs -r -d '\n' rm -v
