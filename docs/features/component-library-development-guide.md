# Component Library Development Guide

## Purpose
Comprehensive guide for developing pages and components following Atomic Design principles and building a consistent, scalable design system for the PIAR project.

## Status
- [x] Completed - Full component development workflow documented

## Philosophy

**Grow the library organically**: Don't create components you don't need yet. When building a new page and you find yourself repeating code, that's when you extract it into a component.

**Benefits**:
1. ✅ **Consistency**: All pages use the same components = same look and feel
2. ✅ **Maintainability**: Change once, update everywhere
3. ✅ **Speed**: Build new pages faster by composing existing components
4. ✅ **Custom Design System**: Tailored to PIAR's specific needs, not a generic library
5. ✅ **Type Safety**: TypeScript ensures correct component usage

## Architecture: Atomic Design

```
@piar/ui-components/
├── atoms/           # Basic building blocks
├── molecules/       # Simple combinations of atoms
└── organisms/       # Complex combinations
```

### 🔹 Atoms (Level 1)
**What**: Smallest, indivisible UI elements

**When to create**: When you need a basic, reusable element

**Examples**:
- `Button` - All button variations
- `Input` - All input types
- `Checkbox` - Checkbox with optional label
- `Label` - Form labels
- `Text` - Typography (h1-h6, body, label, etc.)

**Characteristics**:
- No business logic
- Pure presentation
- CVA variants for different styles
- TypeScript props interface
- Exported with type

### 🔸 Molecules (Level 2)
**What**: Simple combinations of atoms that work together

**When to create**: When 2-3 atoms are always used together

**Examples**:
- `AuthCard` - Icon + Title + Description + Children + Footer
- `FormField` - Label + Input + Error message
- `SearchBar` - Input + Button
- `StatCard` - Icon + Title + Value + Trend

**Characteristics**:
- Compose atoms
- Handle simple interactions
- Props control atom behavior
- Still presentation-focused

### 🔶 Organisms (Level 3)
**What**: Complex components with complete functionality

**When to create**: When molecules + atoms create a complete section

**Examples**:
- `AuthPage` - Full authentication page layout
- `DataTable` - Complete table with sorting, pagination
- `NavigationBar` - Complete navigation with menu, user dropdown
- `DashboardStats` - Grid of stat cards with data

**Characteristics**:
- Can contain business logic
- Manage complex state
- Compose molecules and atoms
- Often page-specific sections

## Workflow: Creating Components

### Step 1: Identify the Need

❌ **Don't**: Create components speculatively
```tsx
// Don't create FormField if you only have one form
<FormField label="Email" />
```

✅ **Do**: Create when you see duplication
```tsx
// After building 3 forms with the same structure:
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
  {error && <Text variant="error">{error}</Text>}
</div>

// ↓ Extract to FormField component
```

### Step 2: Choose the Right Level

**Ask yourself**:
1. Is it a single element? → **Atom**
2. Does it combine 2-3 atoms? → **Molecule**
3. Does it compose multiple molecules/atoms with logic? → **Organism**

**Example: Search Feature**
```
SearchBox (Organism)
  ├─ SearchInput (Molecule)
  │   ├─ Input (Atom)
  │   └─ Button (Atom)
  └─ SearchResults (Molecule)
      └─ Text (Atom)
```

### Step 3: Create the Component File

**Location pattern**:
```
packages/ui/components/src/
  ├── atoms/{ComponentName}.tsx
  ├── molecules/{ComponentName}.tsx
  └── organisms/{ComponentName}.tsx
```

**File template**:
```tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

/**
 * Component Variants (if using CVA)
 */
const componentVariants = cva(
  "base-classes-here", // Always applied
  {
    variants: {
      variant: {
        primary: "variant-specific-classes",
        secondary: "variant-specific-classes",
      },
      size: {
        sm: "size-specific-classes",
        md: "size-specific-classes",
        lg: "size-specific-classes",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * Component Props
 */
export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>, // Or appropriate HTML element
    VariantProps<typeof componentVariants> {
  /**
   * Prop description
   */
  label?: string;
  // ... other props
}

/**
 * ComponentName Component
 * 
 * Brief description of what it does.
 * 
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="lg">
 *   Content
 * </ComponentName>
 * ```
 */
