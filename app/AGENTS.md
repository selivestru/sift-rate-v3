# SiftRate — agent guide

SiftRate is an SSR web platform for a personal media-life archive: movies, TV shows, games, books, albums, and tracks. Users sign in with Google, pick a unique username, then get a protected space to search media, rate it, and use related personal tools.

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

Enums:

- `Subscription`: `FREE | MONTHLY | YEARLY | LIFETIME`.
- `MediaType`: `MOVIE | TV_SHOW | GAME | BOOK | ALBUM | TRACK`.
- `ReviewVisibility`: `PRIVATE | FRIENDS | PUBLIC`.

## Code conventions

- **Do not write comments in code** (`//`, `/* */`, JSDoc) unless the user explicitly asked. Code and names should be self-explanatory. Exception — only what the user requested to add.
- Use TypeScript and strict types; path `~/` maps to `src/` and should be preferred over long relative imports. Use `import type` for type-only imports.
- Primary convention: named exports and arrow components/functions (`export const Component = () => {}`). Local route components in existing code use `function RouteComponent()`; do not rewrite that without reason, but follow the primary convention in new shared code.
- Do not use default export for app code. Exceptions exist for required Vite/Prettier/ESLint config and TanStack Query devtools — not a template for modules.
- Use `??` for fallback only on `null`/`undefined`; do not replace intentional falsy logic with it.
- Conditional React render: use `condition && <Component />`, never `condition ? <Component /> : null`.
- Format: no `;`, single quotes, trailing commas, print width 100, 2 spaces. Prettier sorts imports: React → React DOM → TanStack → third-party → `~/` → relative.

## Environment variables

Validated by `src/env.ts` via `@t3-oss/env-core`

Required server variables:

- `VITE_BASE_URL` — public app URL
