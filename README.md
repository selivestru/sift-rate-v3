# SiftRate

**Your media life archive.** Track the movies, shows, games, books, albums and tracks you've lived through — rate them and keep a personal timeline.

SiftRate is a personal media-life archive rather than a public rating aggregator. You sign in with Google, pick a username, and then search, rate and review media across six types, building a timeline of what you consumed and when.

## Features

- **Six media types** — movies, TV shows, games, books, albums and tracks, powered by TMDB, OMDb, IGDB, Google Books and Spotify.
- **Ratings & reviews** — rate and write about each item; browse a chronological feed of your activity.
- **Personal library** — reviews, a ranked list and a planned queue.
- **IMDb import** — bring your existing ratings over.
- **Localized** — English, Ukrainian and Russian UI.
- **Google-only auth** — no passwords; cookie sessions backed by Redis.

## Tech stack

| Layer      | Choice                                                                                 |
| ---------- | -------------------------------------------------------------------------------------- |
| Frontend   | React 19, Vite, TanStack Router & Query, Zustand, Tailwind CSS v4, intlayer (EN/UK/RU) |
| Backend    | NestJS 11, Prisma 7, PostgreSQL, Redis, BullMQ                                         |
| Storage    | S3-compatible object storage (MinIO)                                                   |
| Runtime    | [Bun](https://bun.sh)                                                                  |
| Deployment | Docker Compose + Caddy, images published to GHCR by GitHub Actions                     |

## Monorepo layout

```
.
├── api/                # NestJS API (see api/README.md)
├── app/                # React SPA (see app/README.md)
├── docker/             # Caddyfile for the production reverse proxy
├── docker-compose.yml  # Local infra and production stack
├── lefthook.yml        # Pre-commit lint/format hooks
└── .github/workflows/  # deploy pipeline
```

## Getting started

### Prerequisites

- [Bun](https://bun.sh)
- Docker with Docker Compose

### 1. Install dependencies

```bash
bun install
```

### 2. Start local infrastructure

```bash
cp .env.example .env
docker compose up -d db redis minio
```

### 3. Run the API

```bash
cp api/.env.example api/.env
cd api
bun run db:generate
bun run db:migrate
bun run dev
```

The API listens on the `PORT` from `api/.env` (default `5000`) and serves everything under `/api`.

### 4. Run the web app

```bash
cp app/.env.example app/.env
cd app
bun run dev
```

The app is available at http://localhost:3000 and talks to the API at `VITE_BASE_URL`.

## Environment variables

Each package has its own example file:

| File               | Scope                                           |
| ------------------ | ----------------------------------------------- |
| `.env.example`     | Docker Compose infrastructure (Postgres, MinIO) |
| `api/.env.example` | API — all variables, validated at boot          |
| `app/.env.example` | Web app — `VITE_BASE_URL`                       |

## Common commands

| Command                       | Action                             |
| ----------------------------- | ---------------------------------- |
| `bun install`                 | Install all workspace dependencies |
| `docker compose up -d`        | Start local infrastructure         |
| `cd api && bun run dev`       | API in watch mode                  |
| `cd app && bun run dev`       | Web app dev server                 |
| `cd api && bun run db:studio` | Prisma Studio                      |

See the package READMEs for the full command lists.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the API, migration and app images, pushes them to GitHub Container Registry, and runs migrations and `docker compose up` on the server over SSH.

## License

[MIT](LICENSE)
