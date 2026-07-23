# Clear Design

Clear Design is a design system and visual direction for building clean, minimal, premium interfaces with Tailwind CSS and shadcn/ui.

The main goal is simple:

The interface should look expensive because every visual decision is controlled.

No random opacity values.
No endless variations of the same color.
No decorative noise.
No inconsistent border radii.
No components that look like they came from different products.

The system should feel calm, precise, structured, and intentional.

## 1. Core Design Philosophy

Clear Design follows five principles.

### 1.1 Clarity over decoration

Every visual element must have a purpose.

Avoid:

* unnecessary gradients
* excessive shadows
* decorative borders
* random background colors
* excessive opacity
* multiple accent colors
* visual noise
* dense layouts without hierarchy

Prefer:

* whitespace
* clear hierarchy
* restrained contrast
* consistent spacing
* predictable component behavior
* strong typography
* simple surfaces

The interface should feel visually quiet.

The user should understand the structure before reading every word.

### 1.2 One visual language

All components must feel like part of the same product.

The following values must come from a centralized system:

* colors
* typography
* spacing
* border radius
* shadows
* borders
* focus states
* component heights

Do not create local visual decisions without a strong reason.

Bad:

```tsx
<div className="bg-primary/20 border-primary/30 rounded-[13px] shadow-[0_4px_20px_rgba(...)]">
```

Good:

```tsx
<div className="bg-accent border border-border rounded-lg shadow-sm">
```

The second implementation is easier to maintain and creates a more consistent interface.

### 1.3 Restraint creates premium quality

Premium interfaces do not need more visual effects.

They need fewer visual effects with better execution.

Use:

* one primary accent
* one neutral surface system
* one border system
* one radius system
* one shadow system
* one spacing system

Do not use opacity as a replacement for proper design tokens.

### 1.4 Hierarchy comes from contrast

Do not create hierarchy with random colors.

Use:

1. typography size
2. typography weight
3. spacing
4. surface color
5. border
6. shadow
7. accent color

Accent color should be reserved for actions and important states.

The primary color should not become the default background for every card, badge, section, and decorative element.

### 1.5 Light and dark themes are separate visual systems

Dark mode is not light mode with inverted colors.

Both themes must be designed intentionally.

Light mode should feel:

* clean
* bright
* spacious
* neutral
* precise

Dark mode should feel:

* deep
* calm
* focused
* soft
* high quality

Avoid pure black and pure white as the default page surfaces.

## 2. Color System

The color system must use semantic tokens.

Components should never depend directly on raw colors.

Avoid:

```tsx
bg-blue-500
text-gray-900
border-white/10
bg-primary/20
bg-primary/90
```

Prefer:

```tsx
bg-background
text-foreground
border-border
bg-muted
bg-accent
text-primary
```

The component should describe the purpose of the color, not the color itself.

## 3. Semantic Color Tokens

Use a limited semantic token system.

### Base tokens

```css
--background
--foreground

--card
--card-foreground

--popover
--popover-foreground

--primary
--primary-foreground

--secondary
--secondary-foreground

--muted
--muted-foreground

--accent
--accent-foreground

--destructive
--destructive-foreground

--border
--input
--ring
```

These tokens should cover most of the interface.

Do not add a new token because a component needs a slightly different gray.

First ask:

Does this represent a new semantic meaning?

If not, use an existing token.

## 4. Opacity Rules

Opacity must be rare and intentional.

Avoid using opacity as a default design tool.

Bad:

```tsx
bg-primary/10
bg-primary/20
bg-primary/30
bg-primary/50
bg-primary/90
text-foreground/70
border-white/10
```

This creates a large number of visual states without a coherent system.

Prefer semantic colors:

```tsx
bg-muted
bg-accent
text-muted-foreground
border-border
```

Opacity is acceptable for:

* overlays
* modal backdrops
* disabled states
* subtle decorative elements
* image overlays
* gradients
* temporary visual effects

Opacity should not replace semantic tokens.

## 5. Recommended Color Architecture

The system should have three visual layers.

### Layer 1. Base

The page itself.

```tsx
bg-background
text-foreground
```

### Layer 2. Surface

Cards, panels, dropdowns, sidebars.

```tsx
bg-card
border-border
```

### Layer 3. Secondary surface

Subtle areas and grouping elements.

