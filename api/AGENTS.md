# SiftRate API — agent guide

NestJS 11 backend for SiftRate (personal media-life archive). Frontend SPA is `../app` (see `app/AGENTS.md`); root `package.json` runs Husky + lint-staged, which auto-runs `lint:fix` + `format:fix` on staged `api/**` files at commit.

## Commands (run from `api/`)

| Command | Action |
|---|---|
| `bun run dev` | Dev server (`nest start --watch`), port from `PORT` |
| `bun run build` | `nest build` (rewrites `~/` alias in output) |
| `bun run lint:check` / `lint:fix` | ESLint (`recommendedTypeChecked`) |
| `bun run format:check` / `format:fix` | Prettier (no `;`, single quotes, width 100, @trivago import sort) |
| `bun run db:generate` | Regenerate Prisma client → `src/generated/prisma` (gitignored) |
| `bun run db:migrate` / `db:deploy` / `db:push` / `db:reset` | Prisma migrate dev / deploy / push / `push --force-reset` |
| `bun run db:seed` | **Broken** — `prisma/seed.ts` doesn't exist yet |
| `bun run db:studio` / `email:dev` | Prisma Studio / react-email preview (port 5001) |

No tests exist (`*.spec.ts` absent; jest/supertest deps are starter leftovers).

## Env & config

- Every var is required and zod-validated at boot in `src/app/config/env.config.ts` — missing vars crash startup. No `.env.example`; add new vars to `envSchema`. Keys: `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET` (min 32), `ORIGIN`, `BACKEND_URL`, `S3_*`, `RESEND_*`, TMDB/OMDB/IGDB/Google Books keys, Google OAuth, `DUMMY_HASH`.
- Typed config convention: inject `ConfigService<EnvConfig, true>` and read via `config.get('KEY', { infer: true })`.
- Global prefix `api`; ValidationPipe `transform/whitelist/forbidNonWhitelisted`; CORS `credentials: true` for `ORIGIN`.

## Auth

- Cookie sessions (express-session + Redis via `SessionMiddlewareService`), **not** JWT.
- Global `AuthGuard` protects all routes by default — opt out with `@Public()`. Unverified users get `EMAIL_NOT_VERIFIED`; deleted users' sessions are revoked.
- `@CurrentUser('userId')` reads `req.user` (`sessionId`, `userId`, `email`, `username`, `subscription`); `@TwoFactor()` + `TwoFactorGuard` for 2FA-sensitive routes.
- Global `ThrottlerGuard` (10 req/min, Redis-backed); tighten with `@Throttle(...)`.

## Architecture

- `src/app/` — bootstrap + env config; `src/common/` — cross-cutting (decorators `Public`/`CurrentUser`/`Trim`/`LowerCase`/`Normalize`/`StrongPassword`/`TwoFactor`, guards, `PrismaClientExceptionFilter`, types, constants)
- `src/infrastructure/` — `prisma/`, `redis/`, `s3/`, `resend/` (react-email `.tsx` templates + BullMQ email processor)
- `src/modules/` — features: `auth`, `feed`, `follow`, `media`, `planned`, `ranked-list`, `review`, `session`, `two-factor`, `user`
- `src/generated/prisma/` — generated, gitignored: after editing `prisma/schema.prisma` run `db:generate`; fresh clones fail to compile until generated. Import as `~/generated/prisma/client`.
- Module shape: `*.module/controller/service.ts` + `dto/` (class-validator — no zod server-side) + `constants/` + `types/`; external providers (TMDB, IGDB, …) and slow work live in `media` under `services/` + `processors/` (BullMQ).

## Data & conventions

- Prisma 7 (`prisma-client` generator, `@prisma/adapter-pg`), Postgres, `uuid(7)` ids; `PrismaModule` is `@Global()`. Schema has no migrations dir yet — `db:migrate` creates the first one. Prisma errors → `PrismaClientExceptionFilter` (e.g. `P2002` → 409).
- Use `~/` alias over relative imports; `import type` for type-only imports; no code comments unless asked.
- ESLint: `no-explicit-any` off; `prettier/prettier` disabled — formatting only via `format:fix` (don't hand-sort imports; the @trivago plugin enforces order).
