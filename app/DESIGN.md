# SiftRate UI design system

Agent guide for shared UI primitives. Match **`Button`** / **`Input`** / **`Select`** for interactive controls;

Sources:

- `src/common/ui/Button.tsx`
- `src/common/ui/Input.tsx`
- Tokens: `src/app/globals.css`

---

## Product language

Quiet personal media archive — soft surfaces, large pill radii, restrained motion. Not a loud SaaS dashboard. Brand accent is purple (`primary`); fields and secondary actions sit on soft gray (`secondary`).

---

## Shared control metrics

Both Button and Input share the same geometry and type rhythm. New interactive controls should lock to this grid.

| Rule           | Value                                                          |
| -------------- | -------------------------------------------------------------- |
| Corner radius  | `rounded-3xl`                                                  |
| Type           | `text-sm font-medium` (`xs` → `text-xs`)                       |
| Transition     | `transition-all duration-300`                                  |
| Default height | `h-10`                                                         |
| Border default | `border border-transparent` (outline variants use real border) |
| Focus          | Always visible — never strip rings                             |
| Disabled       | `opacity-50` + no pointer events                               |

### Size ladder

| Size      | Height | Notes                |
| --------- | ------ | -------------------- |
| `xs`      | `h-7`  | Smaller type on both |
| `sm`      | `h-9`  |                      |
| `default` | `h-10` | Preferred default    |
| `lg`      | `h-11` |                      |

Button also has square icon sizes (`icon`, `icon-xs`, `icon-sm`, `icon-lg`) matching the same heights (`size-10` … `size-7`).

---

## Color roles

Use semantic Tailwind tokens from `globals.css` (light + dark already defined). Do not hardcode hex/oklch in components.

| Token family                                                   | Role                                                                    |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `primary` / `primary-hover` / `primary-foreground`             | Main CTA (solid Button `default`)                                       |
| `primary-soft`                                                 | Soft primary washes elsewhere (not on Button/Input variants themselves) |
| `secondary` / `secondary-hover` / `secondary-foreground`       | Secondary Button + **default Input fill**                               |
| `danger` / `danger-hover` / `danger-foreground`                | Destructive solid Button                                                |
| `danger-soft` / `danger-soft-hover` / `danger-soft-foreground` | Soft danger Button + invalid Input wash                                 |
| `ring`, `border`                                               | Focus / outline chrome                                                  |
| `muted-foreground`                                             | Input placeholder                                                       |
| `foreground`                                                   | Default field text                                                      |

Hover formulas (already in CSS vars): solid colors mix ~90% base + 10% on-color; secondary hover mixes a little foreground into the surface.

---

## Button

**File:** `src/common/ui/Button.tsx`  
**Stack:** Base UI button + `cva` (`buttonVariants`)

### Variants

| Variant       | Look                             | When                              |
| ------------- | -------------------------------- | --------------------------------- |
| `default`     | Solid primary, light label       | Primary action (submit, main CTA) |
| `secondary`   | Soft surface, brand-tinted label | Secondary / quiet actions         |
| `danger`      | Solid danger, light label        | Destructive confirm               |
| `danger-soft` | Soft danger wash                 | Less aggressive destructive       |
| `outline`     | Bordered, light fill             | Low emphasis with edge            |
| `ghost`       | Transparent, muted hover         | Inline / chrome actions           |

### Props (prefer these)

| Prop                    | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `variant`               | Visual style (above)                                                      |
| `size`                  | Height ladder or `icon*`                                                  |
| `isIconOnly`            | Square control; pair with text sizes (`default`/`sm`/…), not only `icon*` |
| `isDisabled`            | Preferred over raw `disabled`                                             |
| `isLoading`             | Disables control, shows spinner; icon-only → spinner only                 |
| `startIcon` / `endIcon` | Icons beside label (`data-icon` for padding)                              |
| `fullWidth`             | `w-full`                                                                  |

### Patterns

```tsx
<Button type="submit" isLoading={isLoading}>Sign in</Button>
<Button variant="secondary">Cancel</Button>
<Button isIconOnly variant="secondary" aria-label="Open menu">
  <MenuIcon />
</Button>
```

- Icon-only needs an accessible name (`aria-label`).
- Do not invent new variants without a product need — extend the table above deliberately.

---

## Input

**File:** `src/common/ui/Input.tsx`  
**Stack:** Base UI input + `cva` (`inputVariants`)

