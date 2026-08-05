# SiftRate UI design system

Clear Design direction for shared UI. Quiet personal media-life archive — calm, precise, minimal. Not a loud SaaS dashboard.

Sources:

- Skill: `.agents/skills/clear-design/SKILL.md`
- Tokens: `src/app/globals.css`
- Controls: `src/common/ui/Button.tsx`, `Input.tsx`, `Select.tsx`, and peers

---

## Product language

- Surfaces over decoration: spacing, typography, and subtle borders create hierarchy
- Brand purple (`primary`) is selective — CTAs, links, focus ring — not card washes
- Light and dark are intentional separate systems (off-white / deep dark, not pure white/black pages)

---

## Semantic color tokens

Use tokens from `globals.css`. Do not hardcode hex/oklch in reusable components.

| Token                                    | Role                                        |
| ---------------------------------------- | ------------------------------------------- |
| `background` / `foreground`              | Page base                                   |
| `card` / `card-foreground`               | Panels, shells, elevated content            |
| `popover` / `popover-foreground`         | Menus, dialogs, selects                     |
| `primary` / `primary-foreground`         | Main CTA, brand accent (selective)          |
| `secondary` / `secondary-foreground`     | Quiet filled controls                       |
| `muted` / `muted-foreground`             | Secondary surfaces, placeholders, meta text |
| `accent` / `accent-foreground`           | Hover / active nav / subtle highlights      |
| `destructive` / `destructive-foreground` | Destructive actions and errors              |
| `border` / `input` / `ring`              | Structure, fields, focus                    |
| `success` / `warning` / `rating`         | Domain status only                          |

Removed (do not reintroduce):

- `primary-soft`, `primary-hover`, `secondary-hover`
- `danger` / `danger-soft` / `danger-hover` (use `destructive`)
- `surface`, `surface-secondary`, `container`, `body`

Prefer:

```tsx
bg-accent text-accent-foreground
bg-muted text-muted-foreground
border-border
```

Avoid:

```tsx
bg-primary/20 border-primary/30 text-foreground/70 border-white/10
```

Opacity is allowed for overlays, disabled states, image scrims, and intentional media chrome (lightbox, poster gradients). Not as a substitute for tokens.

---

## Shared control metrics

Button, Input, Select trigger, and Textarea share geometry.

| Rule           | Value                                       |
| -------------- | ------------------------------------------- |
| Corner radius  | `rounded-md`                                |
| Type           | `text-sm font-medium` (`xs` → `text-xs`)    |
| Transition     | `transition-colors duration-200`            |
| Default height | `h-10`                                      |
| Focus          | Visible ring (`ring-ring/40`) — never strip |
| Disabled       | `opacity-50` + no pointer events            |

### Size ladder

| Size      | Height |
| --------- | ------ |
| `xs`      | `h-7`  |
| `sm`      | `h-9`  |
| `default` | `h-10` |
| `lg`      | `h-11` |

Icon-only buttons match the same heights (`size-10` … `size-7`).

---

## Radius system

| Use                                            | Class          |
| ---------------------------------------------- | -------------- |
| Buttons, inputs, select triggers               | `rounded-md`   |
| Cards, dialogs, menus                          | `rounded-xl`   |
| Large containers (header, sidebar, main shell) | `rounded-2xl`  |
| Pills / badges / avatars                       | `rounded-full` |

---

## Shadows

| Level                     | When                                           |
| ------------------------- | ---------------------------------------------- |
| none                      | Default for most surfaces                      |
| `shadow-sm`               | Subtle lift (tabs indicator, restrained cards) |
| `shadow-md` / `shadow-lg` | Popovers, dialogs, dropdowns only              |

---

## Spacing

Prefer the Tailwind scale: `p-3`, `p-4`, `p-6`, `gap-4`, `gap-6`, `mt-8`.

Most common: 8 / 12 / 16 / 24 / 32px. Avoid arbitrary `p-[13px]`-style values.

---

## Button

**File:** `src/common/ui/Button.tsx`

### Variants

| Variant            | Look                                | When                               |
| ------------------ | ----------------------------------- | ---------------------------------- |
| `default`          | Solid primary                       | Primary action                     |
| `secondary`        | Soft surface                        | Secondary / quiet                  |
| `outline`          | Bordered, transparent fill          | Low emphasis with edge             |
| `ghost`            | Transparent, accent hover           | Chrome / inline                    |
| `destructive-soft` | Quiet destructive text + soft hover | Icon / secondary delete and remove |
| `destructive`      | Solid destructive                   | Confirm delete / irreversible      |

Use `destructive-soft` for quiet delete/remove actions. Use solid `destructive` for confirm dialogs.

Solid `default` / `destructive` hover darkens via `color-mix(in oklab, var(--token) 88%, black)` — not brightness filters or opacity washes.

Do not add blue/purple/premium variants without a real semantic need.

### Props

