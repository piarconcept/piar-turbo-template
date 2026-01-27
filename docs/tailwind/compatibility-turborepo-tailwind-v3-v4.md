# Turborepo and Tailwind CSS Compatibility (v3 vs v4)

## Overview

Turborepo is a high-performance build system for monorepos. Tailwind CSS is a utility-first CSS framework. Tailwind v4 introduces a CSS-first architecture (no `tailwind.config.js` by default) and a faster engine (Oxide). In monorepos, the primary change is class detection: by default Tailwind scans only the current directory and its subfolders, so sibling packages are not detected unless you explicitly include them.

## Key Changes in Tailwind v4

- Configuration
  - v3: `tailwind.config.js` defines content, theme, plugins, etc.
  - v4: CSS-first with `@import "tailwindcss";` and tokens in `@theme`.
- Execution
  - v3: CLI `npx tailwindcss -i ... -o ...`
  - v4: PostCSS plugin `@tailwindcss/postcss` within the bundler.
- Class scanning
  - v3: `content` defines paths.
  - v4: automatic scan limited to the current directory.
- Monorepos
  - v3: add workspace paths to `content`.
  - v4: requires `@source` or `base` in PostCSS.
- Preprocessors
  - v4 favors native CSS; Sass/Less are not recommended.

## Common Monorepo Issues in v4

- Shared components without styles: `packages/ui` is not scanned when building in `apps/web`.
- `base` in PostCSS: older versions required absolute paths.
- VS Code IntelliSense: without `tailwind.config.js`, class detection may be limited.
- Plugin ecosystem: some tooling (e.g., shadcn) still targets v3.

## Monorepo Configuration Options

### 1) Use `@source` in CSS

Recommended by maintainers. It adds extra folders to scan.

Example structure:

- /
  - apps/web/app/globals.css
  - packages/ui/components/Button.tsx
  - packages/ui/styles/tailwind.css

**packages/ui/styles/tailwind.css**

```css
@import 'tailwindcss';
@theme {
  /* design tokens */
}
@source "./components/**/*.{ts,tsx}";
```

Expose CSS from `packages/ui`:

```json
"exports": {
  "./tailwind.css": "./styles/tailwind.css"
}
```

**apps/web/app/globals.css**

```css
@import 'tailwindcss';
@import '@repo/ui/tailwind.css';
@source "../app/**/*.{ts,tsx}";
@source "../../../packages/ui/**/*.{ts,tsx}";
```

### 2) Configure `base` in `@tailwindcss/postcss`

Set the root directory from which Tailwind scans.

**apps/web/postcss.config.mjs**

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      base: process.cwd() + '/../..',
    },
  },
};
export default config;
```

After changing it, clear build cache and rebuild.

### 3) Share tokens and styles

Create a shared package (e.g. `@repo/tailwind-config`) with CSS that imports Tailwind and defines `@theme`. Apps import that CSS in `globals.css`, and UI packages reuse it.

### 4) Minimal per-package setup

For packages that only need Tailwind + PostCSS:

```sh
npm install tailwindcss @tailwindcss/postcss postcss
```

**packages/ui/postcss.config.mjs**

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

**packages/ui/src/styles/globals.css**

```css
@import 'tailwindcss';
```

## Tips for Specific Cases

- VS Code: you can point `tailwindCSS.experimental.configFile` to the main CSS file:

```json
{
  "tailwindCSS.experimental.configFile": "apps/web/app/globals.css"
}
```

- Shadcn UI: the CLI is still v3-based; for v4 you need manual setup.
- Scanning errors: if `node_modules` gets scanned, clear cache or narrow sources with `@source`.

## Recommended Steps for Turborepo + Tailwind v4

1. Create the monorepo (create-turbo or manual).
2. Install Tailwind v4 + `@tailwindcss/postcss` in each consuming package.
3. Add `postcss.config.mjs` and a CSS entry that imports Tailwind.
4. Define tokens with `@theme` (optional).
5. Extend scanning using `@source` or `base`.
6. Import styles in apps (e.g. `globals.css`).
7. Run `pnpm dev` and `pnpm build`.

## Conclusions

Tailwind v4 works with Turborepo, but class scanning must be configured for monorepos. The main solutions are `@source` in CSS or `base` in PostCSS. Centralizing tokens and styles in a shared package improves consistency. The ecosystem is still evolving, so some tools may need extra setup.
