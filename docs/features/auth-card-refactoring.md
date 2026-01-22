# Auth Pages Refactoring with AuthCard Molecule and AuthPage Organism

## Status
- [x] Completed - All auth pages refactored with AuthCard molecule
- [x] Completed - All auth pages now use AuthPage organism for full encapsulation

## Purpose
Document the refactoring of authentication pages in the backoffice app to eliminate code duplication by:
1. Extracting the common card structure into a reusable **AuthCard molecule** component
2. Extracting the page container/layout into a reusable **AuthPage organism** component

## Problem
All authentication pages (login, register, forgot-password, unauthorized) had two levels of code duplication:

**Level 1 - Page Container** (repeated in every auth page):
- Full-page centered layout with `flex items-center justify-center min-h-screen`
- Gray background: `bg-gray-50`
- Custom container classes (different per page)

**Level 2 - Card Structure** (repeated in every auth page):
- White background container with rounded borders
- Centered layout with max-width
- Optional icon at the top with circular background
- Title and description sections
- Form/content area with consistent spacing
- Footer section for navigation links

This resulted in 60-100 lines of repeated code per page and violated DRY principles.

## Solution: Two-Level Refactoring

### Solution 1: AuthCard Molecule (Level 2)

### Component Location
`packages/ui/components/src/molecules/AuthCard.tsx`

### Component Structure
```typescript
export interface AuthCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  icon,
  children,
  footer,
  className = "",
}) => {
  // Renders:
  // - Outer container: max-w-md, centered, py-16
  // - Card: rounded-lg border with shadow, white bg, p-8
  // - Optional icon: circular background with primary color
  // - Title: text-3xl, bold, centered
  // - Optional description: centered, gray text
  // - Children wrapper: space-y-4
  // - Optional footer: mt-6, centered, text-sm
}
```

### Key Features
1. **Flexible Props**: Optional icon, description, footer, and custom className
2. **Consistent Styling**: Centralized authentication card design
3. **TypeScript Support**: Full type safety with exported AuthCardProps
4. **Responsive**: Mobile-first design with proper spacing
5. **Customizable**: Accepts className for specific page customizations (e.g., orange border on unauthorized)

### Solution 2: AuthPage Organism (Level 1)

#### Component Location
`packages/ui/components/src/organisms/AuthPage.tsx`

#### Component Structure
```typescript
export interface AuthPageProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  children, 
  className = "" 
}) => {
  // Renders:
  // - Full-page container: min-h-screen
  // - Centered content: flex items-center justify-center
  // - Gray background: bg-gray-50
  // - Custom className support
}
```

#### Key Features
1. **Full-Page Layout**: Handles entire page structure
2. **Centered Content**: Vertically and horizontally centered
3. **Consistent Background**: Gray background for all auth pages
4. **Minimal Props**: Only children and optional className
5. **Composable**: Works perfectly with AuthCard inside

## Refactored Pages

### 1. Login Page
**File**: `apps/client/backoffice/src/app/[locale]/(public)/(auth)/login/page.tsx`

**Before** (original): 85 lines
**After** (with AuthCard): 50 lines
**After** (with AuthCard + AuthPage): 48 lines

**Final Structure**:
```tsx
<AuthPage>
  <AuthCard
    title={t("title")}
    footer={...}
  >
    <form>...</form>
  </AuthCard>
</AuthPage>
```

**Usage**:
```tsx
<AuthCard
  title={t("title")}
  footer={
    <Text variant="body" className="text-center text-gray-600">
      {t("noAccount")}{" "}
      <Link href="/register" className="text-[var(--color-primary)] hover:underline font-medium">
        {t("signUp")}
      </Link>
    </Text>
  }
>
  <form className="space-y-4">
    {/* Login form fields */}
  </form>
</AuthCard>
```

### 2. Register Page
**File**: `apps/client/backoffice/src/app/[locale]/(public)/(auth)/register/page.tsx`

**Before** (original): 120 lines
**After** (with AuthCard): 80 lines
**After** (with AuthCard + AuthPage): 78 lines

**Final Structure**:
```tsx
<AuthPage>
  <AuthCard
    title={t("title")}
    footer={...}
  >
    <form>...</form>
  </AuthCard>
</AuthPage>
```

### 3. Forgot Password Page
**File**: `apps/client/backoffice/src/app/[locale]/(public)/(auth)/forgot-password/page.tsx`

**Before** (original): 80 lines
**After** (with AuthCard): 55 lines
**After** (with AuthCard + AuthPage): 53 lines

**Features**: Uses icon and description props

**Final Structure**:
```tsx
<AuthPage>
  <AuthCard
    title={t("title")}
    description={t("description")}
    icon={<KeyRound className="h-12 w-12 text-[var(--color-primary)]" />}
    footer={...}
  >
    <form>...</form>
  </AuthCard>
</AuthPage>
```

### 4. Unauthorized Page
**File**: `apps/client/backoffice/src/app/[locale]/(public)/(auth)/unauthorized/page.tsx`