Default field is intentionally the same **soft surface family** as Button `secondary` (filled, not a harsh bordered shadcn box).

### Variants

| Variant   | Look                                                        |
| --------- | ----------------------------------------------------------- |
| `default` | `bg-secondary`, hover `secondary-hover`, transparent border |
| `outline` | Bordered `border-border` + `bg-input/30`                    |

### Sizes

Same ladder as Button: `xs` | `sm` | `default` | `lg`.

### Props

| Prop        | Purpose                                                |
| ----------- | ------------------------------------------------------ |
| `variant`   | `default` \| `outline`                                 |
| `size`      | Height ladder                                          |
| `isInvalid` | Public invalid API — maps to `aria-invalid` internally |

**Do not** pass `aria-invalid` from call sites; use `isInvalid`.

### Patterns

```tsx
<Input placeholder="Email" autoComplete="email" />
<Input size="lg" isInvalid={!!error} />
```

- Invalid styles: soft danger background + danger border/ring (via `aria-invalid` set by the component).
- Focus: ring uses `ring` / `primary` chrome already on the component — keep focus visible.

---

## Alignment rules (Button ↔ Input ↔ Select)

1. **Same height at the same `size`** — a default Input next to a default Button / Select trigger should share `h-10`.
2. **Same radius** — `rounded-3xl` on Button, Input, and Select trigger.
3. **Same motion** — `duration-300`.
4. **Secondary surface is the “quiet fill”** — secondary buttons, default inputs, and default Select triggers should feel related.
5. **Boolean public API uses `is*`** — `isDisabled`, `isLoading`, `isIconOnly`, `isInvalid`.

---

## Select

**File:** `src/common/ui/Select.tsx`  
**Stack:** Base UI select + compound components + `cva` (`selectTriggerVariants`)

Form control for choosing a predefined value. Popup shell matches **DropdownMenu**; trigger matches **Input**.

### Parts

| Export                                            | Role                                                     |
| ------------------------------------------------- | -------------------------------------------------------- |
| `Select`                                          | Root (must export) — value, open, `items`, `disabled`, … |
| `SelectTrigger`                                   | Field-like button; chevron built-in                      |
| `SelectValue`                                     | Selected label / placeholder                             |
| `SelectContent`                                   | Portal + positioner + popup + list + scroll arrows       |
| `SelectItem`                                      | Option + check indicator                                 |
| `SelectGroup` / `SelectLabel`                     | Grouped options (label = group heading inside popup)     |
| `SelectSeparator`                                 | Divider between groups                                   |
| `SelectScrollUpButton` / `SelectScrollDownButton` | Optional; already inside `SelectContent`                 |

Field labels stay outside via `Field` / `Label` (or `aria-label` on the trigger).

### Trigger variants / sizes

Same as Input:

| Prop        | Values                                       |
| ----------- | -------------------------------------------- |
| `variant`   | `default` (soft secondary fill) \| `outline` |
| `size`      | `xs` \| `sm` \| `default` \| `lg`            |
| `isInvalid` | Public invalid API → `aria-invalid`          |

### Content

- Surface: `bg-popover`, `rounded-2xl`, soft ring/shadow (same family as DropdownMenu).
- Items: `rounded-xl`, highlight via `data-highlighted:bg-primary-soft`.
- Positioner defaults: `side="bottom"`, `sideOffset={4}`, `align="center"`, `alignItemWithTrigger={true}` (Base UI item-align mode). For filter-style menus use `alignItemWithTrigger={false}` and often `align="start"`.

### Patterns