```tsx
bg-muted
bg-accent
```

The interface should primarily use these three levels.

Do not create ten different background colors.

## 6. Light Theme

The light theme should avoid pure white everywhere.

Recommended structure:

```css
:root {
  --background: 0 0% 98%;
  --foreground: 222 20% 12%;

  --card: 0 0% 100%;
  --card-foreground: 222 20% 12%;

  --popover: 0 0% 100%;
  --popover-foreground: 222 20% 12%;

  --primary: 222 20% 12%;
  --primary-foreground: 0 0% 100%;

  --secondary: 220 14% 96%;
  --secondary-foreground: 222 20% 16%;

  --muted: 220 14% 96%;
  --muted-foreground: 220 9% 46%;

  --accent: 220 14% 94%;
  --accent-foreground: 222 20% 12%;

  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;

  --border: 220 13% 91%;
  --input: 220 13% 91%;
  --ring: 222 20% 12%;
}
```

The exact values may change depending on the brand color.

The principle should stay the same:

* background is slightly off-white
* cards are clean white
* muted surfaces are soft gray
* text is dark, not pure black
* borders are subtle
* primary actions have strong contrast

## 7. Dark Theme

The dark theme should avoid pure black.

Recommended structure:

```css
.dark {
  --background: 222 20% 8%;
  --foreground: 210 20% 96%;

  --card: 222 18% 11%;
  --card-foreground: 210 20% 96%;

  --popover: 222 18% 11%;
  --popover-foreground: 210 20% 96%;

  --primary: 210 20% 96%;
  --primary-foreground: 222 20% 10%;

  --secondary: 222 15% 16%;
  --secondary-foreground: 210 20% 96%;

  --muted: 222 15% 15%;
  --muted-foreground: 215 12% 65%;

  --accent: 222 15% 17%;
  --accent-foreground: 210 20% 96%;

  --destructive: 0 62% 45%;
  --destructive-foreground: 210 20% 96%;

  --border: 222 14% 20%;
  --input: 222 14% 20%;
  --ring: 215 20% 80%;
}
```

Dark mode should use multiple layers of dark surfaces.

Example:

```text
Page
↓
Background
↓
Card
↓
Elevated Card
↓
Popover / Dialog
```

Do not make every surface the same color.

A good dark interface has subtle depth without heavy shadows.

## 8. Primary Color

The primary color should have a clear job.

Use it for:

* primary buttons
* active navigation
* selected states
* links
* important indicators
* brand identity

Do not use the primary color for:

* every card background
* every badge
* every section
* decorative gradients
* large background areas without a clear reason

The primary color should be recognizable because it is used selectively.

## 9. Accent Color

Accent is a secondary visual tool.

Use it for:

* hover backgrounds
* selected menu items
* subtle highlights
* grouped interactive areas

The accent should remain visually quiet.

Avoid:

```tsx
bg-primary/20
```

Prefer:

```tsx
bg-accent
```

This keeps the design stable across light and dark themes.

## 10. Typography

Typography should create hierarchy before color does.

Recommended hierarchy:

```text
Display
↓
Heading
↓
Subheading
↓
Body
↓
Muted text
↓
Metadata
```

Example:

```text
text-4xl font-semibold
text-2xl font-semibold
text-lg font-medium
text-base
text-sm text-muted-foreground
text-xs text-muted-foreground
```

Avoid excessive font weights.

Use:

* 400 for body text
* 500 for labels and UI elements
* 600 for headings
* 700 only for strong emphasis

Most interfaces should rely on 400, 500, and 600.

## 11. Typography Rules

Headings should be compact and clear.

Avoid overly large headings unless the page is specifically designed around a hero section.

Good:

```tsx
<h1 className="text-3xl font-semibold tracking-tight">
```

Bad:

```tsx
<h1 className="text-7xl font-black tracking-[-0.08em]">
```

Use negative letter spacing carefully.

Recommended:

```tsx
tracking-tight
```

Do not manually create extreme letter spacing for every heading.

## 12. Spacing System

Use the Tailwind spacing scale.

Do not create random values such as:

```tsx
p-[13px]
gap-[19px]
mt-[27px]
```

Prefer:

```tsx
p-3
p-4
p-6
gap-4
gap-6
mt-8
```

The layout should use a limited spacing vocabulary.

Recommended values:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

The most common spacing should be:

