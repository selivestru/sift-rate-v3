#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
stage=${1:?}
revision=${2:?}
registry_user=${3:?}
[[ $revision =~ ^[0-9a-f]{40}$ && $registry_user =~ ^[A-Za-z0-9-]+$ ]]
[[ $stage =~ ^/tmp/siftrate-deploy-${revision}-[0-9]+-[0-9]+$ ]]
[[ -d $stage && ! -L $stage ]]
IFS= read -r registry_token
[[ -n $registry_token ]]
root=/home/ubuntu/siftrate
exec 9>/var/lock/siftrate-deploy.lock
flock -n 9
docker_config=$(mktemp -d /tmp/siftrate-docker-auth.XXXXXXXX)
release_file=$(mktemp /tmp/siftrate-release.XXXXXXXX.yml)
cleanup() {
  rm -f -- "$release_file"
  rm -rf -- "$docker_config"
  rm -rf -- "$stage"
}
trap cleanup EXIT
export DOCKER_CONFIG="$docker_config"
printf '%s' "$registry_token" | docker login ghcr.io --username "$registry_user" --password-stdin >/dev/null
unset registry_token
for image in siftrate-api siftrate-migrate siftrate-app; do
  docker pull "ghcr.io/selivestru/$image:$revision"
done
cat > "$release_file" <<EOF
services:
  api:
    image: ghcr.io/selivestru/siftrate-api:$revision
  caddy:
    image: ghcr.io/selivestru/siftrate-app:$revision
  db-migrate:
    image: ghcr.io/selivestru/siftrate-migrate:$revision
EOF
install -o ubuntu -g ubuntu -m 644 "$stage/docker-compose.yml" "$root/docker-compose.yml"
install -o ubuntu -g ubuntu -m 644 "$stage/docker-compose.production.yml" "$root/docker-compose.production.yml"
install -o ubuntu -g ubuntu -m 644 "$stage/docker/Caddyfile.production" "$root/docker/Caddyfile.production"
install -o ubuntu -g ubuntu -m 644 "$release_file" "$root/docker-compose.release.yml"
cd "$root"
compose=(docker compose -f docker-compose.yml -f docker-compose.production.yml -f docker-compose.release.yml)
"${compose[@]}" config --quiet
"${compose[@]}" run --rm --no-deps db-migrate
"${compose[@]}" up -d --no-deps --no-build --pull never --wait --wait-timeout 120 api caddy
timeout 60 sh -c 'until curl -fsS https://api.siftrate.com/api/health >/dev/null; do sleep 3; done'
printf 'Deployment complete for revision %s\n' "$revision"
