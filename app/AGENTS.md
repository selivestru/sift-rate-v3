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
- `ReviewVisibility`: `PRIVATE | FRIENDS | PUBLIC` — product contract for future review visibility.

## Monorepo structure

Repository root: `siftrate/` (parent of this `app/` package).

| Path                | Role                        | Notes                                                                            |
| ------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `app/`              | Frontend SPA (this package) | Vite + React. Primary UI and agent work.                                         |
| `api/`              | Backend API                 | NestJS. Early scaffold (`AppModule` + config); domain modules still to be built. |
| `landing/`          | Marketing landing           | Placeholder directory; not implemented yet.                                      |
| root `package.json` | Repo tooling                | Husky + lint-staged for `app/**` and `api/**`.                                   |

There are **no shared `packages/*` workspaces** and no Turborepo/pnpm-workspace setup. Do not invent shared packages unless the user asks to extract them.

Root lint-staged:

- `app/**/*.{js,jsx,ts,tsx,json,css,scss}` → `oxfmt` / `oxlint` in `app/`
- `api/**/*.{js,ts}` → eslint / prettier in `api/`

## App source architecture

```
src/
  app/                 # application shell
    main.tsx           # entry
    globals.css        # Tailwind + HeroUI + theme tokens + motion keyframes
    layout/            # Layout, Header, Main, Sidebar, NavDrawer, Navigation, Profile, AppBackdrop
    providers/         # Query, Router, Animation, Toast
    routes/            # TanStack file routes (generates routeTree.gen.ts)
  common/              # cross-feature shared code
    api/               # ky client, getApiError
    constants/         # env, navigation
    hooks/             # e.g. useMediaQuery
    ui/                # shared UI (BlurMorph)
    utils/             # storage, getFirstLetter
    assets/            # static assets (e.g. Google SVG)
  modules/             # feature modules (domain UI + logic)
    auth/              # currently the only full module
  pages/               # thin page components composed by routes
```

**Path aliases** (prefer `~/` over long relative imports):

- `~/` → `src/`
- `~/pages/*`, `~/modules/*`, `~/common/*` also mapped explicitly

**Providers stack** (`src/app/providers/Providers.tsx`):

1. `TanstackQueryProvider`
2. `AnimationProvider` (`LazyMotion` + `domMax` + `strict`)
3. `TanstackRouterProvider` (router context: `auth`, `queryClient`)
4. `Toast.Provider`

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
| UI kit          | HeroUI v3 (`@heroui/react`, `@heroui/styles`)             |
| Styling         | Tailwind CSS v4 (`@tailwindcss/vite`)                     |
| Motion          | `motion` (`motion/react`)                                 |
| Icons           | lucide-react                                              |
| Font            | Geist Variable                                            |
| Env validation  | `@t3-oss/env-core` + Zod                                  |
| Lint / format   | oxlint, oxfmt                                             |
| Package manager | bun (lockfile in package)                                 |
| Tests           | vitest (available; not heavily used yet)                  |

This is a **client-side SPA**, not SSR. Do not introduce Next.js / TanStack Start / shadcn patterns unless explicitly requested.

## Code conventions

- **Do not write comments in code** (`//`, `/* */`, JSDoc) unless the user explicitly asked. Code and names should be self-explanatory. Exception — only what the user requested to add.
- Use TypeScript and strict types; path `~/` maps to `src/` and should be preferred over long relative imports. Use `import type` for type-only imports.
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

### Components

- **Prefer HeroUI** primitives (`Button`, `TextField`, `Drawer`, `Dropdown`, `Avatar`, `Chip`, `Alert`, `Spinner`, etc.).
- Reuse existing app primitives before creating new ones:
  - Layout: `src/app/layout/*`
  - Auth form building blocks: `AuthShell`, `AuthFormHeader`, `AuthTextField`, `PasswordField`, `AuthFormAlert`, `AuthDivider`, `GoogleAuthButton`
  - Motion wrappers: `BlurMorph*`
- Do **not** add a second UI kit (shadcn, MUI, etc.) or duplicate HeroUI wrappers without a clear gap.
- Use `cn` from `@heroui/styles` when composing class names.
- Icons: lucide-react; keep stroke/size consistent with nearby UI (`size-4` / `size-5` patterns).

### Colors

Defined in `src/app/globals.css` (light + dark) and exposed to Tailwind.

