'use client';

import { Component, ReactNode } from 'react';
import { formatErrorForLogging } from '../shared/error-formatter';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React ErrorBoundary component (logic only, no UI)
 * Catches errors in the component tree
 * REQUIRES fallback prop to render error UI
 * 
 * @example
 * ```tsx
 * import { ErrorBoundary } from '@piar/infra-client-common-error/client';
 * import { ErrorAlert } from '@piar/ui-components';
 * 
 * <ErrorBoundary 
 *   fallback={(error, reset) => (
 *     <ErrorAlert error={error} onRetry={reset} />
 *   )}
 * >
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log for monitoring
    const logData = formatErrorForLogging(error);
    console.error('Error logged:', logData);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return this.props.children;
  }
}