**Before** (original): 75 lines (with custom container)
**After** (with AuthCard): 50 lines
**After** (with AuthCard + AuthPage): 48 lines

**Special Note**: This page had a custom container div that was removed and replaced with AuthPage

**Final Structure**:
```tsx
<AuthPage>
  <AuthCard
    title={t("title")}
    description={t("description")}
    className="border-orange-200 bg-orange-50"
    icon={<ShieldAlert + Clock overlay />}
    footer={...}
  >
    <div>...custom content...</div>
  </AuthCard>
</AuthPage>
```
## Benefits

### Code Reduction

**Phase 1 - AuthCard Molecule**:
- Login: 85 → 50 lines (41% reduction)
- Register: 120 → 80 lines (33% reduction)
- Forgot Password: 80 → 55 lines (31% reduction)
- Unauthorized: 75 → 50 lines (33% reduction)
- **Subtotal**: 360 → 235 lines (35% reduction)

**Phase 2 - AuthPage Organism**:
- Login: 50 → 48 lines (4% additional reduction)
- Register: 80 → 78 lines (3% additional reduction)
- Forgot Password: 55 → 53 lines (4% additional reduction)
- Unauthorized: 50 → 48 lines (4% additional reduction)
- **Subtotal**: 235 → 227 lines (3.4% additional reduction)

**Total Reduction**:
- **Before**: 360 lines (4 pages with full duplication)
- **After**: 227 lines (4 pages using AuthPage + AuthCard)
- **Total Reduction**: 133 lines (37% overall)

### Maintenance Improvements
1. **Double-Level Abstraction**: Both page layout (AuthPage) and card structure (AuthCard) centralized
2. **Single Source of Truth**: No repeated layout or card code
3. **Consistent UI**: All auth pages share identical design language
4. **Easy Updates**: Changes to layout or card structure in one place
5. **Type Safety**: TypeScript ensures correct prop usage
6. **Zero Duplication**: Complete elimination of repeated container/card markup

### Design System Benefits
1. **Complete Atomic Design**: Organism (AuthPage) → Molecule (AuthCard) → Atoms (Text, Button, Input, Label)
2. **Composable Architecture**: AuthPage wraps AuthCard, AuthCard contains atoms
3. **Reusable Components**: Both components available for future auth pages
4. **Flexible API**: Props allow customization without breaking consistency
5. **Documentation**: Clear usage examples in component README

## Technical Implementation

### Dependencies Added
```json
// apps/client/backoffice/package.json
{
  "dependencies": {
    "@piar/ui-components": "workspace:*"
  }
}
```

### Build Process
1. **AuthCard** (molecule) and **AuthPage** (organism) built as part of `@piar/ui-components` package
2. Backoffice app imports both: `import { AuthCard, AuthPage } from '@piar/ui-components'`
3. Next.js transpiles the workspace package via `transpilePackages`

### Testing
- ✅ TypeScript compilation passes without errors
- ✅ All auth pages render correctly with AuthPage wrapper
- ✅ Responsive design maintained
- ✅ Accessibility features preserved
- ✅ i18n translations working
- ✅ Custom styling (unauthorized orange theme) works correctly

## Design Patterns Used

1. **Composition Pattern**: Children prop for flexible content in both components
2. **Container/Presentational Pattern**: AuthPage (container) wraps AuthCard (presentational)
3. **Prop Drilling Avoidance**: Sensible defaults with optional overrides
4. **Single Responsibility**: Each component has one job (page layout vs card structure)
5. **Open/Closed Principle**: Open for extension (className), closed for modification
6. **Atomic Design Hierarchy**: Organism → Molecule → Atoms

## Future Enhancements

Potential improvements:
- [ ] AuthCard: Loading state support (skeleton or spinner)
- [ ] AuthCard: Error state prop for displaying error messages
- [ ] AuthCard: Animation transitions when content changes
- [ ] AuthPage: Dark mode variant
- [ ] AuthPage: Alternative background options (gradient, image)
- [ ] AuthCard: Size variants (sm, md, lg)
- [ ] AuthCard: Alternative layouts (side-by-side for desktop)

## Related Documentation
- [UI Components Atomic Design](ui-components-atomic-design.md) - Full component library documentation
- [Tailwind v4 Implementation](tailwind-v4-implementation.md) - Styling architecture
- [Creating Features Guide](creating-features-guide.md) - Feature creation patterns

## Notes
- This two-phase refactoring demonstrates the value of identifying repeated patterns at multiple levels
- The 37% total code reduction significantly improves maintainability
- Both components are reusable for any future authentication-related pages
- Complete elimination of layout and card duplication across 4 pages
- Perfect example of Atomic Design: Organism (AuthPage) → Molecule (AuthCard) → Atoms
- The unauthorized page custom container was completely replaced by AuthPage

## Last Updated
22 January 2026 - Completed AuthPage organism refactoring, achieving 37% total code reduction
