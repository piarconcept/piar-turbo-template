import { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Input Variants
 */
const inputVariants = cva(
  // Base styles
  'w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-gray-300 bg-white focus:border-[var(--color-primary-blue)] focus:ring-[var(--color-primary-blue)]',
        error: 'border-red-500 bg-white focus:border-red-500 focus:ring-red-500',
        success: 'border-green-500 bg-white focus:border-green-500 focus:ring-green-500',
      },
      inputSize: {
        sm: 'h-9 text-sm',
        md: 'h-10 text-base',
        lg: 'h-12 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  },
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

/**
 * Input Component - Atomic Design: Atom
 *
 * @example
 * // Basic input
 * <Input type="email" placeholder="Email" />
 *
 * @example
 * // Error state
 * <Input type="text" variant="error" placeholder="Invalid input" />
 *
 * @example
 * // Large input
 * <Input type="text" inputSize="lg" placeholder="Large input" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, ...props }, ref) => {
    return (
      <input className={inputVariants({ variant, inputSize, className })} ref={ref} {...props} />
    );
  },
);

Input.displayName = 'Input';
