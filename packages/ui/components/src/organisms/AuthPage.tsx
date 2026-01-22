import React from "react";

/**
 * AuthPage Props
 */
export interface AuthPageProps {
  /**
   * Content to display (typically an AuthCard)
   */
  children: React.ReactNode;
  /**
   * Optional custom className for the container
   */
  className?: string;
}

/**
 * AuthPage Organism
 * 
 * Full-page container for authentication pages.
 * Centers content vertically and horizontally with a light gray background.
 * 
 * @example
 * ```tsx
 * <AuthPage>
 *   <AuthCard title="Sign In">
 *     <LoginForm />
 *   </AuthCard>
 * </AuthPage>
 * ```
 */
export const AuthPage: React.FC<AuthPageProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};
