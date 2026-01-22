# @piar/ui-config

Shared Tailwind CSS v4 configuration package for the PIAR monorepo.

## Purpose

This package provides:
- Centralized Tailwind CSS v4 configuration
- PostCSS configuration optimized for monorepo structure
- Design system tokens defined in `@theme`
- Base styles and resets

## Usage

### In Next.js Apps

1. Install as dependency:
```json
{
  "dependencies": {
    "@piar/ui-config": "workspace:*"
  }
}
```

2. Create `postcss.config.mjs`:
```js
import config from "@piar/ui-config/postcss";
export default config;
```

3. Import CSS in your global styles:
```css
@import "@piar/ui-config/tailwind.css";
```

### In Shared Packages

Packages that use Tailwind classes should have the apps that consume them list them in `transpilePackages`.

## Design Tokens

All design tokens are defined in `tailwind.css` using `@theme`:

- **Colors**: `--color-primary`, `--color-secondary`
- **Typography**: `--font-family-sans`

## Architecture

This package follows Tailwind CSS v4's CSS-first approach:
- No `tailwind.config.js` required
- Configuration via `@theme` in CSS
- Automatic class scanning via `base` in PostCSS plugin

## Monorepo Integration

The PostCSS configuration sets `base` to the monorepo root, ensuring Tailwind scans all packages for class names across the workspace.

## Related Documentation

- [Tailwind v4 Documentation](https://tailwindcss.com/docs)
- [Turborepo Compatibility](../../../docs/tailwind/compatibilidad-turborepo-tailwind-v3-v4.md)
- [Implementation Guide](../../../docs/tailwind/tarea-implementacion-tailwind-v4-monorepo.md)
