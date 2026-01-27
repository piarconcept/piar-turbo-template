# UI Components - Atomic Design Architecture

## Purpose

Document the Atomic Design implementation in `@piar/ui-components` package.

## Status

- [x] Completed - Initial Atomic Design structure with atoms
- [ ] In Progress - Creating molecules and organisms

## Overview

The `@piar/ui-components` package follows **Atomic Design** principles to organize reusable UI components. This methodology creates a hierarchy from simple to complex components, making the system scalable and maintainable.

## Atomic Design Layers

### 🔹 Atoms (Implemented)

**Definition**: The smallest, indivisible UI elements. These are the basic building blocks.

**Current Atoms**:

- `Button` - Buttons with multiple variants
- `Input` - Form input fields with validation states
- `Label` - Form labels with optional required indicator
- `Text` - Typography component for headings and body text

**Characteristics**:

- Single responsibility
- No composition of other components
- Highly reusable
- Props-driven variants using CVA (class-variance-authority)

### 🔸 Molecules (Planned)

**Definition**: Simple combinations of atoms that function together as a unit.

**Planned Molecules**:

- `FormField` - Label + Input + error message wrapper
- `Card` - Container with optional header, body, footer
- `StatCard` - Metric display with icon, value, label, change indicator
- `NavigationItem` - Link with icon and label
- `SearchBar` - Input with search icon button
- `Checkbox` - Checkbox input with label

**Characteristics**:

- Combine 2-3 atoms
- Serve a single, clear purpose
- Reusable across contexts
- Still relatively simple

### 🔶 Organisms (Planned)

**Definition**: Complex components combining molecules and atoms to form distinct sections.

**Planned Organisms**:

- `LoginForm` - Complete login form with validation
- `RegisterForm` - Complete registration form
- `StatsGrid` - Dashboard statistics grid with multiple stat cards
- `ActivityFeed` - List of activity items with timestamps
- `UserTable` - Data table with sorting, filtering, actions
- `NavigationMenu` - Complete navigation with items and dropdowns

**Characteristics**:

- Complex combinations
- Feature-specific
- May contain business logic
- Less reusable (more contextual)

## Implementation Details

### Technology Stack

- **React 19**: Functional components with hooks
- **TypeScript 5.9**: Full type safety
- **Tailwind CSS v4**: Utility-first styling from `@piar/ui-config`
- **class-variance-authority**: Type-safe component variants
- **clsx**: Utility for constructing className strings

### Component Pattern

All components follow this structure:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

// Define variants with CVA
const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        primary: 'primary-classes',
        secondary: 'secondary-classes',
      },
      size: {
        sm: 'small-classes',
        md: 'medium-classes',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    }
  }
);

// Props interface
export interface ComponentProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {}

