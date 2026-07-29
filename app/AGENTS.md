# SiftRate — agent guide

SiftRate is a SPA web platform for a personal media-life archive: movies, TV shows, games, books, albums, and tracks. Users authenticate (email/password + Google), pick a unique username, then search media, rate it, and build a life timeline through media.

Product filter: when decisions are ambiguous, prefer what serves a personal archive over a classic rating aggregator.

## Monorepo structure

Repository root: `siftrate/` (parent of this `app/` package).

| Path                | Role                                                         |
| ------------------- | ------------------------------------------------------------ |
| `app/`              | Frontend SPA (this package) — Vite + React                   |
| `api/`              | Backend API — NestJS                                         |
| `landing/`          | Marketing landing                                            |
| root `package.json` | Repo tooling — Husky + lint-staged for `app/**` and `api/**` |

## Tech stack

| Layer           | Choice                                                  |
| --------------- | ------------------------------------------------------- |
| Runtime         | React 19, TypeScript                                    |
| Bundler / dev   | Vite 8, React Compiler (Babel preset), vite-plugin-svgr |
| Router          | TanStack Router (file-based, auto code-splitting)       |
| Server state    | TanStack Query                                          |
| Client state    | Zustand                                                 |
| HTTP            | ky (`credentials: 'include'`)                           |
| Forms           | react-hook-form + Zod v4 + @hookform/resolvers          |
| UI primitives   | @base-ui/react (shadcn style `base-maia`)               |
| Styling         | Tailwind CSS v4 (@tailwindcss/vite) + tw-animate-css    |
| Icons           | reicon-react                                            |
| Toast           | sonner                                                  |
| Animation       | motion (scoped via MotionProvider)                      |
| Carousel        | embla-carousel-react                                    |
| Font            | Geist Variable                                          |
| Env validation  | @t3-oss/env-core + Zod                                  |
| Lint / format   | oxlint, oxfmt                                           |
| Package manager | bun                                                     |
| Tests           | vitest                                                  |

## Source architecture

```
src/
  app/                 # application shell
    main.tsx           # entry
    globals.css        # Tailwind + theme tokens + motion keyframes
    layout/            # Header, Layout, Main, NavDrawer, Navigation, Profile, Sidebar
    providers/         # TanstackQueryProvider, TanstackRouterProvider, MotionProvider, Providers
    routes/            # TanStack file routes (generates routeTree.gen.ts)
  common/              # cross-feature shared code
    api/               # ky client, getApiError, toastApiError
    assets/            # static assets (icons, SVGs)
    constants/         # env, media-type, navigation, queries-keys
    hooks/             # e.g. useMediaQuery
    theme/             # ThemeProvider, useTheme, accent
    types/             # domain types (media-ref)
    ui/                # shared UI components
    utils/             # cn, storage, applyApiFormError, formatters
  modules/             # feature modules
    auth/ | discover/ | library/ | planned/ | ranked-list/ | review/ | settings/ | user/
```

**Path aliases** (prefer `~/` over long relative imports):

- `~/` → `src/`
- `~/pages/*`, `~/modules/*`, `~/common/*` also mapped explicitly

## Routing

- File routes under `src/app/routes/` via `@tanstack/router-plugin`
- Generated tree: `src/app/routeTree.gen.ts` — never hand-edit
- Route components use local `function RouteComponent()` and import module UI
- Layout `/_app`: authenticated app chrome (`Layout`), redirects to `/welcome` if user has no username
- Auth layout `/auth`: wraps `AuthShell`, redirects authenticated users away
- Router context carries `auth` (Zustand store) and `queryClient`

## Feature modules

Feature code belongs in `src/modules/<name>/`, not in routes or random `components/` trees.

Template layout (varies by module):

```
modules/<name>/
  api/           # HTTP calls via ~/common/api
  components/    # UI specific to the module
  hooks/         # form + mutation hooks
  schema/        # Zod schemas + inferred types
  store/         # Zustand store
  types/         # domain types
  utils/         # pure helpers
  index.ts       # barrel: export *
```

Rules:

- Public imports from other layers should go through the module barrel when practical.
- Routes stay thin: load guards + render module/page components.
- New domains should follow the same shape; do not invent a new folder taxonomy.

Current modules: `auth`, `discover` (search + detail), `library`, `planned`, `ranked-list`, `review`, `settings`, `user`.

## Routes and product areas

File routes: `src/app/routes/`.

| Area     | Paths                                                                                              | Intent                                                 |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Auth     | `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/callback`                         | Sign-in, sign-up, reset, Google OAuth                  |
| Welcome  | `/welcome`                                                                                         | Username onboarding when account has no username       |
| Home     | `/`                                                                                                | Activity feed / home of the archive                    |
| Discover | `/discover`, `/discover/{movie,tv_show,game,book,album,track}`, `/$externalId`                     | Search by type, detail by external ID                  |
| Library  | `/library`, `/library/reviews`, `/library/ranked-list`, `/library/planned`                         | Personal library, reviews, ranked lists, planned queue |
| Settings | `/settings`, `/settings/account`, `/settings/appearance`, `/settings/2fa`, `/settings/danger-zone` | Account settings, theme, 2FA, danger zone              |
| Profile  | `/$username`                                                                                       | Public/personal profile by username                    |

