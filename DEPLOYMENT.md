# Deployment

This public guide contains no host-specific credentials or private operational records. Keep the deployment host and SSH identity in the CI configuration, not in source files.

## Requirements

- A supported Linux host with Docker Engine and the Compose plugin.
- A deployment directory at `~/siftrate`.
- Root `.env`, `api/.env` and `docker/minio.license` provisioned securely outside Git.
- The required application images built or pulled before starting production.

```sh
chmod 600 .env api/.env docker/minio.license
```

Use separate non-administrative database and restricted object-storage identities for the application. Keep administrator credentials outside the API. Never publish environment files, private keys, licenses, backups, rendered Compose output or access tokens in source, artifacts, build arguments or logs.

## Production

From the deployment directory:

```sh
sudo docker compose -f docker-compose.yml -f docker-compose.production.yml config --quiet
sudo docker compose -f docker-compose.yml -f docker-compose.production.yml up -d --no-build --pull never
sudo docker compose -f docker-compose.yml -f docker-compose.production.yml ps
```

After the first successful CI deployment, include `-f docker-compose.release.yml` in those commands to retain the deployed image revision. The release overlay is generated on the server by CI; it contains no credentials.

Only HTTP/HTTPS should be public. Database, cache, object-storage and internal API ports must remain unpublished. The public object-storage virtual host permits only reads of the intended bucket paths.

## Recovery and maintenance

Before recovery or migrations, stop relevant application workers and preserve a fresh, verified recovery point. Verify the target database and archive before restoring. Do not blindly reset or baseline migrations, run schema push against production, or overwrite legitimate post-deployment writes with historical data.

Object archives do not necessarily include version history, access policies or identities. Restore required policies and restricted application credentials separately. Keep encrypted, recoverable configuration and data backups outside the server.

For Spotify credential rotation, preserve the session secret and all other settings. Stop only the API, delete only Redis key `spotify:access_token`, and recreate only the API with the production overlay. Do not flush Redis or reset user sessions. Verify provider authentication and public API health afterward.

## CI security

Use a dedicated CI-to-server SSH key and verify the server host key. Store private credentials in GitHub Actions secrets. Do not use an operator's personal SSH key or expose deployment credentials to untrusted pull-request code.

The workflow builds commit-tagged images on the CI runner and transfers only the required non-secret deployment files. Its deploy job authenticates to the private registry with the job token in a temporary Docker configuration. Configure the SSH secrets and network access, then verify a real workflow run before relying on automatic deployment. A deployment may apply database migrations; a failed deployment must be investigated without automatically restoring old database data.