// Component implementation with forwardRef
export const Component = forwardRef<HTMLElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={componentVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Component.displayName = 'Component';
```

### File Structure

```
packages/ui/components/
├── src/
│   ├── index.ts              # Main export file
│   ├── atoms/
│   │   ├── index.ts         # Export all atoms
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Label.tsx
│   │   └── Text.tsx
│   ├── molecules/
│   │   ├── index.ts         # Export all molecules
│   │   └── [to be created]
│   └── organisms/
│       ├── index.ts         # Export all organisms
│       └── [to be created]
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── README.md
```

## Current Components

### Button Component

**Variants**:

- `primary` - Blue background, white text (default)
- `secondary` - Blue border, blue text
- `outline` - Gray border, gray text
- `ghost` - No background, hover effect
- `danger` - Red background
- `success` - Green background

**Sizes**:

- `sm` - Small (h-9, px-3)
- `md` - Medium (h-10, px-4) - default
- `lg` - Large (h-12, px-6)
- `xl` - Extra large (h-14, px-8)

**Props**:

- `fullWidth` - Makes button 100% width
- Standard HTMLButtonElement props

**Usage**:

```tsx
<Button variant="primary" size="lg" fullWidth>
  Sign In
</Button>
```

### Input Component

**Variants**:

- `default` - Gray border, blue focus (default)
- `error` - Red border, red focus
- `success` - Green border, green focus

**Sizes**:

- `sm` - Small (h-9)
- `md` - Medium (h-10) - default
- `lg` - Large (h-12)

**Usage**:

```tsx
<Input type="email" placeholder="Email" variant="error" inputSize="lg" />
```

### Label Component

**Features**:

- Optional required indicator (red asterisk)
- Standard label styles

**Usage**:

```tsx
<Label htmlFor="email" required>
  Email Address
</Label>
```

### Text Component

**Variants**:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings
- `body`, `bodyLarge`, `bodySmall` - Body text
- `caption` - Small text
- `label` - Form label text
- `muted` - Gray text

**Alignment**:

- `left` (default)
- `center`
- `right`

**As prop**: Render as different HTML elements (p, span, div, h1-h6, label)

**Usage**:

```tsx
<Text variant="h1" as="h1">
  Page Title
</Text>
<Text variant="body" align="center">
  Centered body text
</Text>
```

## Design Tokens

All components use CSS variables from `@piar/ui-config`:

```css
--color-primary-blue: #262b50 --color-primary-orange: #ec6b38 --color-secondary: #262b50
  --color-background: #ffffff --color-foreground: #262b50;
```

Usage in Tailwind:

```tsx
className = 'bg-[var(--color-primary-blue)] text-white';
```

## Integration in Apps

### 1. Add Dependency

```json
// apps/client/backoffice/package.json
{
  "dependencies": {
    "@piar/ui-components": "workspace:*"
  }
}
```

### 2. Configure Next.js

```typescript
// next.config.ts
export default {
  transpilePackages: [
    '@piar/ui-components',
    // ... other packages
  ],
};
```

### 3. Import and Use

```tsx
import { Button, Input, Label, Text } from '@piar/ui-components';

function MyPage() {
  return (
    <div>
      <Text variant="h1">Welcome</Text>
      <Button variant="primary">Click me</Button>
    </div>
  );
}
```

## Next Steps

### Phase 1: Complete Atoms ✅

- [x] Button with variants
- [x] Input with validation states
- [x] Label with required indicator
- [x] Text/Typography component

### Phase 2: Build Molecules (Next)

- [ ] FormField (Label + Input + error)
- [ ] Card (header, body, footer)
- [ ] StatCard (icon, value, label, change)
- [ ] NavigationItem (icon + link)
- [ ] SearchBar (input + icon button)
- [ ] Checkbox (checkbox + label)

### Phase 3: Build Organisms

- [ ] LoginForm
- [ ] RegisterForm
- [ ] StatsGrid
- [ ] ActivityFeed
- [ ] UserTable
- [ ] NavigationMenu

### Phase 4: Refactor Existing Pages

- [ ] Update login page to use components
- [ ] Update register page to use components
- [ ] Update dashboard to use components
- [ ] Update forgot-password to use components
- [ ] Remove inline component definitions

## Best Practices

### 1. Component Composition

✅ **Good**: Compose smaller components

```tsx
<div>
  <Label htmlFor="email" required>
    Email
  </Label>
  <Input id="email" type="email" />
</div>
```

❌ **Bad**: Everything inline

```tsx
<div>
  <label className="block text-sm...">Email *</label>
  <input className="w-full border..." />
</div>
```

### 2. Variant Usage

✅ **Good**: Use variant props

```tsx
<Button variant="secondary" size="lg">
  Action
</Button>
```

❌ **Bad**: Override with className

```tsx
<Button className="border-2 border-blue-500 h-12">Action</Button>
```

### 3. Type Safety

✅ **Good**: Use exported types

```tsx
import { Button, type ButtonProps } from '@piar/ui-components';

const MyButton: ButtonProps = { variant: 'primary', size: 'md' };
```

### 4. Customization

✅ **Good**: Extend with className when needed

```tsx
<Button variant="primary" className="shadow-lg mt-4">
  Submit
</Button>
```

### 5. Accessibility

Always provide proper accessibility attributes:

```tsx
<Button aria-label="Close dialog" aria-pressed={isPressed}>
  Close
</Button>
```

## Related Documentation

- [Creating Packages Guide](creating-packages.md)
- [Tailwind v4 Implementation](tailwind-v4-implementation.md)
- [BFF Architecture](bff-architecture.md)

## References

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [class-variance-authority Docs](https://cva.style/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)

## Last Updated

21 January 2026 - Created Atomic Design structure with Button, Input, Label, and Text atoms
