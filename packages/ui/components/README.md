# @piar/ui-components

Shared UI components library for the PIAR monorepo, built with React and Tailwind CSS v4.

## Purpose

This package provides reusable UI components that can be used across all applications in the monorepo.

## Philosophy

- **Tailwind-first**: All styling done with Tailwind CSS v4 utility classes
- **Type-safe**: Full TypeScript support with exported types
- **Composable**: Components are designed to be composed together
- **Accessible**: Built with accessibility in mind

## Usage

```tsx
import { Button } from '@piar/ui-components';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

## Development

```bash
# Build the package
pnpm --filter @piar/ui-components build

# Watch mode for development
pnpm --filter @piar/ui-components dev

# Type checking
pnpm --filter @piar/ui-components typecheck

# Linting
pnpm --filter @piar/ui-components lint
```

## Adding New Components

1. Create component file in `src/`
2. Use Tailwind classes for styling
3. Export from `src/index.ts`
4. Use `class-variance-authority` for variant patterns
5. Document usage in this README

## Styling

All components use Tailwind CSS v4. The design tokens are centralized in `@piar/ui-config`.

## Related Packages

- `@piar/ui-config` - Tailwind CSS configuration
- `@piar/layout` - Layout components

## Related Documentation

- [Creating Packages Guide](../../../docs/features/creating-packages.md)
- [Styling Configuration](../../../docs/features/styling-configuration.md)
