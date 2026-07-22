# SiftRate — agent guide

SiftRate is a SPA web platform for a personal media-life archive: movies, TV shows, games, books, albums, and tracks. Users authenticate (email/password and Google), pick a unique username, then get a protected space to search media, rate it, and use related personal tools.

This guide lives in `app/` and is the primary context for frontend work. The repo is a monorepo — see [Monorepo structure](#monorepo-structure).

## Product idea

SiftRate is not another IMDb, Letterboxd, or Backloggd. Every feature should reinforce the core idea: **"Media is part of your life"**. Users do not just rate media — they gradually build a digital archive of their life through media, track how taste changes, and turn watching / reading / listening into a life timeline.

That direction matters for prioritization: when decisions are ambiguous, prefer what serves a personal archive over a classic rating aggregator.

**Write barrels with `export *`, not named re-exports:**

```ts
// ✅ good
export * from './any-file'

// ❌ bad
export { file } from './any-file'
```

Domain enums (product contracts):

- `Subscription`: `FREE | MONTHLY | YEARLY | LIFETIME` — implemented in app as `SUBSCRIPTIONS` + `Subscription` in `src/modules/auth/types/user.type.ts`.
- `MediaType`: `MOVIE | TV_SHOW | GAME | BOOK | ALBUM | TRACK` — product contract; keep this vocabulary in routes and future modules.
- `Visibility`: `PRIVATE | FRIENDS | PUBLIC` — product contract for future review visibility.

## Monorepo structure

Repository root: `siftrate/` (parent of this `app/` package).

| Path                | Role                        | Notes                                          |
| ------------------- | --------------------------- | ---------------------------------------------- |
| `app/`              | Frontend SPA (this package) | Vite + React. Primary UI and agent work.       |
| `api/`              | Backend API                 | NestJS.                                        |
| `landing/`          | Marketing landing           | Landing                                        |
| root `package.json` | Repo tooling                | Husky + lint-staged for `app/**` and `api/**`. |

## App source architecture

```
src/
  app/                 # application shell
    main.tsx           # entry
    globals.css        # Tailwind + Shadcn + theme tokens + motion keyframes
    layout/            # Layout, Header, Main, Sidebar, NavDrawer, Navigation, Profile, AppBackdrop
    providers/         # Query, Router, Animation, Toast
    routes/            # TanStack file routes (generates routeTree.gen.ts)
  common/              # cross-feature shared code
    api/               # ky client, getApiError
    constants/         # env, navigation
    hooks/             # e.g. useMediaQuery
    ui/                # shared UI
    utils/             # storage, getFirstLetter
    assets/            # static assets (e.g. Google SVG)
  modules/             # feature modules (domain UI + logic)
    auth/              # currently the only full module
  pages/               # thin page components composed by routes
```

**Path aliases** (prefer `~/` over long relative imports):

- `~/` → `src/`
- `~/pages/*`, `~/modules/*`, `~/common/*` also mapped explicitly

**Routing model:**

- File routes under `src/app/routes/` via `@tanstack/router-plugin`
- Generated tree: `src/app/routeTree.gen.ts` (do not hand-edit)
- Route components often use local `function RouteComponent()` and import page/module UI
- Layout route `/_app` wraps authenticated app chrome (`Layout`)
- Auth layout `/auth` wraps `AuthShell` and redirects authenticated users away
- Router context carries `auth` (Zustand) and `queryClient`

## Tech stack

| Layer           | Choice                                                    |
| --------------- | --------------------------------------------------------- |
| Runtime         | React 19, TypeScript                                      |
| Bundler / dev   | Vite 8, React Compiler (Babel preset), `vite-plugin-svgr` |
| Router          | TanStack Router (file-based, auto code-splitting)         |
| Server state    | TanStack Query                                            |
| Client state    | Zustand                                                   |
| HTTP            | ky (`credentials: 'include'`)                             |
| Forms           | react-hook-form + Zod + `@hookform/resolvers`             |
| UI kit          | Shadcn                                                    |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)                     |
| Icons           | lucide-react                                              |
| Font            | Geist Variable                                            |
| Env validation  | `@t3-oss/env-core` + Zod                                  |
| Lint / format   | oxlint, oxfmt                                             |
| Package manager | bun (lockfile in package)                                 |
| Tests           | vitest (available; not heavily used yet)                  |

## Code conventions

- **Do not write comments in code** (`//`, `/* */`, JSDoc) unless the user explicitly asked. Code and names should be self-explanatory. Exception — only what the user requested to add.
- Use TypeScript and strict types; path `~/` maps to `src/` and should be preferred over long relative imports. Use `import type` for type-only imports.
- **Never import React types** (`ComponentProps`, `ReactNode`, `CSSProperties`, `PropsWithChildren`, `ComponentType`, etc.) from `'react'`. Use the global `React.*` namespace with **no type import** — e.g. `React.ComponentProps<'div'>`, `React.ReactNode`. Runtime APIs still need normal imports: `import { useState, useMemo } from 'react'`. Never write `import * as React from 'react'` only for types.

```ts
// ✅ good
export const Input = (props: React.ComponentProps<'input'>) => { ... }

// ❌ bad
import type { ComponentProps } from 'react'
export const Input = (props: ComponentProps<'input'>) => { ... }

// ❌ bad
import * as React from 'react'
```

