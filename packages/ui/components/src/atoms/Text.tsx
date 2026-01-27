import { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Text Variants
 */
const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-5xl font-bold text-[var(--color-primary)]',
      h2: 'text-4xl font-bold text-[var(--color-primary)]',
      h3: 'text-3xl font-semibold text-[var(--color-primary)]',
      h4: 'text-2xl font-semibold text-[var(--color-primary)]',
      h5: 'text-xl font-semibold text-[var(--color-primary)]',
      h6: 'text-lg font-semibold text-[var(--color-primary)]',
      body: 'text-base text-gray-700',
      bodyLarge: 'text-lg text-gray-700',
      bodySmall: 'text-sm text-gray-600',
      caption: 'text-xs text-gray-500',
      label: 'text-sm font-medium text-gray-700',
      muted: 'text-sm text-gray-500',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    align: 'left',
  },
});

export interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
}

/**
 * Text Component - Atomic Design: Atom
 *
 * @example
 * // Heading
 * <Text variant="h1">Page Title</Text>
 *
 * @example
 * // Body text
 * <Text variant="body">This is body text</Text>
 *
 * @example
 * // Custom element
 * <Text as="label" variant="label">Email</Text>
 */
export const Text = ({ className, variant, align, as = 'p', ...props }: TextProps) => {
  const Component = as;
  return <Component className={textVariants({ variant, align, className })} {...props} />;
};

Text.displayName = 'Text';
