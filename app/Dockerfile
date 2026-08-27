FROM oven/bun:1 AS build
ARG VITE_BASE_URL=https://api.siftrate.com/api
WORKDIR /repo
COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY app/package.json ./app/
RUN bun install --frozen-lockfile --filter app
COPY app ./app/
WORKDIR /repo/app
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN bun run build

FROM caddy:2
COPY --from=build /repo/app/dist /srv
