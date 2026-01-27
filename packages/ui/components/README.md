# @piar/ui-components

Shared UI component library for the PIAR monorepo, following **Atomic Design** principles.

## Architecture: Atomic Design

This package organizes components into three levels:

### 🔹 Atoms

Basic building blocks - smallest UI elements:

- `Button` - Buttons with variants (primary, secondary, outline, ghost, danger, success)
- `Checkbox` - Checkbox inputs with optional labels ✅
- `Input` - Form inputs with validation states
- `Label` - Form labels with optional required indicator
- `Text` - Typography component for headings and body text

### 🔸 Molecules

Simple combinations of atoms (to be added):

- `AuthCard` - Authentication card container (login, register, forgot-password) ✅
- `FormField` - Label + Input + error message
- `Card` - Reusable card container
- `NavigationItem` - Link with icon

### 🔶 Organisms

Complex components combining molecules and atoms (to be added):

- `AuthPage` - Full-page container for authentication pages ✅
- `LoginForm` - Complete login form
- `RegisterForm` - Complete registration form
- `StatsGrid` - Dashboard statistics grid

## Installation

This package is already part of the monorepo workspace. To use it in an app:

```json
{
  "dependencies": {
    "@piar/ui-components": "workspace:*"
  }
}
```

Then add to `transpilePackages` in `next.config.ts`:

```typescript
transpilePackages: [
  // ... other packages
  '@piar/ui-components',
];
```

## Usage Examples

### Button Component

```tsx
import { Button } from '@piar/ui-components';

// Primary button (default)
<Button>Click me</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// Ghost button (no background)
<Button variant="ghost">Ghost Button</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Full width button
<Button fullWidth>Sign In</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Disabled
<Button disabled>Disabled</Button>

// As child (asChild pattern) - for Links
<Button asChild>
  <Link href="/login">Sign In</Link>
</Button>

// Outline button with Link
<Button variant="outline" size="lg" asChild>
  <Link href="/register">Register</Link>
</Button>
```

### Checkbox Component

```tsx
import { Checkbox } from '@piar/ui-components';

// Basic checkbox with label
<Checkbox label="Remember me" />

// Required checkbox
<Checkbox label="Accept terms" required />

// Different sizes
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" />

// Without label (for custom layouts)
<Checkbox id="custom" />
<label htmlFor="custom">Custom label</label>

// With wrapper className
<Checkbox
  label="Aligned top"
  wrapperClassName="items-start"
/>
```

### Input Component

```tsx
import { Input } from '@piar/ui-components';

// Basic input
<Input type="email" placeholder="Email" />

// Error state
<Input type="text" variant="error" placeholder="Invalid input" />

// Success state
<Input type="text" variant="success" placeholder="Valid input" />

// Different sizes
<Input inputSize="sm" placeholder="Small input" />
<Input inputSize="md" placeholder="Medium input" />
<Input inputSize="lg" placeholder="Large input" />

// Disabled
<Input disabled placeholder="Disabled input" />
```

### Label Component

```tsx
import { Label } from '@piar/ui-components';

// Basic label
<Label htmlFor="email">Email</Label>

// Required label (shows red asterisk)
<Label htmlFor="password" required>Password</Label>
```

### Text Component

```tsx
import { Text } from '@piar/ui-components';

// Headings
<Text variant="h1">Page Title</Text>
<Text variant="h2">Section Title</Text>
<Text variant="h3">Subsection Title</Text>

// Body text
<Text variant="body">This is body text</Text>
<Text variant="bodyLarge">Large body text</Text>
<Text variant="bodySmall">Small body text</Text>

// Other variants
<Text variant="caption">Caption text</Text>
<Text variant="label">Label text</Text>
<Text variant="muted">Muted text</Text>

// Text alignment
<Text align="center">Centered text</Text>
<Text align="right">Right-aligned text</Text>

// Custom element
<Text as="h1" variant="h1">Heading as H1 element</Text>
<Text as="label" variant="label">Label as label element</Text>
```

### Complete Form Example

```tsx
import { Button, Input, Label, Text } from '@piar/ui-components';

function LoginForm() {
  return (
    <form className="space-y-4">
      <Text variant="h3">Sign In</Text>

      <div>
        <Label htmlFor="email" required>
          Email
        </Label>
        <Input id="email" type="email" placeholder="your@email.com" />
      </div>

      <div>
        <Label htmlFor="password" required>
          Password
        </Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>

      <Button fullWidth type="submit">
        Sign In
      </Button>
    </form>
  );
}
```

### AuthCard Component (Molecule)

The `AuthCard` is a reusable container for all authentication pages:

```tsx
import { AuthCard } from '@piar/ui-components';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';

// Basic usage
<AuthCard
  title="Sign In"
  footer={
    <>
      Don't have an account?{' '}
      <Link href="/register">Sign up</Link>
    </>
  }
>
  <form>
    {/* Form fields */}
  </form>
</AuthCard>

// With icon and description
<AuthCard
  title="Forgot Password"
  description="Enter your email to reset your password"
  icon={<KeyRound className="h-12 w-12" />}
  footer={
    <>
      Remember your password?{' '}
      <Link href="/login">Back to login</Link>
    </>
  }
>
  <form>
    {/* Reset form */}
  </form>
</AuthCard>

// Custom styling
<AuthCard
  title="Access Pending"
  className="border-orange-200 bg-orange-50"
>
  <p>Your account is pending approval...</p>
</AuthCard>
```

### AuthPage Component

```tsx
import { AuthPage, AuthCard } from '@piar/ui-components';

// Full authentication page with centered content
<AuthPage>
  <AuthCard title="Sign In">
    {/* Your form here */}
  </AuthCard>
</AuthPage>

// Custom className for different background
<AuthPage className="bg-gray-100">
  <AuthCard title="Register">
    {/* Registration form */}
  </AuthCard>
</AuthPage>
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

## Styling

All components use **Tailwind CSS v4** classes from `@piar/ui-config`. Component variants are managed using **class-variance-authority (CVA)** for type-safe, flexible styling.

### Design Tokens

Components use CSS variables from `@piar/ui-config`:

- `var(--color-primary-blue)` - Primary blue color
- `var(--color-primary-orange)` - Primary orange color
- `var(--color-secondary)` - Secondary color

### Customization

You can customize components using the `className` prop:

```tsx
<Button className="shadow-lg">Custom Shadow</Button>
<Input className="border-2" />
```

## Dependencies

- `class-variance-authority` - Type-safe component variants
- `clsx` - Utility for constructing className strings
- `react` (peer) - React 19+
- `react-dom` (peer) - React DOM 19+

## Next Steps

### Planned Molecules:

- [ ] `FormField` - Label + Input + error message wrapper
- [ ] `Card` - Reusable card container with header/body/footer
- [ ] `StatCard` - Dashboard metric card
- [ ] `NavigationItem` - Navigation link with icon

### Planned Organisms:

- [x] `AuthPage` - Full-page container for authentication pages ✅
- [ ] `LoginForm` - Complete login form with validation
- [ ] `RegisterForm` - Complete registration form
- [ ] `StatsGrid` - Dashboard statistics grid
- [ ] `ActivityFeed` - Activity list component

## Related Packages

- `@piar/ui-config` - Tailwind CSS v4 configuration and design tokens
- `@piar/layout` - Layout components (Header, Footer, Sidebar)

## Related Documentation

- [Creating Packages Guide](../../../docs/features/creating-packages.md)
- [Tailwind v4 Implementation](../../../docs/features/tailwind-v4-implementation.md)

## Last Updated

22 January 2026 - Added `asChild` prop to Button atom for composition with Link components