export const ComponentName = React.forwardRef<
  HTMLDivElement, // Or appropriate element
  ComponentNameProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(componentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

ComponentName.displayName = "ComponentName";
```

### Step 4: Export the Component

**Update the index file**:
```tsx
// packages/ui/components/src/atoms/index.ts
export { ComponentName, type ComponentNameProps } from './ComponentName';
```

### Step 5: Build the Package

```bash
cd packages/ui/components
pnpm build
```

### Step 6: Use in Pages

```tsx
import { ComponentName } from '@piar/ui-components';

export default function MyPage() {
  return <ComponentName variant="primary">Hello</ComponentName>;
}
```

## Real Examples from PIAR

### Example 1: Button Atom

**Problem**: Multiple button styles repeated across pages
```tsx
// ❌ Before - repeated in every page
<button className="rounded-md bg-[var(--color-secondary)] px-4 py-2 ...">
  Submit
</button>
```

**Solution**: Button atom with variants
```tsx
// ✅ After - consistent everywhere
<Button variant="primary" size="md">Submit</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="outline">Learn More</Button>
```

**Implementation**: `packages/ui/components/src/atoms/Button.tsx`
- 6 variants: primary, secondary, outline, ghost, danger, success
- 5 sizes: xs, sm, md, lg, xl
- CVA for type-safe variants
- Full TypeScript support

### Example 2: AuthCard Molecule

**Problem**: Auth pages had identical card structure (85-120 lines)
```tsx
// ❌ Before - repeated in login, register, forgot-password, unauthorized
<div className="flex min-h-screen items-center justify-center bg-gray-50">
  <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
    {icon && <div className="mb-6 flex justify-center">{icon}</div>}
    <h1 className="text-3xl font-bold text-center">{title}</h1>
    {description && <p className="text-gray-600 text-center">{description}</p>}
    <div className="space-y-4">{children}</div>
    {footer && <div className="mt-6 text-center">{footer}</div>}
  </div>
</div>
```

**Solution**: AuthCard molecule
```tsx
// ✅ After - used in all 4 auth pages
<AuthCard
  title={t('title')}
  description={t('description')}
  icon={<KeyRound className="h-12 w-12" />}
  footer={<Link href="/login">Back to login</Link>}
>
  <form>{/* form fields */}</form>
</AuthCard>
```

**Impact**: Reduced code by 35% (360 → 235 lines across 4 pages)

### Example 3: AuthPage Organism

**Problem**: Every auth page had the same full-page container
```tsx
// ❌ Before - repeated wrapper
<div className="flex items-center justify-center min-h-screen bg-gray-50">
  <AuthCard>{/* content */}</AuthCard>
</div>
```

**Solution**: AuthPage organism
```tsx
// ✅ After - complete page encapsulation
<AuthPage>
  <AuthCard>{/* content */}</AuthCard>
</AuthPage>
```

**Impact**: Additional 3.4% code reduction + complete consistency

## Page Development Workflow

### 1. Start with Existing Components

**Always check** what's available first:
```tsx
import { 
  AuthPage, AuthCard,        // Organisms
  Button, Input, Label,      // Atoms
  Checkbox, Text 
} from '@piar/ui-components';
```

### 2. Build the Page Structure

**Pattern for auth pages**:
```tsx
export default function MyAuthPage() {
  const t = useTranslations('auth.mypage');

  return (
    <AuthPage>
      <AuthCard
        title={t('title')}
        description={t('description')}
        icon={<Icon />}
        footer={<Links />}
      >
        <form className="space-y-4">
          {/* Use atoms here */}
        </form>
      </AuthCard>
    </AuthPage>
  );
}
```

**Pattern for dashboard pages**:
```tsx
export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <Text variant="h1">Dashboard</Text>
      
      {/* Use components */}
      <StatsGrid data={stats} />
      <DataTable data={users} />
    </div>
  );
}
```

### 3. Identify Repeated Patterns

**If you find yourself copying**:
- The same JSX structure
- Similar styling combinations
- The same component composition

→ **Extract it into a component!**

### 4. Extract to Appropriate Level

**Example progression**:

**Stage 1: Raw HTML** (First page)
```tsx
<div>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
</div>
```

**Stage 2: Atoms** (After 2-3 forms)
```tsx
<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

**Stage 3: Molecule** (After 5+ forms)
```tsx
<FormField
  id="email"
  label="Email"
  type="email"
  error={errors.email}
/>
```

## Component Design Best Practices

### 1. Use CVA for Variants

**Why**: Type-safe, maintainable, consistent

