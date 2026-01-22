import { ReactNode } from 'react';

export interface AuthCardProps {
  /**
   * Main title of the card
   */
  title: string;
  
  /**
   * Optional subtitle or description
   */
  description?: string;
  
  /**
   * Optional icon to display at the top
   */
  icon?: ReactNode;
  
  /**
   * Main content - typically a form
   */
  children: ReactNode;
  
  /**
   * Optional footer content - typically links (register, login, etc.)
   */
  footer?: ReactNode;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AuthCard Component - Atomic Design: Molecule
 * 
 * Reusable card container for all authentication pages.
 * Provides consistent styling and layout for login, register, forgot-password, etc.
 * 
 * @example
 * // Login page
 * <AuthCard 
 *   title="Sign In"
 *   footer={<>Don't have an account? <Link href="/register">Sign up</Link></>}
 * >
 *   <form>...</form>
 * </AuthCard>
 * 
 * @example
 * // With icon
 * <AuthCard
 *   title="Forgot Password"
 *   description="Enter your email to reset"
 *   icon={<KeyRound />}
 * >
 *   <form>...</form>
 * </AuthCard>
 */
export const AuthCard = ({
  title,
  description,
  icon,
  children,
  footer,
  className = '',
}: AuthCardProps) => {
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className={`rounded-lg border border-gray-200 bg-white p-8 shadow-sm ${className}`}>
        {icon && (
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[var(--color-primary)]/10 p-4">
              {icon}
            </div>
          </div>
        )}

        <h1 className="mb-4 text-center text-3xl font-bold text-[var(--color-secondary)]">
          {title}
        </h1>

        {description && (
          <p className="mb-6 text-center text-gray-600">
            {description}
          </p>
        )}
        
        <div className="space-y-4">
          {children}
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