## Data layer

- HTTP client: `src/common/api/api.ts` (`ky.create` with `env.VITE_BASE_URL`, `credentials: 'include'`).
- Error normalization: `getApiError` → `{ message, fieldErrors?, status? }`.
- Module APIs: e.g. `authApi.login/register/forgotPassword`.
- Forms: Zod schema → `zodResolver` → mutation hook → `setUser` / navigation; map field errors with `applyApiFormError`.
- Query defaults: `refetchOnWindowFocus: false`, `retry: false`, `staleTime: Infinity` (see `TanstackQueryProvider`).
- Browser storage: `getStorageItem(key, zodSchema, fallback)`, `setStorageItem(key, value)`, `removeStorageItem(key)`. Do not read/write raw `localStorage` without schema validation.

## Environment

Validated by `src/common/constants/env.ts` via `@t3-oss/env-core`. Single client variable:

- `VITE_BASE_URL` — base URL for the ky API client

## Design system

- Quiet, personal archive — not a loud social feed or generic SaaS dashboard.
- Brand is purple OKLCH accent on soft body/block surfaces; light and dark themes share the same accent hue.
- Prefer restraint: semantic tokens, large soft radii, clear hierarchy, minimal chrome outside the shell.
- Product copy and UI should support "media as life", not only ratings tables.

Interactive control patterns (sizes, variants, props) — see [`DESIGN.md`](./DESIGN.md).

## Code conventions

- **No comments in code** (`//`, `/* */`, JSDoc) unless the user explicitly asked. Code and names should be self-explanatory.
- TypeScript; use `~/` alias over long relative imports. Use `import type` for type-only imports (required by `verbatimModuleSyntax`).
- **Never import React types** (`ComponentProps`, `ReactNode`, `CSSProperties`, `PropsWithChildren`, `ComponentType`, etc.) from `'react'`. Use the global `React.*` namespace with **no type import** — e.g. `React.ComponentProps<'div'>`, `React.ReactNode`. Runtime APIs still need normal imports: `import { useState, useMemo } from 'react'`. Never write `import * as React from 'react'` for types only.

  ```ts
  // ✅ good
  export const Input = (props: React.ComponentProps<'input'>) => { ... }

  // ❌ bad
  import type { ComponentProps } from 'react'
  export const Input = (props: ComponentProps<'input'>) => { ... }

  // ❌ bad
  import * as React from 'react'
  ```

- Named exports and arrow components/functions (`export const Component = () => {}`). Local route components may use `function RouteComponent()` — do not rewrite without reason, but follow the primary convention in new shared code.
- No default export for app code. Exceptions: required Vite / oxfmt / oxlint config and TanStack Query devtools — not a template for modules.
- Use `??` for fallback only on `null`/`undefined`; do not replace intentional falsy logic with it.
- Conditional React render: `condition && <Component />`, never `condition ? <Component /> : null`.
- Format (oxfmt): no `;`, single quotes, trailing commas, print width 100, 2 spaces. oxfmt sorts imports and Tailwind classes (`sortImports`, `sortTailwindcss`). Import order intent: React → React DOM → TanStack → third-party → `~/` → relative.
- Prefer existing module layout over ad-hoc folders at `src/` root.
- Barrels: `export * from './file'` — never named re-exports.

## Domain contracts

- `Subscription`: `FREE | MONTHLY | YEARLY | LIFETIME` — `src/modules/auth/types/user.type.ts`
- `MediaType`: `MOVIE | TV_SHOW | GAME | BOOK | ALBUM | TRACK` — `src/common/constants/media-type.ts`
- `Visibility`: `PRIVATE | FRIENDS | PUBLIC` — `src/modules/review/constants/visibility.ts`

## Agent best practices

- **Reuse first.** Search `src/app/layout`, `src/common/ui`, and `src/modules/**/components` before creating a new component.
- **Respect architecture.** Routes thin, modules own domain, common only for cross-cutting code.
- **No drive-by refactors.** Do not rename the design system, swap UI kits, or clean up unrelated files while implementing a feature.
- **No invent patterns.** Follow existing module/layout conventions. Do not invent backend contracts — align with existing types or ask.
- **Generated files.** Never hand-edit `routeTree.gen.ts`.
- **Quality.** Type-safe, accessible labels on icon buttons, consistent loading/error states, oxfmt/oxlint clean.
- **Product filter.** Prefer personal-archive value over generic rating-aggregator chrome.

## Useful commands

| Command          | Action                              |
| ---------------- | ----------------------------------- |
| `bun run dev`    | Start dev server (port 3000)        |
| `bun run build`  | Type-check (`tsc -b`) + Vite build  |
| `bun run oxc`    | Format fix + lint fix (in sequence) |
| `bun run test`   | Run vitest (`src/**/*.test.ts`)     |
| `bun run doctor` | Run react-doctor                    |

## Potentially outdated rules

These rules are preserved from earlier versions for reconciliation. Do not delete them.

- `components.json` declares `"iconLibrary": "lucide"`, but `lucide-react` is **not** installed. All icon imports use `reicon-react` (79 occurrences). This config may need re-syncing.