```tsx
const items = [
  { value: null, label: 'All' },
  { value: 'movie', label: 'Movie' },
]

<Select value={mediaType} onValueChange={setMediaType} items={items}>
  <SelectTrigger aria-label="Media type">
    <SelectValue placeholder="All" />
  </SelectTrigger>
  <SelectContent alignItemWithTrigger={false} align="start">
    {items.map((item) => (
      <SelectItem key={String(item.value)} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

- Prefer `items` on Root so `SelectValue` shows labels without a custom formatter.
- Icon-only chrome is not the primary use case — full-width or `w-fit` via `className` on the trigger.
- Do not invent a one-off native `<select>` or unstyled Base UI select in features; use this primitive.

---

## Library heroes

Shared page-hero family for Library routes. **Do not invent a fourth header layout** for Reviews / Ranked lists / Planned.

**References:**

| Page         | File                                                     |
| ------------ | -------------------------------------------------------- |
| Reviews      | `src/modules/review/components/ReviewListHero.tsx`       |
| Ranked lists | `src/modules/ranked-list/components/RankedListsHero.tsx` |
| Planned      | `src/modules/planned/components/PlannedHero.tsx`         |

### Shell (required)

| Rule        | Value                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------- |
| Surface     | `rounded-4xl bg-card ring-1 ring-border/50`, `isolate overflow-hidden`                                        |
| Padding     | `px-5 py-6 sm:px-7 sm:py-8`                                                                                   |
| Body layout | Column on mobile; `sm:flex-row sm:items-end sm:justify-between`                                               |
| Left        | Eyebrow → `h1` (`text-3xl sm:text-4xl font-semibold tracking-tight`) → short subtext → optional CTA (`w-fit`) |
| Right       | Optional domain motif → large tabular count (`text-5xl sm:text-6xl`) → metric label                           |
| Loading     | Skeleton on the count when total is unknown (`null` / pending)                                                |
| Empty total | Muted count when `0`                                                                                          |
| Footer      | Hairlines + **domain-only** motif strip                                                                       |
| Atmosphere  | 2–3 radials / soft orbs / low-opacity watermark **inside** the hero                                           |
| Page chrome | No competing full-page radial wash above the hero                                                             |

### Domain accents

| Page         | Accent                                | Eyebrow | Metric         | Right motif       | Footer motif          |
| ------------ | ------------------------------------- | ------- | -------------- | ----------------- | --------------------- |
| Reviews      | `reviewsNavItem.color` (`#F59E0B`)    | Library | reviews logged | Rising score bars | Media-type color dots |
| Ranked lists | `rankedListNavItem.color` (`#3B82F6`) | Library | lists ordered  | Mini podium 2·1·3 | Rank bars             |
| Planned      | `plannedNavItem.color` (`#10B981`)    | Library | in queue       | Queue stack bars  | Rising queue ticks    |

New Library page heroes must reuse this shell and only swap accent, copy, motif, and optional CTA.

---

## Badge

**File:** `src/common/ui/Badge.tsx`

Canonical **soft pill chip**: icon + label, `rounded-full`, `font-semibold`. Not a control height (not the Button `h-10` ladder).

### Sizes

| Size | Look                               |
| ---- | ---------------------------------- |
| `sm` | `text-[10px]`, tighter padding     |
| `md` | default — `text-xs`, `px-2.5 py-1` |

### Variants (token surfaces)

| Variant   | When                        |
| --------- | --------------------------- |
| `default` | Neutral secondary chip      |
| `outline` | Low emphasis / genre tags   |
| `danger`  | Spoilers, destructive meta  |
| `rating`  | Perfect / rating-gold chips |
| `warning` | Caution meta                |
| `blur`    | Over photo / glass overlay  |

### Dynamic accent

| Prop      | Role                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `color`   | Any CSS color (`#…`, `var(--…)`). Soft tint via `color-mix` for bg/border/text. Overrides `variant` surface. |
| `isSolid` | With `color`: solid fill + white label (e.g. media type on posters)                                          |

### Icons

`startIcon` / `endIcon` — same idea as Button. Prefer these over raw SVG children for spacing consistency.

### Domain wrappers (keep)

| Component        | File                 | When                                                                         |
| ---------------- | -------------------- | ---------------------------------------------------------------------------- |
| `MediaTypeBadge` | `MediaTypeBadge.tsx` | Media type chip (`color` from `mediaTypeMeta`, `alternateColor` → `isSolid`) |
| `RatingBadge`    | `RatingBadge.tsx`    | Numeric score with star — not a text label chip                              |

```tsx
<Badge variant="danger" startIcon={<TriangleWarning />}>Spoilers</Badge>
<Badge color={visibility.color} startIcon={<Lock />}>Private</Badge>
<MediaTypeBadge mediaType="MOVIE" />
<RatingBadge rating={8} />
```

Do not invent one-off pill markup for visibility / type / status when Badge covers it.

---

## Agent checklist

When adding or changing a control in this family:

- [ ] Uses tokens from `globals.css`, not ad-hoc colors
- [ ] Height from the size ladder; default `h-10`
- [ ] `rounded-3xl` unless there is a documented exception
- [ ] Focus ring kept
- [ ] Light and dark both readable
- [ ] Public boolean props named `is*`
- [ ] Does not invent a third visual language beside Button/Input/Select
- [ ] Select trigger shares height, radius, and quiet fill with Input at the same `size`
