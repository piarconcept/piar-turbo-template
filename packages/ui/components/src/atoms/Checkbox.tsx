import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

/**
 * Checkbox Variants
 */
const checkboxVariants = cva(
  'rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      variant: {
        default: 'border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]',
        error: 'border-red-500 text-red-600 focus:ring-red-500',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

/**
 * Checkbox Props
 */
export interface CheckboxProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  /**
   * Label text for the checkbox
   */
  label?: string;
  /**
   * Additional className for the wrapper
   */
  wrapperClassName?: string;
}

/**
 * Checkbox Atom Component
 *
 * A checkbox input with optional label and variants.
 *
 * @example
 * ```tsx
 * <Checkbox label="Remember me" />
 * <Checkbox label="Accept terms" required />
 * <Checkbox size="lg" label="Large checkbox" />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, variant, label, wrapperClassName, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    if (label) {
      return (
        <div className={clsx('flex items-center gap-2', wrapperClassName)}>
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={clsx(checkboxVariants({ size, variant }), className)}
            {...props}
          />
          <label htmlFor={checkboxId} className="text-sm text-gray-700 cursor-pointer select-none">
            {label}
          </label>
        </div>
      );
    }

    return (
      <input
        type="checkbox"
        id={checkboxId}
        ref={ref}
        className={clsx(checkboxVariants({ size, variant }), className)}
        {...props}
      />
    );
  },
);

Checkbox.displayName = 'Checkbox';
