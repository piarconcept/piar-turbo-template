# Task: Tailwind CSS v4 Migration in the Monorepo

## Goal

Migrate the monorepo to Tailwind CSS v4 with a centralized architecture in `packages/ui/config`. Remove legacy CSS and ensure client apps transpile shared packages and keep styles consistent.

## Scope

- Create new packages: `packages/ui/config` and `packages/ui/components`
- Integrate Tailwind v4 into:
  - `packages/ui/layout`
  - `packages/ui/components`
  - `packages/features/health/client`
  - `packages/features/comingSoon`
- Update apps:
  - `apps/client/web`
  - `apps/client/backoffice`
- Remove legacy CSS files and their imports

## Rules

- Do not use traditional CSS for layout styling. Use Tailwind utilities.
- Use Tailwind v4 with `@tailwindcss/postcss` only.
- Class scanning must cover shared packages.
- Apps must transpile monorepo packages.

## Step 0 - Preparation

- Confirm the repo uses pnpm (or the manager defined at root).
- Ensure the current build passes before changing styles.

## Step 1 - Create `packages/ui/config`

1. Create the package structure:

- `packages/ui/config/package.json`
- `packages/ui/config/postcss.config.mjs`
- `packages/ui/config/tailwind.css`
- `packages/ui/config/README.md`

2. Expected minimum content:

**package.json**

- `name`: `@piar/ui-config`
- `private`: `true`
- `exports`:
  - `"./tailwind.css": "./tailwind.css"`
  - `"./postcss": "./postcss.config.mjs"`
- `devDependencies`:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `postcss`
  - `autoprefixer`

**tailwind.css**

```css
@import 'tailwindcss';

@theme {
  /* base tokens if needed */
}
```

**postcss.config.mjs**

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {
      base: new URL('../..', import.meta.url).pathname,
    },
    autoprefixer: {},
  },
};
```

Note: `base` must point to the monorepo root so scanning includes all packages.

## Step 2 - Create `packages/ui/components`

1. Create a basic package:

- `packages/ui/components/package.json`
- `packages/ui/components/src/index.ts`

2. Use Tailwind in components (no legacy CSS). This package is the base for shared UI components.

## Step 3 - Remove Legacy CSS

1. Delete CSS files in apps and packages:

- `apps/client/web/src/app/[locale]/globals.css`
- `apps/client/backoffice/src/app/[locale]/globals.css`
- `packages/ui/layout/src/styles.css`
- Any other legacy `.css` in target packages

2. Remove CSS imports from:

- `apps/client/web/src/app/[locale]/layout.tsx`
- `apps/client/backoffice/src/app/[locale]/layout.tsx`
- Any component that imported removed CSS

## Step 4 - Integrate Tailwind in Apps

1. In `apps/client/web` and `apps/client/backoffice`:

- Install dependencies if missing:
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `postcss`
  - `autoprefixer`

2. Replace `postcss.config.mjs` to use the shared config:

```js
import config from '@piar/ui-config/postcss';
export default config;
```

3. Create a new global CSS entry:

```css
@import '@piar/ui-config/tailwind.css';
```

Recommended location: `apps/client/*/src/app/[locale]/globals.css`

4. Ensure the layout imports the new global CSS.

## Step 5 - Integrate Tailwind in Packages

1. In `packages/ui/layout`:

- Migrate styles to Tailwind classes in components.
- Remove `styles.css` and any references.

2. In `packages/features/health/client` and `packages/features/comingSoon`:

- Add Tailwind dependencies if components use classes.
- Migrate any styles to Tailwind classes.

3. In `packages/ui/components`:

- Create components using Tailwind classes from the start.

## Step 6 - Transpile Packages in Apps

Update `apps/client/web/next.config.ts` and `apps/client/backoffice/next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: [
    '@piar/layout',
    '@piar/messages',
    '@piar/coming-soon',
    '@piar/health-client',
    '@piar/health-configuration',
    '@piar/health-api',
    '@piar/domain-fields',
    '@piar/domain-models',
    '@piar/ui-config',
    '@piar/ui-components',
  ],
};
```

## Step 7 - Ensure Class Scanning

Confirm Tailwind v4 scans all packages using `base` in `@tailwindcss/postcss`. If classes are missing, add `@source` in the main CSS:

```css
@import '@piar/ui-config/tailwind.css';
@source '../../../../packages/**/*.{ts,tsx}';
```

Adjust the path as needed.

## Step 8 - Verification

1. Install dependencies:

```sh
pnpm install
```

2. Build packages:

```sh
pnpm -w build
```

3. Run apps:

```sh
pnpm --filter @piar/web dev
pnpm --filter @piar/backoffice dev
```

4. Visual checklist:

- Layout renders correctly in both apps
- Shared package components keep styling
- No FOUC when navigating

## Notes

- Removing legacy CSS requires manual migration to Tailwind utilities.
- If classes are not applied, verify PostCSS `base` and `@source`.
- Keep `@piar/ui-config` as the single source of tokens and plugins.
