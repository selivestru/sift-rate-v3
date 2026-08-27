FROM oven/bun:1 AS deps
WORKDIR /repo
COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY app/package.json ./app/
RUN bun install --frozen-lockfile --filter api

FROM oven/bun:1 AS build
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/api/node_modules ./api/node_modules
COPY api/package.json api/prisma.config.ts api/nest-cli.json api/tsconfig.json api/tsconfig.build.json ./api/
COPY api/prisma ./api/prisma
COPY api/src ./api/src
WORKDIR /repo/api
ENV DATABASE_URL=postgres://build:build@localhost:5432/build
RUN bun run db:generate
RUN bun run build

FROM oven/bun:1 AS prod-deps
WORKDIR /repo
COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY app/package.json ./app/
RUN bun install --frozen-lockfile --filter api --production

FROM node:22-slim AS runtime
WORKDIR /repo/api
ENV NODE_ENV=production
COPY --from=prod-deps /repo/node_modules /repo/node_modules
COPY --from=prod-deps /repo/api/node_modules /repo/api/node_modules
COPY --from=build /repo/api/dist ./dist
COPY api/package.json ./
USER node
CMD ["node", "dist/src/main"]