| Token / class                                        | Role                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `bg-body` / `--body`                                 | Page canvas behind the shell                                    |
| `bg-block` / `--block`                               | Elevated panels (header, sidebar, content card, auth form card) |
| `text-foreground`                                    | Primary text                                                    |
| `text-muted`                                         | Secondary text                                                  |
| `bg-accent` / `text-accent` / `accent-foreground`    | Brand actions and highlights                                    |
| `border-border`                                      | Default borders                                                 |
| `surface` / `surface-secondary` / `surface-tertiary` | HeroUI surface scale                                            |
| `danger` / `success` / `warning`                     | Status                                                          |

Rules:

- Prefer semantic utilities (`bg-block`, `text-muted`, `bg-accent`) over raw hex/oklch in feature UI.
- Raw OKLCH is acceptable only for established brand atmosphere (e.g. `AppBackdrop`, auth blobs) — copy those patterns rather than inventing a new palette.
- Nav item accent colors in `navigation.ts` are intentional per-item metadata; do not scatter one-off brand colors elsewhere without reason.

### Typography

- Font: Geist Variable (`--font-sans`), applied on `body`.
- Titles: `font-semibold` + `tracking-tight`; page-level titles often `text-2xl`–`text-4xl`.
- Body / supporting: `text-sm` / `text-base` with `text-muted` and relaxed leading where copy matters.
- Use `text-balance` / `text-pretty` for marketing-like headings and paragraphs (auth brand panel is the reference).

### Cards and surfaces

There is no separate media-card component library yet. Existing surface pattern:

- Elevated block: `bg-block border-border rounded-2xl` or `rounded-3xl`
- App content column and header use large radius on desktop; mobile often drops radius/borders for edge-to-edge chrome
- Auth form card: `max-w-105`, padding `p-6 sm:p-8`, optional subtle radial glow behind the card
- Prefer one clear content surface inside `Main` rather than nested competing cards

When building media grids later, extend this language (block surface, border, large radius, muted meta text) instead of inventing a flat Material-style card system.

### Building pages

- Authenticated pages render **inside** `Layout` → `Main` content column. Do not re-implement header/sidebar/backdrop on feature pages.
- Shell width is `max-w-5xl` centered; content lives in the right grid column on desktop.
- Header height token: `--header-height` (64px). Sticky offsets for sidebar already account for it.
- Auth pages use `AuthShell` only (no app `Layout`).
- Keep page components thin (`src/pages/*` or module components); put domain logic in `src/modules/<feature>/`.

## BlurMorph and motion

Shared helpers live in `src/common/ui/BlurMorph.tsx`.

| Component                                     | Use when                                                                                                         |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `BlurMorphList` + `BlurMorphListItem`         | Dynamic lists that add/remove items. Uses `layout`, `AnimatePresence mode="popLayout"`, staggered children.      |
| `BlurMorphSections` + `BlurMorphSectionsItem` | Static or mostly-static section reveals (auth shell, nav, multi-block forms). Uses `whileInView` once + stagger. |

Item motion: opacity + blur + slight scale (`0.98` → `1`), duration ~0.3s.

**motion/react rules (required):**

- App wraps UI in `LazyMotion` with `features={domMax}` and **`strict`**.
- Always import and use **`m`** (`import { m, AnimatePresence, ... } from 'motion/react'`), never the full `motion` component — strict mode will break otherwise.
- Prefer existing `BlurMorph*` wrappers over one-off variants for the same blur-in pattern.
- Use `AnimatePresence` only when elements must exit-animate (lists, success/state swaps). Forgot-password success state is a good reference.
- Dropdown popovers already use CSS blur-morph (`animate-blur-morph-in/out` on `.dropdown__popover`) in `globals.css` — do not fight that with a second animation system.
- Respect `prefers-reduced-motion` for decorative loops (see `.auth-blob`); keep feature transitions subtle.
- Do not add heavy page-transition frameworks or random spring physics that clash with the soft blur-morph language.

## UI architecture

### Shell

| Piece         | Path                     | Role                                                                   |
| ------------- | ------------------------ | ---------------------------------------------------------------------- |
| `AppBackdrop` | `layout/AppBackdrop.tsx` | Fixed atmospheric background (gradients, dots, blobs) under all routes |
| `Layout`      | `layout/Layout.tsx`      | Column shell: Header + Main                                            |
| `Header`      | `layout/Header.tsx`      | Sticky brand bar, mobile menu trigger, profile menu                    |
| `Main`        | `layout/Main.tsx`        | Desktop grid: Sidebar + content surface                                |
| `Sidebar`     | `layout/Sidebar.tsx`     | Desktop navigation panel (`max-md:hidden`)                             |
| `NavDrawer`   | `layout/NavDrawer.tsx`   | Mobile navigation (HeroUI Drawer, left, blur backdrop)                 |
| `Navigation`  | `layout/Navigation.tsx`  | Shared nav links; used by Sidebar and NavDrawer                        |
| `Profile`     | `layout/Profile.tsx`     | Avatar dropdown (profile / logout)                                     |

