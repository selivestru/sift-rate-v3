# SiftRate API

NestJS 11 backend for [SiftRate](../README.md) — the personal media-life archive. It exposes a REST API under the global `/api` prefix and talks to PostgreSQL through Prisma, Redis for sessions/queues, and S3-compatible storage for media assets.

## Stack

- **NestJS 11** + Express
- **Prisma 7** with the `@prisma/adapter-pg` driver
- **PostgreSQL** — primary datastore
- **Redis** — cookie sessions (`connect-redis`) and BullMQ queues, plus the throttler storage
- **S3 / MinIO** — poster and asset storage
- **Zod** — environment validation at boot

## Requirements

- [Bun](https://bun.sh)
- PostgreSQL, Redis and an S3-compatible endpoint (use the root `docker-compose.yml` for local infra)

## Setup

```bash
# from the repository root
bun install

cp api/.env.example api/.env   # then fill in the values
cd api
bun run db:generate            # generate the Prisma client into src/generated/prisma
bun run db:migrate             # apply migrations
bun run dev                    # watch mode
```

The server listens on `PORT` from `.env` (default `5000`) and serves all routes under `/api`. A public health check is available at `GET /api/health`.

## Environment

All variables are required unless noted and are validated at startup by the zod schema in [`src/app/config/env.config.ts`](src/app/config/env.config.ts). See [`api/.env.example`](.env.example) for a template.

| Variable                                                            | Purpose                                        |
| ------------------------------------------------------------------- | ---------------------------------------------- |
| `PORT`                                                              | HTTP port                                      |
| `NODE_ENV`                                                          | `development` \| `production` \| `test`        |
| `ORIGIN`                                                            | Web app origin, used for CORS                  |
| `DATABASE_URL`                                                      | PostgreSQL connection string                   |
| `REDIS_URL`                                                         | Redis connection string                        |
| `SESSION_SECRET`                                                    | Session signing secret (min 32 chars)          |
| `SESSION_PREFIX`                                                    | Redis session key prefix (default `sessions:`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` | Google OAuth credentials                       |
| `TMDB_API_KEY`                                                      | Movies and TV metadata                         |
| `OMDB_API_KEY`                                                      | Ratings metadata                               |
| `IGDB_CLIENT_ID` / `IGDB_CLIENT_SECRET`                             | Game metadata                                  |
| `GOOGLE_BOOKS_API_KEY`                                              | Book metadata                                  |
| `TINYFISH_API_KEY`                                                  | Metadata scraping                              |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET`                       | Album and track metadata                       |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_REGION`                           | Object storage connection                      |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`                         | Object storage credentials                     |
| `S3_PUBLIC_BASE_URL`                                                | Public base URL for stored assets              |

## Commands

| Command                | Action                               |
| ---------------------- | ------------------------------------ |
| `bun run dev`          | Dev server in watch mode             |
| `bun run build`        | Compile to `dist/`                   |
| `bun run start`        | Build, then run the compiled server  |
| `bun run lint:check`   | ESLint                               |
| `bun run lint:fix`     | ESLint with `--fix`                  |
| `bun run format:check` | Prettier check                       |
| `bun run format:fix`   | Prettier write                       |
| `bun run db:generate`  | Regenerate the Prisma client         |
| `bun run db:migrate`   | Prisma `migrate dev`                 |
| `bun run db:deploy`    | Prisma `migrate deploy` (production) |
| `bun run db:push`      | Push the schema without a migration  |
| `bun run db:reset`     | Force-reset the database             |
| `bun run db:studio`    | Open Prisma Studio                   |

The Prisma client is generated into `src/generated/prisma` (gitignored), so fresh clones must run `bun run db:generate` before building.

## Architecture

```
src/
  app/               # bootstrap + env config
  common/            # decorators, guards, filters, shared types/utilities
  infrastructure/    # prisma, redis, s3 modules
  modules/           # feature modules
  generated/prisma/  # generated Prisma client (gitignored)
```

Feature modules live under `src/modules/`: `auth`, `feed`, `import`, `media`, `planned`, `ranked-list`, `review`, `session`, `user`.

## Auth

Google-only OAuth with server-side cookie sessions (`express-session` + Redis). A global `AuthGuard` protects every route by default; routes opt out with the `@Public()` decorator. `@CurrentUser('userId')` reads the authenticated user from the request. Deleted accounts have their sessions revoked immediately.

## Media & data

- Per-type provider services sit under `src/modules/media/services/` (TMDB, OMDb, IGDB, Google Books, Spotify).
- Poster ingestion runs asynchronously through BullMQ on Redis.
- Prisma models: `User`, `Media`, `MediaTranslation`, `Review`, `PlannedItem`, `RankedList`, `RankedItem`, `ImportJob`, `ImportJobRow` — see [`prisma/schema.prisma`](prisma/schema.prisma).
- Prisma errors are mapped to HTTP responses by `PrismaClientExceptionFilter` (`P2002` → 409, `P2025` → 404).

## Conventions

See [`AGENTS.md`](AGENTS.md) for coding conventions and [`../app/DESIGN.md`](../app/DESIGN.md) for the design system shared with the web app. There are currently no automated tests.
