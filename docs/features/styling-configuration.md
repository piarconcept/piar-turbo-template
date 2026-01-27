# Styling Configuration

## Purpose

Document the styling approach and CSS configuration for the PIAR monorepo applications.

## Status

- [x] Active - Tailwind CSS v4 with centralized configuration

## Key Decisions

### Tailwind CSS v4 (current)

**Decision**: Use Tailwind CSS v4 across client applications with a shared configuration package.

**Rationale**:

- Centralized design tokens and base styles
- Consistent utilities across apps and shared packages
- Monorepo-friendly scanning via shared PostCSS config

## Current Configuration

### Shared Config Package

- **Package**: `@piar/ui-config`
- **Files**:
  - `packages/ui/config/tailwind.css`
  - `packages/ui/config/postcss.config.mjs`

### App PostCSS Setup

Both client applications use the shared PostCSS config:

```javascript
import config from '@piar/ui-config/postcss';
export default config;
```

### globals.css

Each app imports the shared Tailwind CSS entry:

```css
@import '@piar/ui-config/tailwind.css';
```

## Styling Options

1. **Tailwind CSS (primary)**
2. **CSS Modules** for component-level overrides
3. **CSS Variables** for runtime theming

## Related Documentation

- `tailwind-v4-implementation.md` - Tailwind v4 details and monorepo scanning
- `component-library-development-guide.md` - UI component workflow

## Last Updated

27 January 2026 - Updated to Tailwind v4 shared configuration