```tsx
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-white",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

### 2. Use Design Tokens

**Always use CSS variables** from `@piar/ui-config`:
```tsx
// ✅ Good - uses design tokens
className="bg-[var(--color-primary)] text-[var(--color-tertiary)]"

// ❌ Bad - hardcoded colors
className="bg-red-500 text-white"
```

**Available tokens**:
```css
--color-primary: #b22222 (red)
--color-secondary: #000000 (black)
--color-tertiary: #ffffff (white)
--font-family-sans: Montserrat, sans-serif
```

### 3. Provide Sensible Defaults

```tsx
export interface ButtonProps {
  variant?: "primary" | "secondary"; // ← Optional with default
  size?: "sm" | "md" | "lg";         // ← Optional with default
  children: React.ReactNode;         // ← Required
}

// Usage is simple
<Button>Click me</Button> // Works! Uses defaults
```

### 4. Support className Override

**Always allow custom styling**:
```tsx
export const Component = ({ className, ...props }) => {
  return (
    <div className={clsx(baseClasses, className)} {...props}>
      {/* ... */}
    </div>
  );
};

// Usage
<Component className="mt-4 shadow-lg" />
```

### 5. Use forwardRef for Form Elements

```tsx
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} {...props} />;
  }
);

// Enables:
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} />
```

### 6. Document with JSDoc

```tsx
/**
 * Button Component
 * 
 * A button with multiple variants and sizes following the design system.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 */
export const Button = ...
```

### 7. Export Types

```tsx
// Component file
export interface ButtonProps { ... }
export const Button = ...

// Index file
export { Button, type ButtonProps } from './Button';

// Usage in other files
import type { ButtonProps } from '@piar/ui-components';
```

## Testing Components

**Location**: `packages/ui/components/tests/`

**Pattern**: Mirror the src/ structure
```
src/atoms/Button.tsx
tests/Button.test.tsx
```

**Example test**:
```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../src/atoms/Button';

describe('Button', () => {
  it('renders with primary variant by default', () => {
    const { getByText } = render(<Button>Click me</Button>);
    const button = getByText('Click me');
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[var(--color-primary)]');
  });

  it('applies custom className', () => {
    const { getByText } = render(
      <Button className="custom-class">Click me</Button>
    );
    
    expect(getByText('Click me')).toHaveClass('custom-class');
  });
});
```

## Updating Documentation

**After creating a component**, update:

### 1. Component README
`packages/ui/components/README.md`

```markdown
### 🔹 Atoms
- `Button` - Buttons with variants ✅
- `NewComponent` - Description ✅  ← Add here
```

Add usage example:
```markdown
### NewComponent

\`\`\`tsx
<NewComponent variant="primary" size="lg">
  Content
</NewComponent>
\`\`\`
```

### 2. This Guide (if establishing new pattern)

Only update this guide if you're introducing a **new pattern** or **important decision**.

## Common Scenarios

### Scenario 1: Creating a New Form Page

**Need**: Registration form with email, password, confirm password

**Steps**:
1. ✅ Use existing: `AuthPage`, `AuthCard`, `Label`, `Input`, `Button`
2. ✅ Build the form
3. ✅ See if any new patterns emerge (e.g., password strength indicator)
4. ✅ If repeated 3+ times → extract to component

**Result**: No new components needed, form uses existing atoms!

### Scenario 2: Dashboard Stats Grid

**Need**: Display 4 stat cards in a grid

**Steps**:
1. ❌ Don't have `StatCard` yet
2. ✅ Build first stat card with atoms:
   ```tsx
   <div className="rounded-lg border bg-white p-6">
     <Text variant="h3">{title}</Text>
     <Text variant="h1">{value}</Text>
     <Text variant="body" className="text-gray-600">{trend}</Text>
   </div>
   ```
3. ✅ Copy for 4 cards (duplication detected!)
4. ✅ Extract `StatCard` molecule:
   ```tsx
   <StatCard title="Users" value="1,234" trend="+12%" />
   ```
5. ✅ Consider `StatsGrid` organism if used in multiple pages

### Scenario 3: Data Table

**Need**: Table with sorting, pagination, actions

