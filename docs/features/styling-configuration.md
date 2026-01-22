# Styling Configuration

## Purpose
Document the styling approach and CSS configuration for the PIAR monorepo applications.

## Status
- [x] Completed - Tailwind CSS removed from project (21 January 2026)
- [x] PostCSS configuration updated

## Key Decisions

### Tailwind CSS Removal (21 January 2026)

**Decision**: Removed Tailwind CSS from the monorepo due to compatibility issues with monorepo structure.

**Rationale**: 
- Tailwind CSS v4 has known issues with monorepo configurations
- Simplified build process by removing complex CSS compilation
- Reduced dependencies and bundle size
- Allows for more flexible styling approaches per application

**Impact**:
- Removed `@piar/tailwind-config` package from `packages/ui/`
- Removed `tailwind.config.ts` from client applications
- Removed Tailwind directives from `globals.css` files
- Updated PostCSS configuration to only use `autoprefixer`

## Current Configuration

### PostCSS Setup

Both client applications (web and backoffice) use a minimal PostCSS configuration:

**File**: `apps/client/{app}/postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    autoprefixer: {},
  },
};

export default config;
```

### CSS Structure

Each Next.js application has its own `globals.css` file:

**Location**: `apps/client/{app}/src/app/[locale]/globals.css`

```css
:root {
  --background: #ffffff;
  --foreground: #262b50;
  --primary: #ec6b38;
  --primary-blue: #262b50;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## Styling Options

### Recommended Approaches

1. **CSS Modules** (Recommended)
   - Built-in Next.js support
   - Component-scoped styles
   - No additional dependencies
   
   ```tsx
   import styles from './Component.module.css';
   
   export function Component() {
     return <div className={styles.container}>Content</div>;
   }
   ```

2. **CSS Variables**
   - Define in `globals.css`
   - Use throughout the application
   - Easy theming support
   
   ```css
   /* globals.css */
   :root {
     --color-primary: #ec6b38;
   }
   
   /* component.module.css */
   .button {
     background: var(--color-primary);
   }
   ```

3. **Styled Components / Emotion**
   - CSS-in-JS solution
   - Dynamic styling
   - Requires additional setup

4. **Plain CSS**
   - Traditional approach
   - No build step needed
   - Global or scoped with CSS Modules

### Utility Classes

The project includes utility class helpers:

**Package**: `clsx` and `class-variance-authority`

```tsx
import { clsx } from 'clsx';
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded px-4 py-2 font-semibold',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      },
      size: {
        sm: 'text-sm',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  }
);
```

## Dependencies

### Current CSS-related Dependencies

**Both applications** (`web` and `backoffice`):
- `autoprefixer`: ^10.4.23 (PostCSS plugin)
- `postcss`: ^8.5.6 (CSS processor)
- `clsx`: ^2.1.1 (Utility for constructing className strings)
- `class-variance-authority`: ^0.7.1 (CVA for variants)

### Removed Dependencies

- ❌ `tailwindcss`
- ❌ `@tailwindcss/postcss`
- ❌ `tailwind-merge`
- ❌ `@piar/tailwind-config` (package removed)

## Adding New Styling Solutions

If you want to add a new styling solution:

### Option 1: Tailwind CSS (If issues are resolved)

```bash
# Install in specific app
cd apps/client/web
pnpm add -D tailwindcss @tailwindcss/postcss

# Create tailwind.config.ts
# Update postcss.config.mjs
# Add directives to globals.css
```

### Option 2: Styled Components

```bash
# Install in specific app
cd apps/client/web
pnpm add styled-components
pnpm add -D @types/styled-components

# Configure in next.config.ts
```

### Option 3: Emotion

```bash
# Install in specific app
cd apps/client/web
pnpm add @emotion/react @emotion/styled
```

## Best Practices

1. **Co-location**: Keep styles close to components
2. **CSS Modules**: Preferred for most components
3. **CSS Variables**: Use for theming and global values
4. **Consistency**: Maintain consistent styling approach within each app
5. **Performance**: Minimize CSS bundle size
6. **Accessibility**: Always consider a11y in styling

## Migration Notes

### Removed Tailwind Classes

If you had Tailwind classes in components, replace them with:
- CSS Modules
- Plain CSS classes
- CSS Variables
- Alternative utility class libraries

### Example Migration

**Before** (with Tailwind):
```tsx
<div className="flex items-center justify-between p-4 bg-blue-500">
  <h1 className="text-2xl font-bold text-white">Title</h1>
</div>
```

**After** (with CSS Modules):
```tsx
// Component.module.css
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--primary-blue);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

// Component.tsx
<div className={styles.container}>
  <h1 className={styles.title}>Title</h1>
</div>
```

## Related Documentation

- [Creating Packages](./creating-packages.md) - For creating UI component packages
- [Repository Configuration](./repository-configuration.md) - Project structure
- [Next.js Styling Docs](https://nextjs.org/docs/app/building-your-application/styling)

## Future Considerations

- Consider adding a shared design system package
- Evaluate Tailwind CSS v5 when stable for monorepos
- Consider CSS-in-JS solutions for dynamic theming
- Evaluate Panda CSS or similar alternatives

## Last Updated
21 January 2026 - Initial documentation after Tailwind removal
