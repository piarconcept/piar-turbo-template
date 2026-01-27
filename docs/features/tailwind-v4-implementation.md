# Tailwind CSS v4 Implementation

## Status

- [x] Completed - Migration to Tailwind CSS v4

## Goal

Migrate the PIAR monorepo to Tailwind CSS v4 with a centralized configuration that works across apps and shared packages.

## Architecture

### Shared Config Package: `@piar/ui-config`

**Location**: `packages/ui/config/`

**Purpose**: Centralized Tailwind v4 CSS-first config and design tokens.

**Contents**:

- `tailwind.css` with `@theme` tokens and base styles
- `postcss.config.mjs` with `@tailwindcss/postcss` and monorepo `base`

**Exports**:

```json
{
  "./tailwind.css": "./tailwind.css",
  "./postcss": "./postcss.config.mjs"
}
```

### UI Components Package: `@piar/ui-components`

**Location**: `packages/ui/components/`

**Purpose**: Shared UI components built with Tailwind v4 utilities.

## Apps Configuration

Both `@piar/web` and `@piar/backoffice`:

- Depend on `@piar/ui-config`
- Use shared PostCSS config
- Import the shared `tailwind.css`
- Include `transpilePackages` for shared packages

Example (`next.config.ts`):

```ts
transpilePackages: [
  '@piar/layout',
  '@piar/messages',
  '@piar/coming-soon',
  '@piar/health-client',
  '@piar/health-configuration',
  '@piar/domain-fields',
  '@piar/domain-models',
  '@piar/ui-config',
  '@piar/ui-components',
];
```

## PostCSS Configuration

Shared config in `@piar/ui-config/postcss`:

```js
{
  plugins: {
    '@tailwindcss/postcss': {
      base: new URL('../../..', import.meta.url).pathname,
    },
    autoprefixer: {},
  },
}
```

The `base` points to the monorepo root so Tailwind scans all shared packages.

## Class Scanning

Primary approach: `base` in PostCSS.

Backup approach: `@source` directives in app `globals.css` to ensure package scanning.

## Design Tokens

Defined in `packages/ui/config/tailwind.css`:

```css
@theme {
  --color-primary: #ec6b38;
  --color-secondary: #262b50;
  --color-background: #ffffff;
  --color-foreground: #262b50;
  --font-family-sans: var(--font-montserrat), ui-sans-serif, system-ui, sans-serif;
}
```

## Base Styles

```css
@layer base {
  html,
  body {
    @apply max-w-full overflow-x-hidden;
  }

  body {
    @apply text-foreground bg-background antialiased;
    font-family: var(--font-family-sans);
  }

  * {
    @apply box-border p-0 m-0;
  }

  a {
    @apply no-underline;
    color: inherit;
  }
}
```

## Migration Pattern

Inline styles to Tailwind utilities.

Example:

```tsx
<div className="flex flex-col min-h-screen">
```

## Responsive Design

Tailwind breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Verification Checklist

- [x] `@piar/ui-config` created and exported
- [x] Apps use shared PostCSS config
- [x] `globals.css` imports Tailwind entry
- [x] `transpilePackages` configured
- [x] No legacy CSS remains

## Troubleshooting

### Classes not applying

1. Ensure `@piar/ui-config` is installed in the app
2. Verify `base` in PostCSS points to the repo root
3. Add `@source` directives in `globals.css`
4. Clear caches: `.next`, `.turbo`, `node_modules/.cache`

### Build failures

1. Run `pnpm turbo build`
2. Confirm dependencies are correct
3. Ensure Tailwind v4 deps are in app devDependencies

## Related Docs

- `../tailwind/compatibility-turborepo-tailwind-v3-v4.md`
- `../tailwind/tailwind-v4-migration-task.md`

## Last Updated

27 January 2026 - English rewrite and alignment with current repo state