**Steps**:
1. ❌ Very complex, don't build from scratch
2. ✅ Start with basic HTML table using `Text` and `Button` atoms
3. ✅ After 2-3 tables, extract common patterns
4. ✅ Create `DataTable` organism with slots:
   ```tsx
   <DataTable
     columns={columns}
     data={data}
     onSort={handleSort}
     renderRow={(row) => <TableRow data={row} />}
     renderActions={(row) => <Actions row={row} />}
   />
   ```

## Component Library Growth Strategy

### Phase 1: Core Atoms (✅ DONE)
- Button
- Input
- Label
- Text
- Checkbox

### Phase 2: Common Molecules (✅ DONE)
- AuthCard

### Phase 3: Layout Organisms (✅ DONE)
- AuthPage

### Phase 4: Grow Organically (🔄 ONGOING)

**As you build new features**, extract components when you see:
1. **Duplication**: Same structure 3+ times
2. **Complexity**: JSX getting too nested
3. **Reusability**: Pattern used across features

**Potential future components** (don't build until needed):
- `FormField` molecule (Label + Input + Error)
- `Card` molecule (Container with header/body/footer)
- `Modal` organism (Overlay + Card + Actions)
- `DataTable` organism (Table with sort/filter/pagination)
- `NavigationBar` organism (Header with menu + user dropdown)
- `Sidebar` organism (Side navigation)
- `StatCard` molecule (Icon + Title + Value + Trend)
- `SearchBar` molecule (Input + Search button)
- `Dropdown` molecule (Button + Menu)
- `Tabs` molecule (Tab buttons + Content)

## Integration with Next.js Apps

### 1. Add Dependency

```json
// apps/client/backoffice/package.json
{
  "dependencies": {
    "@piar/ui-components": "workspace:*"
  }
}
```

### 2. Configure Transpilation

```ts
// apps/client/backoffice/next.config.ts
const nextConfig = {
  transpilePackages: [
    "@piar/ui-components",
    // ... other packages
  ],
};
```

### 3. Import and Use

```tsx
// Any page or component
import { Button, Input, AuthCard } from '@piar/ui-components';

export default function Page() {
  return (
    <div>
      <Input placeholder="Email" />
      <Button>Submit</Button>
    </div>
  );
}
```

## Design System Governance

### Rules

1. **No hardcoded colors** - Use CSS variables
2. **No duplicate components** - Check library first
3. **No styling in pages** - Use components
4. **Variants over props** - Use CVA for styling variations
5. **Composition over complexity** - Keep components simple

### Review Checklist

Before merging a component:
- [ ] Follows Atomic Design level (atom/molecule/organism)
- [ ] Uses CVA for variants
- [ ] Uses design tokens (CSS variables)
- [ ] Has TypeScript types exported
- [ ] Has JSDoc documentation
- [ ] Has usage examples in README
- [ ] Has tests (if complex logic)
- [ ] Exported in index.ts
- [ ] Built successfully (`pnpm build`)
- [ ] Used in at least one page

## Troubleshooting

### Component not found after creation

**Problem**: `Cannot find module '@piar/ui-components'`

**Solutions**:
1. Export in index.ts: `export { Component } from './Component';`
2. Build package: `pnpm --filter @piar/ui-components build`
3. Restart dev server: `pnpm --filter @piar/backoffice dev`

### Styles not applying

**Problem**: Component renders but styles are missing

**Solutions**:
1. Check Tailwind scanning in `postcss.config.mjs`
2. Verify `@piar/ui-components` in transpilePackages
3. Clear Next.js cache: `rm -rf .next`
4. Rebuild ui-components: `pnpm --filter @piar/ui-components build`

### TypeScript errors

**Problem**: Type errors when using component

**Solutions**:
1. Check props interface is exported: `export interface ComponentProps`
2. Rebuild: `pnpm --filter @piar/ui-components build`
3. Check types in index.ts: `export { Component, type ComponentProps }`

## Related Documentation

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [UI Components README](../../packages/ui/components/README.md)
- [Tailwind v4 Implementation](./tailwind-v4-implementation.md)
- [Auth Card Refactoring](./auth-card-refactoring.md) - Real example of extraction
- [Creating Packages Guide](./creating-packages.md)

## Summary

**The PIAR Way**:
1. ✅ Build pages with existing components
2. ✅ Notice duplication (3+ times)
3. ✅ Extract to component at appropriate level
4. ✅ Document and share
5. ✅ Repeat

**Result**: A custom design system that grows naturally with your needs, ensuring consistency while avoiding premature abstraction.

## Last Updated
22 January 2026 - Complete component library development guide created