| Prop                       | Purpose                          |
| -------------------------- | -------------------------------- |
| `variant` / `size`         | Visual + height ladder or `icon` |
| `isIconOnly`               | Square control                   |
| `isDisabled` / `isLoading` | Preferred public API             |
| `disabled`                 | Deprecated alias; still mapped   |
| `startIcon` / `endIcon`    | Icons beside label               |
| `fullWidth`                | `w-full`                         |

---

## Input / Textarea / Select trigger

| Variant   | Look                              |
| --------- | --------------------------------- |
| `default` | `bg-secondary`, hover `bg-accent` |
| `outline` | `border-input bg-background`      |

Invalid: `border-destructive` + ring (no soft danger wash).

Public API: `isInvalid` (not raw `aria-invalid` from call sites).

Select popup: `bg-popover`, `rounded-xl`, `border-border`, `shadow-lg`. Items highlight with `bg-accent`.

---

## Navigation

Active: `bg-accent text-accent-foreground`  
Hover: `hover:bg-accent hover:text-accent-foreground`

Not `bg-primary/50` or primary soft washes.

**Domain colors on nav config:** `navigation.ts` may define `color` on library children (reviews/lists/planned) and media-type meta for **hubs, heroes, badges, and empty-state icons** — not for sidebar nav chrome. `Navigation.tsx` uses only semantic accent/muted tokens.

---

## Forms

Hierarchy: Label → Input → Description → Error (`text-destructive`).

---

## Cards and shells

| Layer                                                          | Recipe                                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| App chrome (header, sidebar, main)                             | `bg-card border-border rounded-2xl`                                                |
| Content cards (reviews, lists, planned, search, media reviews) | `bg-card border-border rounded-xl` + quiet `hover:bg-accent`                       |
| Empty states                                                   | Same card recipe: icon well + title + body + optional primary action               |
| Dialogs                                                        | `rounded-xl border-border shadow-lg`                                               |
| Drawer (large shell)                                           | `rounded-2xl border-border shadow-lg`; overlay `bg-black/40` (aligned with dialog) |

Content cards must **not** use:

- multi-radial domain atmospheres
- scale/shadow lift on hover
- colored ring ladders (`ring-(--card-accent)/…`)
- nested interactive controls inside `Link` (no nested Button)

### Domain accent policy (allowed residuals)

Runtime domain colors (media type, library section, perfect rating) may appear **only** on:

- badges (`MediaTypeBadge`, `Badge color=…`)
- icons (inline `style={{ color }}` on type icons)
- poster/image scrims (black gradients for title legibility)
- hero metric number tint
- rating chips (`text-rating` / `border-rating` for perfect state)
- restrained **single** radial wash on `ReviewCard` (media-type **or** perfect via `color-mix`; not multi-radial, not solid fills)

Not on full-page washes, nav active states, or other content cards.

---

## Library heroes

Shared shell for Reviews / Ranked lists / Planned:

| Rule       | Value                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| Surface    | `rounded-2xl bg-card ring-1 ring-border`                                   |
| Padding    | `px-5 py-6 sm:px-7 sm:py-8`                                                |
| Layout     | Column → `sm:flex-row` with metric on the right                            |
| Atmosphere | Minimal (optional low-opacity watermark icon) — no full-page radial washes |

Domain accent color may tint the metric number only; keep body chrome neutral.

---

## Empty states

One pattern for library/discover empties:

```text
[icon well: bg-accent text-primary or bg-muted text-muted-foreground]
title (font-semibold)
short body (text-muted-foreground)
optional primary Button
```

Shell: `bg-card border-border rounded-xl border px-4 py-14 text-center`.

---

## Badge

Soft pill: `rounded-full`, icon + label.

| Variant       | When                        |
| ------------- | --------------------------- |
| `default`     | Neutral secondary           |
| `outline`     | Low emphasis                |
| `destructive` | Spoilers / destructive meta |
| `rating`      | Score chips (`text-rating`) |
| `warning`     | Caution meta                |
| `blur`        | Over photo (restrained)     |

Dynamic `color` / `isSolid` for media-type chips. Prefer `MediaTypeBadge` / `RatingBadge` wrappers.

---

## Alert

| Variant       | When    |
| ------------- | ------- |
| `default`     | Neutral |
| `destructive` | Errors  |

---

## Themes

**Light:** off-white background, white cards, dark (not pure black) text, subtle borders.

**Dark:** deep layered dark (not pure black), readable foreground, solid borders (not white/10 stacks).

---

## Agent checklist

- [ ] Semantic tokens only in reusable UI
- [ ] Height from size ladder; default `h-10`
- [ ] Radius matches category (md / xl / 2xl / full)
- [ ] No uncontrolled primary/opacity washes
- [ ] Focus ring kept
- [ ] Light and dark both readable
- [ ] Public booleans named `is*`
- [ ] One visual language with Button / Input / Select
- [ ] Primary used selectively
- [ ] No new variants without semantic reason