**Responsive nav:** desktop = permanent sidebar; mobile = header menu button + drawer. Keep both wired to the same `Navigation` + `navItems` source.

### Navigation config

Single source: `src/common/constants/navigation.ts`.

Top-level areas: Home, Discover, Library (Ratings / Lists / Planned), Life (Timeline / Wrapped / Memories, subscription-gated), Wheel.

- `subscriptionRequired` items show a lock and disable navigation for `FREE` users.
- Life route group also guards in `beforeLoad` (redirect to `/` when free / unauthenticated).
- When adding a section, update `navItems` and add matching file routes — do not hardcode parallel menus.

### Auth UI

- Layout: `AuthShell` + `AuthBrandPanel` (brand story on large screens).
- Forms: `LoginForm`, `RegisterForm`, `ForgotPasswordForm` with shared field components.
- Patterns: Google CTA → divider → email form; server errors via `AuthFormAlert` + field errors via RHF; loading via HeroUI `Spinner` on submit buttons.

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
- New domains (library, discover, wheel, life) should follow the same shape rather than inventing a new folder taxonomy.

## Routes and product areas

File routes: `src/app/routes/`. Many authenticated destinations are still scaffold placeholders; product intent is documented so agents implement the right thing.

| Area     | Paths                                                                                          | Intent                                                         | Status (frontend)          |
| -------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------- |
| Auth     | `/auth/login`, `/auth/register`, `/auth/forgot-password`                                       | Sign-in, sign-up, reset                                        | Implemented UI + API hooks |
| Welcome  | `/welcome`                                                                                     | Username onboarding when account has no username               | Guard + stub page          |
| Home     | `/`                                                                                            | Activity feed / home of the archive                            | Stub                       |
| Discover | `/discover`, `/discover/{movie\|tv_show\|game\|book\|album\|track}`, `.../$externalId`         | Find media to archive by type and external id                  | Route scaffolds            |
| Library  | `/library`, `/library/ratings`, `/library/lists`, `/library/lists/$listId`, `/library/planned` | Personal library, ratings archive, ranked lists, planned queue | Route scaffolds            |
| Life     | `/life`, `/life/timeline`, `/life/wrapped`, `/life/memories`                                   | Media-life story (timeline, recaps, memories); paid            | Guards + scaffolds         |
| Wheel    | `/wheel`                                                                                       | Personal decision wheel tool                                   | Stub page                  |
| Profile  | `/$username`                                                                                   | Public/personal profile by username                            | Stub                       |

Auth notes:

- `/auth` redirects authenticated users to `/`.
- `/_app` protected `beforeLoad` is prepared but currently commented while auth is finalized; do not remove the intended guard without reason.
- Mock user may exist in `auth.store` for local UI work — replace carefully when wiring real session bootstrap.

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
- **Do not redesign by default.** Match existing spacing, radii, tokens, and HeroUI usage. Visual changes need a product reason.
- **Do not invent patterns.** Follow auth/module/layout conventions already in the repo.
- **Do not invent backend contracts.** Align with existing types/schemas or ask; the Nest API is still early.
- **Keep quality.** Type-safe, accessible labels on icon buttons, consistent loading/error states, oxfmt/oxlint clean.
- **Product filter.** Prefer personal-archive value over generic rating-aggregator chrome.
- **No drive-by refactors.** Do not rename the design system, swap UI kits, or “clean up” unrelated files while implementing a feature.
- **Generated files.** Never hand-edit `routeTree.gen.ts`.
- **Comments.** Do not add explanatory comments unless the user asks.
- **Barrels.** `export *` from module `index.ts`.

## What not to assume

- Not SSR / Next.js / TanStack Start.
- Not shadcn/ui.
- Not a packages monorepo with shared UI library.
- Not a finished media domain layer — most discover/library/life pages are scaffolds.
- Sidebar is still part of the desktop shell; mobile uses drawer. Document and implement the **current** dual pattern unless the user asks to change it.
