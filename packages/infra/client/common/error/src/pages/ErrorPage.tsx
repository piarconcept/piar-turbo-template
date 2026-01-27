'use client';

import Link from 'next/link';
import { Button, Text } from '@piar/ui-components';

export interface ErrorPageProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export function ErrorPage({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  actionLabel = 'Try again',
  onRetry,
  actionHref,
  secondaryLabel = 'Go home',
  secondaryHref = '/',
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <Text as="h1" variant="h3" className="mb-3 text-[var(--color-secondary)]">
          {title}
        </Text>
        <Text as="p" variant="body" className="text-gray-600">
          {description}
        </Text>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry} variant="primary">
              {actionLabel}
            </Button>
          ) : (
            actionHref && (
              <Button asChild variant="primary">
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            )
          )}

          {secondaryHref && (
            <Button asChild variant="ghost" size="inline" className="text-gray-600">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
