# SiftRate UI design system

Agent guide for shared UI primitives. Match **`Button`** / **`Input`** for interactive controls;

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

## Alignment rules (Button ↔ Input)

1. **Same height at the same `size`** — a default Input next to a default Button should share `h-10`.
2. **Same radius** — `rounded-3xl` on both.
3. **Same motion** — `duration-300`.
4. **Secondary surface is the “quiet fill”** — secondary buttons and default inputs should feel related.
5. **Boolean public API uses `is*`** — `isDisabled`, `isLoading`, `isIconOnly`, `isInvalid`.

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
- [ ] Does not invent a third visual language beside Button/Input
