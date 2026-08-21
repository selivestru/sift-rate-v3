#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAMP="${1:-}"
STAMP="${STAMP%.dump}"
STAMP="${STAMP%.tar.gz}"
STAMP="${STAMP#postgres_}"
STAMP="${STAMP#minio_}"

PG_DUMP=""
MINIO_TAR=""

if [[ -n "$STAMP" ]]; then
  for p in "$ROOT/backups/postgres/postgres_$STAMP.dump" "$ROOT/backups/postgres_$STAMP.dump"; do [[ -f "$p" ]] && PG_DUMP="$p" && break; done
  for p in "$ROOT/backups/minio/minio_$STAMP.tar.gz" "$ROOT/backups/minio_$STAMP.tar.gz"; do [[ -f "$p" ]] && MINIO_TAR="$p" && break; done
  if [[ -z "$PG_DUMP" || -z "$MINIO_TAR" ]]; then
    echo "Warning: exact stamp '$STAMP' not found for both services, using latest available." >&2
    [[ -z "$PG_DUMP" ]] && PG_DUMP="$(ls -1t "$ROOT/backups/postgres"/postgres_*.dump 2>/dev/null | head -1)"
    [[ -z "$MINIO_TAR" ]] && MINIO_TAR="$(ls -1t "$ROOT/backups/minio"/minio_*.tar.gz 2>/dev/null | head -1)"
  fi
else
  PG_DUMP="$(ls -1t "$ROOT/backups/postgres"/postgres_*.dump 2>/dev/null | head -1)"
  MINIO_TAR="$(ls -1t "$ROOT/backups/minio"/minio_*.tar.gz 2>/dev/null | head -1)"
  STAMP="(latest)"
fi

BACKUP_DIR="$ROOT/backups"
[[ -n "$PG_DUMP" && -n "$MINIO_TAR" ]] || {
  echo "No backup files found. Looked in:" >&2
  echo "  $ROOT/backups/postgres/" >&2
  echo "  $ROOT/backups/minio/" >&2
  ls -R "$ROOT/backups" 2>&1 | head -20 >&2
  exit 1
}
echo "Using PG: $PG_DUMP"
echo "Using MinIO: $MINIO_TAR"

PG_CONTAINER="${PG_CONTAINER:-siftrate_db_1}"
MINIO_CONTAINER="${MINIO_CONTAINER:-siftrate_minio_1}"
MINIO_VOLUME="${MINIO_VOLUME:-siftrate_minio_data}"
BACKUP_DIR_MINIO="$(dirname "$MINIO_TAR")"
BACKUP_DIR_PG="$(dirname "$PG_DUMP")"
PG_DB="${POSTGRES_DB:-siftrate}"
PG_USER="${POSTGRES_USER:-postgres}"

read -rp "This will OVERWRITE all data in db and minio with backup $STAMP. Continue? [y/N] " answer
[[ "$answer" == "y" || "$answer" == "Y" ]] || { echo "Aborted."; exit 1; }

echo "[1/2] PostgreSQL"
podman exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -tAc \
  "SELECT 1 FROM pg_database WHERE datname='$PG_DB'" | grep -q 1 ||
  podman exec "$PG_CONTAINER" psql -U "$PG_USER" -d postgres -c "CREATE DATABASE \"$PG_DB\""
podman exec -i "$PG_CONTAINER" pg_restore -U "$PG_USER" -d "$PG_DB" --clean --if-exists < "$PG_DUMP"

echo "[2/2] MinIO (restart with restored volume)"
podman stop "$MINIO_CONTAINER" > /dev/null
podman run --rm -v "$MINIO_VOLUME":/data docker.io/library/alpine:3.22 sh -c 'rm -rf /data/*'
podman run --rm \
  -v "$MINIO_VOLUME":/data \
  -v "$BACKUP_DIR_MINIO":/backup:ro \
  docker.io/library/alpine:3.22 \
  sh -c "tar xzf /backup/$(basename "$MINIO_TAR") -C /data"
podman start "$MINIO_CONTAINER" > /dev/null

echo
echo "Restore complete. Waiting for health..."
sleep 10
podman ps --format '{{.Names}}\t{{.Status}}'
