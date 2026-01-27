import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

/**
 * Button Variants using CVA (Class Variance Authority)
 */
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 focus:ring-[var(--color-primary)]',
        secondary:
          'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 focus:ring-[var(--color-primary)]',
        outline:
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        xl: 'h-14 px-8 text-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /**
   * Changes the component to a Slot, allowing it to merge with the child element.
   * Useful for rendering as a Link or other component while maintaining button styles.
   *
   * @example
   * <Button asChild>
   *   <Link href="/login">Sign In</Link>
   * </Button>
   */
  asChild?: boolean;
}

/**
 * Button Component - Atomic Design: Atom
 *
 * @example
 * // Primary button
 * <Button>Click me</Button>
 *
 * @example
 * // Secondary button
 * <Button variant="secondary" size="lg">Large Secondary</Button>
 *
 * @example
 * // Full width button
 * <Button fullWidth>Sign In</Button>
 *
 * @example
 * // As Link (asChild pattern)
 * <Button asChild>
 *   <Link href="/about">Learn More</Link>
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Filter out asChild from props to avoid React warning
    const { asChild: _, ...restProps } = props as ButtonProps;

    return (
      <Comp
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        {...restProps}
      />
    );
  },
);

Button.displayName = 'Button';
