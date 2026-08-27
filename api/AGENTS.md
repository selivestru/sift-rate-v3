# SiftRate API — agent guide

NestJS 11 backend for SiftRate (personal media-life archive). Frontend SPA is `../app` (see `app/AGENTS.md`). Repo-root `lefthook.yml` runs a pre-commit hook that auto-runs `lint:fix` + `format:fix` on staged `api/**/*.{js,ts}` (and `app/**`) with `stage_fixed: true`.

## Commands (run from `api/`)

| Command                                                     | Action                                                                                                         |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `bun run dev`                                               | Dev server (`nest start --watch`), port from `PORT`                                                            |
| `bun run build`                                             | `nest build` → `dist/` (rewrites `~/` alias to relative paths); `bun run start` = build + `node dist/src/main` |
| `bun run lint:check` / `lint:fix`                           | ESLint (`recommendedTypeChecked`)                                                                              |
| `bun run format:check` / `format:fix`                       | Prettier (no `;`, single quotes, width 100, @trivago import sort)                                              |
| `bun run db:generate`                                       | Regenerate Prisma client → `src/generated/prisma` (gitignored)                                                 |
| `bun run db:migrate` / `db:deploy` / `db:push` / `db:reset` | Prisma migrate dev / deploy / push / `push --force-reset`                                                      |
| `bun run db:studio`                                         | Prisma Studio                                                                                                  |

No tests exist.

## Env & config

- `envSchema` in `src/app/config/env.config.ts` zod-validates env at boot — missing/invalid vars crash startup. Only schema keys are readable via `ConfigService`, so add new vars to `envSchema` first. Required: `PORT`, `NODE_ENV`, `ORIGIN`, `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET` (min 32), `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`/`GOOGLE_REDIRECT_URI`, `TMDB_API_KEY`, `OMDB_API_KEY`, `IGDB_CLIENT_ID`/`IGDB_CLIENT_SECRET`, `GOOGLE_BOOKS_API_KEY`, `SPOTIFY_CLIENT_ID`/`SPOTIFY_CLIENT_SECRET`, `S3_*` + `S3_PUBLIC_BASE_URL`. `SESSION_PREFIX` defaults to `sessions:`.
- No `api/.env.example`; root `.env.example` only covers docker-compose vars (`POSTGRES_*`, `MINIO_*`).
- Typed config convention: inject `ConfigService<EnvConfig, true>` and read via `config.get('KEY', { infer: true })`.
- Global prefix `api`; ValidationPipe `transform/whitelist/forbidNonWhitelisted`; CORS `credentials: true` for `ORIGIN`; global `ThrottlerGuard` (Redis-backed, 10 req/min default).

## Auth

- Google-only OAuth with cookie sessions (`express-session` + Redis via `SessionMiddlewareService`), not JWT or credentials auth.
- Global `AuthGuard` protects all routes by default — opt out with `@Public()`. Currently public: Google login/callback, profile GETs (`/user/:username…`), media search/details/reviews (`/media/…`), and `/feed`.
- `@CurrentUser('userId')` reads `req.user` (`sessionId`, `userId`, `email`, `username`). Deleted users' sessions are revoked (guard + `user.service.deleteAccount`).
- Account deletion is immediate (`POST /user/delete`).
- There is no 2FA, SSE, notifications, following, or paid subscription system.

## Architecture

- `src/app/` — bootstrap + env config; `src/common/` — cross-cutting (decorators `Public`/`CurrentUser`/`Trim`/`LowerCase`/`Normalize`, guards, `PrismaClientExceptionFilter`, types, constants)
- `src/infrastructure/` — `prisma/` (`@Global()` module), `redis/`, `s3/`
- `src/modules/` — features: `auth`, `feed`, `media`, `planned`, `ranked-list`, `review`, `session`, `user`
- `src/generated/prisma/` — generated, gitignored: after editing `prisma/schema.prisma` run `db:generate`; fresh clones fail to compile until generated. Import as `~/generated/prisma/client`.
- Media providers are per-type services under `media/services/` (TMDB/OMDB/IGDB/Google Books/Spotify). Slow work queues on Redis via BullMQ: poster ingest (`media/processors/poster-ingest.processor.ts`).
- Feed (`feed.service`) returns reviews with author and media data.

## Data & conventions

- Prisma 7 (`prisma-client` generator, `@prisma/adapter-pg`), Postgres, `uuid(7)` ids. Prisma errors → `PrismaClientExceptionFilter` (`P2002` → 409, `P2025` → 404).
- Use `~/` alias over relative imports; `import type` for type-only imports.
- ESLint: `no-explicit-any` off; `prettier/prettier` disabled — formatting only via `format:fix` (don't hand-sort imports; the @trivago plugin enforces order). The pre-commit hook re-formats and restages files.
- Do not write code comments.
