#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$ROOT/backups/minio"
STAMP="$(date +%Y-%m-%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

MINIO_VOLUME="${MINIO_VOLUME:-siftrate_minio_data}"

echo "[minio $STAMP]"
podman run --rm \
  -v "$MINIO_VOLUME":/data:ro \
  -v "$BACKUP_DIR":/backup \
  docker.io/library/alpine:3.22 \
  tar czf "/backup/minio_$STAMP.tar.gz" -C /data .
ls -lh "$BACKUP_DIR/minio_$STAMP.tar.gz"

ls -1t "$BACKUP_DIR"/minio_*.tar.gz | tail -n +2 | xargs -r -d '\n' rm -v