```text
8px
12px
16px
24px
32px
```

## 13. Border Radius

Use a consistent radius system.

Recommended:

```text
rounded-md
rounded-lg
rounded-xl
rounded-2xl
```

Do not mix:

```text
rounded-[7px]
rounded-[11px]
rounded-[13px]
rounded-[17px]
rounded-[21px]
```

Recommended usage:

```text
Buttons: rounded-md
Inputs: rounded-md
Cards: rounded-xl
Dialogs: rounded-xl
Large containers: rounded-2xl
Pills: rounded-full
```

The radius should communicate the component category.

## 14. Borders

Borders should define structure, not decorate the interface.

Use:

```tsx
border border-border
```

Avoid:

```tsx
border-white/10
border-primary/30
border-gray-200/70
```

A border should be subtle but visible.

Do not add borders to every element.

Use borders for:

* cards
* inputs
* tables
* separators
* dialogs
* navigation containers

Use spacing instead of borders when the structure is already clear.

## 15. Shadows

Use a small shadow system.

Recommended:

```text
shadow-sm
shadow-md
shadow-lg
```

Most components should use:

```tsx
shadow-none
```

or:

```tsx
shadow-sm
```

Use stronger shadows only for elevated surfaces:

* dropdowns
* dialogs
* popovers
* floating panels

Avoid custom shadow values unless the design specifically requires them.

## 16. Surface Hierarchy

Every page should have a clear surface hierarchy.

Example:

```text
Page
  background
    section
      card
        interactive element
```

Each layer should differ through:

* background
* border
* spacing
* elevation

Do not use color alone to create every layer.

## 17. Component Design

Components should be simple and predictable.

A component should have:

* clear default state
* clear hover state
* clear active state
* clear focus state
* clear disabled state
* clear error state when relevant

Do not create multiple visual variants without a real use case.

For example, buttons should usually have:

```text
default
secondary
outline
ghost
destructive
```

Do not create:

```text
blue
purple
green
dark
light
soft
premium
special
```

unless these variants represent real product semantics.

## 18. Buttons

Buttons should have clear hierarchy.

Primary:

```tsx
<Button>
  Continue
</Button>
```

Secondary:

```tsx
<Button variant="secondary">
  Cancel
</Button>
```

Outline:

```tsx
<Button variant="outline">
  Learn more
</Button>
```

Ghost:

```tsx
<Button variant="ghost">
  More
</Button>
```

Do not make every button visually loud.

A page should have one clear primary action.

## 19. Cards

Cards should not all look like isolated boxes.

Use cards when content needs visual grouping.

Good card:

```tsx
<Card>
  <CardHeader />
  <CardContent />
</Card>
```

Avoid:

```tsx
<Card className="bg-primary/10 border-primary/20 shadow-lg">
```

Prefer:

```tsx
<Card className="border-border">
```

The card should rely on:

* spacing
* typography
* hierarchy
* subtle border

Cards should not compete with the main page action.

## 20. Navigation

Navigation should feel stable and quiet.

Use:

* clear active state
* consistent spacing
* subtle hover state
* limited visual noise

Recommended active state:

```tsx
bg-accent text-accent-foreground
```

Avoid:

```tsx
bg-primary/20 text-primary border-primary/30
```

The navigation should support the content.

It should not become the most visually dominant element on the page.

## 21. Forms

Forms should be predictable.

Inputs should use:

```tsx
bg-background
border-input
text-foreground
placeholder:text-muted-foreground
focus-visible:ring-ring
```

Avoid custom colors for every input state.

The hierarchy should be:

```text
Label
↓
Input
↓
Description
↓
Error
```

Use consistent vertical spacing.

## 22. Empty States

Empty states should be calm.

Use:

* simple icon
* short title
* short explanation
* one primary action

Avoid large decorative illustrations unless they serve a real product purpose.

Example structure:

```text
[Icon]

No projects yet

Create your first project to get started.

[Create project]
```

## 23. Loading States

Loading states should match the component they replace.

Use skeletons for:

* cards
* lists
* tables
* content blocks

Avoid random spinners everywhere.

The loading state should preserve the final layout whenever possible.

## 24. Dark Mode Rules

Every component must work in both themes.

Do not solve dark mode with:

```tsx
dark:bg-black
dark:text-white
dark:border-white/10
```

Prefer semantic tokens:

```tsx
bg-background
text-foreground
border-border
```

This allows the theme system to control the visual result.

Avoid hardcoded colors inside components.

Bad:

```tsx
text-white
bg-black
border-gray-800
```

Good:

```tsx
text-foreground
bg-background
border-border
```

Hardcoded colors are acceptable only for specific semantic states such as:

* success
* warning
* error
* informational status

Even these should preferably use semantic tokens.

## 25. Color Token Migration

When redesigning the existing interface, remove visual inconsistencies systematically.

Search for:

```text
bg-primary/
text-primary/
border-primary/
bg-white/
bg-black/
text-gray-
bg-gray-
border-gray-
shadow-[...]
rounded-[...]
```

Then classify each usage.

Example:

```tsx
bg-primary/20
```

Possible replacements:

```tsx
bg-accent
bg-muted
bg-secondary
```

Example:

```tsx
text-foreground/70
```

Possible replacement:

```tsx
text-muted-foreground
```

Example:

```tsx
border-primary/30
```

Possible replacement:

```tsx
border-border
```

Do not blindly replace every value.

The goal is to remove accidental visual variation.

## 26. Visual Density

The interface should have enough whitespace to separate concepts.

Use more spacing between:

* page sections
* card groups
* form groups
* navigation areas

Use less spacing between:

* label and input
* title and description
* icon and text
* related controls

A useful rule:

Small spacing groups related elements.

Large spacing separates different concepts.

## 27. Layout

Use a strong content width system.

Recommended:

```text
max-w-7xl
max-w-6xl
max-w-5xl
max-w-4xl
```

Avoid arbitrary container widths.

The page should have:

```text
global page padding
↓
content container
↓
section spacing
↓
component spacing
```

Example:

```tsx
<main className="px-4 py-6 md:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">
    ...
  </div>
</main>
```

## 28. Responsive Design

Mobile is not a smaller desktop layout.

At smaller sizes:

* reduce visual density
* simplify navigation
* reduce horizontal padding
* stack content
* preserve hierarchy
* keep touch targets comfortable

Do not hide important content only because the screen is smaller.

## 29. Animation

Animation should communicate state.

Use animation for:

* opening and closing
* hover feedback
* focus feedback
* loading
* layout changes

Avoid animation for decoration.

Recommended:

```text
150ms to 200ms
ease-out
```

The interface should feel responsive, not animated.

Avoid:

* excessive bounce
* long transitions
* constant movement
* decorative floating elements

## 30. Premium Visual Quality Checklist

Before considering a page complete, check:

* Is there one clear primary action?
* Is the visual hierarchy obvious?
* Are there unnecessary colors?
* Are there unnecessary borders?
* Are there unnecessary shadows?
* Are there random opacity values?
* Are there arbitrary spacing values?
* Are there inconsistent border radii?
* Does the page work in dark mode?
* Does the page work without gradients?
* Do all components feel like part of one product?
* Is the page visually calm?
* Does the interface rely on spacing and typography before decoration?

If the answer is no, simplify the design.

## 31. Hard Rules

The following rules are mandatory.

Do not use random opacity values for design tokens.

Do not use raw Tailwind colors inside reusable components.

Do not use arbitrary spacing values unless the layout requires a precise value.

Do not use arbitrary border radius values.

Do not create new colors for small visual differences.

Do not use gradients by default.

Do not use shadows by default.

Do not use the primary color as a general-purpose background.

Do not make every component visually prominent.

Do not use pure black as the default dark background.

Do not use pure white as the default light page background.

Do not create a new component variant without a semantic reason.

Do not solve bad hierarchy with more color.

Do not solve bad spacing with more borders.

Do not solve bad typography with more font weights.

## 32. Definition of Done

A redesigned page is complete when:

1. Every color has a semantic purpose.
2. Light and dark themes both feel intentional.
3. Components use semantic tokens instead of raw colors.
4. Opacity usage is limited.
5. Spacing follows a consistent scale.
6. Border radii follow a consistent system.
7. Shadows are restrained.
8. Typography creates clear hierarchy.
9. The primary action is obvious.
10. The page looks coherent without decorative effects.
11. The interface feels calm and precise.
12. Every component looks like part of the same product.

Clear Design is based on one core principle:

The interface should look premium because the system is consistent, not because the interface contains more decoration.