- Primary convention: named exports and arrow components/functions (`export const Component = () => {}`). Local route components in existing code use `function RouteComponent()`; do not rewrite that without reason, but follow the primary convention in new shared code.
- Do not use default export for app code. Exceptions exist for required Vite / oxfmt / oxlint config and TanStack Query devtools — not a template for modules.
- Use `??` for fallback only on `null`/`undefined`; do not replace intentional falsy logic with it.
- Conditional React render: use `condition && <Component />`, never `condition ? <Component /> : null`.
- Format (oxfmt): no `;`, single quotes, trailing commas, print width 100, 2 spaces. oxfmt sorts imports and Tailwind classes (`sortImports`, `sortTailwindcss`). Import order intent: React → React DOM → TanStack → third-party → `~/` → relative.
- Prefer existing module layout over ad-hoc folders at `src/` root.

## Environment variables

Validated by `src/common/constants/env.ts` via `@t3-oss/env-core`.

Client variables (must use `VITE_` prefix):

- `VITE_BASE_URL` — base URL for the ky API client

## Design system

### Philosophy

- Quiet, personal archive — not a loud social feed or generic SaaS dashboard.
- Brand is purple OKLCH accent on soft body/block surfaces; light and dark themes share the same accent hue.
- Prefer restraint: semantic tokens, large soft radii, clear hierarchy, minimal chrome outside the shell.
- Product copy and UI should support “media as life”, not only ratings tables.

Interactive control patterns (sizes, variants, props) are documented — see [`DESIGN.md`](./DESIGN.md).

## Feature modules

Feature code belongs in `src/modules/<name>/`, not in routes or random `components/` trees.

Reference layout (`auth`):

```
modules/auth/
  api/           # auth.api.ts — HTTP calls via ~/common/api
  components/    # UI specific to the module
  hooks/         # form + mutation hooks
  schema/        # Zod schemas + inferred types
  store/         # Zustand store when needed
  types/         # domain types
  utils/         # pure helpers (e.g. applyApiFormError)
  index.ts       # barrel: export *
```

Rules:

- Public imports from other layers should go through the module barrel when practical.
- Routes stay thin: load guards + render module/page components.
- New domains (library, discover, life) should follow the same shape rather than inventing a new folder taxonomy.

## Routes and product areas

File routes: `src/app/routes/`. Many authenticated destinations are still scaffold placeholders; product intent is documented so agents implement the right thing.

| Area     | Paths                                                                                          | Intent                                                         | Status (frontend)          |
| -------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------- |
| Auth     | `/auth/login`, `/auth/register`, `/auth/forgot-password`                                       | Sign-in, sign-up, reset                                        | Implemented UI + API hooks |
| Welcome  | `/welcome`                                                                                     | Username onboarding when account has no username               | Guard + stub page          |
| Home     | `/`                                                                                            | Activity feed / home of the archive                            | Stub                       |
| Discover | `/discover`, `/discover/{movie\|tv_show\|game\|book\|album\|track}`, `.../$externalId`         | Find media to archive by type and external id                  | Route scaffolds            |
| Library  | `/library`, `/library/reviews`, `/library/lists`, `/library/lists/$listId`, `/library/planned` | Personal library, reviews archive, ranked lists, planned queue | Route scaffolds            |
| Life     | `/life`, `/life/timeline`, `/life/wrapped`, `/life/memories`                                   | Media-life story (timeline, recaps, memories); paid            | Guards + scaffolds         |
| Profile  | `/$username`                                                                                   | Public/personal profile by username                            | Stub                       |

## Data and API patterns

- HTTP client: `src/common/api/api.ts` (`ky.create` with `env.VITE_BASE_URL`, `credentials: 'include'`).
- Error normalization: `getApiError` → `{ message, fieldErrors?, status? }`.
- Module APIs: e.g. `authApi.login/register/forgotPassword`.
- Forms: Zod schema → `zodResolver` → mutation hook → `setUser` / navigation; map field errors with helpers like `applyApiFormError`.
- Query defaults: `refetchOnWindowFocus: false`, `retry: false` (see `TanstackQueryProvider`).

## Storage

Persist browser state with `src/common/utils/storage.ts`:

- `getStorageItem(key, zodSchema, fallback)`
- `setStorageItem(key, value)`
- `removeStorageItem(key)`

Do not read/write raw `localStorage` in features without schema validation.

## Agent best practices

- **Reuse first.** Search `src/app/layout`, `src/common/ui`, and `src/modules/**/components` before creating a new component.
- **Do not duplicate.** If a field, shell, nav item, or motion wrapper exists, extend it.
- **Respect architecture.** Routes thin, modules own domain, common only for true cross-cutting code.
- **Do not invent patterns.** Follow auth/module/layout conventions already in the repo.
- **Do not invent backend contracts.** Align with existing types/schemas or ask; the Nest API is still early.
- **Keep quality.** Type-safe, accessible labels on icon buttons, consistent loading/error states, oxfmt/oxlint clean.
- **Product filter.** Prefer personal-archive value over generic rating-aggregator chrome.
- **No drive-by refactors.** Do not rename the design system, swap UI kits, or “clean up” unrelated files while implementing a feature.
- **Generated files.** Never hand-edit `routeTree.gen.ts`.
- **Comments.** Do not add explanatory comments unless the user asks.
- **Barrels.** `export *` from module `index.ts`.
